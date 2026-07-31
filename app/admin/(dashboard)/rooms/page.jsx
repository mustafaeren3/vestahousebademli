import RoomsEditor from "./RoomsEditor";
import { getAdminRooms } from "@/lib/rooms/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Odalar" };

export default async function AdminRoomsPage() {
  let rooms = [];
  let dbError = null;

  try {
    rooms = await getAdminRooms();
  } catch (err) {
    dbError = err;
  }

  if (dbError) {
    return (
      <div className="admin-error">
        Veritabanına bağlanılamadı. <code>supabase/migrations/0005_rooms_schema.sql</code>{" "}
        dosyasının uygulandığından emin olun.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Odalar Yönetimi
      </h2>
      <RoomsEditor rooms={rooms} />
    </div>
  );
}
