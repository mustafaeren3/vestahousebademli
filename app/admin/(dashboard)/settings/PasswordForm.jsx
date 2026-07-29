"use client";

import { useState } from "react";
import { changePassword } from "@/lib/auth/actions";

export default function PasswordForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setPending(true);
    const result = await changePassword({
      currentPassword: formData.get("currentPassword"),
      newPassword,
    });
    setPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="admin-success" style={{ marginBottom: 16 }}>
          Şifreniz güncellendi.
        </div>
      )}

      <div className="admin-field">
        <label htmlFor="currentPassword">Mevcut Şifre</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="newPassword">Yeni Şifre</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
        {pending ? "Güncelleniyor…" : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}
