import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "./RoomCard.module.css";

export default function RoomCard({ index, name, text, tags, image, imageAlt, delay = 0 }) {
  return (
    <Reveal as="article" className={styles.card} delay={delay}>
      <div className={styles.frame}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 860px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <span className={styles.index}>{index}</span>
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.text}>{text}</p>
      {tags && (
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      )}
    </Reveal>
  );
}
