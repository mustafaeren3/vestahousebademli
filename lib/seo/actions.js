"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const EDITABLE_FIELDS = [
  "seo_title",
  "meta_description",
  "canonical_url",
  "robots_index",
  "robots_follow",
  "og_title",
  "og_description",
  "og_image",
  "twitter_title",
  "twitter_description",
  "twitter_image",
];

export async function updateSeoPage(routeKey, path, fields) {
  const supabase = createClient();
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (fields[field] !== undefined) payload[field] = fields[field];
  }

  const { error } = await supabase
    .from("seo_pages")
    .upsert({ route_key: routeKey, path, ...payload }, { onConflict: "route_key" });
  if (error) throw error;

  revalidatePath(path);
  revalidatePath("/admin/seo");
  revalidatePath("/sitemap.xml");
}

// Room SEO title/description live on the rooms table itself (mirrors
// blog_posts.seo_title/seo_description), not in seo_pages -- this writes
// only those two columns, nothing else on the room.
export async function updateRoomSeo(id, { seo_title, seo_description }) {
  const supabase = createClient();
  const { data: room, error } = await supabase
    .from("rooms")
    .update({ seo_title, seo_description })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw error;

  revalidatePath("/admin/seo");
  revalidatePath("/odalar");
  if (room?.slug) revalidatePath(`/odalar/${room.slug}`);
}
