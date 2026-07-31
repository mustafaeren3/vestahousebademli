import { createClient } from "@/lib/supabase/public";

export async function getSiteSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .single();
  if (error) throw error;
  return data;
}
