"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LOCALES, MENU_IMAGE_BUCKET } from "./constants";

export async function createCategory({ slug, translations }) {
  const supabase = createClient();

  const { data: maxRow } = await supabase
    .from("menu_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: category, error } = await supabase
    .from("menu_categories")
    .insert({ slug, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;

  const rows = LOCALES.map((locale) => ({
    category_id: category.id,
    locale,
    name: translations?.[locale] || "",
  }));
  const { error: tError } = await supabase.from("menu_category_translations").insert(rows);
  if (tError) throw tError;

  revalidatePath("/admin/menu");
  return category;
}

export async function updateCategory(categoryId, { active }) {
  const supabase = createClient();
  const { error } = await supabase
    .from("menu_categories")
    .update({ active })
    .eq("id", categoryId);
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function updateCategoryTranslation(categoryId, locale, name) {
  const supabase = createClient();
  const { error } = await supabase
    .from("menu_category_translations")
    .upsert({ category_id: categoryId, locale, name }, { onConflict: "category_id,locale" });
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function deleteCategory(categoryId) {
  const supabase = createClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", categoryId);
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function reorderCategories(orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("menu_categories").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/menu");
}

export async function createProduct({ categoryId, slug, price, currency }) {
  const supabase = createClient();

  const { data: maxRow } = await supabase
    .from("menu_products")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: product, error } = await supabase
    .from("menu_products")
    .insert({
      category_id: categoryId,
      slug,
      price: price || 0,
      currency: currency || "₺",
      sort_order: nextOrder,
    })
    .select()
    .single();
  if (error) throw error;

  const rows = LOCALES.map((locale) => ({
    product_id: product.id,
    locale,
    name: "",
    description: "",
  }));
  const { error: tError } = await supabase.from("menu_product_translations").insert(rows);
  if (tError) throw tError;

  revalidatePath("/admin/menu");
  return product;
}

export async function updateProduct(productId, fields) {
  const supabase = createClient();
  const payload = {};

  if (fields.categoryId !== undefined) payload.category_id = fields.categoryId;
  if (fields.price !== undefined) payload.price = fields.price;
  if (fields.currency !== undefined) payload.currency = fields.currency;
  if (fields.allergens !== undefined) payload.allergens = fields.allergens;
  if (fields.active !== undefined) payload.active = fields.active;
  if (fields.isNew !== undefined) payload.is_new = fields.isNew;
  if (fields.isBestseller !== undefined) payload.is_bestseller = fields.isBestseller;
  if (fields.isVegetarian !== undefined) payload.is_vegetarian = fields.isVegetarian;
  if (fields.isSpicy !== undefined) payload.is_spicy = fields.isSpicy;

  const { error } = await supabase.from("menu_products").update(payload).eq("id", productId);
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function updateProductTranslation(productId, locale, { name, description }) {
  const supabase = createClient();
  const { error } = await supabase
    .from("menu_product_translations")
    .upsert(
      { product_id: productId, locale, name, description },
      { onConflict: "product_id,locale" }
    );
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function deleteProduct(productId) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("menu_products")
    .select("image_path")
    .eq("id", productId)
    .maybeSingle();
  if (existing?.image_path) {
    await supabase.storage.from(MENU_IMAGE_BUCKET).remove([existing.image_path]);
  }

  const { error } = await supabase.from("menu_products").delete().eq("id", productId);
  if (error) throw error;
  revalidatePath("/admin/menu");
}

export async function reorderProducts(categoryId, orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("menu_products")
        .update({ sort_order: index, category_id: categoryId })
        .eq("id", id)
    )
  );
  revalidatePath("/admin/menu");
}

export async function uploadProductImage(productId, formData) {
  const supabase = createClient();
  const file = formData.get("image");
  if (!file || typeof file === "string") throw new Error("Görsel bulunamadı.");

  const { data: existing } = await supabase
    .from("menu_products")
    .select("image_path")
    .eq("id", productId)
    .maybeSingle();
  if (existing?.image_path) {
    await supabase.storage.from(MENU_IMAGE_BUCKET).remove([existing.image_path]);
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `products/${productId}-${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("menu_products")
    .update({ image_path: path })
    .eq("id", productId);
  if (error) throw error;

  revalidatePath("/admin/menu");
}

export async function deleteProductImage(productId) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("menu_products")
    .select("image_path")
    .eq("id", productId)
    .maybeSingle();
  if (existing?.image_path) {
    await supabase.storage.from(MENU_IMAGE_BUCKET).remove([existing.image_path]);
  }

  const { error } = await supabase
    .from("menu_products")
    .update({ image_path: null })
    .eq("id", productId);
  if (error) throw error;
  revalidatePath("/admin/menu");
}
