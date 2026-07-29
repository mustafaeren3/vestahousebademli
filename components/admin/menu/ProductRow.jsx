"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./ProductRow.module.css";

export default function ProductRow({ product, onEdit, onDelete, onToggleActive }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const name = product.translations.tr?.name || product.slug;

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <button type="button" className={styles.dragHandle} {...attributes} {...listeners} aria-label="Sürükle">
        ⠿
      </button>

      {product.image_url ? (
        <Image src={product.image_url} alt="" width={44} height={44} className={styles.thumb} />
      ) : (
        <div className={styles.thumbPlaceholder} />
      )}

      <div className={styles.main}>
        <span className={styles.name}>{name}</span>
        <span className={styles.price}>
          {product.price} {product.currency}
        </span>
      </div>

      <button
        type="button"
        className="admin-toggle"
        data-on={product.active}
        onClick={onToggleActive}
        aria-pressed={product.active}
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
