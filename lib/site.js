export const siteConfig = {
  name: "Vesta House Bademli",
  shortName: "Vesta House",
  subBrand: "Liman Meyhanesi",
  tagline: "Bademli'de taş bir ev",
  description:
    "Bademli, Dikili'de taş bir ev. Vesta House Bademli; sade odalar, bir avlu ve Liman Meyhanesi'nin akşam sofrasını bir araya getiriyor.",
  // Production apex domain 308-redirects to www (confirmed via curl -I
  // against both hosts) -- this must be the actual serving host, not the
  // apex, or every canonical/OG/sitemap URL points at a redirecting URL.
  url: "https://www.vestahousebademli.com",
  locale: "tr_TR",
  address: {
    line1: "Bademli Mahallesi, 1. Sokak No:133",
    district: "Dikili / İzmir",
    country: "Türkiye",
  },
  contact: {
    phone: "0553 898 59 82",
    email: "info@vestahousebademli.com",
    whatsapp: "https://wa.me/905538985982",
    instagram: "https://instagram.com/vestahousebademli",
  },
  nav: [
    { href: "/", label: "Anasayfa" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/odalar", label: "Odalar" },
    { href: "/kahvalti", label: "Kahvaltı" },
    { href: "/liman-meyhanesi", label: "Liman Meyhanesi" },
    { href: "/menu", label: "QR Menü" },
    { href: "/galeri", label: "Galeri" },
    { href: "/bademli", label: "Bademli" },
    { href: "/blog", label: "Blog" },
    { href: "/iletisim", label: "İletişim" },
  ],
};
