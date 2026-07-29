import PageHero from "@/components/PageHero";
import ProseBlock from "@/components/ProseBlock";
import RoomCard from "@/components/RoomCard";
import FeatureSplit from "@/components/FeatureSplit";
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
    text: "Evin en eski duvarına yaslanan oda. Çıplak taş, ahşap tavan kirişleri ve toprak tonlarında dokularla sade bir sükûnet sunar.",
    tags: ["Taş Duvar", "Ahşap Tavan"],
    image: "/images/oda-genis.jpg",
    imageAlt: "Vesta House'ta taş duvarlı, ahşap kapılı bir oda",
  },
  {
    index: "II",
    name: "Zeytin Odası",
    text: "Kilim dokuları ve eski ahşap mobilyalarla şekillenen, evin hafızasını taşıyan bir köşe. Pencereden avludaki zeytin ağacı görünür.",
    tags: ["Kilim", "Ahşap Mobilya"],
    image: "/images/oda-kilim-sandalye.jpg",
    imageAlt: "Vesta House'ta kilim ve ahşap sandalyelerin bulunduğu oda",
  },
  {
    index: "III",
    name: "Avlu Odası",
    text: "Taş terasa açılan, hasır koltuklarıyla dinginleşen bir oda. Sabahları kahve, akşamları sessizlik için.",
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
        title="Üç Oda, Tek Bir Ritim"
        subtitle="Toplam üç oda, altı yatak — her biri taş evin farklı bir köşesinde, kendi ışığını ve sessizliğini taşır."
        image="/images/oda-yatak-detay.jpg"
        imageAlt="Vesta House Bademli'de bir odanın taş duvarı ve beyaz keten yatağı"
      />

      <ProseBlock
        lead="Oda numarası yok; her biri kendi karakteriyle anılır."
        body="Vesta House'ta odalar standart değildir — her biri evin farklı bir döneminden ya da köşesinden izler taşır. Ortak olan tek şey: taş duvarlar, sade bir dokunuş ve dışarıdan gelen zeytin ve deniz kokusu."
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
        text="Odaların dışında, misafirleri bekleyen bir avlu var: hasır koltuklar, taş zemin ve günün her saatinde değişen bir gölge. Kahvaltı da, akşamüstü sohbeti de burada, ağacın altında geçer."
        image="/images/avlu-hasir-koltuk.jpg"
        imageAlt="Vesta House Bademli'nin zeytin ağacı gölgesindeki hasır koltuklu avlusu"
        reverse
        tone="dark"
      />
    </>
  );
}
