import { Suspense } from "react";
import MenuApp from "@/components/menu/MenuApp";
import { getMenuForLocale } from "@/lib/menu/queries";
import { LOCALES } from "@/lib/menu/constants";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

function buildMenuJsonLd(menu, locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${siteConfig.name} — Menu`,
    inLanguage: locale,
    url: `${siteConfig.url}/menu?lang=${locale}`,
    hasMenuSection: menu.categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: cat.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description || undefined,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "TRY",
        },
      })),
    })),
  };
}

export default async function MenuPage({ searchParams }) {
  const initialLang = LOCALES.includes(searchParams?.lang) ? searchParams.lang : "tr";

  let initialMenu = null;
  try {
    initialMenu = await getMenuForLocale(initialLang);
  } catch (err) {
    initialMenu = null;
  }

  return (
    <>
      {initialMenu && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildMenuJsonLd(initialMenu, initialLang)),
          }}
        />
      )}
      <Suspense fallback={null}>
        <MenuApp initialMenu={initialMenu} initialLang={initialLang} />
      </Suspense>
    </>
  );
}
