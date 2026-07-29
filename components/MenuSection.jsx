import Reveal from "@/components/Reveal";
import styles from "./MenuSection.module.css";

export default function MenuSection({ title, items, delay = 0 }) {
  return (
    <Reveal as="div" className={styles.section} delay={delay}>
      <h3 className={styles.heading}>{title}</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.name}>
            <div className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.leader} />
              </div>
              {item.price && <span className={styles.price}>{item.price}</span>}
            </div>
            {item.note && <p className={styles.note}>{item.note}</p>}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
