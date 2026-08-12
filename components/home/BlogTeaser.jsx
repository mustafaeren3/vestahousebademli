import Reveal from "@/components/Reveal";
import PostGrid from "@/components/blog/PostGrid";
import SectionCta, { sectionCtaVisible } from "@/components/SectionCta";
import { getAllPosts } from "@/lib/blog";
import styles from "./BlogTeaser.module.css";

export default async function BlogTeaser({ section }) {
  const allPosts = await getAllPosts();
  const posts = allPosts
    .slice(0, 3)
    .map(({ html, faq, seoTitle, seoDescription, ...rest }) => rest);

  if (posts.length === 0) return null;

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
          <PostGrid posts={posts} />
        </div>
      </div>
    </section>
  );
}
