"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import styles from "./Navbar.module.css";

const EASE = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header className={`${styles.nav} ${solid ? styles.navSolid : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={siteConfig.name}>
          <span className={styles.brandMark}>
            <Image src="/images/vesta-mark.png" alt="" width={30} height={30} aria-hidden="true" />
          </span>
          <span className={styles.brandText}>
            Vesta House
            <em>Bademli</em>
          </span>
        </Link>

        <nav className={styles.links} aria-label="Ana menü">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${pathname === item.href ? styles.linkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.toggle}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={menuOpen ? styles.toggleTopOpen : ""} />
          <span className={menuOpen ? styles.toggleBottomOpen : ""} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
            <nav className={styles.mobileNav} aria-label="Mobil menü">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.045, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className={`${styles.mobileLink} ${pathname === item.href ? styles.mobileLinkActive : ""}`}
                  >
                    <span className={styles.mobileLinkIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className={styles.mobileFooter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            >
              <a href={siteConfig.contact.whatsapp} target="_blank" rel="noreferrer noopener">
                WhatsApp
              </a>
              <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer noopener">
                Instagram
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
