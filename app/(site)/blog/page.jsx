import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogSearch from "@/components/blog/BlogSearch";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";

export async function generateMetadata() {
  const seoRow = await getSeoPage("blog");
  return buildPageMetadata({
    seoRow,
    path: "/blog",
    fallbackTitle: "Blog",
    fallbackDescription:
      "Dikili ve Bademli üzerine yazılar: gezi rehberleri, Ege mutfağı, zeytin hasadı ve Vesta House Bademli'den notlar.",
    fallbackImage: "/images/tas-duvar-oyma-pencere.jpg",
  });
}

export default async function BlogPage() {
  const [allPosts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
  ]);
  const posts = allPosts.map(({ html, faq, seoTitle, seoDescription, ...rest }) => rest);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Taş Evin Günlüğü"
        subtitle="Dikili ve Bademli üzerine yazılar: gezi notları, Ege mutfağı ve Vesta House'un günlük ritmi."
        image="/images/tas-duvar-oyma-pencere.jpg"
        imageAlt="Vesta House Bademli'nin taş duvar ve oyma ahşap pencere detayı"
        height="46vh"
      />

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

      <section className="section section--tight">
        <div className="container">
          <BlogSearch posts={posts} categories={categories} tags={tags} />
        </div>
      </section>
    </>
  );
}
