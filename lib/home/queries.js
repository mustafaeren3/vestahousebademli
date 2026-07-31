import { createClient } from "@/lib/supabase/public";

export async function getHomeSections() {
  const supabase = createClient();
  const { data, error } = await supabase.from("home_sections").select("*");
  if (error) throw error;

  const byKey = {};
  for (const row of data) byKey[row.key] = row;
  return byKey;
}

export async function getHomePillars() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("home_pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getHomeGalleryImages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("home_gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAdminHomeData() {
  const [sections, pillars, galleryImages] = await Promise.all([
    getHomeSections(),
    getHomePillars(),
    getHomeGalleryImages(),
  ]);
  return { sections, pillars, galleryImages };
}
