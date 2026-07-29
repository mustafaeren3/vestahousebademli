import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./PageHero.module.css";

export default function PageHero({ eyebrow, title, subtitle, image, imageAlt, height = "60vh" }) {
  return (
    <section className={styles.hero} style={{ "--hero-h": height }}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.scrim} />
      <div className={`container ${styles.content}`}>
        <Reveal>
          {eyebrow && <span className={`eyebrow ${styles.eyebrowOnDark}`}>{eyebrow}</span>}
        </Reveal>
        <Reveal delay={1}>
          <h1 className={`heading-xl ${styles.title}`}>{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={2}>
            <p className={styles.subtitle}>{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
