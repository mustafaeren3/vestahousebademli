export const LOCALES = ["tr", "en", "de", "el"];

export const LOCALE_LABELS = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  el: "Ελληνικά",
};

export const ALLERGENS = [
  { code: "gluten", tr: "Gluten", en: "Gluten", de: "Gluten", el: "Γλουτένη" },
  { code: "crustaceans", tr: "Kabuklu Deniz Ürünleri", en: "Crustaceans", de: "Krebstiere", el: "Μαλακόστρακα" },
  { code: "eggs", tr: "Yumurta", en: "Eggs", de: "Eier", el: "Αυγά" },
  { code: "fish", tr: "Balık", en: "Fish", de: "Fisch", el: "Ψάρι" },
  { code: "peanuts", tr: "Yer Fıstığı", en: "Peanuts", de: "Erdnüsse", el: "Αράπικο Φιστίκι" },
  { code: "soybeans", tr: "Soya", en: "Soybeans", de: "Soja", el: "Σόγια" },
  { code: "milk", tr: "Süt / Laktoz", en: "Milk / Lactose", de: "Milch / Laktose", el: "Γάλα / Λακτόζη" },
  { code: "nuts", tr: "Sert Kabuklu Yemişler", en: "Tree Nuts", de: "Schalenfrüchte", el: "Ξηροί Καρποί" },
  { code: "celery", tr: "Kereviz", en: "Celery", de: "Sellerie", el: "Σέλινο" },
  { code: "mustard", tr: "Hardal", en: "Mustard", de: "Senf", el: "Μουστάρδα" },
  { code: "sesame", tr: "Susam", en: "Sesame", de: "Sesam", el: "Σουσάμι" },
  { code: "sulphites", tr: "Sülfitler", en: "Sulphites", de: "Sulfite", el: "Θειώδη" },
  { code: "lupin", tr: "Acı Bakla (Lupin)", en: "Lupin", de: "Lupinen", el: "Λούπινο" },
  { code: "molluscs", tr: "Yumuşakçalar", en: "Molluscs", de: "Weichtiere", el: "Μαλάκια" },
];

export function allergenLabel(code, locale) {
  const entry = ALLERGENS.find((a) => a.code === code);
  if (!entry) return code;
  return entry[locale] || entry.en;
}

const STORAGE_BUCKET = "menu-images";

export function menuImageUrl(path) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

export const MENU_IMAGE_BUCKET = STORAGE_BUCKET;
