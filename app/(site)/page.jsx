import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Pillars from "@/components/home/Pillars";
import FeatureSplit from "@/components/FeatureSplit";
import HomeGallery from "@/components/home/HomeGallery";
import BlogTeaser from "@/components/home/BlogTeaser";
import ClosingCta from "@/components/home/ClosingCta";
import { getHomeSections, getHomePillars, getHomeGalleryImages } from "@/lib/home/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getSiteSettings } from "@/lib/settings/queries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata() {
  const [seoRow, settings] = await Promise.all([getSeoPage("home"), getSiteSettings()]);
  return buildPageMetadata({
    seoRow,
    path: "/",
    // Matches the root layout's own pre-Faz-5 title exactly, so this is the
    // fallback whenever no seo_pages row/override exists.
    fallbackTitle: `${settings.name} | ${settings.tagline}`,
    fallbackDescription: siteConfig.description,
    fallbackImage: "/images/hero-tas-ev-aksam.jpg",
    titleMode: "absolute",
  });
}

export default async function HomePage() {
  const [sections, pillars, galleryImages] = await Promise.all([
    getHomeSections(),
    getHomePillars(),
    getHomeGalleryImages(),
  ]);

  return (
    <>
      {sections.hero.enabled && <Hero section={sections.hero} />}
      {sections.intro.enabled && <Intro section={sections.intro} />}
      {sections.pillars_head.enabled && (
        <Pillars head={sections.pillars_head} pillars={pillars} />
      )}
      {sections.rooms.enabled && (
        <FeatureSplit
          eyebrow={sections.rooms.eyebrow}
          title={sections.rooms.title}
          text={sections.rooms.body}
          ctaHref={sections.rooms.cta_href}
          ctaLabel={sections.rooms.cta_label}
          ctaAriaLabel={sections.rooms.cta_aria_label}
          ctaIsExternal={sections.rooms.cta_is_external}
          ctaTargetBlank={sections.rooms.cta_target_blank}
          ctaActive={sections.rooms.cta_active}
          image={sections.rooms.image_path}
          imageAlt={sections.rooms.image_alt}
          reverse={sections.rooms.reverse}
          tone={sections.rooms.tone}
        />
      )}
      {sections.breakfast.enabled && (
        <FeatureSplit
          eyebrow={sections.breakfast.eyebrow}
          title={sections.breakfast.title}
          text={sections.breakfast.body}
          ctaHref={sections.breakfast.cta_href}
          ctaLabel={sections.breakfast.cta_label}
          ctaAriaLabel={sections.breakfast.cta_aria_label}
          ctaIsExternal={sections.breakfast.cta_is_external}
          ctaTargetBlank={sections.breakfast.cta_target_blank}
          ctaActive={sections.breakfast.cta_active}
          image={sections.breakfast.image_path}
          imageAlt={sections.breakfast.image_alt}
          reverse={sections.breakfast.reverse}
          tone={sections.breakfast.tone}
        />
      )}
      {sections.meyhanesi.enabled && (
        <FeatureSplit
          eyebrow={sections.meyhanesi.eyebrow}
          title={sections.meyhanesi.title}
          text={sections.meyhanesi.body}
          ctaHref={sections.meyhanesi.cta_href}
          ctaLabel={sections.meyhanesi.cta_label}
          ctaAriaLabel={sections.meyhanesi.cta_aria_label}
          ctaIsExternal={sections.meyhanesi.cta_is_external}
          ctaTargetBlank={sections.meyhanesi.cta_target_blank}
          ctaActive={sections.meyhanesi.cta_active}
          image={sections.meyhanesi.image_path}
          imageAlt={sections.meyhanesi.image_alt}
          reverse={sections.meyhanesi.reverse}
          tone={sections.meyhanesi.tone}
        />
      )}
      {sections.gallery_head.enabled && (
        <HomeGallery section={sections.gallery_head} images={galleryImages} />
      )}
      {sections.blog_teaser.enabled && <BlogTeaser section={sections.blog_teaser} />}
      {sections.closing_cta.enabled && <ClosingCta section={sections.closing_cta} />}
    </>
  );
}
