import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import RoomCard from "@/components/RoomCard";
import FeatureSplit from "@/components/FeatureSplit";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteConfig } from "@/lib/site";
import styles from "@/components/RoomsGrid.module.css";

export const metadata = {
  title: "Odalar",
  description:
    "Vesta House Bademli'de taş duvarlı üç oda: Taş Oda, Zeytin Odası ve Avlu Odası. Toplam 3 oda, 6 yatak kapasiteli butik bir taş ev.",
  alternates: { canonical: `${siteConfig.url}/odalar` },
};

const rooms = [
  {
    index: "I",
    name: "Taş Oda",
    text: "Evin taş duvarlarından birine bitişik oda. Çıplak taş duvarlar, ahşap tavan kirişleri ve toprak tonlarında dokular.",
    tags: ["Taş Duvar", "Ahşap Tavan"],
    image: "/images/oda-genis.jpg",
    imageAlt: "Vesta House'ta taş duvarlı, ahşap kapılı bir oda",
  },
  {
    index: "II",
    name: "Zeytin Odası",
    text: "Kilim dokuları ve eski ahşap mobilyalarla döşenmiş bir oda. Pencereden avludaki zeytin ağacı görünür.",
    tags: ["Kilim", "Ahşap Mobilya"],
    image: "/images/oda-kilim-sandalye.jpg",
    imageAlt: "Vesta House'ta kilim ve ahşap sandalyelerin bulunduğu oda",
  },
  {
    index: "III",
    name: "Avlu Odası",
    text: "Taş terasa açılan, hasır koltuklu bir oda. Sabah kahvesi için uygun bir köşe.",
    tags: ["Teras Erişimi", "Doğal Işık"],
    image: "/images/oda-yatak-detay.jpg",
    imageAlt: "Vesta House'ta beyaz keten örtülü bir yatak ve katlanmış havlular",
  },
];

export default function OdalarPage() {
  return (
    <>
      <PageHero
        eyebrow="Odalar"
        title="Sade Odalar"
        subtitle="Taş evin farklı köşelerinde, kendine özgü üç oda."
        image="/images/oda-yatak-detay.jpg"
        imageAlt="Vesta House Bademli'de bir odanın taş duvarı ve beyaz keten yatağı"
      />

      <Breadcrumbs items={[{ label: "Odalar", href: "/odalar" }]} />

      <ProseBlock
        lead="Her odanın kendine özgü bir görünümü vardır."
        body="Odalar birbirinin aynısı değildir; taş duvarlar, sade bir döşeme ve dışarıdan gelen zeytin ve deniz kokusu ortaktır."
      />

      <section className="section section--tight">
        <div className="container">
          <div className={styles.grid}>
            {rooms.map((room, i) => (
              <RoomCard key={room.name} {...room} delay={(i % 4) + 1} />
            ))}
          </div>
        </div>
      </section>

      <FeatureSplit
        eyebrow="Ortak Alan"
        title="Zeytin ağacının altında bir avlu"
        text="Odaların dışında bir avlu var: hasır koltuklar, taş zemin ve günün her saatinde değişen bir gölge. Kahvaltı da, akşamüstü sohbeti de burada, ağacın altında geçer."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki hasır koltuklu avlusu"
        reverse
        tone="dark"
      />
    </>
  );
}
