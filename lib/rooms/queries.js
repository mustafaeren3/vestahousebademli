import { createClient } from "@/lib/supabase/public";

export async function getRooms() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*)")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "room_images" });
  if (error) throw error;
  return data;
}

export async function getAdminRooms() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "room_images" });
  if (error) throw error;
  return data;
}

export async function getRoomBySlug(slug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*)")
    .eq("slug", slug)
    .eq("enabled", true)
    .order("sort_order", { ascending: true, foreignTable: "room_images" })
    .maybeSingle();
  if (error) throw error;
  return data;
}

// room_images is the source of truth once populated; rooms.image_path is
// kept only as a fallback for rooms that somehow end up with an empty
// gallery, so a room card or detail page never renders with no photo at all.
export function getRoomGallery(room) {
  const images = [...(room.room_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  if (images.length > 0) return images;
  if (room.image_path) {
    return [
      {
        id: "legacy",
        image_url: room.image_path,
        alt_text: room.image_alt || room.title,
        is_cover: true,
        sort_order: 0,
      },
    ];
  }
  return [];
}

export function getRoomCover(room) {
  const gallery = getRoomGallery(room);
  const cover = gallery.find((img) => img.is_cover) || gallery[0];
  if (!cover) return null;
  return { url: cover.image_url, alt: cover.alt_text || room.image_alt || room.title };
}
