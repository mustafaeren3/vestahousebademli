"use client";

import { useState } from "react";
import { login } from "@/lib/auth/actions";
import styles from "./page.module.css";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await login({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="admin-field">
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
      </div>

      <div className="admin-field">
        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className={`admin-btn admin-btn--primary ${styles.submit}`}
        disabled={pending}
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
