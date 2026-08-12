import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionCta, { sectionCtaVisible } from "@/components/SectionCta";
import styles from "./ClosingCta.module.css";

export default function ClosingCta({ section }) {
  return (
    <section className={styles.closing}>
      <Image
        src={section.image_path}
        alt={section.image_alt}
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.scrim} />

      <div className={`container ${styles.content}`}>
        <Reveal>
          <span className={`eyebrow ${styles.eyebrowOnDark}`}>{section.eyebrow}</span>
        </Reveal>
        <Reveal delay={1} as="p" className={`${styles.quote} italic-display`}>
          {section.body}
        </Reveal>
        {sectionCtaVisible(section) && (
          <Reveal delay={2}>
            <SectionCta
              href={section.cta_href}
              label={section.cta_label}
              ariaLabel={section.cta_aria_label}
              isExternal={section.cta_is_external}
              targetBlank={section.cta_target_blank}
              active={section.cta_active}
              className="btn btn--on-dark"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}
