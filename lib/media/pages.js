// Fixed list of public routes a media library image can be linked to, used
// by the admin "bağlı olduğu sayfa" picker and by SEO suggestion text.
export const MEDIA_LINKABLE_PAGES = [
  { value: "/", label: "Anasayfa" },
  { value: "/hakkimizda", label: "Hakkımızda" },
  { value: "/odalar", label: "Odalar" },
  { value: "/kahvalti", label: "Kahvaltı" },
  { value: "/liman-meyhanesi", label: "Liman Meyhanesi" },
  { value: "/galeri", label: "Galeri" },
  { value: "/bademli", label: "Bademli" },
  { value: "/iletisim", label: "İletişim" },
  { value: "/blog", label: "Blog" },
  { value: "/menu", label: "QR Menü" },
];

export function pageLabelForPath(path) {
  return MEDIA_LINKABLE_PAGES.find((p) => p.value === path)?.label || "";
}
