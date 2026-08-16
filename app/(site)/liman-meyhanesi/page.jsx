import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import FeatureSplit from "@/components/FeatureSplit";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";

const PAGE_KEY = "liman-meyhanesi";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;
const F_SOFRA = getPageBodySection(PAGE_KEY, "feature_sofra").fallback;
const F_MEKAN = getPageBodySection(PAGE_KEY, "feature_mekan").fallback;
const F_CLOSING = getPageBodySection(PAGE_KEY, "closing").fallback;

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
  const [settings, hero, sections] = await Promise.all([
    getSiteSettings(),
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
  ]);
  const intro = sections.intro;
  const sofra = sections.feature_sofra;
  const mekan = sections.feature_mekan;
  const closing = sections.closing;

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

      {hero?.enabled !== false && (
        <PageHero
          eyebrow={hero?.eyebrow || FALLBACK.eyebrow}
          title={hero?.title || FALLBACK.title}
          subtitle={hero?.subtitle || FALLBACK.subtitle}
          image={hero?.image_path || FALLBACK.image_path}
          imageAlt={hero?.image_alt || FALLBACK.image_alt}
        />
      )}

      <Breadcrumbs items={[{ label: "Liman Meyhanesi", href: "/liman-meyhanesi" }]} />

      <ProseBlock
        eyebrow={intro?.eyebrow || F_INTRO.eyebrow}
        lead={intro?.subtitle || F_INTRO.subtitle}
        body={intro?.body || F_INTRO.body}
      />

      <FeatureSplit
        eyebrow={sofra?.eyebrow || F_SOFRA.eyebrow}
        title={sofra?.title || F_SOFRA.title}
        text={sofra?.body || F_SOFRA.body}
        image={sofra?.image_path || F_SOFRA.image_path}
        imageAlt={sofra?.image_alt || F_SOFRA.image_alt}
      />

      <FeatureSplit
        eyebrow={mekan?.eyebrow || F_MEKAN.eyebrow}
        title={mekan?.title || F_MEKAN.title}
        text={mekan?.body || F_MEKAN.body}
        image={mekan?.image_path || F_MEKAN.image_path}
        imageAlt={mekan?.image_alt || F_MEKAN.image_alt}
        reverse={mekan ? mekan.reverse : F_MEKAN.reverse}
        tone={mekan?.tone || F_MEKAN.tone}
      />

      <ProseBlock
        eyebrow={closing?.eyebrow || F_CLOSING.eyebrow}
        lead={closing?.subtitle || F_CLOSING.subtitle}
        body={closing?.body || F_CLOSING.body}
      />
    </>
  );
}
