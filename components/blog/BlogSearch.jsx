"use client";

import { useMemo, useState } from "react";
import PostGrid from "./PostGrid";
import styles from "./BlogSearch.module.css";

export default function BlogSearch({ posts, categories, tags }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (activeCategory && post.category !== activeCategory) return false;
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [post.title, post.excerpt, post.category, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, activeCategory, activeTag]);

  return (
    <div>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazılarda ara..."
          className={styles.search}
          aria-label="Blog yazılarında ara"
        />

        {categories.length > 0 && (
          <div className={styles.filters}>
            <button
              type="button"
              className={`${styles.pill} ${!activeCategory ? styles.pillActive : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              Tüm Kategoriler
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={`${styles.pill} ${activeCategory === c.name ? styles.pillActive : ""}`}
                onClick={() => setActiveCategory(activeCategory === c.name ? null : c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className={styles.filters}>
            {tags.map((t) => (
              <button
                key={t.slug}
                type="button"
                className={`${styles.tagPill} ${activeTag === t.name ? styles.tagPillActive : ""}`}
                onClick={() => setActiveTag(activeTag === t.name ? null : t.name)}
              >
                #{t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <PostGrid posts={filtered} emptyMessage="Aramanızla eşleşen bir yazı bulunamadı." />
    </div>
  );
}
