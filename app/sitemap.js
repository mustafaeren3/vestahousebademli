import { siteConfig } from "@/lib/site";

export default function sitemap() {
  const routes = [
    "",
    "/hakkimizda",
    "/odalar",
    "/kahvalti",
    "/liman-meyhanesi",
    "/menu",
    "/galeri",
    "/bademli",
    "/iletisim",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
