import Reveal from "@/components/Reveal";
import styles from "./FaqSection.module.css";

export default function FaqSection({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section section--tight">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Sıkça Sorulanlar</span>
          <h2 className="heading-lg" style={{ marginTop: 18, marginBottom: 34 }}>
            Merak Edilenler
          </h2>
        </Reveal>
        <div className={styles.list}>
          {items.map((item, i) => (
            <Reveal key={item.q} delay={(i % 4) + 1} as="details" className={styles.item}>
              <summary className={styles.question}>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
