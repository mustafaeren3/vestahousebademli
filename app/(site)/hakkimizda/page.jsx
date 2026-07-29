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
    "Vesta House Bademli'nin hikâyesi: Bademli'de yıllar önce örülmüş bir taş evin, aslına dokunulmadan yeniden hayat bulması.",
  alternates: { canonical: `${siteConfig.url}/hakkimizda` },
};

export default function HakkimizdaPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="Taşın Hatırladığı Ev"
        subtitle="Bademli'nin içinde, yıllarca sessizce bekleyen bir evin, dokunulmadan yeniden nefes alma hikâyesi."
        image="/images/oyma-kapi-detay.jpg"
        imageAlt="Vesta House Bademli'nin oyma ahşap giriş kapısı"
      />

      <Breadcrumbs items={[{ label: "Hakkımızda", href: "/hakkimizda" }]} />

      <ProseBlock
        lead="Bu ev, yıkılıp yeniden yapılmadı — yalnızca dinlendirildi."
        body="Bademli'nin köy içinde, dar bir sokakta duran bu taş ev, onlarca yıl aynı ailenin elinde kaldı. Vesta House, evi bugünkü yaşam alanına dönüştürürken tek bir kuralı vardı: Aslına en az müdahaleyle. Taş duvarlar sıvanmadı, yalnızca temizlendi. Ahşap kapılar değiştirilmedi, yalnızca onarıldı."
      />

      <FeatureSplit
        eyebrow="Yeniden Doğuş"
        title="Restorasyon değil, sadakat"
        text="Çatı kiremitleri aynı kalıptan, taşlar aynı ocaktan. Yeni eklenen her şey — aydınlatma, mobilya, tekstil — evin dilini bozmadan, sessizce yerini aldı. Amaç yeni bir şey inşa etmek değil, var olanı olduğu gibi görünür kılmaktı."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu"
      />

      <FeatureSplit
        eyebrow="Malzeme ve Zaman"
        title="Zeytin, taş ve tuz"
        text="Ege'nin üç sabit unsuru evin her köşesinde hissedilir: avludaki zeytin ağacının gölgesi, duvarların taşındaki serinlik ve limandan esen tuzlu rüzgâr. Vesta House, bu üç unsurun üstüne hiçbir şey eklemedi; yalnızca onlara bir çatı oldu."
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
              çünkü burada da amaç aynı: sıcak bir ocak, korunan bir sessizlik
              ve kapısından girenin kendini evinde hissettiği bir yer.
            </p>
          </Reveal>
        </div>
      </section>

      <ProseBlock
        eyebrow="Bugün"
        lead="Vesta House Bademli, artık misafirlerini aynı sessizlikle karşılıyor."
        body="Ev sahibi değişti, ama evin ruhu değişmedi. Her konuk, bu evin onlarca yıllık sessizliğine yalnızca bir gece için de olsa ortak oluyor."
      />
    </>
  );
}
