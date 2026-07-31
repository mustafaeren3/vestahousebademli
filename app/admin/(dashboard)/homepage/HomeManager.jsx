"use client";

import { useState } from "react";
import SectionForm from "./SectionForm";
import PillarsEditor from "./PillarsEditor";
import GalleryEditor from "./GalleryEditor";

const TABS = [
  { key: "hero", label: "Hero", config: { title: true, subtitle: true, body: true, cta: true, image: true } },
  { key: "intro", label: "Giriş", config: { subtitle: true, body: true } },
  { key: "pillars_head", label: "İlkeler", config: { title: true } },
  { key: "rooms", label: "Odalar", config: { title: true, body: true, cta: true, image: true, layout: true } },
  { key: "breakfast", label: "Kahvaltı", config: { title: true, body: true, cta: true, image: true, layout: true } },
  { key: "meyhanesi", label: "Liman Meyhanesi", config: { title: true, body: true, cta: true, image: true, layout: true } },
  { key: "gallery_head", label: "Galeri", config: { title: true, cta: true } },
  { key: "blog_teaser", label: "Blog", config: { title: true, cta: true } },
  { key: "closing_cta", label: "Kapanış", config: { body: true, cta: true, image: true } },
];

export default function HomeManager({ sections, pillars, galleryImages }) {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const activeTabDef = TABS.find((t) => t.key === activeTab);
  const activeSection = sections[activeTab];

  return (
    <div>
      <div className="admin-tabs">
        {TABS.map((tab) => (
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

      <div className="admin-card" style={{ padding: 24, maxWidth: 640 }}>
        <SectionForm key={activeSection.key} section={activeSection} config={activeTabDef.config} />
      </div>

      {activeTab === "pillars_head" && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>İlkeler (4&apos;lü Izgara)</h3>
          <PillarsEditor pillars={pillars} />
        </div>
      )}

      {activeTab === "gallery_head" && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>Galeri Görselleri</h3>
          <GalleryEditor images={galleryImages} />
        </div>
      )}
    </div>
  );
}
