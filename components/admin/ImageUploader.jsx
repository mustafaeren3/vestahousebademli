"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { optimizePhoto, PhotoOptimizeError } from "@/lib/uploads/optimizePhoto";
import styles from "./ImageUploader.module.css";

const GRAPHIC_MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUploader({
  imageUrl,
  onUpload,
  onRemove,
  label = "Görsel Yükle",
  mode = "photo",
}) {
  const inputRef = useRef(null);
  const [stage, setStage] = useState("idle"); // idle | preparing | uploading
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const busy = stage !== "idle";

  // Once the server-confirmed imageUrl actually changes (upload succeeded and
  // the parent re-fetched), drop the local blob preview in favor of the real
  // hosted image. On failure imageUrl never changes, so the explicit
  // clearPreview() calls in the catch blocks below are what revert the view.
  useEffect(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (mode === "graphic") {
      if (file.size > GRAPHIC_MAX_BYTES) {
        setError("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
        clearPreview();
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setStage("uploading");
      try {
        await onUpload(file);
      } catch (err) {
        setError("Görsel yüklenemedi.");
        clearPreview();
      } finally {
        setStage("idle");
        if (inputRef.current) inputRef.current.value = "";
      }
      return;
    }

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
      await onUpload(optimized);
    } catch (err) {
      setError("Görsel yüklenemedi.");
      clearPreview();
    } finally {
      setStage("idle");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setStage("uploading");
    setError(null);
    try {
      await onRemove();
    } catch (err) {
      setError("Görsel silinemedi.");
    } finally {
      setStage("idle");
    }
  }

  const displayUrl = previewUrl || imageUrl;

  return (
    <div className={styles.wrap}>
      {displayUrl ? (
        <div className={styles.preview}>
          {previewUrl ? (
            // Local blob: preview of a not-yet-uploaded file -- next/image
            // can't optimize/validate a blob: URL, so a plain <img> is used
            // here only, styled identically via the same .thumb class.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className={styles.thumb} width={96} height={96} />
          ) : (
            <Image src={imageUrl} alt="" width={96} height={96} className={styles.thumb} />
          )}
          {onRemove && (
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={handleRemove}
              disabled={busy}
            >
              Kaldır
            </button>
          )}
        </div>
      ) : (
        <div className={styles.placeholder}>Görsel yok</div>
      )}

      <label className={`admin-btn admin-btn--ghost admin-btn--sm ${styles.uploadBtn}`}>
        {stage === "preparing"
          ? "Görsel hazırlanıyor…"
          : stage === "uploading"
            ? "Yükleniyor…"
            : imageUrl
              ? "Değiştir"
              : label}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={busy}
          hidden
        />
      </label>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
