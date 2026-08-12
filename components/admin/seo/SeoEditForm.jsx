"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSeoPage, updateRoomSeo } from "@/lib/seo/actions";
import { updateBlogPost } from "@/lib/blog/actions";
import { hasBrandConcatenationBug } from "@/lib/seo/suggest";
import { siteConfig } from "@/lib/site";
import styles from "./SeoEditForm.module.css";

function CharCount({ value, min, max }) {
  const len = (value || "").length;
  const over = len > max;
  const under = len > 0 && len < min;
  return (
    <span className={`${styles.charCount} ${over || under ? styles.charCountWarn : ""}`}>
      {len} / {max} karakter{over ? " (uzun)" : under ? " (kısa)" : ""}
    </span>
  );
}

export default function SeoEditForm({ record }) {
  const router = useRouter();
  const isPageKind = record.kind === "page";

  const [seoTitle, setSeoTitle] = useState(record.current.seo_title);
  const [metaDescription, setMetaDescription] = useState(record.current.meta_description);
  const [canonicalUrl, setCanonicalUrl] = useState(record.current.canonical_url || "");
  const [robotsIndex, setRobotsIndex] = useState(record.current.robots_index !== false);
  const [robotsFollow, setRobotsFollow] = useState(record.current.robots_follow !== false);
  const [ogTitle, setOgTitle] = useState(record.current.og_title || "");
  const [ogDescription, setOgDescription] = useState(record.current.og_description || "");
  const [ogImage, setOgImage] = useState(record.current.og_image || "");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const brandBug =
    hasBrandConcatenationBug(seoTitle) ||
    hasBrandConcatenationBug(ogTitle) ||
    hasBrandConcatenationBug(metaDescription);

  function applySuggestion() {
    setSeoTitle(record.suggestion.title);
    setMetaDescription(record.suggestion.description);
  }

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      if (record.kind === "page") {
        await updateSeoPage(record.key, record.path, {
          seo_title: seoTitle,
          meta_description: metaDescription,
          canonical_url: canonicalUrl || null,
          robots_index: robotsIndex,
          robots_follow: robotsFollow,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image: ogImage || null,
        });
      } else if (record.kind === "room") {
        await updateRoomSeo(record.key, {
          seo_title: seoTitle,
          seo_description: metaDescription,
        });
      } else if (record.kind === "blog") {
        await updateBlogPost(record.key, {
          seo_title: seoTitle,
          seo_description: metaDescription,
        });
      }
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        "Kaydedilemedi. Migration henüz uygulanmamış olabilir (seo_pages tablosu üretimde yoksa bu ekran çalışmaz)."
      );
    } finally {
      setPending(false);
    }
  }

  const previewTitle = seoTitle || record.effective.title;
  const previewDescription = metaDescription || record.effective.description;
  const previewImage = ogImage || record.effective.image;

  return (
    <div className={styles.wrap}>
      <div className="admin-card" style={{ padding: 24 }}>
        {error && (
          <div className="admin-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="admin-success" style={{ marginBottom: 16 }}>
            Kaydedildi.
          </div>
        )}
        {brandBug && (
          <div className="admin-error" style={{ marginBottom: 16 }}>
            Marka adı birleşik yazılmış görünüyor (&quot;House&quot; ile &quot;Bademli&quot; arasında boşluk yok).
            Lütfen &quot;Vesta House Bademli&quot; olarak düzeltin.
          </div>
        )}
        {record.isDraft && (
          <div className={styles.note} style={{ marginBottom: 16 }}>
            Bu yazı taslak durumunda — yayınlanana kadar indexlenmiyor.
          </div>
        )}

        <div className={styles.suggestionBar}>
          <div>
            <div className={styles.suggestionLabel}>Önerilen SEO Başlığı</div>
            <div className={styles.suggestionValue}>{record.suggestion.title}</div>
            <div className={styles.suggestionLabel} style={{ marginTop: 8 }}>
              Önerilen Açıklama
            </div>
            <div className={styles.suggestionValue}>{record.suggestion.description}</div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={applySuggestion}
          >
            Öneriyi Uygula
          </button>
        </div>

        <div className="admin-field">
          <label>SEO Başlığı</label>
          <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <CharCount value={seoTitle} min={15} max={60} />
          {isPageKind && (
            <span className={styles.hint}>
              Marka adı (&quot;Vesta House Bademli&quot;) sona otomatik eklenir, tekrar yazmanıza gerek yok.
            </span>
          )}
        </div>

        <div className="admin-field">
          <label>Meta Açıklama</label>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          <CharCount value={metaDescription} min={70} max={165} />
        </div>

        {isPageKind && (
          <>
            <div className="admin-field">
              <label>Canonical URL (opsiyonel — boş bırakılırsa otomatik üretilir)</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder={record.url}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className="admin-toggle"
                  data-on={robotsIndex}
                  onClick={() => setRobotsIndex((v) => !v)}
                  aria-pressed={robotsIndex}
                >
                  <span />
                </button>
                <span>{robotsIndex ? "Index (aranabilir)" : "Noindex"}</span>
              </div>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className="admin-toggle"
                  data-on={robotsFollow}
                  onClick={() => setRobotsFollow((v) => !v)}
                  aria-pressed={robotsFollow}
                >
                  <span />
                </button>
                <span>{robotsFollow ? "Follow" : "Nofollow"}</span>
              </div>
            </div>

            <div className={styles.sectionHeading}>Open Graph / Sosyal Paylaşım</div>
            <p className={styles.hint}>
              Boş bırakılan alanlar SEO başlığı/açıklaması ve sayfanın görseline geri düşer.
            </p>

            <div className="admin-field">
              <label>OG Başlığı</label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder={`${previewTitle} | ${siteConfig.name}`}
              />
            </div>
            <div className="admin-field">
              <label>OG Açıklaması</label>
              <textarea
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder={previewDescription}
              />
            </div>
            <div className="admin-field">
              <label>OG Görsel URL (opsiyonel)</label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder={record.effective.image || "Sayfa görseli kullanılır"}
              />
            </div>
          </>
        )}

        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={pending}
          style={{ marginTop: 8 }}
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      <div className={styles.previewCol}>
        <div className={styles.previewCard}>
          <div className={styles.previewHeading}>Google Arama Önizlemesi</div>
          <p className={styles.previewNote}>
            Yalnızca yaklaşık bir önizleme — Google&apos;ın gerçek sonucu birebir göstermez.
          </p>
          <div className={styles.serpUrl}>{record.url || `${siteConfig.url}${record.path || ""}`}</div>
          <div className={styles.serpTitle}>{previewTitle}</div>
          <div className={styles.serpDescription}>{previewDescription}</div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewHeading}>Sosyal Paylaşım Kartı Önizlemesi</div>
          {previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewImage} alt="" className={styles.socialImage} />
          ) : (
            <div className={styles.socialImagePlaceholder}>Görsel yok</div>
          )}
          <div className={styles.socialCard}>
            <div className={styles.socialTitle}>{ogTitle || previewTitle}</div>
            <div className={styles.socialDescription}>{ogDescription || previewDescription}</div>
            <div className={styles.socialHost}>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
