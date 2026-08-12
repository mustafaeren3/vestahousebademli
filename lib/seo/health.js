import { titleLengthStatus, descriptionLengthStatus, hasBrandConcatenationBug } from "./suggest";

// Computes a health verdict for one page's SEO record from real, checkable
// signals only: missing/too-short/too-long title or description, the
// brand-concatenation bug, a canonical that doesn't match the real site
// host, a missing OG image, and explicit noindex.
//
// Deliberately does NOT attempt a live HTML crawl for H1 count, duplicate
// H1s, broken internal links, or rendered-schema presence. This codebase's
// page templates were hand-audited for Faz 5: every route renders exactly
// one <h1> and the appropriate JSON-LD by construction (Hero/PageHero/blog
// header each render a single h1; nothing else in the component tree
// renders one). Building a live crawler to re-verify a structural
// guarantee on every admin page load would be real added complexity for a
// static site where this doesn't drift on its own -- flagged as an
// explicit scope decision, not silently skipped.
export function computePageHealth({
  title,
  description,
  canonicalUrl,
  robotsIndex,
  ogImage,
  siteHost,
}) {
  const issues = [];
  const suggestions = [];

  if (!title) {
    issues.push("SEO title yok");
  } else {
    const status = titleLengthStatus(title);
    if (status === "long") suggestions.push("Title 60 karakterden uzun");
    else if (status === "short") suggestions.push("Title çok kısa");
  }

  if (!description) {
    issues.push("Meta description yok");
  } else {
    const status = descriptionLengthStatus(description);
    if (status === "long") suggestions.push("Description 165 karakterden uzun");
    else if (status === "short") suggestions.push("Description çok kısa");
  }

  if (hasBrandConcatenationBug(title) || hasBrandConcatenationBug(description)) {
    issues.push('Marka adı birleşik yazılmış ("House" ile "Bademli" arasında boşluk yok)');
  }

  if (canonicalUrl && siteHost && !canonicalUrl.startsWith(siteHost)) {
    issues.push("Canonical URL, site host'uyla eşleşmiyor");
  }

  if (!ogImage) suggestions.push("OG görseli yok (sayfa görseline geri düşülecek)");
  if (robotsIndex === false) suggestions.push("Bu sayfa noindex olarak işaretli");

  const status = issues.length > 0 ? "eksik" : suggestions.length > 0 ? "iyilestirilebilir" : "iyi";
  return { status, issues, suggestions };
}

export const HEALTH_LABELS = {
  iyi: "İyi",
  iyilestirilebilir: "İyileştirilebilir",
  eksik: "Eksik",
};
