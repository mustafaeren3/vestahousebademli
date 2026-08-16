import { getRooms } from "@/lib/rooms/queries";
import { getAllPosts } from "@/lib/blog";
import { getHomeSections, getHomeGalleryImages } from "@/lib/home/queries";
import { getPageGalleryImages } from "@/lib/pages/queries";
import { GALERI_IMAGES } from "@/lib/galeriImages";
import { seoImageUrl } from "@/lib/seo/imageUrl";
import { siteConfig } from "@/lib/site";

// Google's image sitemap extension. Next's built-in app/sitemap.js
// (MetadataRoute.Sitemap) does not support an `images` field in this
// Next.js version (checked node_modules/next/dist/lib/metadata/types --
// SitemapFile only has url/lastModified/changeFrequency/priority/
// alternates), so this is a separate, hand-built XML route rather than an
// extension of the main sitemap.
//
// Every URL here goes through seoImageUrl(), which proxies Supabase
// Storage URLs through this site's own /_next/image endpoint. The raw
// Storage URLs carry an `x-robots-tag: none` response header (a Supabase
// platform default, confirmed via curl, not something this app sets or
// can turn off) that tells Google not to index them -- listing those raw
// URLs here would make Google fetch them, see that header, and ignore the
// sitemap entry entirely. The /_next/image proxy doesn't forward that
// header (also confirmed via curl against production).

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function imageTag({ url, caption }) {
  if (!url) return "";
  return `
    <image:image>
      <image:loc>${escapeXml(url)}</image:loc>${
        caption ? `\n      <image:caption>${escapeXml(caption)}</image:caption>` : ""
      }
    </image:image>`;
}

function urlBlock(loc, images) {
  const clean = images.filter((img) => img.url);
  if (clean.length === 0) return "";
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>${clean.map(imageTag).join("")}
  </url>`;
}

export async function GET() {
  const [rooms, posts, homeSections, homeGalleryImages, galeriImages] = await Promise.all([
    getRooms(),
    getAllPosts(),
    getHomeSections().catch(() => null),
    getHomeGalleryImages().catch(() => []),
    getPageGalleryImages("galeri"),
  ]);

  const blocks = [];

  // Homepage: hero + enabled section images + the admin-managed homepage
  // gallery. Not the whole site's every image -- just what's actually on
  // "/" today.
  if (homeSections) {
    const homeImages = [];
    if (homeSections.hero?.enabled && homeSections.hero.image_path) {
      homeImages.push({
        url: seoImageUrl(homeSections.hero.image_path),
        caption: homeSections.hero.image_alt,
      });
    }
    for (const key of ["rooms", "breakfast", "meyhanesi"]) {
      const section = homeSections[key];
      if (section?.enabled && section.image_path) {
        homeImages.push({ url: seoImageUrl(section.image_path), caption: section.image_alt });
      }
    }
    if (homeSections.gallery_head?.enabled) {
      for (const img of homeGalleryImages) {
        homeImages.push({ url: seoImageUrl(img.image_path), caption: img.alt });
      }
    }
    blocks.push(urlBlock(siteConfig.url, homeImages));
  }

  // Room detail pages: every real gallery photo (this is the fix for
  // rooms with more than 5 photos -- see components/RoomGallery.jsx for
  // the matching on-page fix).
  for (const room of rooms) {
    if (!room.slug) continue;
    let images = (room.room_images || []).map((img) => ({
      url: seoImageUrl(img.image_url),
      caption: img.alt_text || room.title,
    }));
    if (images.length === 0 && room.image_path) {
      images = [{ url: seoImageUrl(room.image_path), caption: room.image_alt || room.title }];
    }
    blocks.push(urlBlock(`${siteConfig.url}/odalar/${room.slug}`, images));
  }

  // /galeri showcase images -- admin-managed (page_gallery_images), falls
  // back to the original hardcoded list if that table is empty/unreachable
  // (same fallback rule as app/(site)/galeri/page.jsx).
  const galeriSitemapImages =
    galeriImages.length > 0
      ? galeriImages.map((img) => ({ url: seoImageUrl(img.image_path), caption: img.alt }))
      : GALERI_IMAGES.map((img) => ({ url: seoImageUrl(img.src), caption: img.alt }));
  blocks.push(urlBlock(`${siteConfig.url}/galeri`, galeriSitemapImages));

  // Published blog posts: cover image only (not every inline content
  // image -- those aren't tracked as structured data anywhere yet).
  for (const post of posts) {
    if (!post.coverImage) continue;
    blocks.push(
      urlBlock(`${siteConfig.url}/blog/${post.slug}`, [
        { url: seoImageUrl(post.coverImage), caption: post.coverImageAlt || post.title },
      ])
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${blocks.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
