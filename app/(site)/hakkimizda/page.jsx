import Image from "next/image";
import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";
import styles from "./page.module.css";

const PAGE_KEY = "hakkimizda";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;
const F_YENIDEN = getPageBodySection(PAGE_KEY, "feature_yeniden_dogus").fallback;
const F_KARAKTER = getPageBodySection(PAGE_KEY, "feature_karakter").fallback;
const F_CLOSING = getPageBodySection(PAGE_KEY, "closing").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("hakkimizda");
  return buildPageMetadata({
    seoRow,
    path: "/hakkimizda",
    fallbackTitle: "Hakkımızda",
    fallbackDescription:
      "Vesta House Bademli'nin hikâyesi: Bademli'de bir taş evin, aslına sadık kalınarak onarılması.",
    fallbackImage: "/images/oyma-kapi-detay.jpg",
  });
}

export default async function HakkimizdaPage() {
  const [hero, sections] = await Promise.all([
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const yenidenDogus = sections.feature_yeniden_dogus;
  const karakter = sections.feature_karakter;
  const closing = sections.closing;

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

      <Breadcrumbs items={[{ label: "Hakkımızda", href: "/hakkimizda" }]} />

      <ProseBlock
        lead={intro?.subtitle || F_INTRO.subtitle}
        body={intro?.body || F_INTRO.body}
      />

      <FeatureSplit
        eyebrow={yenidenDogus?.eyebrow || F_YENIDEN.eyebrow}
        title={yenidenDogus?.title || F_YENIDEN.title}
        text={yenidenDogus?.body || F_YENIDEN.body}
        image={yenidenDogus?.image_path || F_YENIDEN.image_path}
        imageAlt={yenidenDogus?.image_alt || F_YENIDEN.image_alt}
      />

      <FeatureSplit
        eyebrow={karakter?.eyebrow || F_KARAKTER.eyebrow}
        title={karakter?.title || F_KARAKTER.title}
        text={karakter?.body || F_KARAKTER.body}
        image={karakter?.image_path || F_KARAKTER.image_path}
        imageAlt={karakter?.image_alt || F_KARAKTER.image_alt}
        reverse={karakter ? karakter.reverse : F_KARAKTER.reverse}
        tone={karakter?.tone || F_KARAKTER.tone}
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
        eyebrow={closing?.eyebrow || F_CLOSING.eyebrow}
        lead={closing?.subtitle || F_CLOSING.subtitle}
        body={closing?.body || F_CLOSING.body}
      />
    </>
  );
}
