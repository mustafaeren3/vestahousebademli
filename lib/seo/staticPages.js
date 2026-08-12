// Single source of truth for the 10 static routes managed via seo_pages,
// used by the /admin/seo screens. Fallback title/description/image values
// mirror exactly what each page.jsx passes to buildPageMetadata() and what
// 0011_seo.sql seeds into the database -- kept here too so the admin list
// can show "what's actually live" even before the migration is applied
// (when getAllSeoPages() returns []).
export const STATIC_PAGES = [
  {
    routeKey: "home",
    path: "/",
    label: "Ana Sayfa",
    fallbackTitle: "Vesta House Bademli | Bademli'de taş bir ev",
    fallbackDescription:
      "Bademli, Dikili'de taş bir ev. Vesta House Bademli; sade odalar, bir avlu ve Liman Meyhanesi'nin akşam sofrasını bir araya getiriyor.",
    fallbackImage: "/images/hero-tas-ev-aksam.jpg",
  },
  {
    routeKey: "odalar",
    path: "/odalar",
    label: "Odalar",
    fallbackTitle: "Odalar",
    fallbackDescription:
      "Vesta House Bademli'de taş duvarlı üç oda: Taş Oda, Zeytin Odası ve Avlu Odası. Toplam 3 oda, 6 yatak kapasiteli butik bir taş ev.",
    fallbackImage: "/images/oda-yatak-detay.jpg",
  },
  {
    routeKey: "kahvalti",
    path: "/kahvalti",
    label: "Kahvaltı",
    fallbackTitle: "Kahvaltı",
    fallbackDescription:
      "Vesta House Bademli'de serpme köy kahvaltısı: yöresel peynirler, ev yapımı reçeller ve zeytin ağacının gölgesinde uzun bir sabah.",
    fallbackImage: "/images/avlu-hasir-koltuk.jpg",
  },
  {
    routeKey: "liman-meyhanesi",
    path: "/liman-meyhanesi",
    label: "Liman Meyhanesi",
    fallbackTitle: "Liman Meyhanesi",
    fallbackDescription:
      "Liman Meyhanesi, Vesta House Bademli'nin taş avlusunda akşamları açılan Ege meyhanesi. Günün balığı, mezeler ve uzun bir akşam sofrası.",
    fallbackImage: "/images/vesta-house-tabela.jpg",
  },
  {
    routeKey: "galeri",
    path: "/galeri",
    label: "Galeri",
    fallbackTitle: "Galeri",
    fallbackDescription:
      "Vesta House Bademli'den kareler: taş cephe, oyma ahşap kapılar, zeytin ağacının gölgesindeki avlu ve Liman Meyhanesi.",
    fallbackImage: "/images/oda-kilim-sandalye.jpg",
  },
  {
    routeKey: "bademli",
    path: "/bademli",
    label: "Bademli",
    fallbackTitle: "Bademli",
    fallbackDescription:
      "Bademli: İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve sakin sokaklarıyla bilinen küçük bir Ege köyü.",
    fallbackImage: "/images/hero-tas-ev-aksam.jpg",
  },
  {
    routeKey: "hakkimizda",
    path: "/hakkimizda",
    label: "Hakkımızda",
    fallbackTitle: "Hakkımızda",
    fallbackDescription:
      "Vesta House Bademli'nin hikâyesi: Bademli'de bir taş evin, aslına sadık kalınarak onarılması.",
    fallbackImage: "/images/oyma-kapi-detay.jpg",
  },
  {
    routeKey: "iletisim",
    path: "/iletisim",
    label: "İletişim",
    fallbackTitle: "İletişim",
    fallbackDescription:
      "Vesta House Bademli'ye ulaşın: Bademli Mahallesi, Dikili / İzmir. Telefon, e-posta, WhatsApp ve Instagram üzerinden bize yazabilirsiniz.",
    fallbackImage: "/images/oyma-kapi-detay.jpg",
  },
  {
    routeKey: "blog",
    path: "/blog",
    label: "Blog",
    fallbackTitle: "Blog",
    fallbackDescription:
      "Dikili ve Bademli üzerine yazılar: gezi rehberleri, Ege mutfağı, zeytin hasadı ve Vesta House Bademli'den notlar.",
    fallbackImage: "/images/tas-duvar-oyma-pencere.jpg",
  },
  {
    routeKey: "menu",
    path: "/menu",
    label: "Menü (QR)",
    fallbackTitle: "Menü | Vesta House Bademli",
    fallbackDescription: "Vesta House Bademli ve Liman Meyhanesi dijital menüsü.",
    fallbackImage: "/images/vesta-house-tabela.jpg",
  },
];

export function getStaticPage(routeKey) {
  return STATIC_PAGES.find((p) => p.routeKey === routeKey) || null;
}
