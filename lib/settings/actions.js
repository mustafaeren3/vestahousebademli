"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SITE_IMAGE_BUCKET = "site-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const EDITABLE_FIELDS = [
  "name",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address_line1",
  "address_district",
  "instagram",
  "facebook",
  "google_maps_url",
  "google_business_url",
  "copyright_text",
  "footer_text",
];

export async function updateSiteSettings(fields) {
  const supabase = createClient();
  const payload = {};
  for (const key of EDITABLE_FIELDS) {
    if (fields[key] !== undefined) payload[key] = fields[key];
  }

  const { error } = await supabase.from("site_settings").update(payload).eq("id", "default");
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function uploadSiteImage(kind, formData) {
  if (kind !== "logo" && kind !== "favicon") throw new Error("Geçersiz görsel türü.");
  const supabase = createClient();
  const file = formData.get("image");
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya türü. JPEG, PNG, WEBP, AVIF veya GIF yükleyin.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${kind}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);
  const column = kind === "logo" ? "logo_path" : "favicon_path";

  const { error } = await supabase
    .from("site_settings")
    .update({ [column]: publicUrlData.publicUrl })
    .eq("id", "default");
  if (error) throw error;

  revalidatePath("/", "layout");
}
