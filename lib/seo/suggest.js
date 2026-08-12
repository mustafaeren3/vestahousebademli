// Deterministic, template-based SEO suggestions from real CMS data -- no
// external/AI API.
//
// Brand handling: the root layout (app/(site)/layout.jsx) already sets a
// title template (`%s | ${settings.name}`), which Next.js automatically
// applies to every page's plain-string title -- confirmed in production,
// e.g. a blog post's rendered <title> already carries " | Vesta House
// Bademli" even though lib/blog/queries.js's seoTitle is just the raw post
// title with no manual suffix. So the suggestions below deliberately do
// NOT append the brand to page titles themselves: the template already
// guarantees it, and guarantees it with a real separator, which makes the
// "Vesta HouseBademli" concatenation bug structurally impossible for any
// title that goes through it. The one exception is the home page, whose
// fallback title is the full "Vesta House Bademli | <tagline>" string on
// purpose (matching its pre-Faz-5 behavior) and is rendered via
// `title: { absolute }` specifically to skip the template and avoid a
// double suffix.
//
// OG/Twitter title & description tags are NOT run through that template
// (they're plain meta content), so withBrandSuffix() below adds the brand
// there explicitly when falling back -- guarded so it never doubles up.

export const BRAND = "Vesta House Bademli";
const LOCATION = "Bademli, Dikili";

const TITLE_MAX = 60;
const TITLE_MIN = 15;
const DESC_MIN = 70;
const DESC_MAX = 165;

function truncateAtWord(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max)}…`;
}

// Detects the exact "House"+"Bademli" no-space concatenation defect (e.g.
// "Vesta HouseBademli") in any string, regardless of where it came from --
// used as a live health check over admin-entered SEO text.
export function hasBrandConcatenationBug(text) {
  return /House(?=Bademli)/.test(text || "");
}

// Appends " | Vesta House Bademli" only if the brand isn't already present
// (case-sensitive substring check is enough here -- this only ever runs on
// strings this codebase generates or an admin explicitly typed).
export function withBrandSuffix(text) {
  if (!text) return text;
  return text.includes(BRAND) ? text : `${text} | ${BRAND}`;
}

function withLocationIfMissing(title) {
  const lower = (title || "").toLowerCase();
  if (lower.includes("bademli") || lower.includes("dikili")) return title;
  return `${title} — ${LOCATION}`;
}

// Suggests only the page-specific title fragment; the root layout's title
// template adds " | Vesta House Bademli" when this becomes the page's
// actual <title>.
export function suggestRoomSeo(room) {
  const title = withLocationIfMissing(room.title || "");
  const description = room.description
    ? truncateAtWord(room.description, DESC_MAX)
    : `${room.title} — ${BRAND}, ${LOCATION}.`;
  return { title, description };
}

export function suggestBlogSeo(post) {
  const title = post.title || "";
  const description = post.excerpt
    ? truncateAtWord(post.excerpt, DESC_MAX)
    : `${post.title} — ${BRAND} blog yazısı.`;
  return { title, description };
}

// Static pages already carry hand-written copy as their in-code fallback
// (seeded verbatim into seo_pages by 0011_seo.sql); the "suggestion" here
// is that same real, already-live copy -- a one-click way back to it after
// an experimental edit, never invented text.
export function suggestStaticPageSeo(fallbackTitle, fallbackDescription) {
  return { title: fallbackTitle, description: fallbackDescription };
}

export function titleLengthStatus(title) {
  const len = (title || "").length;
  if (len === 0) return "missing";
  if (len > TITLE_MAX) return "long";
  if (len < TITLE_MIN) return "short";
  return "good";
}

export function descriptionLengthStatus(description) {
  const len = (description || "").length;
  if (len === 0) return "missing";
  if (len > DESC_MAX) return "long";
  if (len < DESC_MIN) return "short";
  return "good";
}
