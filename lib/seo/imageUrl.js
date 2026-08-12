import { siteConfig } from "@/lib/site";

// Turns an image path/URL into an absolute URL suitable for OG tags and the
// sitemap's image extension.
//
// Supabase Storage responses carry `x-robots-tag: none` on every object
// (confirmed via `curl -I` against a real storage URL in production --
// this is a Supabase Storage gateway default, not something set by this
// app's code, and it is not configurable via bucket policy or RLS). That
// header is equivalent to noindex+nofollow for that exact URL, which is
// very likely why room photos have been slow/incomplete in Google Images:
// any URL carrying it can be listed in a sitemap or linked from OG tags
// and Google will still decline to index it.
//
// The app's own /_next/image optimizer proxies the same bytes through
// vestahousebademli.com and does NOT forward that header (also confirmed
// via curl against the production /_next/image endpoint) -- next/image
// components already render through this proxy, so this just gives
// sitemap/OG code the same crawlable URL shape the live HTML already uses.
// Local /public assets have no such header to begin with, so they're left
// as plain absolute URLs.
export function seoImageUrl(src, { width = 1920, quality = 75 } = {}) {
  if (!src) return null;
  if (src.startsWith("/_next/image")) return `${siteConfig.url}${src}`;
  if (!src.startsWith("http")) return `${siteConfig.url}${src}`;

  const proxied = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  return `${siteConfig.url}${proxied}`;
}
