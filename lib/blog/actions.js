"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/menu/slug";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const EDITABLE_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "tags",
  "cover_image_alt",
  "seo_title",
  "seo_description",
  "faq",
  "status",
  "published_at",
];

function assertImageFile(file) {
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya türü. JPEG, PNG, WEBP, AVIF veya GIF yükleyin.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel çok büyük. Lütfen tekrar deneyin veya farklı bir fotoğraf seçin.");
  }
}

async function generateUniqueSlug(supabase, titleOrSlug, excludeId) {
  const base = slugify(titleOrSlug || "") || "yazi";
  let candidate = base;
  for (let suffix = 2; ; suffix += 1) {
    let query = supabase.from("blog_posts").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
  }
}

async function revalidatePost(slug) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function getAdminBlogPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAdminBlogPostById(id) {
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBlogPost({ title }) {
  const supabase = createClient();
  const postTitle = title || "Yeni Yazı";
  const slug = await generateUniqueSlug(supabase, postTitle);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: postTitle,
      slug,
      status: "draft",
      // published_at stays null (column default) until updateBlogPost()
      // stamps it the first time this post actually goes live.
    })
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/admin/blog");
  return data;
}

export async function updateBlogPost(id, fields) {
  const supabase = createClient();
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  if (payload.slug !== undefined) {
    payload.slug = await generateUniqueSlug(supabase, payload.slug, id);
  }

  const { data: before } = await supabase
    .from("blog_posts")
    .select("slug, status, published_at")
    .eq("id", id)
    .maybeSingle();

  // Stamp published_at exactly once, the first time this post goes live.
  // If the admin explicitly picked a date in the form (payload.published_at
  // already set), that choice wins. If published_at is already set from a
  // previous publish, draft -> published -> draft -> published again never
  // overwrites it.
  const targetStatus = payload.status !== undefined ? payload.status : before?.status;
  if (targetStatus === "published" && !before?.published_at && payload.published_at === undefined) {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await revalidatePost(before?.slug);
  if (data.slug !== before?.slug) await revalidatePost(data.slug);
  return data;
}

export async function deleteBlogPost(id) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug, cover_image")
    .eq("id", id)
    .maybeSingle();

  if (existing?.cover_image?.includes(`/storage/v1/object/public/${SITE_IMAGE_BUCKET}/`)) {
    const storagePath = existing.cover_image.split(`/${SITE_IMAGE_BUCKET}/`)[1];
    if (storagePath) await supabase.storage.from(SITE_IMAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;

  await revalidatePost(existing?.slug);
}

export async function uploadBlogCoverImage(id, formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `blog/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ cover_image: pub.publicUrl })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await revalidatePost(data.slug);
  return data;
}

export async function deleteBlogCoverImage(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ cover_image: "" })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await revalidatePost(data.slug);
  return data;
}

// Inline image for the content editor (markdown toolbar's "image" button) --
// uploads and returns a public URL only, doesn't touch any post row.
export async function uploadBlogInlineImage(formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `blog/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);
  return pub.publicUrl;
}
