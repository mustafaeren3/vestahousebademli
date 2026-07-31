"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createRoom,
  updateRoom,
  uploadRoomImage,
  deleteRoomImage,
  deleteRoom,
  reorderRooms,
} from "@/lib/rooms/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./RoomsEditor.module.css";

function tagsToText(tags) {
  return (tags || []).join(", ");
}

function textToTags(text) {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function RoomCardEditor({ room, onDelete }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: room.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [badge, setBadge] = useState(room.badge);
  const [title, setTitle] = useState(room.title);
  const [description, setDescription] = useState(room.description);
  const [tagsText, setTagsText] = useState(tagsToText(room.tags));
  const [enabled, setEnabled] = useState(room.enabled);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      await updateRoom(room.id, {
        badge,
        title,
        description,
        tags: textToTags(tagsText),
        enabled,
      });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Kaydedilemedi.");
    } finally {
      setPending(false);
    }
  }

  async function handleImageUpload(file) {
    const formData = new FormData();
    formData.set("image", file);
    await uploadRoomImage(room.id, formData);
    router.refresh();
  }

  async function handleImageRemove() {
    await deleteRoomImage(room.id);
    router.refresh();
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.card}>
      <button type="button" className={styles.dragHandle} {...attributes} {...listeners} aria-label="Sürükle">
        ⠿
      </button>

      <div className={styles.imageCol}>
        <ImageUploader
          imageUrl={room.image_path}
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
        />
      </div>

      <div className={styles.fields}>
        {error && (
          <div className="admin-error" style={{ marginBottom: 10 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="admin-success" style={{ marginBottom: 10 }}>
            Kaydedildi.
          </div>
        )}

        <div className={styles.topRow}>
          <div className={`admin-field ${styles.badgeField}`}>
            <label>Numara (I, II, III)</label>
            <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} />
          </div>
          <div className={`admin-field ${styles.titleField}`}>
            <label>Oda Adı</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>

        <div className="admin-field">
          <label>Açıklama</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Özellik Etiketleri (virgülle ayırın)</label>
          <input
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Taş Duvar, Ahşap Tavan"
          />
        </div>

        <div className={styles.footerRow}>
          <label className={styles.toggleWrap}>
            <button
              type="button"
              className="admin-toggle"
              data-on={enabled}
              onClick={() => setEnabled((v) => !v)}
              aria-pressed={enabled}
            >
              <span />
            </button>
            {enabled ? "Sitede görünüyor" : "Gizli"}
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className="admin-btn admin-btn--primary admin-btn--sm"
              onClick={handleSave}
              disabled={pending}
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => onDelete(room)}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomsEditor({ rooms: initialRooms }) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [addPending, setAddPending] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rooms.findIndex((r) => r.id === active.id);
    const newIndex = rooms.findIndex((r) => r.id === over.id);
    const reordered = arrayMove(rooms, oldIndex, newIndex);
    setRooms(reordered);
    await reorderRooms(reordered.map((r) => r.id));
    router.refresh();
  }

  async function handleAdd() {
    setAddPending(true);
    try {
      await createRoom({ badge: String(rooms.length + 1), title: "Yeni Oda", description: "", tags: [] });
      router.refresh();
    } finally {
      setAddPending(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      await deleteRoom(confirmTarget.id);
      setConfirmTarget(null);
      router.refresh();
    } finally {
      setConfirmPending(false);
    }
  }

  return (
    <div>
      {rooms.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 14 }}>Henüz oda yok.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rooms.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            {rooms.map((room) => (
              <RoomCardEditor key={room.id} room={room} onDelete={setConfirmTarget} />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        className="admin-btn admin-btn--ghost admin-btn--sm"
        onClick={handleAdd}
        disabled={addPending}
      >
        + Oda Ekle
      </button>

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message={`"${confirmTarget.title}" odası silinecek.`}
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
