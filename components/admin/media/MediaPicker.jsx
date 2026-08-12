"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { optimizePhoto, PhotoOptimizeError } from "@/lib/uploads/optimizePhoto";
import { useEscapeToClose } from "@/components/admin/useEscapeToClose";
import styles from "./MediaPicker.module.css";

// Reusable "pick an image" control for CMS forms: preview + choose an
// existing media_library item + upload a brand new one (through the same
// optimizePhoto pipeline every other upload in the admin already uses).
// Callers own the actual persistence (upload action / link action) --
// this component only handles the picking UI and local upload staging.
export default function MediaPicker({ imageUrl, mediaLibrary, onUploadNew, onSelectMedia }) {
  const inputRef = useRef(null);
  const [stage, setStage] = useState("idle"); // idle | preparing | uploading
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const busy = stage !== "idle";

  useEscapeToClose(() => setPickerOpen(false));

  // Once the server-confirmed imageUrl actually changes (upload/select
  // succeeded and the parent re-fetched), drop the local blob preview.
  useEffect(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  function clearPreview() {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setStage("preparing");
    let optimized;
    try {
      optimized = await optimizePhoto(file);
    } catch (err) {
      setError(err instanceof PhotoOptimizeError ? err.message : "Görsel hazırlanamadı.");
      setStage("idle");
      clearPreview();
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setStage("uploading");
    try {
      await onUploadNew(optimized);
    } catch (err) {
      setError("Görsel yüklenemedi.");
      clearPreview();
    } finally {
      setStage("idle");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleSelectFromLibrary(item) {
    setPickerOpen(false);
    setError(null);
    setStage("uploading");
    try {
      await onSelectMedia(item);
    } catch (err) {
      setError("Görsel bağlanamadı.");
    } finally {
      setStage("idle");
    }
  }

  const displayUrl = previewUrl || imageUrl;

  return (
    <div className={styles.wrap}>
      <div className={styles.previewBox}>
        {displayUrl ? (
          previewUrl ? (
            // Local blob: preview of a not-yet-uploaded file -- next/image
            // can't handle a blob: URL.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className={styles.previewImg} />
          ) : (
            <Image src={imageUrl} alt="" width={320} height={200} className={styles.previewImg} />
          )
        ) : (
          <div className={styles.placeholder}>Görsel yok</div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className="admin-btn admin-btn--ghost admin-btn--sm"
          onClick={() => setPickerOpen(true)}
          disabled={busy}
        >
          Medya Kütüphanesinden Seç
        </button>
        <label className={`admin-btn admin-btn--ghost admin-btn--sm ${styles.uploadLabel}`}>
          {stage === "preparing"
            ? "Görsel hazırlanıyor…"
            : stage === "uploading"
              ? "Yükleniyor…"
              : "Yeni Fotoğraf Yükle"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={busy}
            hidden
          />
        </label>
      </div>

      {error && <span className={styles.error}>{error}</span>}

      {pickerOpen && (
        <div className="admin-modal-overlay" onClick={() => setPickerOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 760 }}
            role="dialog"
            aria-modal="true"
            aria-label="Medya kütüphanesinden görsel seç"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: 16 }}>
              Medya Kütüphanesinden Seç
            </h3>
            {mediaLibrary.length === 0 ? (
              <p style={{ color: "var(--color-ink-soft)" }}>Medya kütüphanesinde henüz görsel yok.</p>
            ) : (
              <div className={styles.grid}>
                {mediaLibrary.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.gridItem}
                    onClick={() => handleSelectFromLibrary(item)}
                  >
                    <Image src={item.url} alt="" width={160} height={120} className={styles.gridThumb} />
                    <span className={styles.gridAlt}>{item.alt_text || "Alt metin yok"}</span>
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setPickerOpen(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
