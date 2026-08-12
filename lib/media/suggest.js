import { slugify } from "@/lib/menu/slug";
import { siteConfig } from "@/lib/site";
import { pageLabelForPath } from "@/lib/media/pages";

// Heuristic starting point for a newly uploaded photo's SEO metadata. Not a
// final answer -- the admin always sees these pre-filled in the edit form
// and can change every field before saving (nothing here is auto-saved).
export function suggestMediaMeta({ filename, linkedPath }) {
  const raw = filename || "gorsel.jpg";
  const dot = raw.lastIndexOf(".");
  const ext = dot > -1 ? raw.slice(dot + 1).toLowerCase() : "jpg";
  const baseName = dot > -1 ? raw.slice(0, dot) : raw;
  const base = slugify(baseName) || "gorsel";

  const pageLabel = linkedPath ? pageLabelForPath(linkedPath) : "";
  const pageSlug = pageLabel ? slugify(pageLabel) : "";

  const seoFilename = `${pageSlug ? `${pageSlug}-` : ""}${base}.${ext}`;
  const readableBase = base.replace(/-/g, " ").trim();
  const subject = pageLabel || siteConfig.name;
  const altText = readableBase ? `${subject} — ${readableBase}` : subject;

  return {
    filename: seoFilename,
    altText,
    caption: altText,
  };
}
