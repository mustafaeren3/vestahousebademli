"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./MenuApp.module.css";

const LANGS = ["tr", "en", "de", "el"];

const UI_STRINGS = {
  tr: {
    loading: "Menü yükleniyor…",
    error: "Menü şu anda yüklenemedi. Lütfen tekrar deneyin.",
    tagNew: "Yeni",
    tagBestseller: "Çok Satan",
    tagVegetarian: "Vejetaryen",
    tagSpicy: "Acı",
    backLink: "Vesta House Bademli",
  },
  en: {
    loading: "Loading menu…",
    error: "The menu couldn't be loaded right now. Please try again.",
    tagNew: "New",
    tagBestseller: "Bestseller",
    tagVegetarian: "Vegetarian",
    tagSpicy: "Spicy",
    backLink: "Vesta House Bademli",
  },
  de: {
    loading: "Menü wird geladen…",
    error: "Das Menü konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.",
    tagNew: "Neu",
    tagBestseller: "Beliebt",
    tagVegetarian: "Vegetarisch",
    tagSpicy: "Scharf",
    backLink: "Vesta House Bademli",
  },
  el: {
    loading: "Φόρτωση μενού…",
    error: "Το μενού δεν φορτώθηκε αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά.",
    tagNew: "Νέο",
    tagBestseller: "Δημοφιλές",
    tagVegetarian: "Χορτοφαγικό",
    tagSpicy: "Πικάντικο",
    backLink: "Vesta House Bademli",
  },
};

function formatPrice(price, currency) {
  return `${new Intl.NumberFormat("tr-TR").format(price)} ${currency}`;
}

export default function MenuApp({ initialMenu = null, initialLang = "tr" }) {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState(initialLang);
  const [menu, setMenu] = useState(initialMenu);
  const [status, setStatus] = useState(initialMenu ? "ready" : "error");
  const sectionRefs = useRef({});
  const [activeCategory, setActiveCategory] = useState(null);
  const skipNextLoad = useRef(Boolean(initialMenu));

  // Keeps <html lang> in sync with the selected menu language — screen
  // readers rely on this, and it also stops the browser's CSS uppercase
  // transform from using Turkish case-folding on non-Turkish tag labels.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const fromQuery = searchParams.get("lang");
    if (fromQuery && LANGS.includes(fromQuery)) return;
    try {
      const stored = window.localStorage.getItem("vesta-menu-lang");
      if (stored && LANGS.includes(stored) && stored !== lang) {
        setLang(stored);
      }
    } catch (e) {
      /* localStorage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMenu = useCallback((currentLang) => {
    setStatus((s) => (s === "ready" ? "revalidating" : "loading"));
    fetch(`/menu/api/${currentLang}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setMenu(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus((s) => (s === "revalidating" ? "ready" : "error"));
      });
  }, []);

  useEffect(() => {
    if (skipNextLoad.current) {
      skipNextLoad.current = false;
      return;
    }
    loadMenu(lang);
  }, [lang, loadMenu]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadMenu(lang);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [lang, loadMenu]);

  useEffect(() => {
    if (!menu) return;
    const visibleCategories = menu.categories.filter((c) =>
      c.items.some((item) => item.active !== false)
    );
    if (visibleCategories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        });
      },
      { rootMargin: "-130px 0px -70% 0px", threshold: 0 }
    );

    visibleCategories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menu]);

  function switchLang(code) {
    if (code === lang) return;
    try {
      window.localStorage.setItem("vesta-menu-lang", code);
    } catch (e) {
      /* ignore */
    }
    setLang(code);
  }

  function scrollToCategory(id) {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(id);
    }
  }

  const strings = UI_STRINGS[lang] || UI_STRINGS.tr;
  const visibleCategories = menu
    ? menu.categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.active !== false),
        }))
        .filter((cat) => cat.items.length > 0)
    : [];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.topRow}>
            <Image
              src="/images/vesta-mark.png"
              alt=""
              width={26}
              height={26}
              priority
              className={styles.mark}
            />
            <span className={styles.brand}>Vesta House Bademli</span>
            <a href="/" className={styles.closeBtn} aria-label="Menüyü kapat">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </a>
          </div>
          <div className={styles.langSwitch}>
            {LANGS.map((code) => (
              <button
                key={code}
                className={`${styles.langBtn} ${lang === code ? styles.langBtnActive : ""}`}
                onClick={() => switchLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {visibleCategories.length > 0 && (
          <nav className={styles.tabs} aria-label="Kategoriler">
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.tabBtnActive : ""}`}
                onClick={() => scrollToCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className={styles.main}>
        {status === "loading" && <p className={styles.state}>{strings.loading}</p>}
        {status === "error" && <p className={styles.state}>{strings.error}</p>}

        {menu &&
          visibleCategories.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              className={styles.category}
            >
              <h2 className={styles.categoryTitle}>{cat.name}</h2>
              <div className={styles.categoryDivider} />
              <div className={styles.itemList}>
                {cat.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemBody}>
                      <div className={styles.itemTopRow}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price, item.currency || "₺")}
                        </span>
                      </div>
                      {item.description && (
                        <p className={styles.itemDesc}>{item.description}</p>
                      )}
                      {item.tags &&
                        (item.tags.new ||
                          item.tags.bestseller ||
                          item.tags.vegetarian ||
                          item.tags.spicy) && (
                          <div className={styles.tagRow}>
                            {item.tags.new && (
                              <span className={`${styles.tag} ${styles.tagNew}`}>
                                {strings.tagNew}
                              </span>
                            )}
                            {item.tags.bestseller && (
                              <span className={`${styles.tag} ${styles.tagBestseller}`}>
                                {strings.tagBestseller}
                              </span>
                            )}
                            {item.tags.vegetarian && (
                              <span className={`${styles.tag} ${styles.tagVegetarian}`}>
                                {strings.tagVegetarian}
                              </span>
                            )}
                            {item.tags.spicy && (
                              <span className={`${styles.tag} ${styles.tagSpicy}`}>
                                {strings.tagSpicy}
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </main>

      <footer className={styles.footer}>
        <a href="/">{strings.backLink} →</a>
      </footer>
    </div>
  );
}
