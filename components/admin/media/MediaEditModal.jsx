"use client";

import { useState } from "react";
import Image from "next/image";
import { useEscapeToClose } from "@/components/admin/useEscapeToClose";
import { MEDIA_LINKABLE_PAGES } from "@/lib/media/pages";

export default function MediaEditModal({ media, onSave, onDelete, onClose }) {
  const [altText, setAltText] = useState(media.alt_text || "");
  const [title, setTitle] = useState(media.title || "");
  const [caption, setCaption] = useState(media.caption || "");
  const [filename, setFilename] = useState(media.filename || "");
  const [linkedPath, setLinkedPath] = useState(media.linked_entity_id || "");
  const [isCover, setIsCover] = useState(media.is_cover || false);
  const [pending, setPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [error, setError] = useState(null);

  useEscapeToClose(onClose);

  async function handleSave() {
    setPending(true);
    setError(null);
    try {
      await onSave(media.id, {
        alt_text: altText,
        title,
        caption,
        filename,
        linked_entity_type: linkedPath ? "page" : null,
        linked_entity_id: linkedPath || null,
        is_cover: isCover,
      });
      onClose();
    } catch (err) {
      setError("Kaydedilemedi.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    setDeletePending(true);
    setError(null);
    try {
      await onDelete(media.id);
      onClose();
    } catch (err) {
      setError("Silinemedi.");
      setDeletePending(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="media-edit-title"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 16 }}
        >
          Görsel Bilgileri
        </h3>

        <Image
          src={media.url}
          alt=""
          width={480}
          height={300}
          style={{ width: "100%", height: "auto", maxHeight: 260, objectFit: "cover", borderRadius: 6, marginBottom: 18 }}
        />

        {error && (
          <div className="admin-error" style={{ marginBottom: 14 }}>
            {error}
          </div>
        )}

        <div className="admin-field">
          <label>Alt Metin (SEO / erişilebilirlik)</label>
          <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Başlık</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Açıklama (Caption)</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Dosya Adı</label>
          <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Bağlı Olduğu Sayfa</label>
          <select value={linkedPath} onChange={(e) => setLinkedPath(e.target.value)}>
            <option value="">Genel / Atanmamış</option>
            {MEDIA_LINKABLE_PAGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <button
            type="button"
            className="admin-toggle"
            data-on={isCover}
            onClick={() => setIsCover((v) => !v)}
            aria-pressed={isCover}
          >
            <span />
          </button>
          Kapak görseli
        </label>

        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={handleDelete}
            disabled={pending || deletePending}
          >
            {deletePending ? "Siliniyor…" : "Sil"}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={pending}>
              Vazgeç
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSave}
              disabled={pending || deletePending}
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
