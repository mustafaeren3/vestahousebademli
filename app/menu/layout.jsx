import { Cormorant_Garamond, Inter } from "next/font/google";
import "./menu.css";
import ServiceWorkerRegister from "@/components/menu/ServiceWorkerRegister";
import { siteConfig } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-menu-display",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-menu-body",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Menü | Vesta House Bademli",
  description: "Vesta House Bademli ve Liman Meyhanesi dijital menüsü.",
  manifest: "/menu/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vesta Menü",
  },
  icons: {
    icon: "/menu/icon-192.png",
    apple: "/menu/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/menu`,
    languages: {
      tr: `${siteConfig.url}/menu?lang=tr`,
      en: `${siteConfig.url}/menu?lang=en`,
      de: `${siteConfig.url}/menu?lang=de`,
      el: `${siteConfig.url}/menu?lang=el`,
    },
  },
};

export const viewport = {
  themeColor: "#6f7450",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function MenuLayout({ children }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
