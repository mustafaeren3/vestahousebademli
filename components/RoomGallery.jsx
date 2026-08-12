"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Lightbox from "@/components/Lightbox";
import { IconGrid } from "@/components/icons";
import styles from "./RoomGallery.module.css";

function MobileStrip({ images, roomTitle, onOpen }) {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  function handleScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(Math.min(images.length - 1, Math.max(0, i)));
  }

  return (
    <div className={styles.mobileWrap}>
      <div className={styles.mobileTrack} ref={trackRef} onScroll={handleScroll}>
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            className={styles.mobileSlide}
            onClick={() => onOpen(i)}
            aria-label={`${roomTitle} - fotoğraf ${i + 1}'i büyüt`}
          >
            <Image
              src={img.image_url}
              alt={img.alt_text || roomTitle}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <span className={styles.mobileCounter} aria-hidden="true">
          {current + 1} / {images.length}
        </span>
      )}
    </div>
  );
}

// Always-visible (no display:none at any viewport, no sr-only trick) strip
// covering every gallery photo -- the mosaic above only ever puts 5 photos
// (cover + 4 tiles) in view, and the rest previously only existed inside
// the click-triggered Lightbox, which a crawler won't open. This renders
// as a real, useful "browse all photos" rail so every photo is both a
// genuine on-page feature and a real <Image> present in server-rendered
// HTML regardless of viewport.
function ThumbnailRail({ images, roomTitle, onOpen }) {
  if (images.length <= 5) return null;

  return (
    <div className={styles.railWrap}>
      <span className={styles.railLabel}>Tüm Fotoğraflar ({images.length})</span>
      <div className={styles.rail}>
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            className={styles.railThumb}
            onClick={() => onOpen(i)}
            aria-label={`${roomTitle} - fotoğraf ${i + 1}'i büyüt`}
          >
            <Image
              src={img.image_url}
              alt={img.alt_text || roomTitle}
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RoomGallery({ images, roomTitle }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const [cover, ...rest] = images;
  const tiles = rest.slice(0, 4);

  return (
    <section className={styles.wrap} aria-label={`${roomTitle} fotoğraf galerisi`}>
      <div className="container">
        <div className={styles.mosaic}>
          <button
            type="button"
            className={styles.big}
            onClick={() => setLightboxIndex(0)}
            aria-label={`${roomTitle} - fotoğraf 1'i büyüt`}
          >
            <Image
              src={cover.image_url}
              alt={cover.alt_text || roomTitle}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
          </button>

          {tiles.length > 0 && (
            <div className={styles.tiles}>
              {tiles.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={styles.tile}
                  onClick={() => setLightboxIndex(i + 1)}
                  aria-label={`${roomTitle} - fotoğraf ${i + 2}'yi büyüt`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || roomTitle}
                    fill
                    sizes="(max-width: 900px) 50vw, 15vw"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <button type="button" className={styles.showAll} onClick={() => setLightboxIndex(0)}>
              <IconGrid width={16} height={16} />
              Tüm Fotoğrafları Göster ({images.length})
            </button>
          )}
        </div>

        <MobileStrip images={images} roomTitle={roomTitle} onOpen={setLightboxIndex} />

        {images.length > 1 && (
          <button type="button" className={styles.showAllMobile} onClick={() => setLightboxIndex(0)}>
            <IconGrid width={15} height={15} />
            Tüm Fotoğrafları Göster ({images.length})
          </button>
        )}

        <ThumbnailRail images={images} roomTitle={roomTitle} onOpen={setLightboxIndex} />
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            key="lightbox"
            images={images}
            startIndex={lightboxIndex}
            roomTitle={roomTitle}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
