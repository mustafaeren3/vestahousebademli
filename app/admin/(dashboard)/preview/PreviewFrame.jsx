"use client";

import { useRef, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "@/lib/menu/constants";
import styles from "./preview.module.css";

export default function PreviewFrame() {
  const [lang, setLang] = useState("tr");
  const [key, setKey] = useState(0);
  const iframeRef = useRef(null);

  function refresh() {
    setKey((k) => k + 1);
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.langs}>
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              className={`admin-btn admin-btn--sm ${
                lang === code ? "admin-btn--primary" : "admin-btn--ghost"
              }`}
              onClick={() => setLang(code)}
            >
              {LOCALE_LABELS[code]}
            </button>
          ))}
        </div>
        <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={refresh}>
          Yenile
        </button>
      </div>

      <div className={styles.frameWrap}>
        <iframe
          key={key}
          ref={iframeRef}
          src={`/menu?lang=${lang}`}
          title="Müşteri menü önizlemesi"
          className={styles.frame}
        />
      </div>
    </div>
  );
}
