import Link from "next/link";
import { getAllSeoPages } from "@/lib/seo/queries";
import { getRooms, getRoomCover } from "@/lib/rooms/queries";
import { getAdminBlogPosts } from "@/lib/blog/actions";
import { STATIC_PAGES } from "@/lib/seo/staticPages";
import { computePageHealth, HEALTH_LABELS } from "@/lib/seo/health";
import { siteConfig } from "@/lib/site";
import styles from "./SeoList.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO Yönetimi" };

function charLabel(text, target) {
  const len = (text || "").length;
  return `${len} karakter${target ? ` (~${target} önerilir)` : ""}`;
}

export default async function AdminSeoPage() {
  const [seoPages, rooms, blogPosts] = await Promise.all([
    getAllSeoPages(),
    getRooms(),
    getAdminBlogPosts(),
  ]);

  const seoByRouteKey = {};
  for (const row of seoPages) seoByRouteKey[row.route_key] = row;

  const staticRows = STATIC_PAGES.map((staticPage) => {
    const row = seoByRouteKey[staticPage.routeKey];
    const title = row?.seo_title || staticPage.fallbackTitle;
    const description = row?.meta_description || staticPage.fallbackDescription;
    const ogImage = row?.og_image || staticPage.fallbackImage;
    const robotsIndex = row?.robots_index !== false;
    const canonicalUrl = row?.canonical_url || `${siteConfig.url}${staticPage.path}`;
    const health = computePageHealth({
      title,
      description,
      canonicalUrl,
      robotsIndex,
      ogImage,
      siteHost: siteConfig.url,
    });
    return {
      kind: "page",
      key: staticPage.routeKey,
      label: staticPage.label,
      path: staticPage.path,
      title,
      description,
      robotsIndex,
      ogImage,
      health,
    };
  });

  const roomRows = rooms
    .filter((room) => room.slug)
    .map((room) => {
      const title = room.seo_title || room.title;
      const description = room.seo_description || room.description;
      const ogImage = getRoomCover(room)?.url;
      const canonicalUrl = `${siteConfig.url}/odalar/${room.slug}`;
      const health = computePageHealth({
        title,
        description,
        canonicalUrl,
        robotsIndex: true,
        ogImage,
        siteHost: siteConfig.url,
      });
      return {
        kind: "room",
        key: room.id,
        label: `Oda: ${room.title}`,
        path: `/odalar/${room.slug}`,
        title,
        description,
        robotsIndex: true,
        ogImage,
        health,
      };
    });

  const blogRows = blogPosts.map((post) => {
    const title = post.seo_title || post.title;
    const description = post.seo_description || post.excerpt;
    const ogImage = post.cover_image;
    const isPublished = post.status === "published";
    const canonicalUrl = `${siteConfig.url}/blog/${post.slug}`;
    const health = isPublished
      ? computePageHealth({
          title,
          description,
          canonicalUrl,
          robotsIndex: true,
          ogImage,
          siteHost: siteConfig.url,
        })
      : { status: "iyi", issues: [], suggestions: [] };
    return {
      kind: "blog",
      key: post.id,
      label: `Blog: ${post.title || "(Başlıksız)"}`,
      path: isPublished ? `/blog/${post.slug}` : null,
      title,
      description,
      robotsIndex: isPublished,
      ogImage,
      health,
      isDraft: !isPublished,
    };
  });

  const rows = [...staticRows, ...roomRows, ...blogRows];

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 6 }}>
        SEO Yönetimi
      </h2>
      <p style={{ color: "var(--color-ink-soft)", fontSize: "0.85rem", marginBottom: 20 }}>
        Sistem analiz eder, önerir; siz onaylayıp kaydedersiniz. Hiçbir alan otomatik yayınlanmaz.
      </p>

      <div className={styles.list}>
        {rows.map((row) => (
          <div key={`${row.kind}-${row.key}`} className={styles.row}>
            <div className={styles.rowMain}>
              <div className={styles.rowHead}>
                <span className={styles.label}>{row.label}</span>
                <span
                  className={`${styles.healthBadge} ${styles[`health_${row.health.status}`]}`}
                >
                  {HEALTH_LABELS[row.health.status]}
                </span>
                {row.isDraft && <span className={styles.draftBadge}>Taslak · index dışı</span>}
                {!row.robotsIndex && !row.isDraft && (
                  <span className={styles.draftBadge}>Noindex</span>
                )}
              </div>
              <div className={styles.url}>{row.path ? `${siteConfig.url}${row.path}` : "—"}</div>
              <div className={styles.fieldsGrid}>
                <div>
                  <span className={styles.fieldLabel}>SEO Title</span>
                  <div className={styles.fieldValue}>{row.title || <em>yok</em>}</div>
                  <div className={styles.charCount}>{charLabel(row.title, 60)}</div>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Meta Description</span>
                  <div className={styles.fieldValue}>{row.description || <em>yok</em>}</div>
                  <div className={styles.charCount}>{charLabel(row.description, 155)}</div>
                </div>
                <div>
                  <span className={styles.fieldLabel}>OG Görsel</span>
                  <div className={styles.fieldValue}>{row.ogImage ? "Mevcut" : "Yok (fallback kullanılır)"}</div>
                </div>
              </div>
              {(row.health.issues.length > 0 || row.health.suggestions.length > 0) && (
                <ul className={styles.findings}>
                  {row.health.issues.map((issue) => (
                    <li key={issue} className={styles.issueItem}>
                      {issue}
                    </li>
                  ))}
                  {row.health.suggestions.map((s) => (
                    <li key={s} className={styles.suggestionItem}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.actions}>
              <Link
                href={`/admin/seo/${row.kind}/${row.key}`}
                className="admin-btn admin-btn--ghost admin-btn--sm"
              >
                Düzenle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
