import { createClient } from "@/lib/supabase/public";

export async function getMediaLibrary() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMediaByEntity(linkedEntityType, linkedEntityId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .eq("linked_entity_type", linkedEntityType)
    .eq("linked_entity_id", linkedEntityId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}
