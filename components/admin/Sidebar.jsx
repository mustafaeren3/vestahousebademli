"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const LINKS = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/menu", label: "Menü Yönetimi" },
  { href: "/admin/preview", label: "Canlı Önizleme" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Yönetim menüsü">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`${styles.link} ${active ? styles.linkActive : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
