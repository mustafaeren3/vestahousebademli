import { Cormorant_Garamond, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

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

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
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
  authors: [{ name: siteConfig.name }],
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/hero-tas-ev-aksam.jpg",
        width: 2048,
        height: 1536,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/hero-tas-ev-aksam.jpg"],
  },
  icons: {
    icon: "/images/vesta-mark.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}/images/hero-tas-ev-aksam.jpg`,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: "Dikili",
    addressRegion: "İzmir",
    addressCountry: "TR",
  },
  sameAs: [siteConfig.contact.instagram],
};

export default function RootLayout({ children }) {
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
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
