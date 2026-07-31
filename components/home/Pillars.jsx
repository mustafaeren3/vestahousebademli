import Reveal from "@/components/Reveal";
import { IconStone, IconOlive, IconMinimal, IconWarmth } from "@/components/icons";
import styles from "./Pillars.module.css";

const ICONS = {
  stone: IconStone,
  olive: IconOlive,
  minimal: IconMinimal,
  warmth: IconWarmth,
};

export default function Pillars({ head, pillars }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">{head.eyebrow}</span>
          <h2 className="heading-lg" style={{ marginTop: 18 }}>
            {head.title}
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {pillars.map((p, i) => {
            const Icon = ICONS[p.icon] || IconStone;
            return (
              <Reveal key={p.id} delay={(i % 4) + 1} className={styles.pillar}>
                <Icon className={styles.icon} />
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.text}>{p.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
