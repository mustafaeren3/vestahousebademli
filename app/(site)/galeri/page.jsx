import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import Gallery from "@/components/Gallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { GALERI_IMAGES } from "@/lib/galeriImages";

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

export default function GaleriPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Karelerle Vesta House"
        subtitle="Taş, ahşap ve zeytin — evin kendi diliyle anlattıkları."
        image="/images/oda-kilim-sandalye.jpg"
        imageAlt="Vesta House Bademli'de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi"
        height="46vh"
      />

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
