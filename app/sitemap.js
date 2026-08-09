import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { getRooms } from "@/lib/rooms/queries";
import { siteConfig } from "@/lib/site";

export default async function sitemap() {
  const routes = [
    "",
    "/hakkimizda",
    "/odalar",
    "/kahvalti",
    "/liman-meyhanesi",
    "/menu",
    "/galeri",
    "/bademli",
    "/blog",
    "/iletisim",
  ];

  const staticEntries = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const postEntries = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryEntries = getAllCategories().map((c) => ({
    url: `${siteConfig.url}/blog/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const tagEntries = getAllTags().map((t) => ({
    url: `${siteConfig.url}/blog/etiket/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const rooms = await getRooms();
  const roomEntries = rooms
    .filter((room) => room.slug)
    .map((room) => ({
      url: `${siteConfig.url}/odalar/${room.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticEntries, ...postEntries, ...categoryEntries, ...tagEntries, ...roomEntries];
}
