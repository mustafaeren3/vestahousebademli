"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { optimizePhoto, PhotoOptimizeError } from "@/lib/uploads/optimizePhoto";
import {
  uploadRoomGalleryImage,
  deleteRoomGalleryImage,
  setRoomCoverImage,
  reorderRoomImages,
} from "@/lib/rooms/actions";
import styles from "./RoomImagesManager.module.css";

function PhotoTile({ image, onDelete, onSetCover, busy }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.tile}>
      <div className={styles.thumbWrap}>
        <Image
          src={image.image_url}
          alt=""
          width={160}
          height={160}
          className={styles.thumb}
        />
        {image.is_cover && <span className={styles.coverBadge}>Kapak</span>}
        <button
          type="button"
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Sürükleyerek sırala"
        >
          ⠿
        </button>
      </div>
      <div className={styles.tileActions}>
        {!image.is_cover && (
          <button
            type="button"
            className={styles.tileBtn}
            onClick={() => onSetCover(image.id)}
            disabled={busy}
          >
            Kapak Yap
          </button>
        )}
        <button
          type="button"
          className={styles.tileBtnDanger}
          onClick={() => onDelete(image.id)}
          disabled={busy}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default function RoomImagesManager({ roomId, images: initialImages, onBusyChange }) {
  const [images, setImages] = useState(() =>
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const inputRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function setBusy(value) {
    setUploading(value);
    onBusyChange?.(value);
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMessage(null);
    setBusy(true);
    setProgress({ done: 0, total: files.length });

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        const optimized = await optimizePhoto(file);
        const formData = new FormData();
        formData.set("image", optimized);
        const inserted = await uploadRoomGalleryImage(roomId, formData);
        setImages((prev) => [...prev, inserted]);
        successCount += 1;
      } catch (err) {
        failCount += 1;
      } finally {
        setProgress((p) => ({ done: (p?.done ?? 0) + 1, total: files.length }));
      }
    }

    setBusy(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";

    if (failCount === 0) {
      setMessage({ type: "success", text: `${successCount} fotoğraf başarıyla yüklendi.` });
    } else if (successCount === 0) {
      setMessage({ type: "error", text: "Fotoğraflar yüklenemedi. Lütfen tekrar deneyin." });
    } else {
      setMessage({
        type: "error",
        text: `${files.length} fotoğraftan ${successCount}'si başarıyla yüklendi. ${failCount} fotoğraf yüklenemedi.`,
      });
    }
  }

  async function handleDelete(imageId) {
    setBusyId(imageId);
    setMessage(null);
    try {
      const { newCoverId } = await deleteRoomGalleryImage(roomId, imageId);
      setImages((prev) => {
        const remaining = prev.filter((img) => img.id !== imageId);
        if (!newCoverId) return remaining;
        return remaining.map((img) =>
          img.id === newCoverId ? { ...img, is_cover: true } : img
        );
      });
    } catch (err) {
      setMessage({ type: "error", text: "Fotoğraf silinemedi." });
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetCover(imageId) {
    setBusyId(imageId);
    setMessage(null);
    try {
      await setRoomCoverImage(roomId, imageId);
      setImages((prev) => prev.map((img) => ({ ...img, is_cover: img.id === imageId })));
    } catch (err) {
      setMessage({ type: "error", text: "Kapak fotoğrafı değiştirilemedi." });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);
    await reorderRoomImages(
      roomId,
      reordered.map((img) => img.id)
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h4 className={styles.title}>Oda Fotoğrafları</h4>
        <label className={`admin-btn admin-btn--ghost admin-btn--sm ${styles.uploadBtn}`}>
          {uploading
            ? progress
              ? `Yükleniyor… (${progress.done}/${progress.total})`
              : "Yükleniyor…"
            : "+ Fotoğraf Ekle"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {message && (
        <div
          className={message.type === "error" ? "admin-error" : "admin-success"}
          style={{ marginBottom: 10 }}
        >
          {message.text}
        </div>
      )}

      {images.length === 0 ? (
        <p className={styles.empty}>
          Henüz fotoğraf yok. iPhone&apos;dan aynı anda birden fazla fotoğraf seçerek
          ekleyebilirsiniz.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className={styles.grid}>
              {images.map((image) => (
                <PhotoTile
                  key={image.id}
                  image={image}
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                  busy={busyId === image.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
