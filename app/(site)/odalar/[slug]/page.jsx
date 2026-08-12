import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RoomGallery from "@/components/RoomGallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import { getRooms, getRoomBySlug, getRoomGallery, getRoomCover } from "@/lib/rooms/queries";
import { seoImageUrl } from "@/lib/seo/imageUrl";
import { withBrandSuffix } from "@/lib/seo/suggest";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.filter((room) => room.slug).map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }) {
  const room = await getRoomBySlug(params.slug);
  if (!room) return {};

  const cover = getRoomCover(room);
  const url = `${siteConfig.url}/odalar/${room.slug}`;
  const title = room.seo_title || room.title;
  const description = room.seo_description || room.description || siteConfig.description;
  // seoImageUrl proxies the raw Supabase Storage URL through this site's own
  // /_next/image endpoint -- the raw URL carries an x-robots-tag: none
  // header (confirmed via curl against production Storage), which tells
  // Google not to index it; the proxy doesn't forward that header.
  const imageUrl = seoImageUrl(cover?.url);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: withBrandSuffix(title),
      description,
      images: imageUrl ? [{ url: imageUrl, alt: cover.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function RoomDetailPage({ params }) {
  const room = await getRoomBySlug(params.slug);
  if (!room) notFound();

  const gallery = getRoomGallery(room);
  const url = `${siteConfig.url}/odalar/${room.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.title,
    description: room.description,
    url,
    // Full ImageObject entries (not bare URL strings) so each gallery photo
    // carries its real alt text as a caption -- helps Google associate the
    // right description with the right room photo. Uses the proxied URL
    // (see seoImageUrl) so the listed image isn't the x-robots-tag-blocked
    // raw Storage URL.
    image: gallery.map((img) => ({
      "@type": "ImageObject",
      contentUrl: seoImageUrl(img.image_url),
      caption: img.alt_text || room.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RoomGallery images={gallery} roomTitle={room.title} />

      <Breadcrumbs
        items={[
          { label: "Odalar", href: "/odalar" },
          { label: room.title, href: `/odalar/${room.slug}` },
        ]}
      />

      <section className="section section--tight">
        <div className={`container ${styles.content}`}>
          <div className={styles.header}>
            <Reveal>
              {room.badge && <span className="eyebrow">Oda {room.badge}</span>}
            </Reveal>
            <Reveal delay={1} as="h1" className={`heading-lg ${styles.title}`}>
              {room.title}
            </Reveal>
          </div>

          {room.description && (
            <Reveal delay={2} as="p" className={`${styles.description} body-lg`}>
              {room.description}
            </Reveal>
          )}

          {room.tags && room.tags.length > 0 && (
            <Reveal delay={3} className={styles.tags}>
              {room.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </Reveal>
          )}

          <Reveal delay={4} className={styles.ctaRow}>
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn--primary"
            >
              WhatsApp&apos;tan Sorun
            </a>
            <Link href="/odalar" className="btn btn--ghost">
              Diğer Odalar
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
