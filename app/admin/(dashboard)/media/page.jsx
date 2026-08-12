import MediaLibraryManager from "@/components/admin/media/MediaLibraryManager";
import { getMediaLibrary } from "@/lib/media/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Medya Kütüphanesi" };

export default async function AdminMediaPage() {
  let media = [];
  let dbError = null;

  try {
    media = await getMediaLibrary();
  } catch (err) {
    dbError = err;
  }

  if (dbError) {
    return (
      <div className="admin-error">
        Veritabanına bağlanılamadı. <code>supabase/migrations/0007_media_library.sql</code>{" "}
        dosyasının uygulandığından emin olun.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Medya Kütüphanesi
      </h2>
      <MediaLibraryManager media={media} />
    </div>
  );
}
