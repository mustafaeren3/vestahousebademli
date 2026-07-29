"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import LogoutButton from "./LogoutButton";
import styles from "./AdminShell.module.css";

export default function AdminShell({ email, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <a href="#admin-main-content" className={styles.skipLink}>
        Ana içeriğe geç
      </a>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <span className={styles.brand}>Vesta House Bademli — Yönetim</span>
        <div className={styles.topbarRight}>
          <span className={styles.email}>{email}</span>
          <LogoutButton />
        </div>
      </header>

      <div className={styles.body}>
        <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </aside>

        {menuOpen && (
          <div
            className={styles.backdrop}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <main id="admin-main-content" className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
