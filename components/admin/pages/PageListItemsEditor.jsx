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
  createPageListItem,
  updatePageListItem,
  deletePageListItem,
  reorderPageListItems,
} from "@/lib/pages/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./PageListItemsEditor.module.css";

// Faz 7: page_list_items CRUD UI (bugün yalnızca Kahvaltı sayfasının 4
// fiyat/not grubu için kullanılıyor) -- pageKey+groupKey parametreli twin
// of app/admin/(dashboard)/homepage/PillarsEditor.jsx (aynı dnd-kit
// ekle/sil/kaydet deseni, icon yerine ad+detay alanları).

function ItemRow({ pageKey, item, detailLabel, onDelete }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [name, setName] = useState(item.name);
  const [detail, setDetail] = useState(item.detail);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    setPending(true);
    try {
      await updatePageListItem(pageKey, item.id, { name, detail });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <button type="button" className={styles.dragHandle} {...attributes} {...listeners} aria-label="Sürükle">
        ⠿
      </button>
      <div className={styles.fields}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad" />
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={detailLabel}
        />
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--sm"
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "…" : "Kaydet"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--danger admin-btn--sm"
          onClick={() => onDelete(item)}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default function PageListItemsEditor({ pageKey, groupKey, detailLabel, items: initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [addPending, setAddPending] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    await reorderPageListItems(pageKey, groupKey, reordered.map((i) => i.id));
    router.refresh();
  }

  async function handleAdd() {
    setAddPending(true);
    try {
      await createPageListItem(pageKey, groupKey, { name: "Yeni Ürün", detail: "" });
      router.refresh();
    } finally {
      setAddPending(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      await deletePageListItem(pageKey, confirmTarget.id);
      setConfirmTarget(null);
      router.refresh();
    } finally {
      setConfirmPending(false);
    }
  }

  return (
    <div>
      {items.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 14 }}>Henüz ürün yok.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <ItemRow key={item.id} pageKey={pageKey} item={item} detailLabel={detailLabel} onDelete={setConfirmTarget} />
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
        + Ürün Ekle
      </button>

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message={`"${confirmTarget.name}" silinecek.`}
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
