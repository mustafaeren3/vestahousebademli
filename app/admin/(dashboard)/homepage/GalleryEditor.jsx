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
import {
  addGalleryImage,
  updateGalleryImageAlt,
  deleteGalleryImage,
  reorderGalleryImages,
} from "@/lib/home/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./GalleryEditor.module.css";

function readImageDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 1650, height: 2200 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function GalleryItem({ image, onDelete }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [alt, setAlt] = useState(image.alt);

  async function handleBlur() {
    if (alt !== image.alt) await updateGalleryImageAlt(image.id, alt);
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      <div className={styles.thumbWrap}>
        <Image
          src={image.image_path}
          alt=""
          width={200}
          height={150}
          className={styles.thumb}
        />
        <button
          type="button"
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Sürükle"
        >
          ⠿
        </button>
        <button
          type="button"
          className={`admin-btn admin-btn--danger admin-btn--sm ${styles.deleteBtn}`}
          onClick={() => onDelete(image)}
        >
          Sil
        </button>
      </div>
      <div className={styles.itemBody}>
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={handleBlur}
          placeholder="Görsel açıklaması"
        />
      </div>
    </div>
  );
}

export default function GalleryEditor({ images: initialImages }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [images, setImages] = useState(initialImages);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);
    await reorderGalleryImages(reordered.map((i) => i.id));
    router.refresh();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Görsel çok büyük. En fazla 5 MB yükleyebilirsiniz.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const { width, height } = await readImageDimensions(file);
      const formData = new FormData();
      formData.set("image", file);
      formData.set("width", String(width));
      formData.set("height", String(height));
      formData.set("alt", "");
      await addGalleryImage(formData);
      router.refresh();
    } catch (err) {
      setError("Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      await deleteGalleryImage(confirmTarget.id);
      setConfirmTarget(null);
      router.refresh();
    } finally {
      setConfirmPending(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {images.map((image) => (
              <GalleryItem key={image.id} image={image} onDelete={setConfirmTarget} />
            ))}

            <label className={styles.uploadCard}>
              {uploading ? "Yükleniyor…" : "+ Görsel Ekle"}
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

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message="Bu görsel galeriden silinecek."
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
