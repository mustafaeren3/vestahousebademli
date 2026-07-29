import LoginForm from "./LoginForm";
import styles from "./page.module.css";

export const metadata = { title: "Giriş" };

export default function AdminLoginPage() {
  return (
    <div className={styles.wrap}>
      <div className={`admin-card ${styles.card}`}>
        <p className={styles.brand}>Vesta House Bademli</p>
        <p className={styles.subtitle}>Yönetim Paneli</p>
        <LoginForm />
      </div>
    </div>
  );
}
