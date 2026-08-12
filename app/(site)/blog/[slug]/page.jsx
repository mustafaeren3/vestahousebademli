import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleBody from "@/components/blog/ArticleBody";
import FaqSection from "@/components/blog/FaqSection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  categorySlug,
  tagSlug,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = `${siteConfig.url}${post.coverImage}`;

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle,
      description: post.seoDescription,
      publishedTime: post.date,
      images: [{ url: imageUrl, width: 1200, height: 800, alt: post.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const date = new Date(post.date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const url = `${siteConfig.url}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteConfig.url}${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/vesta-mark.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const faqJsonLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <section className={styles.header}>
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className={styles.scrim} />
        <div className={`container ${styles.headerContent}`}>
          <Reveal>
            <span className={`eyebrow ${styles.eyebrowOnDark}`}>{post.category}</span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className={`heading-xl ${styles.title}`}>{post.title}</h1>
          </Reveal>
          <Reveal delay={2}>
            <div className={styles.meta}>
              <span>{date}</span>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
              <span>{post.readingTime} dk okuma</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.category, href: `/blog/kategori/${categorySlug(post.category)}` },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <section className="section">
        <div className="container">
          <ArticleBody html={post.html} />

          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/etiket/${tagSlug(tag)}`} className={styles.tag}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <FaqSection items={post.faq} />
      <RelatedPosts posts={related} />
    </>
  );
}
