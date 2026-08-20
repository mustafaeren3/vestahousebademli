"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getInteriorPage, getPageBodySection } from "./staticPages";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const HERO_FIELDS = ["enabled", "eyebrow", "title", "subtitle", "image_alt"];
// Body sections (Faz 7) never carry their own `enabled` toggle -- unlike
// Hero, they're always part of the page's fixed prose flow. Prose sections
// only ever use eyebrow/subtitle/body; feature sections add title/image_alt
// /reverse/tone. Passing the union through is harmless since updatePageSection
// only writes keys that were actually included in `fields`.
const BODY_SECTION_FIELDS = ["eyebrow", "title", "subtitle", "body", "image_alt", "reverse", "tone"];

function assertPageKey(pageKey) {
  if (!getInteriorPage(pageKey)) throw new Error("Geçersiz sayfa.");
}

function assertSectionKey(pageKey, sectionKey) {
  if (sectionKey === "hero") {
    assertPageKey(pageKey);
    return;
  }
  if (!getPageBodySection(pageKey, sectionKey)) throw new Error("Geçersiz bölüm.");
}

function assertListGroup(pageKey, groupKey) {
  const page = getInteriorPage(pageKey);
  const group = page?.listItemGroups?.find((g) => g.key === groupKey);
  if (!group) throw new Error("Geçersiz liste grubu.");
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

// Best-effort media_library bookkeeping, same pattern as
// lib/home/actions.js's linkMediaLibrary -- never throws, since the
// primary image_path write already succeeded by the time this runs.
async function linkMediaLibrary(supabase, { storagePath, url, altText, linkedEntityId }) {
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
        linked_entity_id: linkedEntityId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch {
    return null;
  }
}

export async function updatePageHero(pageKey, fields) {
  return updatePageSection(pageKey, "hero", fields);
}

// Faz 8: sayfa seviyesinde aktif/pasif anahtarı -- getPageIsActive'in
// karşılığı. Kapatıldığında sayfanın kendisi 404 döner, ana sayfa
// bölümü/nav/footer/sitemap linkleri gizlenir, ama page_sections /
// page_list_items içindeki veri hiç silinmez.
export async function updatePageIsActive(pageKey, isActive) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const { error } = await supabase
    .from("page_settings")
    .upsert(
      { page_key: pageKey, is_active: isActive, updated_at: new Date().toISOString() },
      { onConflict: "page_key" }
    );
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function uploadPageHeroImage(pageKey, formData) {
  return uploadPageSectionImage(pageKey, "hero", formData);
}

export async function setPageHeroImageFromMedia(pageKey, mediaId) {
  return setPageSectionImageFromMedia(pageKey, "hero", mediaId);
}

// Faz 7: generic version of the above -- Hero is just section_key='hero'.
// EDITABLE_FIELDS differs by section: Hero owns `enabled` (page.jsx hides
// the whole banner when false), body sections don't.
export async function updatePageSection(pageKey, sectionKey, fields) {
  assertSectionKey(pageKey, sectionKey);
  const editableFields = sectionKey === "hero" ? HERO_FIELDS : BODY_SECTION_FIELDS;
  const supabase = createClient();
  const payload = {};
  for (const field of editableFields) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  const { error } = await supabase
    .from("page_sections")
    .upsert(
      { page_key: pageKey, section_key: sectionKey, ...payload },
      { onConflict: "page_key,section_key" }
    );
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
}

export async function uploadPageSectionImage(pageKey, sectionKey, formData) {
  assertSectionKey(pageKey, sectionKey);
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
    .eq("section_key", sectionKey)
    .maybeSingle();

  const mediaId = await linkMediaLibrary(supabase, {
    storagePath,
    url: pub.publicUrl,
    altText: existing?.image_alt || "",
    linkedEntityId: `${pageKey}:${sectionKey}`,
  });

  const payload = { page_key: pageKey, section_key: sectionKey, image_path: pub.publicUrl };
  if (mediaId) payload.media_id = mediaId;

  const { error } = await supabase
    .from("page_sections")
    .upsert(payload, { onConflict: "page_key,section_key" });
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
  return { image_path: pub.publicUrl, media_id: mediaId };
}

// Links an existing media_library item as this section's image -- no new
// upload, just copies its url/id in. Never overwrites the media_library
// row itself.
export async function setPageSectionImageFromMedia(pageKey, sectionKey, mediaId) {
  assertSectionKey(pageKey, sectionKey);
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
      { page_key: pageKey, section_key: sectionKey, image_path: media.url, media_id: media.id },
      { onConflict: "page_key,section_key" }
    );
  if (error) throw error;

  revalidatePageAndAdmin(pageKey);
  return { image_path: media.url, media_id: media.id };
}

