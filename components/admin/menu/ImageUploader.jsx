"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadProductImage, deleteProductImage } from "@/lib/menu/actions";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({ productId, imageUrl, onChanged }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("image", file);
      await uploadProductImage(productId, formData);
      onChanged?.();
    } catch (err) {
      setError("Görsel yüklenemedi.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError(null);
    try {
      await deleteProductImage(productId);
      onChanged?.();
    } catch (err) {
      setError("Görsel silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      {imageUrl ? (
        <div className={styles.preview}>
          <Image src={imageUrl} alt="" width={96} height={96} className={styles.thumb} />
          <button
            type="button"
            className="admin-btn admin-btn--danger admin-btn--sm"
            onClick={handleRemove}
            disabled={busy}
          >
            Kaldır
          </button>
        </div>
      ) : (
        <div className={styles.placeholder}>Görsel yok</div>
      )}

      <label className={`admin-btn admin-btn--ghost admin-btn--sm ${styles.uploadBtn}`}>
        {busy ? "Yükleniyor…" : imageUrl ? "Değiştir" : "Görsel Yükle"}
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
