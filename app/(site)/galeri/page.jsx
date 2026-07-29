import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import Gallery from "@/components/Gallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Galeri",
  description:
    "Vesta House Bademli'den kareler: taş cephe, oyma ahşap kapılar, zeytin ağacının gölgesindeki avlu ve Liman Meyhanesi.",
  alternates: { canonical: `${siteConfig.url}/galeri` },
};

const images = [
  {
    src: "/images/hero-tas-ev-aksam.jpg",
    alt: "Vesta House Bademli'nin akşam ışığında taş cephesi",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/oyma-kapi-detay.jpg",
    alt: "Oyma ahşap giriş kapısı",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/oda-genis.jpg",
    alt: "Taş duvarlı bir oda ve ahşap kapı",
    width: 1650,
    height: 2200,
  },
  {
    src: "/images/vesta-house-tabela.jpg",
    alt: "Vesta House'un akşam ışığında tabelası",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/avlu-hasir-koltuk.jpg",
    alt: "Zeytin ağacı gölgesindeki avlu ve hasır koltuk",
    width: 1650,
    height: 2200,
  },
  {
    src: "/images/oda-kilim-sandalye.jpg",
    alt: "Kilim ve ahşap sandalyelerin bulunduğu oda köşesi",
    width: 1650,
    height: 2200,
  },
  {
    src: "/images/tas-duvar-oyma-pencere.jpg",
    alt: "Taş duvar ve oyma ahşap pencere detayı",
    width: 1650,
    height: 2200,
  },
  {
    src: "/images/oda-yatak-detay.jpg",
    alt: "Beyaz keten örtülü yatak ve katlanmış havlular",
    width: 1650,
    height: 2200,
  },
];

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
          <Gallery images={images} />
        </div>
      </section>
    </>
  );
}
