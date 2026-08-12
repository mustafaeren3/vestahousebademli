import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
import SectionCta, { sectionCtaVisible } from "@/components/SectionCta";
import styles from "./HomeGallery.module.css";

export default function HomeGallery({ section, images }) {
  if (images.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className={styles.head}>
          <Reveal>
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="heading-lg" style={{ marginTop: 18 }}>
              {section.title}
            </h2>
          </Reveal>
          {sectionCtaVisible(section) && (
            <Reveal delay={1}>
              <SectionCta
                href={section.cta_href}
                label={section.cta_label}
                ariaLabel={section.cta_aria_label}
                isExternal={section.cta_is_external}
                targetBlank={section.cta_target_blank}
                active={section.cta_active}
                className="btn btn--ghost"
              />
            </Reveal>
          )}
        </div>

        <div className={styles.grid}>
          <Gallery
            images={images.map((img) => ({
              src: img.image_path,
              alt: img.alt,
              width: img.width,
              height: img.height,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
