import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { getDashboardStats, getRecentUpdates } from "@/lib/menu/queries";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default async function AdminDashboardPage() {
  let stats = null;
  let updates = [];
  let dbError = null;

  try {
    [stats, updates] = await Promise.all([getDashboardStats(), getRecentUpdates(8)]);
  } catch (err) {
    dbError = err;
  }

  if (dbError) {
    return (
      <div className="admin-error">
        Veritabanına bağlanılamadı. <code>.env.local</code> dosyasında Supabase
        bilgilerinin doğru olduğundan ve <code>supabase/migrations</code> içindeki
        şemanın uygulandığından emin olun.
      </div>
    );
  }

  return (
    <div>
      <div className={styles.statGrid}>
        <StatCard label="Kategori" value={stats.categoryCount} />
        <StatCard label="Ürün" value={stats.productCount} />
        <StatCard label="Yayında" value={stats.activeProductCount} />
        <StatCard label="Gizli" value={stats.inactiveProductCount} />
      </div>

      <h2 className={styles.sectionTitle}>Son Güncellemeler</h2>
      <div className="admin-card">
        {updates.length === 0 ? (
          <p className={styles.empty}>Henüz güncelleme yok.</p>
        ) : (
          updates.map((update) => (
            <div key={update.id} className={styles.updateRow}>
              <span className={styles.updateName}>{update.name}</span>
              <span className={styles.updateMeta}>
                <span
                  className={`${styles.badge} ${
                    update.active ? styles.badgeActive : styles.badgeInactive
                  }`}
                >
                  {update.active ? "Yayında" : "Gizli"}
                </span>
                {timeAgo(update.updatedAt)}
              </span>
            </div>
          ))
        )}
      </div>

      <p style={{ marginTop: 28 }}>
        <Link href="/admin/menu" className="admin-btn admin-btn--primary">
          Menüyü Düzenle
        </Link>
      </p>
    </div>
  );
}
