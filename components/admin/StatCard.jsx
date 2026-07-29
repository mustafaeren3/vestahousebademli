import styles from "./StatCard.module.css";

export default function StatCard({ label, value }) {
  return (
    <div className={`admin-card ${styles.card}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
