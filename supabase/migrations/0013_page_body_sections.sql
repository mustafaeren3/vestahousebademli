-- Faz 7: interior-page BODY content (everything below each page's Hero
-- banner -- the ProseBlock/FeatureSplit text and images that Faz 6 left
-- hard-coded in each page.jsx). Concrete complaint this fixes: the two
-- FeatureSplit images on /liman-meyhanesi ("Sofra", "Mekân") couldn't be
-- changed from the admin panel because they were literal <Image src>
-- strings in the component tree, not database-backed.
--
-- Reuses page_sections (0012_page_sections.sql) rather than a new table --
-- that table is already keyed by (page_key, section_key) specifically so a
-- page can hold more than one row ("the composite key leaves room for a
-- future 'intro'/'closing' row per page without another migration").
-- section_key is 'hero' today; this migration adds 'intro', 'feature_*',
-- 'closing', and (kahvaltı only) 'pricing_head' rows.
--
-- Two columns page_sections doesn't have yet but FeatureSplit needs
-- (reverse / tone, for the "image on the right" / dark-panel look) are
-- added here, matching home_sections' existing reverse/tone columns
-- exactly (same names, same tone check constraint).
--
-- All seed values below are copy-pasted verbatim from each page.jsx's
-- current hardcoded ProseBlock/FeatureSplit props, so applying this
-- migration changes nothing visible until an admin edits a row.

alter table page_sections add column if not exists reverse boolean not null default false;
alter table page_sections add column if not exists tone text not null default 'light' check (tone in ('light', 'dark'));

insert into page_sections (page_key, section_key, eyebrow, title, subtitle, body, image_path, image_alt, reverse, tone) values
  -- Liman Meyhanesi
  ('liman-meyhanesi', 'intro', 'Akşam Ritüeli', '',
   'Vesta House''un misafiri olmasanız da, Liman Meyhanesi''nin kapısı size açık.',
   'Günün balığı, Ege usulü mezeler ve ızgaradan sofraya taşınanlar — Liman Meyhanesi, uzun bir akşam yemeği anlayışıyla kuruldu. Menü mevsime göre değişir.',
   null, '', false, 'light'),
  ('liman-meyhanesi', 'feature_sofra', 'Sofra', 'Ege mezeleri, günün balığı', '',
   'Zeytinyağlılar, deniz ürünleri ve ızgaradan gelen sıcaklar — Liman Meyhanesi''nin sofrası, mevsimine göre şekillenen sade bir Ege mutfağını takip eder. Rakı eşliğinde, uzayan bir akşam için.',
   '/images/vesta-house-tabela.jpg', 'Vesta House''un taş duvarında akşam ışığında parlayan tabelası', false, 'light'),
  ('liman-meyhanesi', 'feature_mekan', 'Mekân', 'Taş duvarlar arasında bir avlu sofrası', '',
   'Masalar, evin taş cephesine ve zeytin ağacına bakar. Gündüz sakin bir avlu, akşamları bir meyhane.',
   '/images/hero-tas-ev-aksam.jpg', 'Vesta House Bademli''nin akşam ışığında taş cephesi', true, 'dark'),
  ('liman-meyhanesi', 'closing', 'Bademli, Dikili', '',
   'Rezervasyon için doğrudan ulaşabilirsiniz.',
   'Liman Meyhanesi''nde masa sayısı sınırlıdır. Kalabalık akşamlarda yer ayırtmak için iletişim bilgilerimizden bize ulaşmanız yeterli.',
   null, '', false, 'light'),

  -- Odalar
  ('odalar', 'intro', '', '',
   'Her odanın kendine özgü bir görünümü vardır.',
   'Odalar birbirinin aynısı değildir; taş duvarlar, sade bir döşeme ve dışarıdan gelen zeytin ve deniz kokusu ortaktır.',
   null, '', false, 'light'),
  ('odalar', 'feature_avlu', 'Ortak Alan', 'Zeytin ağacının altında bir avlu', '',
   'Odaların dışında bir avlu var: hasır koltuklar, taş zemin ve günün her saatinde değişen bir gölge. Kahvaltı da, akşamüstü sohbeti de burada, ağacın altında geçer.',
   '/images/avlu-hasir-koltuk.jpg', 'Vesta House Bademli''nin zeytin ağacı gölgesindeki hasır koltuklu avlusu', true, 'dark'),

  -- Kahvaltı
  ('kahvalti', 'intro', '', '',
   'Sabahlar, avluda serpme bir sofrayla başlar.',
   'Kahvaltı en az iki kişilik hazırlanır. İçerik mevsime göre değişebilir.',
   null, '', false, 'light'),
  ('kahvalti', 'pricing_head', 'Sofra', 'Kişi Başı 750 ₺', '',
   'Serpme köy kahvaltısı en az iki kişilik servis edilir. İçerik mevsime göre değişiklik gösterebilir.',
   null, '', false, 'light'),

  -- Bademli
  ('bademli', 'intro', '', '',
   'Bademli, kalabalık turizm rotalarının dışında kalan sakin bir köydür.',
   'Zeytinlikleri, dar taş sokakları ve komşuluk kültürüyle bilinir. Vesta House, köyün bu dokusuna sadık kalarak var oldu.',
   null, '', false, 'light'),
  ('bademli', 'feature_zeytin', 'Zeytin ve Toprak', 'Bir zeytin köyünün ritmi', '',
   'Bademli''nin ekonomisi ve günlük hayatı, yüzyıllardır zeytin üzerine kurulu. Köyün çevresini saran zeytinlikler, hem manzaranın hem sofranın değişmeyen unsuru. Hasat mevsiminde köy, kendi sakin temposunda hareketlenir.',
   '/images/avlu-hasir-koltuk.jpg', 'Vesta House Bademli''nin zeytin ağacı gölgesindeki avlusu', false, 'light'),
  ('bademli', 'feature_konum', 'Konum', 'Dikili ve çevresi', '',
   'Bademli, İzmir''in Dikili ilçesine bağlıdır. Bölge; antik Pergamon kentiyle bilinen Bergama''ya ve komşu sahil kasabası Ayvalık''a yakınlığıyla da tanınır — sakin bir üsten, Ege''nin tarihini ve kıyısını keşfetmek isteyenler için uygun bir konum sunar.',
   '/images/oyma-kapi-detay.jpg', 'Vesta House Bademli''nin oyma ahşap giriş kapısı', true, 'dark'),

  -- Hakkımızda
  ('hakkimizda', 'intro', '', '',
   'Bu ev yıkılıp yeniden yapılmadı; olduğu gibi korunarak onarıldı.',
   'Bademli''nin köy içinde, dar bir sokakta duran bu taş ev, aslına en az müdahaleyle bugünkü hâline getirildi. Taş duvarlar sıvanmadı, yalnızca temizlendi. Ahşap kapılar değiştirilmedi, yalnızca onarıldı.',
   null, '', false, 'light'),
  ('hakkimizda', 'feature_yeniden_dogus', 'Yeniden Doğuş', 'Aslına Sadık Kalarak', '',
   'Yeni eklenen aydınlatma, mobilya ve tekstil, evin genel görünümüyle uyumlu seçildi. Amaç, evin özgün hâlini korumaktı.',
   '/images/avlu-hasir-koltuk.jpg', 'Vesta House Bademli''nin zeytin ağacı gölgesindeki avlusu', false, 'light'),
  ('hakkimizda', 'feature_karakter', 'Evin Karakteri', 'Taş, ahşap ve sadelik', '',
   'Taş duvarlar, ahşap kapılar ve sade bir avlu. Vesta House Bademli, küçük ölçekli ve gösterişsiz bir yapıdır.',
   '/images/oda-kilim-sandalye.jpg', 'Vesta House Bademli''de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi', true, 'dark'),
  ('hakkimizda', 'closing', 'Bugün', '',
   'Vesta House Bademli, bugün misafirlerini bu taş evde ağırlıyor.',
   'Ev sahibi değişti, evin karakteri aynı kaldı. Her konuk, kısa bir süre için de olsa bu evin bir parçası oluyor.',
   null, '', false, 'light'),

  -- İletişim ("Konum" paragrafı -- adres/telefon/vb zaten site_settings'ten geliyor)
  ('iletisim', 'intro', 'Konum', '', '',
   'Vesta House Bademli, Bademli Mahallesi''nde; denize, koylara ve köy merkezine kısa mesafede yer alır.',
   null, '', false, 'light'),

  -- Galeri (üst tanıtım metni -- görsellerin kendisi page_gallery_images'ta)
  ('galeri', 'intro', '', '', '',
   'Aşağıdaki kareler, stüdyo ışığı olmadan, evin kendi gerçek hâliyle çekildi. Herhangi bir görsele tıklayarak büyütebilirsiniz.',
   null, '', false, 'light')
on conflict (page_key, section_key) do nothing;


-- Galeri sayfasının serbest, eklenebilir/silinebilir/sıralanabilir görsel
-- listesi. Bugüne kadar lib/galeriImages.js içinde sabit bir dizi olarak
-- tutuluyordu (component ile image-sitemap route'u arasında paylaşılsın diye
-- ayrı bir dosyaya çıkarılmıştı, ama admin panelinden hiç yönetilemiyordu).
-- home_gallery_images ile birebir aynı şekil + aynı RLS deseni, sadece
-- page_key kolonu eklenmiş hali -- ileride başka bir iç sayfa da kendi
-- galerisini isterse aynı tablo yeniden kullanılabilir.
create table if not exists page_gallery_images (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  image_path text not null,
  alt text not null default '',
  width integer not null default 1650,
  height integer not null default 2200,
  media_id uuid references media_library(id),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_gallery_images_page_sort
  on page_gallery_images(page_key, sort_order);

alter table page_gallery_images enable row level security;

drop policy if exists "public read page gallery images" on page_gallery_images;
create policy "public read page gallery images" on page_gallery_images
  for select using (true);
drop policy if exists "admin write page gallery images" on page_gallery_images;
create policy "admin write page gallery images" on page_gallery_images
  for all using (is_admin()) with check (is_admin());

grant select on page_gallery_images to anon, authenticated;
grant insert, update, delete on page_gallery_images to authenticated;
grant all on page_gallery_images to service_role;

insert into page_gallery_images (page_key, image_path, alt, width, height, sort_order) values
  ('galeri', '/images/hero-tas-ev-aksam.jpg', 'Vesta House Bademli''nin akşam ışığında taş cephesi', 2048, 1536, 0),
  ('galeri', '/images/oyma-kapi-detay.jpg', 'Oyma ahşap giriş kapısı', 1200, 1600, 1),
  ('galeri', '/images/oda-genis.jpg', 'Taş duvarlı bir oda ve ahşap kapı', 1650, 2200, 2),
  ('galeri', '/images/vesta-house-tabela.jpg', 'Vesta House''un akşam ışığında tabelası', 1200, 1600, 3),
  ('galeri', '/images/avlu-hasir-koltuk.jpg', 'Zeytin ağacı gölgesindeki avlu ve hasır koltuk', 1650, 2200, 4),
  ('galeri', '/images/oda-kilim-sandalye.jpg', 'Kilim ve ahşap sandalyelerin bulunduğu oda köşesi', 1650, 2200, 5),
  ('galeri', '/images/tas-duvar-oyma-pencere.jpg', 'Taş duvar ve oyma ahşap pencere detayı', 1650, 2200, 6),
  ('galeri', '/images/oda-yatak-detay.jpg', 'Beyaz keten örtülü yatak ve katlanmış havlular', 1650, 2200, 7)
on conflict do nothing;


-- Kahvaltı sayfasının fiyatlı listeleri (tabak içerikleri, ekstra sıcaklar,
-- sıcak/soğuk içecekler). home_pillars ile aynı basit repeatable-row deseni;
-- `detail` kolonu gruba göre "not" (tabak içerikleri) ya da "fiyat" (diğer
-- üç grup) anlamına gelir -- admin arayüzü etiketi buna göre değiştirir,
-- veritabanı seviyesinde ayrı kolonlara gerek yok.
create table if not exists page_list_items (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  group_key text not null,
  name text not null default '',
  detail text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_page_list_items_page_group_sort
  on page_list_items(page_key, group_key, sort_order);

drop trigger if exists trg_page_list_items_updated_at on page_list_items;
create trigger trg_page_list_items_updated_at
  before update on page_list_items
  for each row execute function set_updated_at();

alter table page_list_items enable row level security;

drop policy if exists "public read page list items" on page_list_items;
create policy "public read page list items" on page_list_items
  for select using (true);
drop policy if exists "admin write page list items" on page_list_items;
create policy "admin write page list items" on page_list_items
  for all using (is_admin()) with check (is_admin());

grant select on page_list_items to anon, authenticated;
grant insert, update, delete on page_list_items to authenticated;
grant all on page_list_items to service_role;

insert into page_list_items (page_key, group_key, name, detail, sort_order) values
  ('kahvalti', 'inclusions', 'Peynir Tabağı', 'Beyaz peynir, Bergama peyniri, çeçil peynir', 0),
  ('kahvalti', 'inclusions', 'Söğüş Tabağı', 'Domates, salatalık, köy biberi ve taze yeşillikler', 1),
  ('kahvalti', 'inclusions', 'Zeytin Tabağı', 'Kırma yeşil zeytin, siyah sele zeytin', 2),
  ('kahvalti', 'inclusions', 'Sahanda Yumurta / Omlet', '', 3),
  ('kahvalti', 'inclusions', 'Tuzlu Soslar', 'Ev yapımı cevizli acuka, ev yapımı yağlı kapya biber', 4),
  ('kahvalti', 'inclusions', 'Tatlılar', 'Ev yapımı reçel çeşitleri, bal & tereyağ', 5),

  ('kahvalti', 'extras', 'Menemen', '300 ₺', 0),
  ('kahvalti', 'extras', 'Sucuklu Yumurta', '250 ₺', 1),

  ('kahvalti', 'sicak_icecekler', 'Espresso', '200 ₺', 0),
  ('kahvalti', 'sicak_icecekler', 'Americano', '250 ₺', 1),
  ('kahvalti', 'sicak_icecekler', 'Türk Kahvesi', '150 ₺', 2),
  ('kahvalti', 'sicak_icecekler', 'Çay', '70 ₺', 3),

  ('kahvalti', 'soguk_icecekler', 'Coca-Cola', '200 ₺', 0),
  ('kahvalti', 'soguk_icecekler', 'Fanta', '200 ₺', 1),
  ('kahvalti', 'soguk_icecekler', 'Sprite', '200 ₺', 2),
  ('kahvalti', 'soguk_icecekler', 'Ice Tea', '200 ₺', 3),
  ('kahvalti', 'soguk_icecekler', 'Frappe', '300 ₺', 4),
  ('kahvalti', 'soguk_icecekler', 'Frozen', '350 ₺', 5),
  ('kahvalti', 'soguk_icecekler', 'Soda', '100 ₺', 6),
  ('kahvalti', 'soguk_icecekler', 'Su', '60 ₺', 7)
on conflict do nothing;
