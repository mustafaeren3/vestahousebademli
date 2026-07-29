import Link from "next/link";
import { siteConfig } from "@/lib/site";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({ items }) {
  const trail = [{ label: "Anasayfa", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <div className={styles.wrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={`container ${styles.nav}`}>
        <ol className={styles.list}>
          {trail.map((item, i) => (
            <li key={item.href} className={styles.item}>
              {i < trail.length - 1 ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              )}
              {i < trail.length - 1 && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
