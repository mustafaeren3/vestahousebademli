import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import styles from "./RoomCard.module.css";

export default function RoomCard({ index, name, text, tags, image, imageAlt, href, delay = 0 }) {
  return (
    <Reveal as="article" className={styles.card} delay={delay}>
      <Link href={href} className={styles.frame} aria-label={`${name} odasını incele`}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 860px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </Link>
      <span className={styles.index}>{index}</span>
      <h3 className={styles.title}>
        <Link href={href}>{name}</Link>
      </h3>
      <p className={styles.text}>{text}</p>
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      )}
      <Link href={href} className={styles.cta}>
        Odayı İncele
      </Link>
    </Reveal>
  );
}
