import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection } from "@/lib/pages/queries";
import { getInteriorPage } from "@/lib/pages/staticPages";

const FALLBACK = getInteriorPage("bademli").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("bademli");
  return buildPageMetadata({
    seoRow,
    path: "/bademli",
    fallbackTitle: "Bademli",
    fallbackDescription:
      "Bademli: İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve sakin sokaklarıyla bilinen küçük bir Ege köyü.",
    fallbackImage: "/images/hero-tas-ev-aksam.jpg",
  });
}

export default async function BademliPage() {
  const hero = await getPageSection("bademli", "hero");

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

      <Breadcrumbs items={[{ label: "Bademli", href: "/bademli" }]} />

      <ProseBlock
        lead="Bademli, kalabalık turizm rotalarının dışında kalan sakin bir köydür."
        body="Zeytinlikleri, dar taş sokakları ve komşuluk kültürüyle bilinir. Vesta House, köyün bu dokusuna sadık kalarak var oldu."
      />

      <FeatureSplit
        eyebrow="Zeytin ve Toprak"
        title="Bir zeytin köyünün ritmi"
        text="Bademli'nin ekonomisi ve günlük hayatı, yüzyıllardır zeytin üzerine kurulu. Köyün çevresini saran zeytinlikler, hem manzaranın hem sofranın değişmeyen unsuru. Hasat mevsiminde köy, kendi sakin temposunda hareketlenir."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu"
      />

      <FeatureSplit
        eyebrow="Konum"
        title="Dikili ve çevresi"
        text="Bademli, İzmir'in Dikili ilçesine bağlıdır. Bölge; antik Pergamon kentiyle bilinen Bergama'ya ve komşu sahil kasabası Ayvalık'a yakınlığıyla da tanınır — sakin bir üsten, Ege'nin tarihini ve kıyısını keşfetmek isteyenler için uygun bir konum sunar."
        image="/images/oyma-kapi-detay.jpg"
        imageAlt="Vesta House Bademli'nin oyma ahşap giriş kapısı"
        reverse
        tone="dark"
      />

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Adres</span>
            <h2 className="heading-lg" style={{ marginTop: 18 }}>
              {siteConfig.address.line1}
            </h2>
            <p className="body-lg" style={{ marginTop: 10 }}>
              {siteConfig.address.district}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <Link href="/iletisim" className="btn btn--primary" style={{ marginTop: 34 }}>
              İletişime Geçin
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
