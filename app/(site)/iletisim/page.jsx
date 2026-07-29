import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { IconPin, IconPhone, IconMail } from "@/components/icons";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: "İletişim",
  description:
    "Vesta House Bademli'ye ulaşın: Bademli Mahallesi, Dikili / İzmir. Telefon, e-posta, WhatsApp ve Instagram üzerinden bize yazabilirsiniz.",
  alternates: { canonical: `${siteConfig.url}/iletisim` },
};

const mapQuery = encodeURIComponent(
  `${siteConfig.address.line1}, ${siteConfig.address.district}`
);

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
          <div className={styles.grid}>
            <div>
              <Reveal>
                <span className="eyebrow">Konum &amp; İletişim</span>
                <h2 className="heading-lg" style={{ marginTop: 18 }}>
                  Bademli, Dikili
                </h2>
              </Reveal>

              <div className={styles.infoList}>
                <Reveal delay={1} className={styles.infoRow}>
                  <IconPin className={styles.infoIcon} />
                  <div>
                    <div className={styles.infoLabel}>Adres</div>
                    <div className={styles.infoValue}>
                      {siteConfig.address.line1}
                      <br />
                      {siteConfig.address.district}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={2} className={styles.infoRow}>
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

                <Reveal delay={3} className={styles.infoRow}>
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

              <Reveal delay={4}>
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

            <Reveal delay={1} className={styles.mapFrame}>
              <iframe
                title="Vesta House Bademli konumu"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
