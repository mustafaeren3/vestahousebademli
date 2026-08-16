import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import MenuSection from "@/components/MenuSection";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections, getPageListItems } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";
import styles from "./page.module.css";

const PAGE_KEY = "kahvalti";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;
const F_PRICING = getPageBodySection(PAGE_KEY, "pricing_head").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("kahvalti");
  return buildPageMetadata({
    seoRow,
    path: "/kahvalti",
    fallbackTitle: "Kahvaltı",
    fallbackDescription:
      "Vesta House Bademli'de serpme köy kahvaltısı: yöresel peynirler, ev yapımı reçeller ve zeytin ağacının gölgesinde uzun bir sabah.",
    fallbackImage: "/images/avlu-hasir-koltuk.jpg",
  });
}

// Bu 4 dizi, page_list_items tablosunda ilgili group_key için hiç satır
// yoksa (sorgu hatası ya da migration henüz uygulanmadıysa) kullanılan
// yedek içerik -- admin panelinden "Kahvaltı > Fiyat Listesi" sekmesinde
// düzenlenen asıl veri page_list_items'tan gelir.
const FALLBACK_INCLUSIONS = [
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

const FALLBACK_EXTRAS = [
  { name: "Menemen", price: "300 ₺" },
  { name: "Sucuklu Yumurta", price: "250 ₺" },
];

const FALLBACK_SICAK = [
  { name: "Espresso", price: "200 ₺" },
  { name: "Americano", price: "250 ₺" },
  { name: "Türk Kahvesi", price: "150 ₺" },
  { name: "Çay", price: "70 ₺" },
];

const FALLBACK_SOGUK = [
  { name: "Coca-Cola", price: "200 ₺" },
  { name: "Fanta", price: "200 ₺" },
  { name: "Sprite", price: "200 ₺" },
  { name: "Ice Tea", price: "200 ₺" },
  { name: "Frappe", price: "300 ₺" },
  { name: "Frozen", price: "350 ₺" },
  { name: "Soda", price: "100 ₺" },
  { name: "Su", price: "60 ₺" },
];

export default async function KahvaltiPage() {
  const [hero, sections, listItems] = await Promise.all([
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
    getPageListItems(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const pricing = sections.pricing_head;

  const inclusions = listItems.inclusions?.length
    ? listItems.inclusions.map((i) => ({ name: i.name, note: i.detail }))
    : FALLBACK_INCLUSIONS;
  const extras = listItems.extras?.length
    ? listItems.extras.map((i) => ({ name: i.name, price: i.detail }))
    : FALLBACK_EXTRAS;
  const sicakIcecekler = listItems.sicak_icecekler?.length
    ? listItems.sicak_icecekler.map((i) => ({ name: i.name, price: i.detail }))
    : FALLBACK_SICAK;
  const sogukIcecekler = listItems.soguk_icecekler?.length
    ? listItems.soguk_icecekler.map((i) => ({ name: i.name, price: i.detail }))
    : FALLBACK_SOGUK;

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

      <Breadcrumbs items={[{ label: "Kahvaltı", href: "/kahvalti" }]} />

      <ProseBlock
        lead={intro?.subtitle || F_INTRO.subtitle}
        body={intro?.body || F_INTRO.body}
      />

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{pricing?.eyebrow || F_PRICING.eyebrow}</span>
            <h2 className="heading-lg" style={{ marginTop: 18, marginBottom: 8 }}>
              {pricing?.title || F_PRICING.title}
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

          <p className={styles.footnote}>{pricing?.body || F_PRICING.body}</p>
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
