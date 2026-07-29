import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import styles from "./FeatureSplit.module.css";

export default function FeatureSplit({
  eyebrow,
  title,
  text,
  ctaHref,
  ctaLabel,
  image,
  imageAlt,
  reverse = false,
  tone = "light",
}) {
  return (
    <section className={`section ${tone === "dark" ? styles.splitDark : ""}`}>
      <div className={`container ${styles.inner} ${reverse ? styles.reverse : ""}`}>
        <Reveal as="div" className={styles.frame}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </Reveal>

        <Reveal delay={1} as="div" className={styles.text}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="heading-lg" style={{ marginTop: 18 }}>
            {title}
          </h2>
          <div className="divider" />
          <p className="body-lg">{text}</p>
          {ctaHref && (
            <Link
              href={ctaHref}
              className={`btn ${tone === "dark" ? "btn--on-dark" : "btn--ghost"}`}
              style={{ marginTop: 34 }}
            >
              {ctaLabel}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
