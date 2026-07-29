import Reveal from "@/components/Reveal";
import PostGrid from "./PostGrid";

export default function RelatedPosts({ posts, title = "İlgili Yazılar" }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="section section--tight">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Devamı</span>
          <h2 className="heading-lg" style={{ marginTop: 18, marginBottom: 40 }}>
            {title}
          </h2>
        </Reveal>
        <PostGrid posts={posts} />
      </div>
    </section>
  );
}
