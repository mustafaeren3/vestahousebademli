"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SECTION_ALT_FALLBACKS, GALLERY_ALT_FALLBACK } from "@/lib/home/altSuggestions";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
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
  "cta_target_blank",
  "cta_is_external",
  "cta_aria_label",
  "cta_active",
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
    throw new Error("Görsel çok büyük. Lütfen tekrar deneyin veya farklı bir fotoğraf seçin.");
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
  return { url: data.publicUrl, storagePath: path };
}

// Best-effort media_library bookkeeping for a homepage image that was just
// uploaded to Storage. Never throws: the primary image_path write already
// succeeded by the time this runs, and a media_library hiccup shouldn't take
// down an otherwise-successful photo upload.
async function linkMediaLibrary(supabase, { storagePath, url, altText, linkedEntityType, linkedEntityId }) {
  try {
    const { data, error } = await supabase
      .from("media_library")
      .insert({
        storage_path: storagePath,
        url,
        alt_text: altText || "",
        title: altText || "",
        filename: storagePath.split("/").pop() || "",
        linked_entity_type: linkedEntityType,
        linked_entity_id: String(linkedEntityId),
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch {
    return null;
  }
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

  const { url, storagePath } = await uploadToSiteImages(supabase, "sections", file);
  const mediaId = await linkMediaLibrary(supabase, {
    storagePath,
    url,
    altText: SECTION_ALT_FALLBACKS[key] || "",
    linkedEntityType: "home_section",
    linkedEntityId: key,
  });

  const payload = { image_path: url };
  if (mediaId) payload.media_id = mediaId;

  const { error } = await supabase.from("home_sections").update(payload).eq("key", key);
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
  const alt = (formData.get("alt") || "").trim();

  const { url, storagePath } = await uploadToSiteImages(supabase, "gallery", file);

  const { data: maxRow } = await supabase
    .from("home_gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: inserted, error } = await supabase
    .from("home_gallery_images")
    .insert({
      image_path: url,
      alt,
      width,
      height,
      sort_order: nextOrder,
    })
    .select("id")
    .single();
  if (error) throw error;

  // Linked after insert (not inside uploadToSiteImages) since the media_library
  // row references this gallery row's own id, which only exists once inserted.
  const mediaId = await linkMediaLibrary(supabase, {
    storagePath,
    url,
    altText: alt || GALLERY_ALT_FALLBACK,
    linkedEntityType: "home_gallery_image",
    linkedEntityId: inserted.id,
  });
  if (mediaId) {
    await supabase.from("home_gallery_images").update({ media_id: mediaId }).eq("id", inserted.id);
  }

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
