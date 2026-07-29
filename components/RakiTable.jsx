import Reveal from "@/components/Reveal";
import styles from "./RakiTable.module.css";

export default function RakiTable({ title, sizes, brands, delay = 0 }) {
  return (
    <Reveal as="div" delay={delay}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid var(--color-line)" }}>
        {title}
      </h3>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              {brands.map((b) => (
                <th key={b.name}>{b.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizes.map((size, i) => (
              <tr key={size}>
                <th>{size}</th>
                {brands.map((b) => (
                  <td key={b.name}>{b.prices[i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
