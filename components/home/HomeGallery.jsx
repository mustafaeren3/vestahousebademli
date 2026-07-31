import Link from "next/link";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
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
          <Reveal delay={1}>
            <Link href={section.cta_href} className="btn btn--ghost">
              {section.cta_label}
            </Link>
          </Reveal>
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
