import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { getRooms } from "@/lib/rooms/queries";
import { getAllSeoPages } from "@/lib/seo/queries";
import { getPageIsActive } from "@/lib/pages/queries";
import { siteConfig } from "@/lib/site";

// Static pages that don't have their own tracked "last changed" timestamp
// yet -- kept here (instead of a fake `new Date()` on every build) so each
// only gets a real lastModified once an admin actually edits it from
// /admin/seo (seo_pages.updated_at), and shows no lastModified at all
// until then.
const STATIC_ROUTES = [
  { routeKey: "kahvalti", path: "/kahvalti" },
  { routeKey: "liman-meyhanesi", path: "/liman-meyhanesi" },
  { routeKey: "galeri", path: "/galeri" },
  { routeKey: "bademli", path: "/bademli" },
  { routeKey: "hakkimizda", path: "/hakkimizda" },
  { routeKey: "iletisim", path: "/iletisim" },
];

export default async function sitemap() {
  const [allPosts, categories, tags, rooms, seoPages, kahvaltiActive] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
    getRooms(),
    getAllSeoPages(),
    getPageIsActive("kahvalti"),
  ]);

  const seoByRouteKey = {};
  for (const row of seoPages) seoByRouteKey[row.route_key] = row;

  const homeEntry = {
    url: siteConfig.url,
    lastModified: seoByRouteKey.home?.updated_at ? new Date(seoByRouteKey.home.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 1,
  };

  const odalarEntry = {
    url: `${siteConfig.url}/odalar`,
    lastModified: seoByRouteKey.odalar?.updated_at
      ? new Date(seoByRouteKey.odalar.updated_at)
      : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  };

  const menuEntry = {
    url: `${siteConfig.url}/menu`,
    lastModified: seoByRouteKey.menu?.updated_at ? new Date(seoByRouteKey.menu.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  };

  const blogIndexEntry = {
    url: `${siteConfig.url}/blog`,
    lastModified: seoByRouteKey.blog?.updated_at ? new Date(seoByRouteKey.blog.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  };

  const staticEntries = STATIC_ROUTES.filter(({ routeKey }) => routeKey !== "kahvalti" || kahvaltiActive).map(
    ({ routeKey, path }) => {
      const row = seoByRouteKey[routeKey];
      return {
        url: `${siteConfig.url}${path}`,
        lastModified: row?.updated_at ? new Date(row.updated_at) : undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      };
    }
  );

  const postEntries = allPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Category/tag pages are derived listings with no single owned timestamp;
  // using the most recently updated post they contain is a real signal
  // (not a fake `now()`), and omitting it entirely would be less useful.
  const categoryEntries = categories.map((c) => {
    const postsIn = allPosts.filter((p) => p.category === c.name);
    const newest = postsIn.reduce(
      (max, p) => (new Date(p.updatedAt) > max ? new Date(p.updatedAt) : max),
      new Date(0)
    );
    return {
      url: `${siteConfig.url}/blog/kategori/${c.slug}`,
      lastModified: postsIn.length > 0 ? newest : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

  const tagEntries = tags.map((t) => {
    const postsIn = allPosts.filter((p) => p.tags.includes(t.name));
    const newest = postsIn.reduce(
      (max, p) => (new Date(p.updatedAt) > max ? new Date(p.updatedAt) : max),
      new Date(0)
    );
    return {
      url: `${siteConfig.url}/blog/etiket/${t.slug}`,
      lastModified: postsIn.length > 0 ? newest : undefined,
      changeFrequency: "monthly",
      priority: 0.4,
    };
  });

  const roomEntries = rooms
    .filter((room) => room.slug)
    .map((room) => ({
      url: `${siteConfig.url}/odalar/${room.slug}`,
      lastModified: room.updated_at ? new Date(room.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    homeEntry,
    odalarEntry,
    ...roomEntries,
    menuEntry,
    ...staticEntries,
    blogIndexEntry,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
}
