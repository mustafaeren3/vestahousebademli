"use client";

import { useTransition } from "react";
import { logout } from "@/lib/auth/actions";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="admin-btn admin-btn--ghost admin-btn--sm"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
    >
      {pending ? "Çıkış yapılıyor…" : "Çıkış Yap"}
    </button>
  );
}
