import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src="/images/vesta-logo-full.png"
            alt={siteConfig.name}
            width={240}
            height={240}
            className={styles.logo}
          />
          <p className={`${styles.tagline} italic-display`}>{siteConfig.tagline}</p>
        </div>

        <nav className={styles.navCol} aria-label="Alt menü">
          <span className={styles.heading}>Sayfalar</span>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.contact}>
          <span className={styles.heading}>İletişim</span>
          <p>{siteConfig.address.line1}</p>
          <p>{siteConfig.address.district}</p>
          <p>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>
              {siteConfig.contact.phone}
            </a>
          </p>
          <p>
            <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
            {" · "}
            <a href={siteConfig.contact.whatsapp} target="_blank" rel="noreferrer noopener">
              WhatsApp
            </a>
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
        </span>
        <span className={styles.sub}>{siteConfig.subBrand}</span>
      </div>
    </footer>
  );
}
