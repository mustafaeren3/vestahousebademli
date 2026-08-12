import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogSearch from "@/components/blog/BlogSearch";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection } from "@/lib/pages/queries";
import { getInteriorPage } from "@/lib/pages/staticPages";

const FALLBACK = getInteriorPage("blog").fallback;

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
  const [allPosts, categories, tags, hero] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
    getPageSection("blog", "hero"),
  ]);
  const posts = allPosts.map(({ html, faq, seoTitle, seoDescription, ...rest }) => rest);

  return (
    <>
      {hero?.enabled !== false && (
        <PageHero
          eyebrow={hero?.eyebrow || FALLBACK.eyebrow}
          title={hero?.title || FALLBACK.title}
          subtitle={hero?.subtitle || FALLBACK.subtitle}
          image={hero?.image_path || FALLBACK.image_path}
          imageAlt={hero?.image_alt || FALLBACK.image_alt}
          height="46vh"
        />
      )}

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

      <section className="section section--tight">
        <div className="container">
          <BlogSearch posts={posts} categories={categories} tags={tags} />
        </div>
      </section>
    </>
  );
}
