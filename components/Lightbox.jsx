"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Lightbox.module.css";

const EASE = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 40;

export default function Lightbox({ images, startIndex = 0, roomTitle, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(null);

  const showPrev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const showNext = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose, showPrev, showNext]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) showPrev();
    else if (delta < -SWIPE_THRESHOLD) showNext();
  }

  const current = images[index];
  const showArrows = images.length > 1;

  return (
    <motion.div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`${roomTitle} fotoğraf galerisi`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
    >
      <button className={styles.closeBtn} onClick={onClose} aria-label="Galeriyi kapat">
        Kapat ✕
      </button>

      <span className={styles.counter}>
        {index + 1} / {images.length}
      </span>

      <motion.figure
        key={current.id}
        className={styles.figure}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {showArrows && (
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={showPrev}
            aria-label="Önceki fotoğraf"
          >
            ‹
          </button>
        )}
        <Image
          src={current.image_url}
          alt={current.alt_text || roomTitle}
          fill
          sizes="90vw"
          style={{ objectFit: "contain" }}
          priority
        />
        {showArrows && (
          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={showNext}
            aria-label="Sonraki fotoğraf"
          >
            ›
          </button>
        )}
      </motion.figure>
    </motion.div>
  );
}
