"use client";

import { useEscapeToClose } from "./useEscapeToClose";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, pending }) {
  useEscapeToClose(onCancel);

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div
        className="admin-modal"
        style={{ maxWidth: 420 }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-dialog-title"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 12 }}
        >
          {title}
        </h3>
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="admin-btn admin-btn--ghost" onClick={onCancel} disabled={pending}>
            Vazgeç
          </button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm} disabled={pending}>
            {pending ? "Siliniyor…" : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
