import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import styles from "./ClosingCta.module.css";

export default function ClosingCta() {
  return (
    <section className={styles.closing}>
      <Image
        src="/images/tas-duvar-oyma-pencere.jpg"
        alt="Vesta House Bademli'nin taş duvarı ve oyma ahşap detayları"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.scrim} />

      <div className={`container ${styles.content}`}>
        <Reveal>
          <span className={`eyebrow ${styles.eyebrowOnDark}`}>Bademli, Dikili</span>
        </Reveal>
        <Reveal delay={1} as="p" className={`${styles.quote} italic-display`}>
          Bademli&apos;de taş bir ev, sizi bekliyor.
        </Reveal>
        <Reveal delay={2}>
          <Link href="/iletisim" className="btn btn--on-dark">
            Konumu Görün
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
