"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSection, uploadSectionImage, deleteSectionImage } from "@/lib/home/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import styles from "./SectionForm.module.css";

export default function SectionForm({ section, config }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [enabled, setEnabled] = useState(section.enabled);
  const [reverse, setReverse] = useState(section.reverse);
  const [tone, setTone] = useState(section.tone);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    fields.enabled = enabled;
    if (config.layout) {
      fields.reverse = reverse;
      fields.tone = tone;
    }

    try {
      await updateSection(section.key, fields);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  async function handleImageUpload(file) {
    const formData = new FormData();
    formData.set("image", file);
    await uploadSectionImage(section.key, formData);
    router.refresh();
  }

  async function handleImageRemove() {
    await deleteSectionImage(section.key);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="admin-success" style={{ marginBottom: 16 }}>
          Kaydedildi.
        </div>
      )}

      <div className={styles.toggleRow}>
        <button
          type="button"
          className="admin-toggle"
          data-on={enabled}
          onClick={() => setEnabled((v) => !v)}
          aria-pressed={enabled}
        >
          <span />
        </button>
        <span className={styles.toggleLabel}>
          {enabled ? "Bu bölüm sitede görünüyor" : "Bu bölüm gizli"}
        </span>
      </div>

      {config.image && (
        <div className="admin-field">
          <label>Görsel</label>
          <ImageUploader
            imageUrl={section.image_path}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
        </div>
      )}

      <div className="admin-field">
        <label htmlFor={`${section.key}-eyebrow`}>Üst Etiket</label>
        <input
          id={`${section.key}-eyebrow`}
          name="eyebrow"
          type="text"
          defaultValue={section.eyebrow}
        />
      </div>

      {config.title && (
        <div className="admin-field">
          <label htmlFor={`${section.key}-title`}>Başlık</label>
          <input
            id={`${section.key}-title`}
            name="title"
            type="text"
            defaultValue={section.title}
          />
        </div>
      )}

      {config.subtitle && (
        <div className="admin-field">
          <label htmlFor={`${section.key}-subtitle`}>
            {section.key === "hero" ? "Başlık (İkinci Satır)" : "Alt Başlık"}
          </label>
          <input
            id={`${section.key}-subtitle`}
            name="subtitle"
            type="text"
            defaultValue={section.subtitle}
          />
        </div>
      )}

      {config.body && (
        <div className="admin-field">
          <label htmlFor={`${section.key}-body`}>Metin</label>
          <textarea id={`${section.key}-body`} name="body" defaultValue={section.body} />
        </div>
      )}

      {config.image && (
        <div className="admin-field">
          <label htmlFor={`${section.key}-image_alt`}>Görsel Açıklaması (alt metin)</label>
          <input
            id={`${section.key}-image_alt`}
            name="image_alt"
            type="text"
            defaultValue={section.image_alt}
          />
        </div>
      )}

      {config.cta && (
        <div className={styles.row}>
          <div className="admin-field">
            <label htmlFor={`${section.key}-cta_label`}>Buton Metni</label>
            <input
              id={`${section.key}-cta_label`}
              name="cta_label"
              type="text"
              defaultValue={section.cta_label}
            />
          </div>
          <div className="admin-field">
            <label htmlFor={`${section.key}-cta_href`}>Buton Bağlantısı</label>
            <input
              id={`${section.key}-cta_href`}
              name="cta_href"
              type="text"
              defaultValue={section.cta_href}
            />
          </div>
        </div>
      )}

      {config.layout && (
        <div className={styles.row}>
          <div className="admin-field">
            <label htmlFor={`${section.key}-tone`}>Görünüm</label>
            <select
              id={`${section.key}-tone`}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="light">Açık</option>
              <option value="dark">Koyu</option>
            </select>
          </div>
          <div className={styles.toggleRow} style={{ marginTop: 22 }}>
            <button
              type="button"
              className="admin-toggle"
              data-on={reverse}
              onClick={() => setReverse((v) => !v)}
              aria-pressed={reverse}
            >
              <span />
            </button>
            <span className={styles.toggleLabel}>Görsel sağda</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="admin-btn admin-btn--primary"
        disabled={pending}
        style={{ marginTop: 8 }}
      >
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
