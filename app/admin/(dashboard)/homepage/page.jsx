import HomeManager from "./HomeManager";
import { getAdminHomeData } from "@/lib/home/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Anasayfa" };

export default async function AdminHomePage() {
  let data = null;
  let dbError = null;

  try {
    data = await getAdminHomeData();
  } catch (err) {
    dbError = err;
  }

  if (dbError) {
    return (
      <div className="admin-error">
        Veritabanına bağlanılamadı. <code>supabase/migrations/0004_cms_schema.sql</code>{" "}
        dosyasının uygulandığından emin olun.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Anasayfa Yönetimi
      </h2>
      <HomeManager
        sections={data.sections}
        pillars={data.pillars}
        galleryImages={data.galleryImages}
      />
    </div>
  );
}
