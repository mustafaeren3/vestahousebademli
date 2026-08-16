import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteSettings } from "@/lib/settings/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";

const PAGE_KEY = "bademli";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;
const F_ZEYTIN = getPageBodySection(PAGE_KEY, "feature_zeytin").fallback;
const F_KONUM = getPageBodySection(PAGE_KEY, "feature_konum").fallback;

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
  const [settings, hero, sections] = await Promise.all([
    getSiteSettings(),
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const zeytin = sections.feature_zeytin;
  const konum = sections.feature_konum;

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
        lead={intro?.subtitle || F_INTRO.subtitle}
        body={intro?.body || F_INTRO.body}
      />

      <FeatureSplit
        eyebrow={zeytin?.eyebrow || F_ZEYTIN.eyebrow}
        title={zeytin?.title || F_ZEYTIN.title}
        text={zeytin?.body || F_ZEYTIN.body}
        image={zeytin?.image_path || F_ZEYTIN.image_path}
        imageAlt={zeytin?.image_alt || F_ZEYTIN.image_alt}
      />

      <FeatureSplit
        eyebrow={konum?.eyebrow || F_KONUM.eyebrow}
        title={konum?.title || F_KONUM.title}
        text={konum?.body || F_KONUM.body}
        image={konum?.image_path || F_KONUM.image_path}
        imageAlt={konum?.image_alt || F_KONUM.image_alt}
        reverse={konum ? konum.reverse : F_KONUM.reverse}
        tone={konum?.tone || F_KONUM.tone}
      />

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow">Adres</span>
            <h2 className="heading-lg" style={{ marginTop: 18 }}>
              {settings.address_line1}
            </h2>
            <p className="body-lg" style={{ marginTop: 10 }}>
              {settings.address_district}
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
