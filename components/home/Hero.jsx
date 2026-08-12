import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionCta, { sectionCtaVisible } from "@/components/SectionCta";
import styles from "./Hero.module.css";

export default function Hero({ section }) {
  return (
    <section className={styles.hero}>
      <Image
        src={section.image_path}
        alt={section.image_alt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.scrim} />

      <div className={`container ${styles.content}`}>
        <Reveal>
          <span className={`eyebrow ${styles.eyebrowDark}`}>{section.eyebrow}</span>
        </Reveal>
        <Reveal delay={1}>
          <h1 className={styles.title}>
            {section.title}{" "}
            <span className={`${styles.titleSub} italic-display`}>{section.subtitle}</span>
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className={styles.tagline}>{section.body}</p>
        </Reveal>
        {sectionCtaVisible(section) && (
          <Reveal delay={3}>
            <SectionCta
              href={section.cta_href}
              label={section.cta_label}
              ariaLabel={section.cta_aria_label}
              isExternal={section.cta_is_external}
              targetBlank={section.cta_target_blank}
              active={section.cta_active}
              className="btn btn--on-dark"
              style={{ marginTop: 8 }}
            />
          </Reveal>
        )}
      </div>

      <Reveal delay={4} className={styles.cueWrap}>
        <div className={styles.cue} aria-hidden="true">
          <span />
        </div>
      </Reveal>
    </section>
  );
}
