import { Cormorant_Garamond, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings/queries";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const title = `${settings.name} | ${settings.tagline}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "Vesta House Bademli",
      "Bademli butik otel",
      "Dikili taş otel",
      "Liman Meyhanesi",
      "Ege butik otel",
      "Dikili konaklama",
    ],
    authors: [{ name: settings.name }],
    alternates: {
      types: {
        "application/rss+xml": `${siteConfig.url}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: settings.name,
      title,
      description: siteConfig.description,
      images: [
        {
          url: "/images/hero-tas-ev-aksam.jpg",
          width: 2048,
          height: 1536,
          alt: settings.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: siteConfig.description,
      images: ["/images/hero-tas-ev-aksam.jpg"],
    },
    icons: {
      icon: settings.favicon_path,
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: settings.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/hero-tas-ev-aksam.jpg`,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_line1,
      addressLocality: "Dikili",
      addressRegion: "İzmir",
      addressCountry: "TR",
    },
    sameAs: [settings.instagram],
  };

  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Ana içeriğe geç
        </a>
        <MotionConfig reducedMotion="user">
          <Navbar settings={settings} />
          <main id="main-content">{children}</main>
          <Footer settings={settings} />
        </MotionConfig>
      </body>
    </html>
  );
}
