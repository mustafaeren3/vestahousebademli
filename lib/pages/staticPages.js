// Single source of truth for the 8 interior pages managed under
// /admin/pages, and the route each one lives at. Fallback hero copy
// mirrors exactly what each page.jsx passed to <PageHero /> before this
// system existed and what 0012_page_sections.sql seeds into the database
// -- kept here too so the admin screen (and the page itself) can show
// "what's actually live" even before the migration is applied.
export const INTERIOR_PAGES = [
  {
    pageKey: "odalar",
    path: "/odalar",
    label: "Odalar",
    fallback: {
      eyebrow: "Odalar",
      title: "Sade Odalar",
      subtitle: "Taş evin farklı köşelerinde, kendine özgü üç oda.",
      image_path: "/images/oda-yatak-detay.jpg",
      image_alt: "Vesta House Bademli'de bir odanın taş duvarı ve beyaz keten yatağı",
    },
  },
  {
    pageKey: "kahvalti",
    path: "/kahvalti",
    label: "Kahvaltı",
    fallback: {
      eyebrow: "Kahvaltı",
      title: "Serpme Köy Kahvaltısı",
      subtitle: "Zeytin ağacının gölgesinde bir Ege kahvaltısı.",
      image_path: "/images/avlu-hasir-koltuk.jpg",
      image_alt: "Vesta House Bademli'nin kahvaltı servisi yapılan avlusu",
    },
  },
  {
    pageKey: "liman-meyhanesi",
    path: "/liman-meyhanesi",
    label: "Liman Meyhanesi",
    fallback: {
      eyebrow: "Alt Marka",
      title: "Liman Meyhanesi",
      subtitle: "Gün batımıyla birlikte, Vesta House'un taş avlusu bir meyhaneye dönüşür.",
      image_path: "/images/avlu-hasir-koltuk.jpg",
      image_alt: "Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu",
    },
  },
  {
    pageKey: "bademli",
    path: "/bademli",
    label: "Bademli",
    fallback: {
      eyebrow: "Bademli, Dikili",
      title: "Ege'nin Sakin Köşesi",
      subtitle: "İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve dar taş sokaklarıyla bilinen küçük bir köy.",
      image_path: "/images/hero-tas-ev-aksam.jpg",
      image_alt: "Bademli'nin dar sokağında Vesta House'un taş cephesi",
    },
  },
  {
    pageKey: "hakkimizda",
    path: "/hakkimizda",
    label: "Hakkımızda",
    fallback: {
      eyebrow: "Hakkımızda",
      title: "Evin Hikâyesi",
      subtitle: "Bademli'de bir taş evin, aslına sadık kalınarak yeniden kullanılabilir hâle getirilme hikâyesi.",
      image_path: "/images/oyma-kapi-detay.jpg",
      image_alt: "Vesta House Bademli'nin oyma ahşap giriş kapısı",
    },
  },
  {
    pageKey: "iletisim",
    path: "/iletisim",
    label: "İletişim",
    fallback: {
      eyebrow: "İletişim",
      title: "Bize Ulaşın",
      subtitle: "Bademli'ye hoş geldiniz. Sorularınız için doğrudan yazabilir ya da arayabilirsiniz.",
      image_path: "/images/oyma-kapi-detay.jpg",
      image_alt: "Vesta House Bademli'nin oyma ahşap kapısı",
    },
  },
  {
    pageKey: "galeri",
    path: "/galeri",
    label: "Galeri",
    fallback: {
      eyebrow: "Galeri",
      title: "Karelerle Vesta House",
      subtitle: "Taş, ahşap ve zeytin — evin kendi diliyle anlattıkları.",
      image_path: "/images/oda-kilim-sandalye.jpg",
      image_alt: "Vesta House Bademli'de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi",
    },
  },
  {
    pageKey: "blog",
    path: "/blog",
    label: "Blog",
    fallback: {
      eyebrow: "Blog",
      title: "Taş Evin Günlüğü",
      subtitle: "Dikili ve Bademli üzerine yazılar: gezi notları, Ege mutfağı ve Vesta House'un günlük ritmi.",
      image_path: "/images/tas-duvar-oyma-pencere.jpg",
      image_alt: "Vesta House Bademli'nin taş duvarı ve oyma ahşap pencere detayı",
    },
  },
];

export function getInteriorPage(pageKey) {
  return INTERIOR_PAGES.find((p) => p.pageKey === pageKey) || null;
}
