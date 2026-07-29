import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Pillars from "@/components/home/Pillars";
import FeatureSplit from "@/components/FeatureSplit";
import BlogTeaser from "@/components/home/BlogTeaser";
import ClosingCta from "@/components/home/ClosingCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Pillars />
      <FeatureSplit
        eyebrow="Odalar"
        title="Küçük bir evde, özenle hazırlanmış odalar"
        text="Her oda, taş duvarların arasında kendi karakterini korur: ahşap kirişler, keten dokular, toprak tonları. Sayıları azdır; her biri ayrı ayrı hazırlanmıştır."
        ctaHref="/odalar"
        ctaLabel="Odaları Keşfedin"
        image="/images/oda-genis.jpg"
        imageAlt="Vesta House Bademli'de taş duvarlı bir oda ve ahşap oyma kapı"
      />
      <FeatureSplit
        eyebrow="Alt Marka"
        title="Liman Meyhanesi"
        text="Gün batımıyla birlikte avlu bir meyhaneye dönüşür. Günün balığı, Ege mezeleri ve uzun bir akşam sofrası."
        ctaHref="/liman-meyhanesi"
        ctaLabel="Liman Meyhanesi'ni Tanıyın"
        image="/images/tas-duvar-oyma-pencere.jpg"
        imageAlt="Vesta House Bademli'nin taş duvarı ve oyma ahşap penceresi"
        reverse
        tone="dark"
      />
      <BlogTeaser />
      <ClosingCta />
    </>
  );
}
