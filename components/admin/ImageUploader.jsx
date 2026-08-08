"use client";

import { useRef, useState } from "react";
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
  const busy = stage !== "idle";

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (mode === "graphic") {
      if (file.size > GRAPHIC_MAX_BYTES) {
        setError("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setStage("uploading");
      try {
        await onUpload(file);
      } catch (err) {
        setError("Görsel yüklenemedi.");
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
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setStage("uploading");
    try {
      await onUpload(optimized);
    } catch (err) {
      setError("Görsel yüklenemedi.");
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

  return (
    <div className={styles.wrap}>
      {imageUrl ? (
        <div className={styles.preview}>
          <Image src={imageUrl} alt="" width={96} height={96} className={styles.thumb} />
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
