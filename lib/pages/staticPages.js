// Single source of truth for the 8 interior pages managed under
// /admin/pages, the route each one lives at, its Hero fallback, and (Faz 7)
// every body section below the Hero that's also editable from the admin
// panel. Fallback copy mirrors exactly what each page.jsx hardcoded before
// this system existed and what 0012_page_sections.sql /
// 0013_page_body_sections.sql seed into the database -- kept here too so
// the admin screen (and the page itself) can show "what's actually live"
// even before a migration is applied, and so page.jsx never needs its own
// separate copy of the same strings.
export const INTERIOR_PAGES = [
  {
    pageKey: "odalar",
    path: "/odalar",
    label: "Odalar",
    fallback: {
      eyebrow: "Odalar",
      title: "Sade Odalar",
      subtitle: "Taş evin farklı köşelerinde, kendine özgü üç oda.",
      image_path: "/images/oda-yatak-detay.jpg",
      image_alt: "Vesta House Bademli'de bir odanın taş duvarı ve beyaz keten yatağı",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "",
          subtitle: "Her odanın kendine özgü bir görünümü vardır.",
          body: "Odalar birbirinin aynısı değildir; taş duvarlar, sade bir döşeme ve dışarıdan gelen zeytin ve deniz kokusu ortaktır.",
        },
      },
      {
        key: "feature_avlu",
        type: "feature",
        label: "Ortak Alan Bölümü",
        fallback: {
          eyebrow: "Ortak Alan",
          title: "Zeytin ağacının altında bir avlu",
          body: "Odaların dışında bir avlu var: hasır koltuklar, taş zemin ve günün her saatinde değişen bir gölge. Kahvaltı da, akşamüstü sohbeti de burada, ağacın altında geçer.",
          image_path: "/images/avlu-hasir-koltuk.jpg",
          image_alt: "Vesta House Bademli'nin zeytin ağacı gölgesindeki hasır koltuklu avlusu",
          reverse: true,
          tone: "dark",
        },
      },
    ],
  },
  {
    pageKey: "kahvalti",
    path: "/kahvalti",
    label: "Kahvaltı",
    fallback: {
      eyebrow: "Kahvaltı",
      title: "Serpme Köy Kahvaltısı",
      subtitle: "Zeytin ağacının gölgesinde bir Ege kahvaltısı.",
      image_path: "/images/avlu-hasir-koltuk.jpg",
      image_alt: "Vesta House Bademli'nin kahvaltı servisi yapılan avlusu",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "",
          subtitle: "Sabahlar, avluda serpme bir sofrayla başlar.",
          body: "Kahvaltı en az iki kişilik hazırlanır. İçerik mevsime göre değişebilir.",
        },
      },
      {
        key: "pricing_head",
        type: "prose",
        label: "Fiyat Başlığı",
        fallback: {
          eyebrow: "Sofra",
          title: "Kişi Başı 750 ₺",
          body: "Serpme köy kahvaltısı en az iki kişilik servis edilir. İçerik mevsime göre değişiklik gösterebilir.",
        },
      },
    ],
    listItemGroups: [
      { key: "inclusions", label: "Kahvaltı Tabağı İçerikleri", detailLabel: "Not (opsiyonel)" },
      { key: "extras", label: "Ekstra Sıcaklar", detailLabel: "Fiyat" },
      { key: "sicak_icecekler", label: "Sıcak İçecekler", detailLabel: "Fiyat" },
      { key: "soguk_icecekler", label: "Soğuk İçecekler", detailLabel: "Fiyat" },
    ],
  },
  {
    pageKey: "liman-meyhanesi",
    path: "/liman-meyhanesi",
    label: "Liman Meyhanesi",
    fallback: {
      eyebrow: "Alt Marka",
      title: "Liman Meyhanesi",
      subtitle: "Gün batımıyla birlikte, Vesta House'un taş avlusu bir meyhaneye dönüşür.",
      image_path: "/images/avlu-hasir-koltuk.jpg",
      image_alt: "Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "Akşam Ritüeli",
          subtitle: "Vesta House'un misafiri olmasanız da, Liman Meyhanesi'nin kapısı size açık.",
          body: "Günün balığı, Ege usulü mezeler ve ızgaradan sofraya taşınanlar — Liman Meyhanesi, uzun bir akşam yemeği anlayışıyla kuruldu. Menü mevsime göre değişir.",
        },
      },
      {
        key: "feature_sofra",
        type: "feature",
        label: "Sofra Bölümü (Alt Fotoğraf)",
        fallback: {
          eyebrow: "Sofra",
          title: "Ege mezeleri, günün balığı",
          body: "Zeytinyağlılar, deniz ürünleri ve ızgaradan gelen sıcaklar — Liman Meyhanesi'nin sofrası, mevsimine göre şekillenen sade bir Ege mutfağını takip eder. Rakı eşliğinde, uzayan bir akşam için.",
          image_path: "/images/vesta-house-tabela.jpg",
          image_alt: "Vesta House'un taş duvarında akşam ışığında parlayan tabelası",
          reverse: false,
          tone: "light",
        },
      },
      {
        key: "feature_mekan",
        type: "feature",
        label: "Mekân Bölümü (Alt Fotoğraf)",
        fallback: {
          eyebrow: "Mekân",
          title: "Taş duvarlar arasında bir avlu sofrası",
          body: "Masalar, evin taş cephesine ve zeytin ağacına bakar. Gündüz sakin bir avlu, akşamları bir meyhane.",
          image_path: "/images/hero-tas-ev-aksam.jpg",
          image_alt: "Vesta House Bademli'nin akşam ışığında taş cephesi",
          reverse: true,
          tone: "dark",
        },
      },
      {
        key: "closing",
        type: "prose",
        label: "Kapanış Metni",
        fallback: {
          eyebrow: "Bademli, Dikili",
          subtitle: "Rezervasyon için doğrudan ulaşabilirsiniz.",
          body: "Liman Meyhanesi'nde masa sayısı sınırlıdır. Kalabalık akşamlarda yer ayırtmak için iletişim bilgilerimizden bize ulaşmanız yeterli.",
        },
      },
    ],
  },
  {
    pageKey: "bademli",
    path: "/bademli",
    label: "Bademli",
    fallback: {
      eyebrow: "Bademli, Dikili",
      title: "Ege'nin Sakin Köşesi",
      subtitle: "İzmir'in Dikili ilçesine bağlı, zeytin ağaçları ve dar taş sokaklarıyla bilinen küçük bir köy.",
      image_path: "/images/hero-tas-ev-aksam.jpg",
      image_alt: "Bademli'nin dar sokağında Vesta House'un taş cephesi",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "",
          subtitle: "Bademli, kalabalık turizm rotalarının dışında kalan sakin bir köydür.",
          body: "Zeytinlikleri, dar taş sokakları ve komşuluk kültürüyle bilinir. Vesta House, köyün bu dokusuna sadık kalarak var oldu.",
        },
      },
      {
        key: "feature_zeytin",
        type: "feature",
        label: "Zeytin ve Toprak Bölümü",
        fallback: {
          eyebrow: "Zeytin ve Toprak",
          title: "Bir zeytin köyünün ritmi",
          body: "Bademli'nin ekonomisi ve günlük hayatı, yüzyıllardır zeytin üzerine kurulu. Köyün çevresini saran zeytinlikler, hem manzaranın hem sofranın değişmeyen unsuru. Hasat mevsiminde köy, kendi sakin temposunda hareketlenir.",
          image_path: "/images/avlu-hasir-koltuk.jpg",
          image_alt: "Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu",
          reverse: false,
          tone: "light",
        },
      },
      {
        key: "feature_konum",
        type: "feature",
        label: "Konum Bölümü",
        fallback: {
          eyebrow: "Konum",
          title: "Dikili ve çevresi",
          body: "Bademli, İzmir'in Dikili ilçesine bağlıdır. Bölge; antik Pergamon kentiyle bilinen Bergama'ya ve komşu sahil kasabası Ayvalık'a yakınlığıyla da tanınır — sakin bir üsten, Ege'nin tarihini ve kıyısını keşfetmek isteyenler için uygun bir konum sunar.",
          image_path: "/images/oyma-kapi-detay.jpg",
          image_alt: "Vesta House Bademli'nin oyma ahşap giriş kapısı",
          reverse: true,
          tone: "dark",
        },
      },
    ],
  },
  {
    pageKey: "hakkimizda",
    path: "/hakkimizda",
    label: "Hakkımızda",
    fallback: {
      eyebrow: "Hakkımızda",
      title: "Evin Hikâyesi",
      subtitle: "Bademli'de bir taş evin, aslına sadık kalınarak yeniden kullanılabilir hâle getirilme hikâyesi.",
      image_path: "/images/oyma-kapi-detay.jpg",
      image_alt: "Vesta House Bademli'nin oyma ahşap giriş kapısı",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "",
          subtitle: "Bu ev yıkılıp yeniden yapılmadı; olduğu gibi korunarak onarıldı.",
          body: "Bademli'nin köy içinde, dar bir sokakta duran bu taş ev, aslına en az müdahaleyle bugünkü hâline getirildi. Taş duvarlar sıvanmadı, yalnızca temizlendi. Ahşap kapılar değiştirilmedi, yalnızca onarıldı.",
        },
      },
      {
        key: "feature_yeniden_dogus",
        type: "feature",
        label: "Yeniden Doğuş Bölümü",
        fallback: {
          eyebrow: "Yeniden Doğuş",
          title: "Aslına Sadık Kalarak",
          body: "Yeni eklenen aydınlatma, mobilya ve tekstil, evin genel görünümüyle uyumlu seçildi. Amaç, evin özgün hâlini korumaktı.",
          image_path: "/images/avlu-hasir-koltuk.jpg",
          image_alt: "Vesta House Bademli'nin zeytin ağacı gölgesindeki avlusu",
          reverse: false,
          tone: "light",
        },
      },
      {
        key: "feature_karakter",
        type: "feature",
        label: "Evin Karakteri Bölümü",
        fallback: {
          eyebrow: "Evin Karakteri",
          title: "Taş, ahşap ve sadelik",
          body: "Taş duvarlar, ahşap kapılar ve sade bir avlu. Vesta House Bademli, küçük ölçekli ve gösterişsiz bir yapıdır.",
          image_path: "/images/oda-kilim-sandalye.jpg",
          image_alt: "Vesta House Bademli'de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi",
          reverse: true,
          tone: "dark",
        },
      },
      {
        key: "closing",
        type: "prose",
        label: "Kapanış Metni",
        fallback: {
          eyebrow: "Bugün",
          subtitle: "Vesta House Bademli, bugün misafirlerini bu taş evde ağırlıyor.",
          body: "Ev sahibi değişti, evin karakteri aynı kaldı. Her konuk, kısa bir süre için de olsa bu evin bir parçası oluyor.",
        },
      },
    ],
  },
  {
    pageKey: "iletisim",
    path: "/iletisim",
    label: "İletişim",
    fallback: {
      eyebrow: "İletişim",
      title: "Bize Ulaşın",
      subtitle: "Bademli'ye hoş geldiniz. Sorularınız için doğrudan yazabilir ya da arayabilirsiniz.",
      image_path: "/images/oyma-kapi-detay.jpg",
      image_alt: "Vesta House Bademli'nin oyma ahşap kapısı",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Konum Metni",
        fallback: {
          eyebrow: "Konum",
          subtitle: "",
          body: "Vesta House Bademli, Bademli Mahallesi'nde; denize, koylara ve köy merkezine kısa mesafede yer alır.",
        },
      },
    ],
  },
  {
    pageKey: "galeri",
    path: "/galeri",
    label: "Galeri",
    fallback: {
      eyebrow: "Galeri",
      title: "Karelerle Vesta House",
      subtitle: "Taş, ahşap ve zeytin — evin kendi diliyle anlattıkları.",
      image_path: "/images/oda-kilim-sandalye.jpg",
      image_alt: "Vesta House Bademli'de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi",
    },
    sections: [
      {
        key: "intro",
        type: "prose",
        label: "Giriş Metni",
        fallback: {
          eyebrow: "",
          subtitle: "",
          body: "Aşağıdaki kareler, stüdyo ışığı olmadan, evin kendi gerçek hâliyle çekildi. Herhangi bir görsele tıklayarak büyütebilirsiniz.",
        },
      },
    ],
    gallery: true,
  },
  {
    pageKey: "blog",
    path: "/blog",
    label: "Blog",
    fallback: {
      eyebrow: "Blog",
      title: "Taş Evin Günlüğü",
      subtitle: "Dikili ve Bademli üzerine yazılar: gezi notları, Ege mutfağı ve Vesta House'un günlük ritmi.",
      image_path: "/images/tas-duvar-oyma-pencere.jpg",
      image_alt: "Vesta House Bademli'nin taş duvarı ve oyma ahşap pencere detayı",
    },
    sections: [],
  },
];

export function getInteriorPage(pageKey) {
  return INTERIOR_PAGES.find((p) => p.pageKey === pageKey) || null;
}

export function getPageBodySection(pageKey, sectionKey) {
  const page = getInteriorPage(pageKey);
  return page?.sections.find((s) => s.key === sectionKey) || null;
}
