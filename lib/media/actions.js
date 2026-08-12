"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { suggestMediaMeta } from "@/lib/media/suggest";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const EDITABLE_FIELDS = [
  "alt_text",
  "title",
  "caption",
  "filename",
  "linked_entity_type",
  "linked_entity_id",
  "is_cover",
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

export async function uploadMedia(formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const linkedPath = formData.get("linked_entity_id") || "";
  const suggestion = suggestMediaMeta({ filename: file.name, linkedPath });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const storagePath = `media/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(storagePath);

  const { data: maxRow } = await supabase
    .from("media_library")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: inserted, error } = await supabase
    .from("media_library")
    .insert({
      storage_path: storagePath,
      url: publicUrlData.publicUrl,
      alt_text: suggestion.altText,
      title: suggestion.altText,
      caption: suggestion.caption,
      filename: suggestion.filename,
      linked_entity_type: linkedPath ? "page" : null,
      linked_entity_id: linkedPath || null,
      sort_order: nextOrder,
    })
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/admin/media");
  return inserted;
}

export async function updateMedia(id, fields) {
  const supabase = createClient();
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  const { error } = await supabase.from("media_library").update(payload).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/media");
}

export async function deleteMedia(id) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("media_library")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (existing?.storage_path) {
    await supabase.storage.from(SITE_IMAGE_BUCKET).remove([existing.storage_path]);
  }

  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/media");
}

export async function reorderMedia(orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("media_library").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/media");
}
