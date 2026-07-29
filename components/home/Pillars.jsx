import Reveal from "@/components/Reveal";
import { IconStone, IconOlive, IconMinimal, IconWarmth } from "@/components/icons";
import styles from "./Pillars.module.css";

const pillars = [
  {
    icon: IconStone,
    title: "Taş Ev",
    text: "Bademli'nin yerel taşından örülmüş duvarlar, orijinal hâliyle korundu. Zaman izlerini saklıyoruz.",
  },
  {
    icon: IconOlive,
    title: "Zeytin Ağacı",
    text: "Avludaki yaşlı zeytin, günün her saatinde farklı bir gölge ve farklı bir ışık bırakıyor.",
  },
  {
    icon: IconMinimal,
    title: "Ege Minimalizmi",
    text: "Fazlalıktan arındırılmış bir sadelik. Her nesnenin bir nedeni, her boşluğun bir anlamı var.",
  },
  {
    icon: IconWarmth,
    title: "İçtenlik",
    text: "Küçük bir ev ölçeğinde, gösterişsiz ama özenli bir ağırlama. Konfor, sessizce sunulur.",
  },
];

export default function Pillars() {
  return (
    <section className="section">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Felsefemiz</span>
          <h2 className="heading-lg" style={{ marginTop: 18 }}>
            Dört sade ilke
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 4) + 1} className={styles.pillar}>
              <p.icon className={styles.icon} />
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.text}>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
