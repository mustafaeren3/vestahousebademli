"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getInteriorPage } from "./staticPages";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const EDITABLE_FIELDS = ["enabled", "eyebrow", "title", "subtitle", "image_alt"];

function assertPageKey(pageKey) {
  if (!getInteriorPage(pageKey)) throw new Error("Geçersiz sayfa.");
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

function revalidatePageAndAdmin(pageKey) {
  const page = getInteriorPage(pageKey);
  if (page) revalidatePath(page.path);
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${pageKey}`);
}

export async function updatePageHero(pageKey, fields) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  const { error } = await supabase
    .from("page_sections")
    .upsert(
      { page_key: pageKey, section_key: "hero", ...payload },
      { onConflict: "page_key,section_key" }
    );
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
}

// Best-effort media_library bookkeeping, same pattern as
// lib/home/actions.js's linkMediaLibrary -- never throws, since the
// primary image_path write already succeeded by the time this runs.
async function linkMediaLibrary(supabase, { storagePath, url, altText, pageKey }) {
  try {
    const { data, error } = await supabase
      .from("media_library")
      .insert({
        storage_path: storagePath,
        url,
        alt_text: altText || "",
        title: altText || "",
        filename: storagePath.split("/").pop() || "",
        linked_entity_type: "page_section",
        linked_entity_id: `${pageKey}:hero`,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch {
    return null;
  }
}

export async function uploadPageHeroImage(pageKey, formData) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const storagePath = `pages/${pageKey}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(storagePath);

  const { data: existing } = await supabase
    .from("page_sections")
    .select("image_alt")
    .eq("page_key", pageKey)
    .eq("section_key", "hero")
    .maybeSingle();

  const mediaId = await linkMediaLibrary(supabase, {
    storagePath,
    url: pub.publicUrl,
    altText: existing?.image_alt || "",
    pageKey,
  });

  const payload = { page_key: pageKey, section_key: "hero", image_path: pub.publicUrl };
  if (mediaId) payload.media_id = mediaId;

  const { error } = await supabase
    .from("page_sections")
    .upsert(payload, { onConflict: "page_key,section_key" });
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
  return { image_path: pub.publicUrl, media_id: mediaId };
}

// Links an existing media_library item as this page's hero image -- no new
// upload, just copies its url/id in. Never overwrites the media_library
// row itself.
export async function setPageHeroImageFromMedia(pageKey, mediaId) {
  assertPageKey(pageKey);
  const supabase = createClient();

  const { data: media, error: mediaError } = await supabase
    .from("media_library")
    .select("id, url")
    .eq("id", mediaId)
    .maybeSingle();
  if (mediaError) throw mediaError;
  if (!media) throw new Error("Görsel bulunamadı.");

  const { error } = await supabase
    .from("page_sections")
    .upsert(
      { page_key: pageKey, section_key: "hero", image_path: media.url, media_id: media.id },
      { onConflict: "page_key,section_key" }
    );
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
  return { image_path: media.url, media_id: media.id };
}
