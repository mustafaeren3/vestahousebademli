import SiteSettingsForm from "./SiteSettingsForm";
import { getSiteSettings } from "@/lib/settings/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site Ayarları" };

export default async function SiteSettingsPage() {
  let settings = null;
  let dbError = null;

  try {
    settings = await getSiteSettings();
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
        Site Ayarları
      </h2>
      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
