"use client";

import { useState } from "react";
import { LOCALES, LOCALE_LABELS, ALLERGENS } from "@/lib/menu/constants";
import { slugify } from "@/lib/menu/slug";
import ImageUploader from "./ImageUploader";
import styles from "./ProductFormModal.module.css";

const TAG_FIELDS = [
  { key: "isNew", label: "Yeni" },
  { key: "isBestseller", label: "Çok Satan" },
  { key: "isVegetarian", label: "Vejetaryen" },
  { key: "isSpicy", label: "Acı" },
];

export default function ProductFormModal({
  product,
  categories,
  defaultCategoryId,
  onSave,
  onImageChanged,
  onClose,
}) {
  const isNew = !product;
  const [activeLocale, setActiveLocale] = useState("tr");
  const [categoryId, setCategoryId] = useState(product?.category_id || defaultCategoryId || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [currency, setCurrency] = useState(product?.currency || "₺");
  const [allergens, setAllergens] = useState(product?.allergens || []);
  const [tags, setTags] = useState({
    isNew: product?.is_new || false,
    isBestseller: product?.is_bestseller || false,
    isVegetarian: product?.is_vegetarian || false,
    isSpicy: product?.is_spicy || false,
  });
  const [active, setActive] = useState(product?.active ?? true);
  const [translations, setTranslations] = useState(() => {
    const initial = {};
    for (const locale of LOCALES) {
      initial[locale] = {
        name: product?.translations?.[locale]?.name || "",
        description: product?.translations?.[locale]?.description || "",
      };
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function toggleAllergen(code) {
    setAllergens((prev) =>
      prev.includes(code) ? prev.filter((a) => a !== code) : [...prev, code]
    );
  }

  function updateTranslationField(locale, field, value) {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoryId) {
      setError("Kategori seçin.");
      return;
    }
    if (isNew && !translations.tr.name.trim()) {
      setError("Türkçe ürün adı zorunludur.");
      setActiveLocale("tr");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        id: product?.id,
        categoryId,
        slug: isNew ? slugify(`${translations.tr.name}-${Date.now()}`) : undefined,
        fields: {
          price: Number(price) || 0,
          currency,
          allergens,
          isNew: tags.isNew,
          isBestseller: tags.isBestseller,
          isVegetarian: tags.isVegetarian,
          isSpicy: tags.isSpicy,
          active,
        },
        locale: activeLocale,
        translation: translations[activeLocale],
        translations,
      });
      if (!isNew) onClose();
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
          {isNew ? "Yeni Ürün" : "Ürünü Düzenle"}
        </h3>

        {error && (
          <div className="admin-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        {!isNew && (
          <ImageUploader
            productId={product.id}
            imageUrl={product.image_url}
            onChanged={onImageChanged}
          />
        )}
        {isNew && <p className={styles.hint}>Görsel eklemek için önce ürünü kaydedin.</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className="admin-field">
              <label htmlFor="category">Kategori</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.translations.tr?.name || cat.slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="price">Fiyat</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ maxWidth: 90 }}>
              <label htmlFor="currency">Birim</label>
              <input
                id="currency"
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-tabs">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                className="admin-tab"
                data-active={activeLocale === locale}
                onClick={() => setActiveLocale(locale)}
              >
                {LOCALE_LABELS[locale]}
                {locale === "tr" && " *"}
              </button>
            ))}
          </div>

          {!isNew && (
            <p className={styles.hint}>
              Kaydet, yalnızca şu an açık olan “{LOCALE_LABELS[activeLocale]}” dilini günceller;
              diğer diller etkilenmez.
            </p>
          )}

          {LOCALES.map((locale) => (
            <div key={locale} style={{ display: activeLocale === locale ? "block" : "none" }}>
              <div className="admin-field">
                <label>Ürün Adı ({LOCALE_LABELS[locale]})</label>
                <input
                  type="text"
                  value={translations[locale].name}
                  onChange={(e) => updateTranslationField(locale, "name", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Açıklama ({LOCALE_LABELS[locale]})</label>
                <textarea
                  value={translations[locale].description}
                  onChange={(e) => updateTranslationField(locale, "description", e.target.value)}
                />
              </div>
            </div>
          ))}

          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-ink-soft)" }}>
            Alerjenler
          </label>
          <div className={styles.checkGrid} style={{ marginTop: 8 }}>
            {ALLERGENS.map((allergen) => (
              <label key={allergen.code} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={allergens.includes(allergen.code)}
                  onChange={() => toggleAllergen(allergen.code)}
                />
                {allergen.tr}
              </label>
            ))}
          </div>

          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-ink-soft)" }}>
            Etiketler
          </label>
          <div className={styles.checkGrid} style={{ marginTop: 8 }}>
            {TAG_FIELDS.map((tag) => (
              <label key={tag.key} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={tags[tag.key]}
                  onChange={() =>
                    setTags((prev) => ({ ...prev, [tag.key]: !prev[tag.key] }))
                  }
                />
                {tag.label}
              </label>
            ))}
          </div>

          <div className={styles.toggleRow}>
            <button
              type="button"
              className="admin-toggle"
              data-on={active}
              onClick={() => setActive((v) => !v)}
              aria-pressed={active}
            >
              <span />
            </button>
            <label style={{ margin: 0 }}>Menüde görünsün</label>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={onClose}
              disabled={saving}
            >
              {isNew ? "Vazgeç" : "Kapat"}
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
