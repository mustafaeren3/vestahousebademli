import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content/blog");
const WORDS_PER_MINUTE = 200;

marked.setOptions({ gfm: true, breaks: false });

function readingTimeFor(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadPost(filename) {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    category: data.category,
    tags: data.tags || [],
    coverImage: data.coverImage,
    coverImageAlt: data.coverImageAlt,
    seoTitle: data.seoTitle || data.title,
    seoDescription: data.seoDescription || data.excerpt,
    faq: data.faq || [],
    readingTime: readingTimeFor(content),
    html: marked.parse(content),
  };
}

let cache = null;

export function getAllPosts() {
  if (cache) return cache;
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  cache = files
    .map(loadPost)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return cache;
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.slug === slug) || null;
}

export function getAllCategories() {
  const set = new Set(getAllPosts().map((p) => p.category).filter(Boolean));
  return Array.from(set).map((name) => ({ name, slug: slugify(name) }));
}

export function getAllTags() {
  const set = new Set(getAllPosts().flatMap((p) => p.tags));
  return Array.from(set).map((name) => ({ name, slug: slugify(name) }));
}

export function categorySlug(name) {
  return slugify(name);
}

export function tagSlug(name) {
  return slugify(name);
}

export function getPostsByCategory(categorySlugValue) {
  return getAllPosts().filter((p) => slugify(p.category) === categorySlugValue);
}

export function getPostsByTag(tagSlugValue) {
  return getAllPosts().filter((p) => p.tags.some((t) => slugify(t) === tagSlugValue));
}

export function getRelatedPosts(post, limit = 3) {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);

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
    .concat(
      scored.length === 0
        ? others.slice(0, limit)
        : []
    )
    .slice(0, limit);
}

export function searchPosts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return getAllPosts();

  return getAllPosts().filter((post) => {
    const haystack = [post.title, post.excerpt, post.category, ...post.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
