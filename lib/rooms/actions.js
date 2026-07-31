"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SITE_IMAGE_BUCKET = "site-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

function assertImageFile(file) {
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya türü. JPEG, PNG, WEBP, AVIF veya GIF yükleyin.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
  }
}

export async function createRoom({ badge, title, description, tags }) {
  const supabase = createClient();
  const { data: maxRow } = await supabase
    .from("rooms")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("rooms").insert({
    badge: badge || "",
    title: title || "Yeni Oda",
    description: description || "",
    tags: tags || [],
    sort_order: nextOrder,
  });
  if (error) throw error;
  revalidatePath("/odalar");
}

export async function updateRoom(id, { badge, title, description, tags, enabled, image_alt }) {
  const supabase = createClient();
  const payload = {};
  if (badge !== undefined) payload.badge = badge;
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (tags !== undefined) payload.tags = tags;
  if (enabled !== undefined) payload.enabled = enabled;
  if (image_alt !== undefined) payload.image_alt = image_alt;

  const { error } = await supabase.from("rooms").update(payload).eq("id", id);
  if (error) throw error;
  revalidatePath("/odalar");
}

export async function uploadRoomImage(id, formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `rooms/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);

  const { error } = await supabase
    .from("rooms")
    .update({ image_path: data.publicUrl })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/odalar");
}

export async function deleteRoomImage(id) {
  const supabase = createClient();
  const { error } = await supabase.from("rooms").update({ image_path: null }).eq("id", id);
  if (error) throw error;
  revalidatePath("/odalar");
}

export async function deleteRoom(id) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("rooms")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (existing?.image_path?.includes(`/storage/v1/object/public/${SITE_IMAGE_BUCKET}/`)) {
    const storagePath = existing.image_path.split(`/${SITE_IMAGE_BUCKET}/`)[1];
    if (storagePath) await supabase.storage.from(SITE_IMAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/odalar");
}

export async function reorderRooms(orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("rooms").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/odalar");
}
