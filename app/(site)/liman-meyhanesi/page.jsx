import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Liman Meyhanesi",
  description:
    "Liman Meyhanesi, Vesta House Bademli'nin taş avlusunda akşamları açılan Ege meyhanesi. Günün balığı, mezeler ve uzun bir akşam sofrası.",
  alternates: { canonical: `${siteConfig.url}/liman-meyhanesi` },
};

export default function LimanMeyhanesiPage() {
  return (
    <>
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
