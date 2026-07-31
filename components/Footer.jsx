import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer({ settings }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src={settings.logo_path}
            alt={settings.name}
            width={240}
            height={240}
            className={styles.logo}
          />
          <p className={`${styles.tagline} italic-display`}>{settings.tagline}</p>
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
          <p>{settings.address_line1}</p>
          <p>{settings.address_district}</p>
          <p>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
          </p>
          <p>
            <a href={settings.instagram} target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
            {" · "}
            <a href={settings.whatsapp} target="_blank" rel="noreferrer noopener">
              WhatsApp
            </a>
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {new Date().getFullYear()} {settings.name}. {settings.copyright_text}
        </span>
        <span className={styles.sub}>{settings.footer_text}</span>
      </div>
    </footer>
  );
}
