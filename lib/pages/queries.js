import { createClient } from "@/lib/supabase/public";

// Every interior page's render calls this. Before the Faz 6 migration
// (0012_page_sections.sql) is applied, the page_sections table doesn't
// exist yet -- this must never throw, or every interior page would break.
// Any query error (missing table included) is treated the same as "no row
// yet": every caller already has its own hardcoded fallback for every
// field.
export async function getPageSection(pageKey, sectionKey = "hero") {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_key", pageKey)
      .eq("section_key", sectionKey)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function getAllPageHeroSections() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("section_key", "hero");
    if (error) throw error;
    return data;
  } catch {
    return [];
  }
}
