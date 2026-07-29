import { createClient } from "@/lib/supabase/server";
import { LOCALES, menuImageUrl } from "./constants";

function translationMap(rows) {
  const map = {};
  for (const locale of LOCALES) map[locale] = null;
  for (const row of rows || []) {
    map[row.locale] = row;
  }
  return map;
}

// Public-facing menu, shaped like the legacy static JSON so MenuApp.jsx
// needs no changes. Only active categories/products are returned.
export async function getMenuForLocale(locale) {
  const supabase = createClient();

  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select(
      "id, slug, sort_order, active, menu_category_translations(locale, name)"
    )
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (catError) throw catError;

  const { data: products, error: prodError } = await supabase
    .from("menu_products")
    .select(
      "id, category_id, slug, price, currency, image_path, allergens, is_new, is_bestseller, is_vegetarian, is_spicy, active, sort_order, menu_product_translations(locale, name, description)"
    )
    .order("sort_order", { ascending: true });

  if (prodError) throw prodError;

  const productsByCategory = {};
  for (const product of products) {
    if (!productsByCategory[product.category_id]) productsByCategory[product.category_id] = [];
    productsByCategory[product.category_id].push(product);
  }

  const shaped = categories.map((cat) => {
    const catTranslations = translationMap(cat.menu_category_translations);
    const items = (productsByCategory[cat.id] || []).map((product) => {
      const t = translationMap(product.menu_product_translations);
      const translation = t[locale] || t.tr || { name: product.slug, description: "" };

      return {
        id: product.slug,
        name: translation.name,
        description: translation.description || "",
        price: Number(product.price),
        currency: product.currency,
        image: menuImageUrl(product.image_path),
        active: product.active,
        allergens: product.allergens || [],
        tags: {
          new: product.is_new,
          bestseller: product.is_bestseller,
          vegetarian: product.is_vegetarian,
          spicy: product.is_spicy,
        },
      };
    });

    return {
      id: cat.slug,
      name: (catTranslations[locale] || catTranslations.tr || { name: cat.slug }).name,
      items,
    };
  });

  return {
    updatedAt: new Date().toISOString().slice(0, 10),
    categories: shaped,
  };
}

// Full data set (all locales, including inactive rows) for the admin panel.
export async function getAdminMenuData() {
  const supabase = createClient();

  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select("id, slug, sort_order, active, menu_category_translations(locale, name)")
    .order("sort_order", { ascending: true });

  if (catError) throw catError;

  const { data: products, error: prodError } = await supabase
    .from("menu_products")
    .select(
      "id, category_id, slug, price, currency, image_path, allergens, is_new, is_bestseller, is_vegetarian, is_spicy, active, sort_order, updated_at, menu_product_translations(locale, name, description)"
    )
    .order("sort_order", { ascending: true });

  if (prodError) throw prodError;

  const productsByCategory = {};
  for (const product of products) {
    if (!productsByCategory[product.category_id]) productsByCategory[product.category_id] = [];
    productsByCategory[product.category_id].push({
      ...product,
      image_url: menuImageUrl(product.image_path),
      translations: translationMap(product.menu_product_translations),
    });
  }

  return categories.map((cat) => ({
    ...cat,
    translations: translationMap(cat.menu_category_translations),
    products: productsByCategory[cat.id] || [],
  }));
}

export async function getDashboardStats() {
  const supabase = createClient();

  const [{ count: categoryCount }, { count: productCount }, { count: activeCount }] =
    await Promise.all([
      supabase.from("menu_categories").select("*", { count: "exact", head: true }),
      supabase.from("menu_products").select("*", { count: "exact", head: true }),
      supabase
        .from("menu_products")
        .select("*", { count: "exact", head: true })
        .eq("active", true),
    ]);

  return {
    categoryCount: categoryCount || 0,
    productCount: productCount || 0,
    activeProductCount: activeCount || 0,
    inactiveProductCount: (productCount || 0) - (activeCount || 0),
  };
}

export async function getRecentUpdates(limit = 6) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("menu_products")
    .select("id, slug, active, updated_at, menu_product_translations(locale, name)")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data.map((product) => {
    const translations = translationMap(product.menu_product_translations);
    const name = (translations.tr || translations.en || { name: product.slug }).name;
    return {
      id: product.id,
      name,
      active: product.active,
      updatedAt: product.updated_at,
    };
  });
}
