import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import MenuSection from "@/components/MenuSection";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Kahvaltı",
  description:
    "Vesta House Bademli'de serpme köy kahvaltısı: yöresel peynirler, ev yapımı reçeller ve zeytin ağacının gölgesinde uzun bir sabah.",
  alternates: { canonical: `${siteConfig.url}/kahvalti` },
};

const inclusions = [
  {
    name: "Peynir Tabağı",
    note: "Beyaz peynir, Bergama peyniri, çeçil peynir",
  },
  {
    name: "Söğüş Tabağı",
    note: "Domates, salatalık, köy biberi ve taze yeşillikler",
  },
  {
    name: "Zeytin Tabağı",
    note: "Kırma yeşil zeytin, siyah sele zeytin",
  },
  {
    name: "Sahanda Yumurta / Omlet",
  },
  {
    name: "Tuzlu Soslar",
    note: "Ev yapımı cevizli acuka, ev yapımı yağlı kapya biber",
  },
  {
    name: "Tatlılar",
    note: "Ev yapımı reçel çeşitleri, bal & tereyağ",
  },
];

const extras = [
  { name: "Menemen", price: "300 ₺" },
  { name: "Sucuklu Yumurta", price: "250 ₺" },
];

const sicakIcecekler = [
  { name: "Espresso", price: "200 ₺" },
  { name: "Americano", price: "250 ₺" },
  { name: "Türk Kahvesi", price: "150 ₺" },
  { name: "Çay", price: "70 ₺" },
];

const sogukIcecekler = [
  { name: "Coca-Cola", price: "200 ₺" },
  { name: "Fanta", price: "200 ₺" },
  { name: "Sprite", price: "200 ₺" },
  { name: "Ice Tea", price: "200 ₺" },
  { name: "Frappe", price: "300 ₺" },
  { name: "Frozen", price: "350 ₺" },
  { name: "Soda", price: "100 ₺" },
  { name: "Su", price: "60 ₺" },
];

export default function KahvaltiPage() {
  return (
    <>
      <PageHero
        eyebrow="Kahvaltı"
        title="Serpme Köy Kahvaltısı"
        subtitle="Zeytin ağacının gölgesinde bir Ege kahvaltısı."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin kahvaltı servisi yapılan avlusu"
      />

      <Breadcrumbs items={[{ label: "Kahvaltı", href: "/kahvalti" }]} />

      <ProseBlock
        lead="Sabahlar, avluda serpme bir sofrayla başlar."
        body="Kahvaltı en az iki kişilik hazırlanır. İçerik mevsime göre değişebilir."
      />

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Sofra</span>
            <h2 className="heading-lg" style={{ marginTop: 18, marginBottom: 8 }}>
              Kişi Başı 750 ₺
            </h2>
          </Reveal>

          <div className={styles.inclusions}>
            {inclusions.map((item, i) => (
              <Reveal key={item.name} delay={(i % 4) + 1} className={styles.item}>
                <div className={styles.itemName}>{item.name}</div>
                {item.note && <div className={styles.itemNote}>{item.note}</div>}
              </Reveal>
            ))}
          </div>

          <p className={styles.footnote}>
            Serpme köy kahvaltısı en az iki kişilik servis edilir. İçerik mevsime göre
            değişiklik gösterebilir.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MenuSection title="Ekstra Sıcaklar" items={extras} />
          <MenuSection title="Sıcak İçecekler" items={sicakIcecekler} delay={1} />
          <MenuSection title="Soğuk İçecekler" items={sogukIcecekler} delay={2} />
        </div>
      </section>
    </>
  );
}
