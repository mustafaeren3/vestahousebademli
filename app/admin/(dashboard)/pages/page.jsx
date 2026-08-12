import Link from "next/link";
import Image from "next/image";
import { getAllPageHeroSections } from "@/lib/pages/queries";
import { INTERIOR_PAGES } from "@/lib/pages/staticPages";
import styles from "./PagesList.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sayfalar" };

export default async function AdminPagesListPage() {
  const heroRows = await getAllPageHeroSections();
  const byPageKey = {};
  for (const row of heroRows) byPageKey[row.page_key] = row;

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 6 }}>
        Sayfalar
      </h2>
      <p style={{ color: "var(--color-ink-soft)", fontSize: "0.85rem", marginBottom: 20 }}>
        İç sayfaların üst banner (hero) alanını buradan yönetin. Oda/blog/menü kartları kendi
        bölümlerinden (Odalar, Blog, Menü) yönetilmeye devam eder.
      </p>

      <div className={styles.list}>
        {INTERIOR_PAGES.map((page) => {
          const hero = byPageKey[page.pageKey];
          const title = hero?.title || page.fallback.title;
          const image = hero?.image_path || page.fallback.image_path;
          const enabled = hero?.enabled !== false;

          return (
            <Link key={page.pageKey} href={`/admin/pages/${page.pageKey}`} className={styles.row}>
              <div className={styles.thumbWrap}>
                {image && <Image src={image} alt="" width={96} height={72} className={styles.thumb} />}
              </div>
              <div className={styles.rowMain}>
                <div className={styles.pageLabel}>{page.label}</div>
                <div className={styles.heroTitle}>{title}</div>
                <div className={styles.path}>{page.path}</div>
              </div>
              {!enabled && <span className={styles.disabledBadge}>Üst alan gizli</span>}
              <span className="admin-btn admin-btn--ghost admin-btn--sm">Düzenle</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
