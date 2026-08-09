import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RoomGallery from "@/components/RoomGallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import { getRooms, getRoomBySlug, getRoomGallery, getRoomCover } from "@/lib/rooms/queries";
import styles from "./page.module.css";

function absoluteUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${siteConfig.url}${url}`;
}

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.filter((room) => room.slug).map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }) {
  const room = await getRoomBySlug(params.slug);
  if (!room) return {};

  const cover = getRoomCover(room);
  const url = `${siteConfig.url}/odalar/${room.slug}`;
  const description = room.description || siteConfig.description;
  const imageUrl = absoluteUrl(cover?.url);

  return {
    title: room.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: room.title,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: cover.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: room.title,
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
    image: gallery.map((img) => absoluteUrl(img.image_url)),
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
