"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateBlogPost,
  uploadBlogCoverImage,
  deleteBlogCoverImage,
} from "@/lib/blog/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import MarkdownToolbar from "./MarkdownToolbar";
import styles from "./BlogEditor.module.css";

function tagsToText(tags) {
  return (tags || []).join(", ");
}

function textToTags(text) {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toDateInputValue(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function BlogEditor({ post }) {
  const router = useRouter();
  const contentRef = useRef(null);

  const [title, setTitle] = useState(post.title || "");
  const [slug, setSlug] = useState(post.slug || "");
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [category, setCategory] = useState(post.category || "");
  const [tagsText, setTagsText] = useState(tagsToText(post.tags));
  const [content, setContent] = useState(post.content || "");
  const [coverImageAlt, setCoverImageAlt] = useState(post.cover_image_alt || "");
  const [seoTitle, setSeoTitle] = useState(post.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(post.seo_description || "");
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(post.published_at));
  const [status, setStatus] = useState(post.status);
  const [faq, setFaq] = useState(post.faq && post.faq.length > 0 ? post.faq : []);
  const [coverImage, setCoverImage] = useState(post.cover_image || "");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function updateFaqItem(index, field, value) {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addFaqItem() {
    setFaq((prev) => [...prev, { q: "", a: "" }]);
  }

  function removeFaqItem(index) {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateBlogPost(post.id, {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: textToTags(tagsText),
        cover_image_alt: coverImageAlt,
        seo_title: seoTitle,
        seo_description: seoDescription,
        faq: faq.filter((item) => item.q.trim() || item.a.trim()),
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      });
      setSlug(updated.slug);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  async function handleCoverUpload(file) {
    const formData = new FormData();
    formData.set("image", file);
    const updated = await uploadBlogCoverImage(post.id, formData);
    setCoverImage(updated.cover_image);
    router.refresh();
  }

  async function handleCoverRemove() {
    await deleteBlogCoverImage(post.id);
    setCoverImage("");
    router.refresh();
  }

  return (
    <div className="admin-card" style={{ padding: 24, maxWidth: 760 }}>
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

      <div className={styles.toggleRow}>
        <button
          type="button"
          className="admin-toggle"
          data-on={status === "published"}
          onClick={() => setStatus((v) => (v === "published" ? "draft" : "published"))}
          aria-pressed={status === "published"}
        >
          <span />
        </button>
        <span className={styles.toggleLabel}>
          {status === "published" ? "Yayında" : "Taslak"}
        </span>
        {status === "published" && (
          <Link href={`/blog/${slug}`} target="_blank" className="admin-btn admin-btn--ghost admin-btn--sm" style={{ marginLeft: "auto" }}>
            Canlı Sayfayı Gör
          </Link>
        )}
      </div>

      <div className="admin-field">
        <label>Başlık</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="admin-field">
        <label>Slug (URL)</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <span style={{ fontSize: "0.75rem", color: "var(--color-ink-soft)" }}>
          /blog/{slug || "..."}
        </span>
      </div>

      <div className="admin-field">
        <label>Özet</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div className={styles.row}>
        <div className="admin-field">
          <label>Kategori</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Yayın Tarihi</label>
          <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
        </div>
      </div>

      <div className="admin-field">
        <label>Etiketler (virgülle ayırın)</label>
        <input
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="Bademli, Dikili, Gezi Rehberi"
        />
      </div>

      <div className="admin-field">
        <label>Kapak Görseli</label>
        <ImageUploader
          imageUrl={coverImage}
          onUpload={handleCoverUpload}
          onRemove={coverImage ? handleCoverRemove : undefined}
        />
      </div>

      <div className="admin-field">
        <label>Kapak Görseli Açıklaması (alt metin)</label>
        <input
          type="text"
          value={coverImageAlt}
          onChange={(e) => setCoverImageAlt(e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label>İçerik</label>
        <MarkdownToolbar textareaRef={contentRef} value={content} onChange={setContent} />
        <textarea
          ref={contentRef}
          className={styles.contentTextarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={styles.sectionHeading}>SEO</div>

      <div className="admin-field">
        <label>SEO Başlığı</label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder={title || "Boş bırakılırsa yazı başlığı kullanılır"}
        />
      </div>

      <div className="admin-field">
        <label>SEO Açıklaması (meta description)</label>
        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder={excerpt || "Boş bırakılırsa özet kullanılır"}
        />
      </div>

      <div className={styles.sectionHeading}>Sıkça Sorulan Sorular (opsiyonel)</div>

      {faq.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <div className={styles.faqItemHead}>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => removeFaqItem(index)}
            >
              Kaldır
            </button>
          </div>
          <div className="admin-field">
            <label>Soru</label>
            <input
              type="text"
              value={item.q}
              onChange={(e) => updateFaqItem(index, "q", e.target.value)}
            />
          </div>
          <div className="admin-field" style={{ marginBottom: 0 }}>
            <label>Cevap</label>
            <textarea value={item.a} onChange={(e) => updateFaqItem(index, "a", e.target.value)} />
          </div>
        </div>
      ))}

      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addFaqItem}>
        + Soru Ekle
      </button>

      <div style={{ marginTop: 28 }}>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
