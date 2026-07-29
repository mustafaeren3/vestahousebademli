import Reveal from "@/components/Reveal";
import styles from "./ProseBlock.module.css";

export default function ProseBlock({ eyebrow, lead, body, tight = false }) {
  return (
    <section className={`section ${tight ? "section--tight" : ""}`}>
      <div className={`container ${styles.inner}`}>
        {eyebrow && (
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        {lead && (
          <Reveal delay={1} as="p" className={styles.lead}>
            {lead}
          </Reveal>
        )}
        {body && (
          <Reveal delay={2} as="p" className={`${styles.body} body-lg`}>
            {body}
          </Reveal>
        )}
      </div>
    </section>
  );
}
