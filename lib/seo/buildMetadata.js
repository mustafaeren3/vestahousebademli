import { siteConfig } from "@/lib/site";
import { seoImageUrl } from "./imageUrl";
import { withBrandSuffix } from "./suggest";

// Builds a Next.js Metadata object for one page from its seo_pages (or
// rooms/blog_posts) SEO row layered over the page's own hardcoded
// fallback. Every field falls back independently, so a partially-filled
// SEO row -- or no row at all, e.g. before the Faz 5 migration is applied
// -- never loses what the page already had.
//
// `titleMode: "absolute"` is only for the home page: its fallback title is
// already the full "Vesta House Bademli | <tagline>" string, and the root
// layout's title template would otherwise append " | Vesta House Bademli"
// a second time. Every other page uses the default "template" mode, which
// lets that template add the brand suffix exactly once.
export function buildPageMetadata({
  seoRow,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  titleMode = "template",
}) {
  const title = seoRow?.seo_title || fallbackTitle;
  const description = seoRow?.meta_description || fallbackDescription;
  const canonical = seoRow?.canonical_url || `${siteConfig.url}${path}`;
  const robotsIndex = seoRow?.robots_index !== false;
  const robotsFollow = seoRow?.robots_follow !== false;

  const ogTitle = seoRow?.og_title || withBrandSuffix(title);
  const ogDescription = seoRow?.og_description || description;
  const ogImageSrc = seoRow?.og_image || fallbackImage;
  const ogImage = seoImageUrl(ogImageSrc);

  const twitterTitle = seoRow?.twitter_title || ogTitle;
  const twitterDescription = seoRow?.twitter_description || ogDescription;
  const twitterImage = seoImageUrl(seoRow?.twitter_image || ogImageSrc);

  return {
    title: titleMode === "absolute" ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: { index: robotsIndex, follow: robotsFollow },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}
