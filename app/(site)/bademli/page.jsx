import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Bademli",
  description:
    "Bademli: İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve sakin sokaklarıyla bilinen küçük bir Ege köyü.",
  alternates: { canonical: `${siteConfig.url}/bademli` },
};

export default function BademliPage() {
  return (
    <>
      <PageHero
        eyebrow="Bademli, Dikili"
        title="Ege'nin Sakin Köşesi"
        subtitle="İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve dar taş sokaklarıyla bilinen küçük bir köy."
        image="/images/hero-tas-ev-aksam.jpg"
        imageAlt="Bademli'nin dar sokağında Vesta House'un taş cephesi"
      />

      <Breadcrumbs items={[{ label: "Bademli", href: "/bademli" }]} />

      <ProseBlock
        lead="Bademli, aceleyle tanışmamış bir yer."
        body="Kalabalık turizm rotalarının dışında kalan bu küçük Ege köyü, zeytinlikleri, dar taş sokakları ve komşuluk kültürüyle tanınır. Vesta House, tam da bu sessizliğin içinde, köyün dokusuna sadık kalarak var oldu."
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
              Yol Tarifi Alın
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
