import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostGrid from "@/components/blog/PostGrid";
import { getAllCategories, getPostsByCategory } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const category = getAllCategories().find((c) => c.slug === params.category);
  if (!category) return {};

  return {
    title: `${category.name} Yazıları`,
    description: `Dikili ve Bademli üzerine "${category.name}" kategorisindeki blog yazıları.`,
    alternates: { canonical: `${siteConfig.url}/blog/kategori/${category.slug}` },
  };
}

export default function CategoryPage({ params }) {
  const category = getAllCategories().find((c) => c.slug === params.category);
  if (!category) notFound();

  const posts = getPostsByCategory(params.category).map(
    ({ html, faq, seoTitle, seoDescription, ...rest }) => rest
  );

  return (
    <>
      <PageHero
        eyebrow="Kategori"
        title={category.name}
        subtitle={`${category.name} kategorisindeki tüm yazılar.`}
        image="/images/tas-duvar-oyma-pencere.jpg"
        imageAlt="Vesta House Bademli'nin taş duvar ve oyma ahşap pencere detayı"
        height="40vh"
      />

      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: category.name, href: `/blog/kategori/${category.slug}` },
        ]}
      />

      <section className="section section--tight">
        <div className="container">
          <PostGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
