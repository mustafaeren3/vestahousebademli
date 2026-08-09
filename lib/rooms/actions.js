"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/menu/slug";
import { siteConfig } from "@/lib/site";

const SITE_IMAGE_BUCKET = "site-images";
// Client always optimizes photos to WebP (~300 KB-1.5 MB) before upload; this
// cap is a server-side backstop against bypassing that step, not a normal limit.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

function assertImageFile(file) {
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya türü. JPEG, PNG, WEBP, AVIF veya GIF yükleyin.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel çok büyük. Lütfen tekrar deneyin veya farklı bir fotoğraf seçin.");
  }
}

async function generateUniqueRoomSlug(supabase, title) {
  const base = slugify(title || "") || "oda";
  let candidate = base;
  for (let suffix = 2; ; suffix += 1) {
    const { data } = await supabase.from("rooms").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
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
  const roomTitle = title || "Yeni Oda";
  const slug = await generateUniqueRoomSlug(supabase, roomTitle);

  const { error } = await supabase.from("rooms").insert({
    badge: badge || "",
    title: roomTitle,
    description: description || "",
    tags: tags || [],
    sort_order: nextOrder,
    slug,
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

  // room_images rows cascade-delete with the room, but the gallery photo
  // files themselves live in Storage and won't be cleaned up by the DB
  // cascade, so remove them explicitly first.
  const { data: galleryFiles } = await supabase.storage.from(SITE_IMAGE_BUCKET).list(`rooms/${id}`);
  if (galleryFiles?.length) {
    await supabase.storage
      .from(SITE_IMAGE_BUCKET)
      .remove(galleryFiles.map((f) => `rooms/${id}/${f.name}`));
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

async function revalidateRoom(supabase, roomId) {
  revalidatePath("/odalar");
  const { data: room } = await supabase.from("rooms").select("slug").eq("id", roomId).maybeSingle();
  if (room?.slug) revalidatePath(`/odalar/${room.slug}`);
}

// --- Room photo gallery (room_images) ---
// Each photo is uploaded and inserted independently (one call per file) so
// that a single failed upload in a multi-photo batch never rolls back or
// blocks the photos that already succeeded.

export async function uploadRoomGalleryImage(roomId, formData) {
  const supabase = createClient();
  const file = formData.get("image");
  assertImageFile(file);

  const { count: existingCount } = await supabase
    .from("room_images")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);

  const { data: maxRow } = await supabase
    .from("room_images")
    .select("sort_order")
    .eq("room_id", roomId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `rooms/${roomId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);

  const { data: room } = await supabase.from("rooms").select("title").eq("id", roomId).maybeSingle();
  const altText = `${siteConfig.name} ${room?.title || ""}`.trim();

  const { data: inserted, error } = await supabase
    .from("room_images")
    .insert({
      room_id: roomId,
      image_url: publicUrlData.publicUrl,
      sort_order: nextOrder,
      is_cover: (existingCount ?? 0) === 0,
      alt_text: altText,
    })
    .select()
    .single();
  if (error) throw error;

  await revalidateRoom(supabase, roomId);
  return inserted;
}

export async function deleteRoomGalleryImage(roomId, imageId) {
  const supabase = createClient();

  const { data: image, error: fetchError } = await supabase
    .from("room_images")
    .select("image_url, is_cover")
    .eq("id", imageId)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!image) return { newCoverId: null };

  if (image.image_url?.includes(`/storage/v1/object/public/${SITE_IMAGE_BUCKET}/`)) {
    const storagePath = image.image_url.split(`/${SITE_IMAGE_BUCKET}/`)[1];
    if (storagePath) await supabase.storage.from(SITE_IMAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("room_images").delete().eq("id", imageId);
  if (error) throw error;

  let newCoverId = null;
  if (image.is_cover) {
    const { data: next } = await supabase
      .from("room_images")
      .select("id")
      .eq("room_id", roomId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase.from("room_images").update({ is_cover: true }).eq("id", next.id);
      newCoverId = next.id;
    }
  }

  await revalidateRoom(supabase, roomId);
  return { newCoverId };
}

export async function setRoomCoverImage(roomId, imageId) {
  const supabase = createClient();
  const { error: clearError } = await supabase
    .from("room_images")
    .update({ is_cover: false })
    .eq("room_id", roomId)
    .neq("id", imageId);
  if (clearError) throw clearError;

  const { error } = await supabase.from("room_images").update({ is_cover: true }).eq("id", imageId);
  if (error) throw error;

  await revalidateRoom(supabase, roomId);
}

export async function reorderRoomImages(roomId, orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("room_images").update({ sort_order: index }).eq("id", id).eq("room_id", roomId)
    )
  );
  await revalidateRoom(supabase, roomId);
}
