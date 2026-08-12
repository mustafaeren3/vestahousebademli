import { notFound } from "next/navigation";
import { getSeoPage } from "@/lib/seo/queries";
import { getStaticPage } from "@/lib/seo/staticPages";
import { getAdminRooms, getRoomCover } from "@/lib/rooms/queries";
import { getAdminBlogPostById } from "@/lib/blog/actions";
import {
  suggestRoomSeo,
  suggestBlogSeo,
  suggestStaticPageSeo,
} from "@/lib/seo/suggest";
import { siteConfig } from "@/lib/site";
import SeoEditForm from "@/components/admin/seo/SeoEditForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO Düzenle" };

async function loadPageKind(key) {
  const staticPage = getStaticPage(key);
  if (!staticPage) return null;
  const seoRow = await getSeoPage(key);
  return {
    kind: "page",
    key,
    label: staticPage.label,
    path: staticPage.path,
    url: `${siteConfig.url}${staticPage.path}`,
    current: {
      seo_title: seoRow?.seo_title || "",
      meta_description: seoRow?.meta_description || "",
      canonical_url: seoRow?.canonical_url || "",
      robots_index: seoRow?.robots_index !== false,
      robots_follow: seoRow?.robots_follow !== false,
      og_title: seoRow?.og_title || "",
      og_description: seoRow?.og_description || "",
      og_image: seoRow?.og_image || "",
      twitter_title: seoRow?.twitter_title || "",
      twitter_description: seoRow?.twitter_description || "",
      twitter_image: seoRow?.twitter_image || "",
    },
    effective: {
      title: seoRow?.seo_title || staticPage.fallbackTitle,
      description: seoRow?.meta_description || staticPage.fallbackDescription,
      image: seoRow?.og_image || staticPage.fallbackImage,
    },
    suggestion: suggestStaticPageSeo(staticPage.fallbackTitle, staticPage.fallbackDescription),
  };
}

async function loadRoomKind(key) {
  const rooms = await getAdminRooms();
  const room = rooms.find((r) => r.id === key);
  if (!room || !room.slug) return null;
  const cover = getRoomCover(room);
  return {
    kind: "room",
    key,
    label: `Oda: ${room.title}`,
    path: `/odalar/${room.slug}`,
    url: `${siteConfig.url}/odalar/${room.slug}`,
    current: {
      seo_title: room.seo_title || "",
      meta_description: room.seo_description || "",
    },
    effective: {
      title: room.seo_title || room.title,
      description: room.seo_description || room.description,
      image: cover?.url,
    },
    suggestion: suggestRoomSeo(room),
  };
}

async function loadBlogKind(key) {
  const post = await getAdminBlogPostById(key);
  if (!post) return null;
  return {
    kind: "blog",
    key,
    label: `Blog: ${post.title || "(Başlıksız)"}`,
    path: post.status === "published" ? `/blog/${post.slug}` : null,
    url: post.status === "published" ? `${siteConfig.url}/blog/${post.slug}` : null,
    isDraft: post.status !== "published",
    current: {
      seo_title: post.seo_title || "",
      meta_description: post.seo_description || "",
    },
    effective: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      image: post.cover_image,
    },
    suggestion: suggestBlogSeo(post),
  };
}

export default async function AdminSeoEditPage({ params }) {
  const { kind, key } = params;

  let record = null;
  if (kind === "page") record = await loadPageKind(key);
  else if (kind === "room") record = await loadRoomKind(key);
  else if (kind === "blog") record = await loadBlogKind(key);
  else notFound();

  if (!record) notFound();

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        SEO Düzenle — {record.label}
      </h2>
      <SeoEditForm record={record} />
    </div>
  );
}
