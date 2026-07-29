import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero-tas-ev-aksam.jpg"
        alt="Vesta House Bademli'nin akşam ışığında taş cephesi ve zeytin ağacı"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.scrim} />

      <div className={`container ${styles.content}`}>
        <Reveal>
          <span className={`eyebrow ${styles.eyebrowDark}`}>Bademli · Dikili</span>
        </Reveal>
        <Reveal delay={1}>
          <h1 className={styles.title}>
            Vesta House
            <span className={`${styles.titleSub} italic-display`}>Bademli</span>
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className={styles.tagline}>Taş bir evin sessizliğinde, Ege&apos;nin tadında.</p>
        </Reveal>
      </div>

      <Reveal delay={3} className={styles.cueWrap}>
        <div className={styles.cue} aria-hidden="true">
          <span />
        </div>
      </Reveal>
    </section>
  );
}
