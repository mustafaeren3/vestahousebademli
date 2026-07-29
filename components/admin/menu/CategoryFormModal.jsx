"use client";

import { useState } from "react";
import { LOCALES, LOCALE_LABELS } from "@/lib/menu/constants";
import { slugify } from "@/lib/menu/slug";

export default function CategoryFormModal({ category, onSave, onClose }) {
  const isNew = !category;
  const [activeLocale, setActiveLocale] = useState("tr");
  const [names, setNames] = useState(() => {
    const initial = {};
    for (const locale of LOCALES) initial[locale] = category?.translations?.[locale]?.name || "";
    return initial;
  });
  const [active, setActive] = useState(category?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!names.tr.trim()) {
      setError("Türkçe kategori adı zorunludur.");
      setActiveLocale("tr");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        id: category?.id,
        slug: isNew ? slugify(names.tr) : undefined,
        translations: names,
        active,
      });
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
          {isNew ? "Yeni Kategori" : "Kategoriyi Düzenle"}
        </h3>

        {error && (
          <div className="admin-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          {LOCALES.map((locale) => (
            <div
              key={locale}
              className="admin-field"
              style={{ display: activeLocale === locale ? "flex" : "none" }}
            >
              <label>Kategori Adı ({LOCALE_LABELS[locale]})</label>
              <input
                type="text"
                value={names[locale]}
                onChange={(e) => setNames((prev) => ({ ...prev, [locale]: e.target.value }))}
              />
            </div>
          ))}

          <div
            className="admin-field"
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
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

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={onClose}
              disabled={saving}
            >
              Vazgeç
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
