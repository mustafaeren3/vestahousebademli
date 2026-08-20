import { notFound } from "next/navigation";
import {
  getPageSection,
  getPageSections,
  getPageGalleryImages,
  getPageListItems,
  getPageIsActive,
} from "@/lib/pages/queries";
import { getInteriorPage } from "@/lib/pages/staticPages";
import { getMediaLibrary } from "@/lib/media/queries";
import PageManager from "@/components/admin/pages/PageManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sayfa Düzenle" };

export default async function AdminPageEditPage({ params }) {
  const page = getInteriorPage(params.pageKey);
  if (!page) notFound();

  const [hero, sections, mediaLibrary, galleryImages, listItems, isActive] = await Promise.all([
    getPageSection(page.pageKey, "hero"),
    getPageSections(page.pageKey),
    getMediaLibrary().catch(() => []),
    page.gallery ? getPageGalleryImages(page.pageKey) : Promise.resolve([]),
    page.listItemGroups ? getPageListItems(page.pageKey) : Promise.resolve({}),
    page.pageActiveToggle ? getPageIsActive(page.pageKey) : Promise.resolve(true),
  ]);

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Sayfalar — {page.label}
      </h2>
      <PageManager
        page={page}
        hero={hero}
        sections={sections}
        mediaLibrary={mediaLibrary}
        galleryImages={galleryImages}
        listItems={listItems}
        isActive={isActive}
      />
    </div>
  );
}
