import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";

export async function generateMetadata() {
  const seoRow = await getSeoPage("liman-meyhanesi");
  return buildPageMetadata({
    seoRow,
    path: "/liman-meyhanesi",
    fallbackTitle: "Liman Meyhanesi",
    fallbackDescription:
      "Liman Meyhanesi, Vesta House Bademli'nin taş avlusunda akşamları açılan Ege meyhanesi. Günün balığı, mezeler ve uzun bir akşam sofrası.",
    fallbackImage: "/images/avlu-hasir-koltuk.jpg",
  });
}

export default async function LimanMeyhanesiPage() {
  const settings = await getSiteSettings();

  // Real data only: name/address/phone come from site_settings (the same
  // source the rest of the site already uses), servesCuisine is quoted from
  // this page's own real copy ("Ege mezeleri, günün balığı" below). No
  // rating, price range, or menu items are asserted here -- there's no
  // single verified source for those yet, and schema.org doesn't require
  // them.
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.subBrand,
    description:
      "Vesta House Bademli'nin taş avlusunda akşamları açılan Ege meyhanesi.",
    url: `${siteConfig.url}/liman-meyhanesi`,
    image: `${siteConfig.url}/images/vesta-house-tabela.jpg`,
    servesCuisine: "Ege Mutfağı",
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_line1,
      addressLocality: "Dikili",
      addressRegion: "İzmir",
      addressCountry: "TR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />

      <PageHero
        eyebrow="Alt Marka"
        title="Liman Meyhanesi"
        subtitle="Gün batımıyla birlikte, Vesta House'un taş avlusu bir meyhaneye dönüşür."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu"
      />

      <Breadcrumbs items={[{ label: "Liman Meyhanesi", href: "/liman-meyhanesi" }]} />

      <ProseBlock
        eyebrow="Akşam Ritüeli"
        lead="Vesta House'un misafiri olmasanız da, Liman Meyhanesi'nin kapısı size açık."
        body="Günün balığı, Ege usulü mezeler ve ızgaradan sofraya taşınanlar — Liman Meyhanesi, uzun bir akşam yemeği anlayışıyla kuruldu. Menü mevsime göre değişir."
      />

      <FeatureSplit
        eyebrow="Sofra"
        title="Ege mezeleri, günün balığı"
        text="Zeytinyağlılar, deniz ürünleri ve ızgaradan gelen sıcaklar — Liman Meyhanesi'nin sofrası, mevsimine göre şekillenen sade bir Ege mutfağını takip eder. Rakı eşliğinde, uzayan bir akşam için."
        image="/images/vesta-house-tabela.jpg"
        imageAlt="Vesta House'un taş duvarında akşam ışığında parlayan tabelası"
      />

      <FeatureSplit
        eyebrow="Mekân"
        title="Taş duvarlar arasında bir avlu sofrası"
        text="Masalar, evin taş cephesine ve zeytin ağacına bakar. Gündüz sakin bir avlu, akşamları bir meyhane."
        image="/images/hero-tas-ev-aksam.jpg"
        imageAlt="Vesta House Bademli'nin akşam ışığında taş cephesi"
        reverse
        tone="dark"
      />

      <ProseBlock
        eyebrow="Bademli, Dikili"
        lead="Rezervasyon için doğrudan ulaşabilirsiniz."
        body="Liman Meyhanesi'nde masa sayısı sınırlıdır. Kalabalık akşamlarda yer ayırtmak için iletişim bilgilerimizden bize ulaşmanız yeterli."
      />
    </>
  );
}
