import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import Gallery from "@/components/Gallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections, getPageGalleryImages } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";
import { GALERI_IMAGES } from "@/lib/galeriImages";

const PAGE_KEY = "galeri";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("galeri");
  return buildPageMetadata({
    seoRow,
    path: "/galeri",
    fallbackTitle: "Galeri",
    fallbackDescription:
      "Vesta House Bademli'den kareler: taş cephe, oyma ahşap kapılar, zeytin ağacının gölgesindeki avlu ve Liman Meyhanesi.",
    fallbackImage: "/images/oda-kilim-sandalye.jpg",
  });
}

export default async function GaleriPage() {
  const [hero, sections, dbImages] = await Promise.all([
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
    getPageGalleryImages(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const images =
    dbImages.length > 0
      ? dbImages.map((img) => ({ src: img.image_path, alt: img.alt, width: img.width, height: img.height }))
      : GALERI_IMAGES;

  return (
    <>
      {hero?.enabled !== false && (
        <PageHero
          eyebrow={hero?.eyebrow || FALLBACK.eyebrow}
          title={hero?.title || FALLBACK.title}
          subtitle={hero?.subtitle || FALLBACK.subtitle}
          image={hero?.image_path || FALLBACK.image_path}
          imageAlt={hero?.image_alt || FALLBACK.image_alt}
          height="46vh"
        />
      )}

      <Breadcrumbs items={[{ label: "Galeri", href: "/galeri" }]} />

      <ProseBlock body={intro?.body || F_INTRO.body} tight />

      <section className="section section--tight">
        <div className="container">
          <Gallery images={images} />
        </div>
      </section>
    </>
  );
}
