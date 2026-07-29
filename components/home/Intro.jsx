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
          Bademli&apos;nin dar bir sokağında duran bu taş ev,{" "}
          <span className="italic-display">aslına sadık kalınarak</span> onarıldı.
        </Reveal>
        <Reveal delay={2} as="p" className={`${styles.body} body-lg`}>
          Vesta House Bademli, taş duvarları ve sade bir avlusu olan küçük bir
          evdir. Deniz ve zeytinliklere yakın, Bademli&apos;nin sakin
          sokaklarında yer alır. Üç oda, özenle hazırlanmıştır.
        </Reveal>
      </div>
    </section>
  );
}
