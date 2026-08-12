import { createClient } from "@/lib/supabase/public";

// Every public route's generateMetadata() calls this. Before the Faz 5
// migration (0011_seo.sql) is applied, the seo_pages table doesn't exist
// yet -- this must never throw, or every public page would break. Any
// query error (missing table included) is treated the same as "no row
// yet": every caller already has its own hardcoded fallback for every
// field, so returning null here just means "use the fallback".
export async function getSeoPage(routeKey) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("route_key", routeKey)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function getAllSeoPages() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("seo_pages").select("*").order("path");
    if (error) throw error;
    return data;
  } catch {
    return [];
  }
}
