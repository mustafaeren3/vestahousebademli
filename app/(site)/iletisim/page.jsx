import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { IconPhone, IconMail } from "@/components/icons";
import { getSiteSettings } from "@/lib/settings/queries";
import { getSeoPage } from "@/lib/seo/queries";
import { buildPageMetadata } from "@/lib/seo/buildMetadata";
import { getPageSection, getPageSections } from "@/lib/pages/queries";
import { getInteriorPage, getPageBodySection } from "@/lib/pages/staticPages";
import styles from "./page.module.css";

const PAGE_KEY = "iletisim";
const FALLBACK = getInteriorPage(PAGE_KEY).fallback;
const F_INTRO = getPageBodySection(PAGE_KEY, "intro").fallback;

export async function generateMetadata() {
  const seoRow = await getSeoPage("iletisim");
  return buildPageMetadata({
    seoRow,
    path: "/iletisim",
    fallbackTitle: "İletişim",
    fallbackDescription:
      "Vesta House Bademli'ye ulaşın: Bademli Mahallesi, Dikili / İzmir. Telefon, e-posta, WhatsApp ve Instagram üzerinden bize yazabilirsiniz.",
    fallbackImage: "/images/oyma-kapi-detay.jpg",
  });
}

export default async function IletisimPage() {
  const [settings, hero, sections] = await Promise.all([
    getSiteSettings(),
    getPageSection(PAGE_KEY, "hero"),
    getPageSections(PAGE_KEY),
  ]);
  const intro = sections.intro;

  return (
    <>
      {hero?.enabled !== false && (
        <PageHero
          eyebrow={hero?.eyebrow || FALLBACK.eyebrow}
          title={hero?.title || FALLBACK.title}
          subtitle={hero?.subtitle || FALLBACK.subtitle}
          image={hero?.image_path || FALLBACK.image_path}
          imageAlt={hero?.image_alt || FALLBACK.image_alt}
          height="46vh"
        />
      )}

      <Breadcrumbs items={[{ label: "İletişim", href: "/iletisim" }]} />

      <section className="section">
        <div className="container">
          <div className={styles.location}>
            <Reveal>
              <span className="eyebrow">{intro?.eyebrow || F_INTRO.eyebrow}</span>
              <p className={`body-lg ${styles.locationText}`}>
                {intro?.body || F_INTRO.body}
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="divider divider--center" />
              <p className={styles.address}>
                {settings.address_line1}
                <br />
                {settings.address_district}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className={styles.contact}>
            <Reveal>
              <span className="eyebrow">İletişim Bilgileri</span>
            </Reveal>

            <div className={styles.infoList}>
              <Reveal delay={1} className={styles.infoRow}>
                <IconPhone className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Telefon</div>
                  <div className={styles.infoValue}>
                    <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                      {settings.phone}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={2} className={styles.infoRow}>
                <IconMail className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>E-posta</div>
                  <div className={styles.infoValue}>
                    <a href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={3}>
              <div className={styles.socials}>
                <a href={settings.whatsapp} target="_blank" rel="noreferrer noopener" className="btn btn--ghost">
                  WhatsApp
                </a>
                <a href={settings.instagram} target="_blank" rel="noreferrer noopener" className="btn btn--ghost">
                  Instagram
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
