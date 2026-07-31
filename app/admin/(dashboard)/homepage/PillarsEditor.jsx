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
import { createPillar, updatePillar, deletePillar, reorderPillars } from "@/lib/home/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./PillarsEditor.module.css";

const ICON_OPTIONS = [
  { value: "stone", label: "Taş" },
  { value: "olive", label: "Zeytin" },
  { value: "minimal", label: "Minimal" },
  { value: "warmth", label: "Sıcaklık" },
];

function PillarRow({ pillar, onDelete }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pillar.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [icon, setIcon] = useState(pillar.icon);
  const [title, setTitle] = useState(pillar.title);
  const [text, setText] = useState(pillar.text);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    setPending(true);
    try {
      await updatePillar(pillar.id, { icon, title, text });
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
        <select value={icon} onChange={(e) => setIcon(e.target.value)}>
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Metin" />
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
          onClick={() => onDelete(pillar)}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default function PillarsEditor({ pillars: initialPillars }) {
  const router = useRouter();
  const [pillars, setPillars] = useState(initialPillars);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [addPending, setAddPending] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pillars.findIndex((p) => p.id === active.id);
    const newIndex = pillars.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(pillars, oldIndex, newIndex);
    setPillars(reordered);
    await reorderPillars(reordered.map((p) => p.id));
    router.refresh();
  }

  async function handleAdd() {
    setAddPending(true);
    try {
      await createPillar({ icon: "stone", title: "Yeni İlke", text: "" });
      router.refresh();
    } finally {
      setAddPending(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      await deletePillar(confirmTarget.id);
      setConfirmTarget(null);
      router.refresh();
    } finally {
      setConfirmPending(false);
    }
  }

  return (
    <div>
      {pillars.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 14 }}>Henüz ilke yok.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pillars.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {pillars.map((pillar) => (
              <PillarRow key={pillar.id} pillar={pillar} onDelete={setConfirmTarget} />
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
        + İlke Ekle
      </button>

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message={`"${confirmTarget.title}" ilkesi silinecek.`}
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
