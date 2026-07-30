import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { IconPhone, IconMail } from "@/components/icons";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: "İletişim",
  description:
    "Vesta House Bademli'ye ulaşın: Bademli Mahallesi, Dikili / İzmir. Telefon, e-posta, WhatsApp ve Instagram üzerinden bize yazabilirsiniz.",
  alternates: { canonical: `${siteConfig.url}/iletisim` },
};

export default function IletisimPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize Ulaşın"
        subtitle="Bademli'ye hoş geldiniz. Sorularınız için doğrudan yazabilir ya da arayabilirsiniz."
        image="/images/oyma-kapi-detay.jpg"
        imageAlt="Vesta House Bademli'nin oyma ahşap kapısı"
        height="46vh"
      />

      <Breadcrumbs items={[{ label: "İletişim", href: "/iletisim" }]} />

      <section className="section">
        <div className="container">
          <div className={styles.location}>
            <Reveal>
              <span className="eyebrow">Konum</span>
              <p className={`body-lg ${styles.locationText}`}>
                Vesta House Bademli, Bademli Mahallesi&apos;nde; denize, koylara ve
                köy merkezine kısa mesafede yer alır.
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="divider divider--center" />
              <p className={styles.address}>
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.district}
              </p>
            </Reveal>

            <Reveal delay={2}>
              <p className={styles.locationNote}>
                Konum bilgisi rezervasyon sonrasında misafirlerimizle paylaşılır.
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
                    <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={2} className={styles.infoRow}>
                <IconMail className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>E-posta</div>
                  <div className={styles.infoValue}>
                    <a href={`mailto:${siteConfig.contact.email}`}>
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={3}>
              <div className={styles.socials}>
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noreferrer noopener" className="btn btn--ghost">
                  WhatsApp
                </a>
                <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer noopener" className="btn btn--ghost">
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
