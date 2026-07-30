import Image from "next/image";
import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Hakkımızda",
  description:
    "Vesta House Bademli'nin hikâyesi: Bademli'de bir taş evin, aslına sadık kalınarak onarılması.",
  alternates: { canonical: `${siteConfig.url}/hakkimizda` },
};

export default function HakkimizdaPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="Evin Hikâyesi"
        subtitle="Bademli'de bir taş evin, aslına sadık kalınarak yeniden kullanılabilir hâle getirilme hikâyesi."
        image="/images/oyma-kapi-detay.jpg"
        imageAlt="Vesta House Bademli'nin oyma ahşap giriş kapısı"
      />

      <Breadcrumbs items={[{ label: "Hakkımızda", href: "/hakkimizda" }]} />

      <ProseBlock
        lead="Bu ev yıkılıp yeniden yapılmadı; olduğu gibi korunarak onarıldı."
        body="Bademli'nin köy içinde, dar bir sokakta duran bu taş ev, aslına en az müdahaleyle bugünkü hâline getirildi. Taş duvarlar sıvanmadı, yalnızca temizlendi. Ahşap kapılar değiştirilmedi, yalnızca onarıldı."
      />

      <FeatureSplit
        eyebrow="Yeniden Doğuş"
        title="Aslına Sadık Kalarak"
        text="Yeni eklenen aydınlatma, mobilya ve tekstil, evin genel görünümüyle uyumlu seçildi. Amaç, evin özgün hâlini korumaktı."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu"
      />

      <FeatureSplit
        eyebrow="Evin Karakteri"
        title="Taş, ahşap ve sadelik"
        text="Taş duvarlar, ahşap kapılar ve sade bir avlu. Vesta House Bademli, küçük ölçekli ve gösterişsiz bir yapıdır."
        image="/images/oda-kilim-sandalye.jpg"
        imageAlt="Vesta House Bademli'de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi"
        reverse
        tone="dark"
      />

      <section className="section">
        <div className={`container ${styles.nameWrap}`}>
          <Reveal className={styles.nameMark}>
            <Image
              src="/images/vesta-rahibesi.png"
              alt="Vesta — Roma mitolojisinde ocak ve ev huzurunun tanrıçası"
              width={220}
              height={220}
            />
          </Reveal>
          <Reveal delay={1} className={styles.nameText}>
            <span className="eyebrow">İsmin Kökeni</span>
            <h2 className="heading-lg" style={{ marginTop: 18 }}>
              Neden Vesta?
            </h2>
            <div className="divider" />
            <p className="body-lg">
              Vesta, Roma mitolojisinde evin ocağını ve huzurunu koruyan
              tanrıçadır. Bademli&apos;deki bu taş evin adını ondan aldık —
              çünkü burada da amaç aynı: sıcak bir ocak ve kapısından girenin
              kendini evinde hissettiği bir yer.
            </p>
          </Reveal>
        </div>
      </section>

      <ProseBlock
        eyebrow="Bugün"
        lead="Vesta House Bademli, bugün misafirlerini bu taş evde ağırlıyor."
        body="Ev sahibi değişti, evin karakteri aynı kaldı. Her konuk, kısa bir süre için de olsa bu evin bir parçası oluyor."
      />
    </>
  );
}
