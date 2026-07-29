import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostGrid from "@/components/blog/PostGrid";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export function generateMetadata({ params }) {
  const tag = getAllTags().find((t) => t.slug === params.tag);
  if (!tag) return {};

  return {
    title: `#${tag.name} Etiketli Yazılar`,
    description: `Dikili ve Bademli üzerine "#${tag.name}" etiketiyle işaretlenmiş blog yazıları.`,
    alternates: { canonical: `${siteConfig.url}/blog/etiket/${tag.slug}` },
  };
}

export default function TagPage({ params }) {
  const tag = getAllTags().find((t) => t.slug === params.tag);
  if (!tag) notFound();

  const posts = getPostsByTag(params.tag).map(
    ({ html, faq, seoTitle, seoDescription, ...rest }) => rest
  );

  return (
    <>
      <PageHero
        eyebrow="Etiket"
        title={`#${tag.name}`}
        subtitle={`"${tag.name}" etiketiyle işaretlenmiş tüm yazılar.`}
        image="/images/tas-duvar-oyma-pencere.jpg"
        imageAlt="Vesta House Bademli'nin taş duvar ve oyma ahşap pencere detayı"
        height="40vh"
      />

      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: `#${tag.name}`, href: `/blog/etiket/${tag.slug}` },
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
