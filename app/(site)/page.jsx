import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Pillars from "@/components/home/Pillars";
import FeatureSplit from "@/components/FeatureSplit";
import HomeGallery from "@/components/home/HomeGallery";
import BlogTeaser from "@/components/home/BlogTeaser";
import ClosingCta from "@/components/home/ClosingCta";
import { getHomeSections, getHomePillars, getHomeGalleryImages } from "@/lib/home/queries";

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
