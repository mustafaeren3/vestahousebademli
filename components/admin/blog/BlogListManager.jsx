"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBlogPost, deleteBlogPost } from "@/lib/blog/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./BlogListManager.module.css";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogListManager({ posts: initialPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [creating, setCreating] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const post = await createBlogPost({ title: "Yeni Yazı" });
      router.push(`/admin/blog/${post.id}`);
    } catch (err) {
      setError("Yazı oluşturulamadı.");
      setCreating(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      await deleteBlogPost(confirmTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== confirmTarget.id));
      setConfirmTarget(null);
      router.refresh();
    } catch (err) {
      setError("Silinemedi.");
    } finally {
      setConfirmPending(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className={styles.toolbar}>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? "Oluşturuluyor…" : "+ Yeni Yazı"}
        </button>
      </div>

      {posts.length === 0 ? (
        <p className={styles.empty}>Henüz blog yazısı yok.</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.row}>
              <div className={styles.rowMain}>
                <div className={styles.title}>{post.title || "(Başlıksız)"}</div>
                <div className={styles.meta}>
                  <span
                    className={`${styles.badge} ${
                      post.status === "published" ? styles.badgePublished : styles.badgeDraft
                    }`}
                  >
                    {post.status === "published" ? "Yayında" : "Taslak"}
                  </span>
                  {post.category && <span>{post.category}</span>}
                  {post.published_at && <span>{formatDate(post.published_at)}</span>}
                </div>
              </div>
              <div className={styles.actions}>
                <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn--ghost admin-btn--sm">
                  Düzenle
                </Link>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  onClick={() => setConfirmTarget(post)}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message={`"${confirmTarget.title || "Başlıksız yazı"}" kalıcı olarak silinecek.`}
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
