import Reveal from "@/components/Reveal";
import styles from "./Intro.module.css";

export default function Intro({ section }) {
  return (
    <section className="section section--tight">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <span className="eyebrow">{section.eyebrow}</span>
        </Reveal>
        <Reveal delay={1} as="p" className={styles.lead}>
          {section.subtitle}
        </Reveal>
        <Reveal delay={2} as="p" className={`${styles.body} body-lg`}>
          {section.body}
        </Reveal>
      </div>
    </section>
  );
}
