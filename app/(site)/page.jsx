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
        title="Üç oda, altı yatak, tek bir sükûnet"
        text="Her oda, taş duvarların arasında kendi karakterini korur: ahşap kirişler, keten dokular, toprak tonları. Vesta House'ta odalar numaralandırılmaz, hissedilir."
        ctaHref="/odalar"
        ctaLabel="Odaları Keşfedin"
        image="/images/oda-genis.jpg"
        imageAlt="Vesta House Bademli'de taş duvarlı bir oda ve ahşap oyma kapı"
      />
      <FeatureSplit
        eyebrow="Alt Marka"
        title="Liman Meyhanesi"
        text="Gün batımıyla birlikte avlu bir meyhaneye dönüşür. Günün balığı, Ege mezeleri ve ağır ağır uzayan bir sofra — Vesta House'un misafirlerini karşılayan diğer yüzü."
        ctaHref="/liman-meyhanesi"
        ctaLabel="Liman Meyhanesi'ni Tanıyın"
        image="/images/liman-meyhanesi-mekan.jpg"
        imageAlt="Liman Meyhanesi'nin taş ve tuğla duvarlı sofra alanı"
        reverse
        tone="dark"
      />
      <BlogTeaser />
      <ClosingCta />
    </>
  );
}
