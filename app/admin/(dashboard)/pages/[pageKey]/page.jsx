import { notFound } from "next/navigation";
import { getPageSection } from "@/lib/pages/queries";
import { getInteriorPage } from "@/lib/pages/staticPages";
import { getMediaLibrary } from "@/lib/media/queries";
import PageHeroEditor from "@/components/admin/pages/PageHeroEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sayfa Düzenle" };

export default async function AdminPageEditPage({ params }) {
  const page = getInteriorPage(params.pageKey);
  if (!page) notFound();

  const [hero, mediaLibrary] = await Promise.all([
    getPageSection(page.pageKey, "hero"),
    getMediaLibrary().catch(() => []),
  ]);

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Sayfalar — {page.label}
      </h2>
      <PageHeroEditor page={page} hero={hero} mediaLibrary={mediaLibrary} />
    </div>
  );
}
