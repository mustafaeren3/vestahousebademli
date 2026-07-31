import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
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
        <Reveal delay={2}>
          <Link href={section.cta_href} className="btn btn--on-dark">
            {section.cta_label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
