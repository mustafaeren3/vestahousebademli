"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SITE_IMAGE_BUCKET = "site-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const SECTION_KEYS = [
  "hero",
  "intro",
  "pillars_head",
  "rooms",
  "breakfast",
  "meyhanesi",
  "gallery_head",
  "blog_teaser",
  "closing_cta",
];

const SECTION_FIELDS = [
  "enabled",
  "eyebrow",
  "title",
  "subtitle",
  "body",
  "cta_label",
  "cta_href",
  "image_alt",
  "reverse",
  "tone",
];

function assertSectionKey(key) {
  if (!SECTION_KEYS.includes(key)) throw new Error("Geçersiz bölüm.");
}

function assertImageFile(file) {
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya türü. JPEG, PNG, WEBP, AVIF veya GIF yükleyin.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
  }
}

async function uploadToSiteImages(supabase, folder, file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (error) throw error;
  const { data } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateSection(key, fields) {
  assertSectionKey(key);
  const supabase = createClient();
  const payload = {};
  for (const field of SECTION_FIELDS) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  const { error } = await supabase.from("home_sections").update(payload).eq("key", key);
  if (error) throw error;
  revalidatePath("/");
}

export async function uploadSectionImage(key, formData) {
  assertSectionKey(key);
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const url = await uploadToSiteImages(supabase, "sections", file);

  const { error } = await supabase
    .from("home_sections")
    .update({ image_path: url })
    .eq("key", key);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteSectionImage(key) {
  assertSectionKey(key);
  const supabase = createClient();
  const { error } = await supabase
    .from("home_sections")
    .update({ image_path: null })
    .eq("key", key);
  if (error) throw error;
  revalidatePath("/");
}

export async function createPillar({ icon, title, text }) {
  const supabase = createClient();
  const { data: maxRow } = await supabase
    .from("home_pillars")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("home_pillars")
    .insert({ icon, title, text, sort_order: nextOrder });
  if (error) throw error;
  revalidatePath("/");
}

export async function updatePillar(id, { icon, title, text }) {
  const supabase = createClient();
  const { error } = await supabase.from("home_pillars").update({ icon, title, text }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function deletePillar(id) {
  const supabase = createClient();
  const { error } = await supabase.from("home_pillars").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function reorderPillars(orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("home_pillars").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}

export async function addGalleryImage(formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const width = Number(formData.get("width")) || 1650;
  const height = Number(formData.get("height")) || 2200;
  const alt = formData.get("alt") || "";

  const url = await uploadToSiteImages(supabase, "gallery", file);

  const { data: maxRow } = await supabase
    .from("home_gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("home_gallery_images").insert({
    image_path: url,
    alt,
    width,
    height,
    sort_order: nextOrder,
  });
  if (error) throw error;
  revalidatePath("/");
}

export async function updateGalleryImageAlt(id, alt) {
  const supabase = createClient();
  const { error } = await supabase.from("home_gallery_images").update({ alt }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteGalleryImage(id) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("home_gallery_images")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (existing?.image_path?.includes(`/storage/v1/object/public/${SITE_IMAGE_BUCKET}/`)) {
    const storagePath = existing.image_path.split(`/${SITE_IMAGE_BUCKET}/`)[1];
    if (storagePath) await supabase.storage.from(SITE_IMAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("home_gallery_images").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function reorderGalleryImages(orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("home_gallery_images").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}
