import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import RoomCard from "@/components/RoomCard";
import FeatureSplit from "@/components/FeatureSplit";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getRooms, getRoomCover } from "@/lib/rooms/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";
import styles from "@/components/RoomsGrid.module.css";

const PAGE_KEY = "odalar";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;
const F_AVLU = getPageBodySection(PAGE_KEY, "feature_avlu").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("odalar");
  return buildPageMetadata({
    seoRow,
    path: "/odalar",
    fallbackTitle: "Odalar",
    fallbackDescription:
      "Vesta House Bademli'de taş duvarlı üç oda: Taş Oda, Zeytin Odası ve Avlu Odası. Toplam 3 oda, 6 yatak kapasiteli butik bir taş ev.",
    fallbackImage: "/images/oda-yatak-detay.jpg",
  });
}

export default async function OdalarPage() {
  const [rooms, hero, sections] = await Promise.all([
    getRooms(),
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const avlu = sections.feature_avlu;

  return (
    <>
      {hero?.enabled !== false && (
        <PageHero
          eyebrow={hero?.eyebrow || FALLBACK.eyebrow}
          title={hero?.title || FALLBACK.title}
          subtitle={hero?.subtitle || FALLBACK.subtitle}
          image={hero?.image_path || FALLBACK.image_path}
          imageAlt={hero?.image_alt || FALLBACK.image_alt}
        />
      )}

      <Breadcrumbs items={[{ label: "Odalar", href: "/odalar" }]} />

      <ProseBlock
        lead={intro?.subtitle || F_INTRO.subtitle}
        body={intro?.body || F_INTRO.body}
      />

      <section className="section section--tight">
        <div className="container">
          <div className={styles.grid}>
            {rooms.map((room, i) => {
              const cover = getRoomCover(room);
              return (
                <RoomCard
                  key={room.id}
                  index={room.badge}
                  name={room.title}
                  text={room.description}
                  tags={room.tags}
                  image={cover?.url}
                  imageAlt={cover?.alt}
                  href={room.slug ? `/odalar/${room.slug}` : "/odalar"}
                  delay={(i % 4) + 1}
                />
              );
            })}
          </div>
        </div>
      </section>

      <FeatureSplit
        eyebrow={avlu?.eyebrow || F_AVLU.eyebrow}
        title={avlu?.title || F_AVLU.title}
        text={avlu?.body || F_AVLU.body}
        image={avlu?.image_path || F_AVLU.image_path}
        imageAlt={avlu?.image_alt || F_AVLU.image_alt}
        reverse={avlu ? avlu.reverse : F_AVLU.reverse}
        tone={avlu?.tone || F_AVLU.tone}
      />
    </>
  );
}
