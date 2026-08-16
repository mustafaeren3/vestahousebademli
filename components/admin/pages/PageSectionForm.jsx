"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updatePageSection,
  uploadPageSectionImage,
  setPageSectionImageFromMedia,
} from "@/lib/pages/actions";
import MediaPicker from "@/components/admin/media/MediaPicker";
import styles from "./PageSectionForm.module.css";

// Generic editor for one page_sections body row (Faz 7). Two shapes:
// "prose" (eyebrow/subtitle/body -- ProseBlock, no image) and "feature"
// (eyebrow/title/body/image/reverse/tone -- FeatureSplit). Mirrors
// app/admin/(dashboard)/homepage/SectionForm.jsx's config-flag approach,
// just driven by sectionDef.type instead of a config object per field.
export default function PageSectionForm({ pageKey, sectionDef, section, mediaLibrary }) {
  const router = useRouter();
  const fb = sectionDef.fallback;
  const isFeature = sectionDef.type === "feature";

  const [eyebrow, setEyebrow] = useState(section?.eyebrow ?? fb.eyebrow ?? "");
  const [title, setTitle] = useState(section?.title ?? fb.title ?? "");
  const [subtitle, setSubtitle] = useState(section?.subtitle ?? fb.subtitle ?? "");
  const [body, setBody] = useState(section?.body ?? fb.body ?? "");
  const [imageAlt, setImageAlt] = useState(section?.image_alt ?? fb.image_alt ?? "");
  const [imagePath, setImagePath] = useState(section?.image_path ?? fb.image_path ?? "");
  const [reverse, setReverse] = useState(section?.reverse ?? fb.reverse ?? false);
  const [tone, setTone] = useState(section?.tone ?? fb.tone ?? "light");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      const fields = isFeature
        ? { eyebrow, title, body, image_alt: imageAlt, reverse, tone }
        : { eyebrow, subtitle, body };
      await updatePageSection(pageKey, sectionDef.key, fields);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  async function handleUploadNew(file) {
    const formData = new FormData();
    formData.set("image", file);
    const result = await uploadPageSectionImage(pageKey, sectionDef.key, formData);
    setImagePath(result.image_path);
    router.refresh();
  }

  async function handleSelectMedia(mediaItem) {
    const result = await setPageSectionImageFromMedia(pageKey, sectionDef.key, mediaItem.id);
    setImagePath(result.image_path);
    if (!imageAlt && mediaItem.alt_text) setImageAlt(mediaItem.alt_text);
    router.refresh();
  }

  return (
    <div className="admin-card" style={{ padding: 24, maxWidth: 640 }}>
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

      <div className="admin-field">
        <label>Küçük Başlık (eyebrow)</label>
        <input type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
      </div>

      {isFeature ? (
        <div className="admin-field">
          <label>Başlık</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      ) : (
        <div className="admin-field">
          <label>Öne Çıkan Cümle</label>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
      )}

      <div className="admin-field">
        <label>Metin</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      {isFeature && (
        <>
          <div className="admin-field">
            <label>Görsel</label>
            <MediaPicker
              imageUrl={imagePath}
              mediaLibrary={mediaLibrary}
              onUploadNew={handleUploadNew}
              onSelectMedia={handleSelectMedia}
            />
          </div>

          <div className="admin-field">
            <label>Görsel Açıklaması (alt metin)</label>
            <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
          </div>

          <div className={styles.row}>
            <div className="admin-field">
              <label>Görünüm</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
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
        </>
      )}

      <button
        type="button"
        className="admin-btn admin-btn--primary"
        onClick={handleSave}
        disabled={pending}
        style={{ marginTop: 8 }}
      >
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </div>
  );
}
