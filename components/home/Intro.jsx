import Reveal from "@/components/Reveal";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section className="section section--tight">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <span className="eyebrow">Hoş geldiniz</span>
        </Reveal>
        <Reveal delay={1} as="p" className={styles.lead}>
          Bademli&apos;nin dar sokaklarında, yaşını taşlarında taşıyan bir ev var.
          Vesta House, o evi olduğu gibi bırakıp yalnızca{" "}
          <span className="italic-display">nefes almasına izin verdi.</span>
        </Reveal>
        <Reveal delay={2} as="p" className={`${styles.body} body-lg`}>
          Burada oda numaraları yerine sessizlik, hizmet listeleri yerine zaman
          var. Zeytin ağacının gölgesi, taş duvarın serinliği ve limandan gelen
          akşam rüzgârı — Vesta House Bademli, hiçbir şeyin eklenmediği,
          yalnızca gürültünün çıkarıldığı bir yer.
        </Reveal>
      </div>
    </section>
  );
}
