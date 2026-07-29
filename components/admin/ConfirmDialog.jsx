"use client";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, pending }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div
        className="admin-modal"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 12 }}>
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
