"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHero from "@/components/PageHero";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { updatePageHero, uploadPageHeroImage, setPageHeroImageFromMedia } from "@/lib/pages/actions";
import styles from "./PageHeroEditor.module.css";

export default function PageHeroEditor({ page, hero, mediaLibrary }) {
  const router = useRouter();

  const [enabled, setEnabled] = useState(hero?.enabled !== false);
  const [eyebrow, setEyebrow] = useState(hero?.eyebrow || page.fallback.eyebrow);
  const [title, setTitle] = useState(hero?.title || page.fallback.title);
  const [subtitle, setSubtitle] = useState(hero?.subtitle || page.fallback.subtitle);
  const [imageAlt, setImageAlt] = useState(hero?.image_alt || "");
  const [imagePath, setImagePath] = useState(hero?.image_path || page.fallback.image_path);

  const [previewMode, setPreviewMode] = useState("desktop"); // desktop | mobile
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      await updatePageHero(page.pageKey, { enabled, eyebrow, title, subtitle, image_alt: imageAlt });
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
    const result = await uploadPageHeroImage(page.pageKey, formData);
    setImagePath(result.image_path);
    router.refresh();
  }

  async function handleSelectMedia(mediaItem) {
    const result = await setPageHeroImageFromMedia(page.pageKey, mediaItem.id);
    setImagePath(result.image_path);
    // Only offer the library item's alt as a starting point if this page's
    // own hero alt text is still empty -- never overwrites something the
    // admin already wrote for this specific page.
    if (!imageAlt && mediaItem.alt_text) setImageAlt(mediaItem.alt_text);
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <div className="admin-card" style={{ padding: 24 }}>
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
          <span>{enabled ? "Üst alan sitede görünüyor" : "Üst alan gizli"}</span>
          <Link
            href={`/admin/seo/page/${page.pageKey}`}
            className="admin-btn admin-btn--ghost admin-btn--sm"
            style={{ marginLeft: "auto" }}
          >
            SEO Ayarlarını Düzenle
          </Link>
        </div>

        <div className="admin-field">
          <label>Küçük Başlık (eyebrow)</label>
          <input type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Ana Başlık (H1)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Açıklama</label>
          <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Kapak Görseli</label>
          <MediaPicker
            imageUrl={imagePath}
            mediaLibrary={mediaLibrary}
            onUploadNew={handleUploadNew}
            onSelectMedia={handleSelectMedia}
          />
        </div>

        <div className="admin-field">
          <label>Görsel Açıklaması (alt metin)</label>
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder={`Vesta House Bademli — ${page.label.toLowerCase()}`}
          />
          <span className={styles.hint}>
            Boş bırakılırsa sistem yukarıdaki gibi genel bir öneri gösterir, ama kaydedilen değer siz
            yazana kadar boş kalır. Dekoratif bir görselse boş bırakabilirsiniz.
          </span>
        </div>

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

      <div className={styles.previewCol}>
        <div className={styles.previewTabs}>
          <button
            type="button"
            className={styles.previewTab}
            data-active={previewMode === "desktop"}
            onClick={() => setPreviewMode("desktop")}
          >
            Masaüstü Önizleme
          </button>
          <button
            type="button"
            className={styles.previewTab}
            data-active={previewMode === "mobile"}
            onClick={() => setPreviewMode("mobile")}
          >
            Mobil Önizleme
          </button>
        </div>

        <div className={previewMode === "mobile" ? styles.mobileFrame : styles.desktopFrame}>
          {/* PageHero's real height prop is used here purely to make the
              preview box a reasonable fixed size -- the actual public page
              passes its own height (60vh default, or 46vh on a few pages);
              this doesn't change anything about the component itself. */}
          <PageHero
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            image={imagePath}
            imageAlt={imageAlt}
            height={previewMode === "mobile" ? "220px" : "320px"}
          />
        </div>
      </div>
    </div>
  );
}
