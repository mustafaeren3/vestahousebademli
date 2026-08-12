import { marked } from "marked";
import { createClient } from "@/lib/supabase/public";
import { slugify } from "@/lib/menu/slug";

const WORDS_PER_MINUTE = 200;

marked.setOptions({ gfm: true, breaks: false });

function readingTimeFor(content) {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

// Shapes a blog_posts row into the same object shape the old filesystem
// loader produced (lib/blog.js), so every existing call site keeps working
// unchanged: title/date/excerpt/category/tags/coverImage/coverImageAlt/
// seoTitle/seoDescription/faq/readingTime/html.
//
// published_at is nullable now (null until a post's first publish), but
// every row returned here has already passed the "status = published"
// filter, so in practice published_at is always set by the time it reaches
// this function -- the `|| row.created_at` fallback only guards the
// theoretical edge case of a published row with no publish stamp, so
// `date` (used for display, sitemap lastModified, RSS pubDate, and the
// BlogPosting JSON-LD's datePublished/dateModified) is never null and
// never falls back to the Unix epoch via `new Date(null)`.
function decorate(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.published_at || row.created_at,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags || [],
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt,
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    faq: row.faq || [],
    readingTime: readingTimeFor(row.content),
    html: marked.parse(row.content || ""),
  };
}

export async function getAllPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    // nullsFirst: false keeps any (in practice never-expected) published
    // row with a null published_at at the bottom of "newest first" instead
    // of Postgres's default of sorting nulls to the top of a DESC order.
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data.map(decorate);
}

export async function getPostBySlug(slug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? decorate(data) : null;
}

export function categorySlug(name) {
  return slugify(name || "");
}

export function tagSlug(name) {
  return slugify(name || "");
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const set = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(set).map((name) => ({ name, slug: categorySlug(name) }));
}

export async function getAllTags() {
  const posts = await getAllPosts();
  const set = new Set(posts.flatMap((p) => p.tags));
  return Array.from(set).map((name) => ({ name, slug: tagSlug(name) }));
}

export async function getPostsByCategory(categorySlugValue) {
  const posts = await getAllPosts();
  return posts.filter((p) => categorySlug(p.category) === categorySlugValue);
}

export async function getPostsByTag(tagSlugValue) {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.some((t) => tagSlug(t) === tagSlugValue));
}

export async function getRelatedPosts(post, limit = 3) {
  const all = await getAllPosts();
  const others = all.filter((p) => p.slug !== post.slug);

  const scored = others.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 2;
    score += p.tags.filter((t) => post.tags.includes(t)).length;
    return { post: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post)
    .concat(scored.length === 0 ? others.slice(0, limit) : [])
    .slice(0, limit);
}

export async function searchPosts(query) {
  const q = (query || "").trim().toLowerCase();
  const all = await getAllPosts();
  if (!q) return all;

  return all.filter((post) => {
    const haystack = [post.title, post.excerpt, post.category, ...post.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
