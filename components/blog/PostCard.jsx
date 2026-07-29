import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./PostCard.module.css";

export default function PostCard({ post, delay = 0 }) {
  const date = new Date(post.date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Reveal as="article" className={styles.card} delay={delay}>
      <Link href={`/blog/${post.slug}`} className={styles.link}>
        <div className={styles.frame}>
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            fill
            sizes="(max-width: 860px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        {post.category && <span className={styles.category}>{post.category}</span>}
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span>{date}</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <span>{post.readingTime} dk okuma</span>
        </div>
      </Link>
    </Reveal>
  );
}
