import Link from "next/link";
import Reveal from "@/components/Reveal";
import PostGrid from "@/components/blog/PostGrid";
import { getAllPosts } from "@/lib/blog";
import styles from "./BlogTeaser.module.css";

export default function BlogTeaser() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map(({ html, faq, seoTitle, seoDescription, ...rest }) => rest);

  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className={styles.head}>
          <Reveal>
            <span className="eyebrow">Blog</span>
            <h2 className="heading-lg" style={{ marginTop: 18 }}>
              Taş Evin Günlüğünden
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <Link href="/blog" className="btn btn--ghost">
              Tüm Yazılar
            </Link>
          </Reveal>
        </div>

        <div className={styles.grid}>
          <PostGrid posts={posts} />
        </div>
      </div>
    </section>
  );
}
