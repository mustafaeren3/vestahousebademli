import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import Gallery from "@/components/Gallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection } from "@/lib/pages/queries";
import { getInteriorPage } from "@/lib/pages/staticPages";
import { GALERI_IMAGES } from "@/lib/galeriImages";

const FALLBACK = getInteriorPage("galeri").fallback;

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
  const hero = await getPageSection("galeri", "hero");

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

      <ProseBlock
        body="Aşağıdaki kareler, stüdyo ışığı olmadan, evin kendi gerçek hâliyle çekildi. Herhangi bir görsele tıklayarak büyütebilirsiniz."
        tight
      />

      <section className="section section--tight">
        <div className="container">
          <Gallery images={GALERI_IMAGES} />
        </div>
      </section>
    </>
  );
}
