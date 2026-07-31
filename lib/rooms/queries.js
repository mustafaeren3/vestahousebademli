import { createClient } from "@/lib/supabase/public";

export async function getRooms() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAdminRooms() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}
