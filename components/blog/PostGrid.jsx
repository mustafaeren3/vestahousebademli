import PostCard from "./PostCard";
import styles from "./PostGrid.module.css";

export default function PostGrid({ posts, emptyMessage = "Bu kategoride henüz yazı yok." }) {
  if (!posts || posts.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} delay={(i % 4) + 1} />
      ))}
    </div>
  );
}
