// One-off migration: reads the legacy static menu JSON (public/menu/data/*.json)
// and inserts it into Supabase. Run once after applying supabase/migrations.
//
// Usage:
//   node scripts/seed-menu.js
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
// (service role is needed here to bypass RLS for a bulk one-time import;
// it is never used by the running app itself).

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const LOCALES = ["tr", "en", "de", "el"];

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Eksik ortam değişkeni: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env.local içinde tanımlı olmalı."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function loadData(locale) {
  const filePath = path.join(__dirname, "..", "public", "menu", "data", `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const dataByLocale = Object.fromEntries(LOCALES.map((l) => [l, loadData(l)]));
  const base = dataByLocale.tr;

  const { count: existing } = await supabase
    .from("menu_categories")
    .select("*", { count: "exact", head: true });

  if (existing > 0) {
    console.log(`menu_categories zaten ${existing} kayıt içeriyor, seed atlandı.`);
    console.log("Yeniden seed etmek isterseniz önce tabloları temizleyin.");
    return;
  }

  for (let catIndex = 0; catIndex < base.categories.length; catIndex++) {
    const baseCat = base.categories[catIndex];

    const { data: category, error: catError } = await supabase
      .from("menu_categories")
      .insert({ slug: baseCat.id, sort_order: catIndex, active: true })
      .select()
      .single();
    if (catError) throw catError;

    const catTranslationRows = LOCALES.map((locale) => ({
      category_id: category.id,
      locale,
      name: dataByLocale[locale].categories[catIndex].name,
    }));
    const { error: catTError } = await supabase
      .from("menu_category_translations")
      .insert(catTranslationRows);
    if (catTError) throw catTError;

    for (let itemIndex = 0; itemIndex < baseCat.items.length; itemIndex++) {
      const baseItem = baseCat.items[itemIndex];

      const { data: product, error: prodError } = await supabase
        .from("menu_products")
        .insert({
          category_id: category.id,
          slug: baseItem.id,
          price: baseItem.price,
          currency: baseItem.currency || "₺",
          active: baseItem.active !== false,
          sort_order: itemIndex,
          is_new: !!baseItem.tags?.new,
          is_bestseller: !!baseItem.tags?.bestseller,
          is_vegetarian: !!baseItem.tags?.vegetarian,
          is_spicy: !!baseItem.tags?.spicy,
        })
        .select()
        .single();
      if (prodError) throw prodError;

      const prodTranslationRows = LOCALES.map((locale) => {
        const localItem = dataByLocale[locale].categories[catIndex].items[itemIndex];
        return {
          product_id: product.id,
          locale,
          name: localItem.name,
          description: localItem.description || "",
        };
      });
      const { error: prodTError } = await supabase
        .from("menu_product_translations")
        .insert(prodTranslationRows);
      if (prodTError) throw prodTError;
    }

    console.log(`✓ ${baseCat.id} (${baseCat.items.length} ürün)`);
  }

  console.log("Seed tamamlandı.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
