"use client";

import { useState } from "react";
import PageHeroEditor from "./PageHeroEditor";
import PageSectionForm from "./PageSectionForm";
import PageGalleryEditor from "./PageGalleryEditor";
import PageListItemsEditor from "./PageListItemsEditor";

// Faz 7: tabbed editor for one interior page -- Hero (Faz 6, unchanged)
// plus every body section declared in that page's staticPages.js config,
// plus a Galeri tab (pages with `gallery: true`) and a Fiyat Listesi tab
// (pages with `listItemGroups`). Mirrors
// app/admin/(dashboard)/homepage/HomeManager.jsx's tab-switching shape.
export default function PageManager({ page, hero, sections, mediaLibrary, galleryImages, listItems }) {
  const tabs = [
    { key: "hero", label: "Üst Alan (Hero)" },
    ...page.sections.map((s) => ({ key: s.key, label: s.label })),
    ...(page.gallery ? [{ key: "__gallery", label: "Galeri" }] : []),
    ...(page.listItemGroups ? [{ key: "__pricing", label: "Fiyat Listesi" }] : []),
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div>
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className="admin-tab"
            data-active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "hero" && <PageHeroEditor page={page} hero={hero} mediaLibrary={mediaLibrary} />}

      {page.sections.map(
        (sectionDef) =>
          activeTab === sectionDef.key && (
            <PageSectionForm
              key={sectionDef.key}
              pageKey={page.pageKey}
              sectionDef={sectionDef}
              section={sections[sectionDef.key]}
              mediaLibrary={mediaLibrary}
            />
          )
      )}

      {activeTab === "__gallery" && (
        <div className="admin-card" style={{ padding: 24 }}>
          <PageGalleryEditor pageKey={page.pageKey} images={galleryImages} />
        </div>
      )}

      {activeTab === "__pricing" && (
        <div className="admin-card" style={{ padding: 24 }}>
          {page.listItemGroups.map((group) => (
            <div key={group.key} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>{group.label}</h3>
              <PageListItemsEditor
                pageKey={page.pageKey}
                groupKey={group.key}
                detailLabel={group.detailLabel}
                items={listItems[group.key] || []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
