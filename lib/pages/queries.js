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

// Faz 7: every body-section row (intro/feature/closing/pricing_head/...)
// for one page, keyed by section_key -- same never-throw contract as
// getPageSection above, and the same shape as lib/home/queries.js's
// getHomeSections byKey map.
export async function getPageSections(pageKey) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_key", pageKey);
    if (error) throw error;
    const byKey = {};
    for (const row of data) byKey[row.section_key] = row;
    return byKey;
  } catch {
    return {};
  }
}

// Faz 8: sayfa seviyesinde aktif/pasif anahtarı. page_settings tablosu ya
// da bu page_key için satır yoksa (migration henüz uygulanmamışsa dahil)
// `true` döner -- bu özellikle önemli, çünkü aksi halde migration
// uygulanmadan önce her sayfa yanlışlıkla "pasif" görünürdü.
export async function getPageIsActive(pageKey) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_settings")
      .select("is_active")
      .eq("page_key", pageKey)
      .maybeSingle();
    if (error) throw error;
    return data?.is_active !== false;
  } catch {
    return true;
  }
}

// Faz 7: Galeri sayfasının (ve ileride başka bir iç sayfanın) serbest
// görsel galerisi. Sorgu hatası/tablo yokluğunda boş dizi döner --
// app/(site)/galeri/page.jsx bu durumda lib/galeriImages.js'teki sabit
// diziye düşer.
export async function getPageGalleryImages(pageKey) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_gallery_images")
      .select("*")
      .eq("page_key", pageKey)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  } catch {
    return [];
  }
}

// Faz 7: Kahvaltı gibi sayfaların fiyatlı/notlu liste grupları
// (inclusions/extras/sicak_icecekler/soguk_icecekler). group_key'e göre
// gruplanmış döner; sorgu hatasında boş obje -- çağıran taraf kendi
// hardcoded dizisine düşer.
export async function getPageListItems(pageKey) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("page_list_items")
      .select("*")
      .eq("page_key", pageKey)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    const byGroup = {};
    for (const row of data) {
      if (!byGroup[row.group_key]) byGroup[row.group_key] = [];
      byGroup[row.group_key].push(row);
    }
    return byGroup;
  } catch {
    return {};
  }
}
