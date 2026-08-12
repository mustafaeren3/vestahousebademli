"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadMedia, updateMedia, deleteMedia, reorderMedia } from "@/lib/media/actions";
import { optimizePhoto, PhotoOptimizeError } from "@/lib/uploads/optimizePhoto";
import { pageLabelForPath } from "@/lib/media/pages";
import MediaEditModal from "./MediaEditModal";
import styles from "./MediaLibraryManager.module.css";

function MediaItem({ media, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: media.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button type="button" ref={setNodeRef} style={style} className={styles.item} onClick={() => onOpen(media)}>
      <div className={styles.thumbWrap}>
        <Image src={media.url} alt="" width={200} height={150} className={styles.thumb} />
        <span className={styles.dragHandle} {...attributes} {...listeners} aria-label="Sürükle">
          ⠿
        </span>
        {media.is_cover && <span className={styles.coverBadge}>Kapak</span>}
      </div>
      <div className={styles.itemBody}>
        <div className={styles.itemAlt}>{media.alt_text || "Alt metin yok"}</div>
        {media.linked_entity_id && (
          <div className={styles.itemPage}>{pageLabelForPath(media.linked_entity_id)}</div>
        )}
      </div>
    </button>
  );
}

export default function MediaLibraryManager({ media: initialMedia }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [media, setMedia] = useState(initialMedia);
  const [activeMedia, setActiveMedia] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | preparing | uploading
  const [error, setError] = useState(null);
  const uploading = stage !== "idle";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = media.findIndex((m) => m.id === active.id);
    const newIndex = media.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(media, oldIndex, newIndex);
    setMedia(reordered);
    await reorderMedia(reordered.map((m) => m.id));
    router.refresh();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
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
      const formData = new FormData();
      formData.set("image", optimized);
      const inserted = await uploadMedia(formData);
      setMedia((prev) => [inserted, ...prev]);
      setActiveMedia(inserted);
      router.refresh();
    } catch (err) {
      setError("Görsel yüklenemedi.");
    } finally {
      setStage("idle");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleSave(id, fields) {
    await updateMedia(id, fields);
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
    router.refresh();
  }

  async function handleDelete(id) {
    await deleteMedia(id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  return (
    <div>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={media.map((m) => m.id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {media.map((item) => (
              <MediaItem key={item.id} media={item} onOpen={setActiveMedia} />
            ))}

            <label className={styles.uploadCard}>
              {stage === "preparing"
                ? "Görsel hazırlanıyor…"
                : stage === "uploading"
                  ? "Yükleniyor…"
                  : "+ Görsel Yükle"}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
        </SortableContext>
      </DndContext>

      {media.length === 0 && (
        <p style={{ color: "var(--color-ink-soft)" }}>
          Henüz görsel yok. Yüklediğiniz her görsel için otomatik alt metin, dosya adı ve açıklama önerisi
          oluşturulur — kaydetmeden önce dilediğiniz gibi düzenleyebilirsiniz.
        </p>
      )}

      {activeMedia && (
        <MediaEditModal
          media={activeMedia}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </div>
  );
}
