import MenuManager from "@/components/admin/menu/MenuManager";
import { getAdminMenuData } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Menü Yönetimi" };

export default async function AdminMenuPage() {
  let categories = [];
  let dbError = null;

  try {
    categories = await getAdminMenuData();
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
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Menü Yönetimi
      </h2>
      <MenuManager initialCategories={categories} />
    </div>
  );
}