// --- Faz 7: sayfaya özgü galeri (bugün yalnızca /galeri kullanıyor) ---
// lib/home/actions.js'teki home_gallery_images CRUD'unun pageKey parametreli
// hali; aynı upload/link/reorder deseni.

export async function addPageGalleryImage(pageKey, formData) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const width = Number(formData.get("width")) || 1650;
  const height = Number(formData.get("height")) || 2200;
  const alt = (formData.get("alt") || "").trim();

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const storagePath = `pages/${pageKey}/gallery/${randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;
  const { data: pub } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(storagePath);

  const { data: maxRow } = await supabase
    .from("page_gallery_images")
    .select("sort_order")
    .eq("page_key", pageKey)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: inserted, error } = await supabase
    .from("page_gallery_images")
    .insert({ page_key: pageKey, image_path: pub.publicUrl, alt, width, height, sort_order: nextOrder })
    .select("id")
    .single();
  if (error) throw error;

  const mediaId = await linkMediaLibrary(supabase, {
    storagePath,
    url: pub.publicUrl,
    altText: alt,
    linkedEntityId: `${pageKey}:gallery:${inserted.id}`,
  });
  if (mediaId) {
    await supabase.from("page_gallery_images").update({ media_id: mediaId }).eq("id", inserted.id);
  }

  revalidatePageAndAdmin(pageKey);
}

export async function updatePageGalleryImageAlt(pageKey, id, alt) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const { error } = await supabase
    .from("page_gallery_images")
    .update({ alt })
    .eq("id", id)
    .eq("page_key", pageKey);
  if (error) throw error;
  revalidatePageAndAdmin(pageKey);
}

export async function deletePageGalleryImage(pageKey, id) {
  assertPageKey(pageKey);
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("page_gallery_images")
    .select("image_path")
    .eq("id", id)
    .eq("page_key", pageKey)
    .maybeSingle();
  if (existing?.image_path?.includes(`/storage/v1/object/public/${SITE_IMAGE_BUCKET}/`)) {
    const storagePath = existing.image_path.split(`/${SITE_IMAGE_BUCKET}/`)[1];
    if (storagePath) await supabase.storage.from(SITE_IMAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase
    .from("page_gallery_images")
    .delete()
    .eq("id", id)
    .eq("page_key", pageKey);
  if (error) throw error;
  revalidatePageAndAdmin(pageKey);
}

export async function reorderPageGalleryImages(pageKey, orderedIds) {
  assertPageKey(pageKey);
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("page_gallery_images")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("page_key", pageKey)
    )
  );
  revalidatePageAndAdmin(pageKey);
}

// --- Faz 7: sayfaya özgü fiyatlı/notlu liste satırları (bugün yalnızca
// /kahvalti kullanıyor) --- lib/home/actions.js'teki home_pillars CRUD'unun
// pageKey+groupKey parametreli hali.

export async function createPageListItem(pageKey, groupKey, { name, detail }) {
  assertListGroup(pageKey, groupKey);
  const supabase = createClient();
  const { data: maxRow } = await supabase
    .from("page_list_items")
    .select("sort_order")
    .eq("page_key", pageKey)
    .eq("group_key", groupKey)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("page_list_items")
    .insert({ page_key: pageKey, group_key: groupKey, name, detail, sort_order: nextOrder });
  if (error) throw error;
  revalidatePageAndAdmin(pageKey);
}

export async function updatePageListItem(pageKey, id, { name, detail }) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const { error } = await supabase
    .from("page_list_items")
    .update({ name, detail })
    .eq("id", id)
    .eq("page_key", pageKey);
  if (error) throw error;
  revalidatePageAndAdmin(pageKey);
}

export async function deletePageListItem(pageKey, id) {
  assertPageKey(pageKey);
  const supabase = createClient();
  const { error } = await supabase
    .from("page_list_items")
    .delete()
    .eq("id", id)
    .eq("page_key", pageKey);
  if (error) throw error;
  revalidatePageAndAdmin(pageKey);
}

export async function reorderPageListItems(pageKey, groupKey, orderedIds) {
  assertListGroup(pageKey, groupKey);
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("page_list_items")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("page_key", pageKey)
        .eq("group_key", groupKey)
    )
  );
  revalidatePageAndAdmin(pageKey);
}
