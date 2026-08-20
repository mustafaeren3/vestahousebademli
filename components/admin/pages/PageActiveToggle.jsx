"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePageIsActive } from "@/lib/pages/actions";
import styles from "./PageActiveToggle.module.css";

// Faz 8: page_sections'ın hero-only enabled alanından ayrı, tüm sayfayı
// (route + ana sayfa bölümü + nav + footer + sitemap) aç/kapa eden anahtar.
// Kapatıldığında değişiklik anında kaydedilir -- bu ikili bir yayın anahtarı,
// diğer alanlar gibi taslak/kaydet akışına ihtiyacı yok.
export default function PageActiveToggle({ pageKey, isActive }) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function handleToggle() {
    const next = !active;
    setPending(true);
    setError(null);
    try {
      await updatePageIsActive(pageKey, next);
      setActive(next);
      router.refresh();
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`admin-card ${styles.wrap}`}>
      <button
        type="button"
        className="admin-toggle"
        data-on={active}
        onClick={handleToggle}
        disabled={pending}
        aria-pressed={active}
      >
        <span />
      </button>
      <div className={styles.text}>
        <strong>Kahvaltı Sayfası Aktif</strong>
        <span className={styles.hint}>
          {active
            ? "Sayfa, ana sayfa bölümü, menü linkleri ve sitemap kaydı yayında."
            : "Sayfa kapalı: /kahvalti 404 döner, ana sayfa bölümü ve tüm menü/footer linkleri gizli, sitemap'te yok. İçerik ve görseller silinmedi."}
        </span>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}
