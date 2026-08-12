"use client";

import { useRef, useState } from "react";
import { optimizePhoto, PhotoOptimizeError } from "@/lib/uploads/optimizePhoto";
import { uploadBlogInlineImage } from "@/lib/blog/actions";
import styles from "./MarkdownToolbar.module.css";

function wrapSelection(value, start, end, before, after, placeholder) {
  const selected = value.slice(start, end) || placeholder;
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    newValue,
    cursorStart: start + before.length,
    cursorEnd: start + before.length + selected.length,
  };
}

function prefixLines(value, start, end, prefix) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = value.indexOf("\n", end);
  if (lineEnd === -1) lineEnd = value.length;

  const block = value.slice(lineStart, lineEnd);
  const prefixed = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : prefix + line))
    .join("\n");

  const newValue = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  return { newValue, cursorStart: lineStart, cursorEnd: lineStart + prefixed.length };
}

// Minimal markdown insertion toolbar for the blog content textarea. Covers
// the requested minimum set (H2/H3/paragraph/bold/italic/link/list/image/
// quote); "paragraf" needs no button since a blank line already starts one
// in markdown. Operates directly on the textarea's selection, then hands
// the updated string back to the parent via onChange (the textarea stays a
// normal controlled input).
export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function apply(fn) {
    const el = textareaRef.current;
    if (!el) return;
    const { newValue, cursorStart, cursorEnd } = fn(value, el.selectionStart, el.selectionEnd);
    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const optimized = await optimizePhoto(file);
      const formData = new FormData();
      formData.set("image", optimized);
      const url = await uploadBlogInlineImage(formData);
      apply((v, s, en) => wrapSelection(v, s, en, "![", `](${url})`, "görsel açıklaması"));
    } catch (err) {
      setError(err instanceof PhotoOptimizeError ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const buttons = [
    { label: "H2", title: "Alt Başlık (H2)", action: (v, s, en) => prefixLines(v, s, en, "## ") },
    { label: "H3", title: "Alt Başlık (H3)", action: (v, s, en) => prefixLines(v, s, en, "### ") },
    { label: "B", title: "Kalın", action: (v, s, en) => wrapSelection(v, s, en, "**", "**", "kalın metin") },
    { label: "İ", title: "İtalik", action: (v, s, en) => wrapSelection(v, s, en, "_", "_", "italik metin") },
    { label: "🔗", title: "Bağlantı", action: (v, s, en) => wrapSelection(v, s, en, "[", "](https://)", "bağlantı metni") },
    { label: "•", title: "Liste", action: (v, s, en) => prefixLines(v, s, en, "- ") },
    { label: "❝", title: "Alıntı", action: (v, s, en) => prefixLines(v, s, en, "> ") },
  ];

  return (
    <div>
      <div className={styles.toolbar}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className={styles.btn}
            title={btn.title}
            onClick={() => apply(btn.action)}
          >
            {btn.label}
          </button>
        ))}
        <label className={styles.btn} title="Görsel Ekle">
          {uploading ? "…" : "🖼"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFile}
            disabled={uploading}
            hidden
          />
        </label>
      </div>
      {error && (
        <div className="admin-error" style={{ marginBottom: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
}
