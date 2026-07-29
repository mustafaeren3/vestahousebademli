"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./CategoryRow.module.css";

export default function CategoryRow({ category, active, onSelect, onEdit, onDelete, onToggleActive }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${styles.row} ${active ? styles.rowActive : ""}`}>
      <button type="button" className={styles.dragHandle} {...attributes} {...listeners} aria-label="Sürükle">
        ⠿
      </button>
      <button type="button" className={styles.selectBtn} onClick={onSelect}>
        <span>{category.translations.tr?.name || category.slug}</span>
        <span className={styles.count}>{category.products.length}</span>
      </button>
      <button
        type="button"
        className="admin-toggle"
        data-on={category.active}
        onClick={onToggleActive}
        aria-pressed={category.active}
        title="Menüde görünsün"
      >
        <span />
      </button>
      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={onEdit}>
        Düzenle
      </button>
      <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={onDelete}>
        Sil
      </button>
    </div>
  );
}
