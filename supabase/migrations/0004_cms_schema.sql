-- CMS schema: site-wide settings + homepage sections, editable from the
-- admin panel. Seeded with today's exact hardcoded copy from lib/site.js
-- and the homepage components, so applying this migration changes nothing
-- visually until an admin edits something.
--
-- image_path / logo_path / favicon_path columns store whatever string is
-- directly usable as an <Image src>: either an existing /images/... public
-- path (the seeded defaults below) or a full Supabase Storage public URL
-- (computed once at upload time and saved whole, see lib/settings/actions.js
-- and lib/home/actions.js) — no URL-building or fallback branching needed
-- at render time either way.

create table if not exists site_settings (
  id text primary key default 'default' check (id = 'default'),
  name text not null default '',
  tagline text not null default '',
  logo_path text,
  favicon_path text,
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address_line1 text not null default '',
  address_district text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  google_maps_url text not null default '',
  google_business_url text not null default '',
  copyright_text text not null default '',
  footer_text text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists home_sections (
  key text primary key check (
    key in ('hero', 'intro', 'pillars_head', 'rooms', 'breakfast', 'meyhanesi',
            'gallery_head', 'blog_teaser', 'closing_cta')
  ),
  enabled boolean not null default true,
  eyebrow text not null default '',
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  cta_label text not null default '',
  cta_href text not null default '',
  image_path text,
  image_alt text not null default '',
  reverse boolean not null default false,
  tone text not null default 'light' check (tone in ('light', 'dark')),
  updated_at timestamptz not null default now()
);

create table if not exists home_pillars (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'stone' check (icon in ('stone', 'olive', 'minimal', 'warmth')),
  title text not null default '',
  text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists home_gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  alt text not null default '',
  width integer not null default 1650,
  height integer not null default 2200,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_home_pillars_sort on home_pillars(sort_order);
create index if not exists idx_home_gallery_images_sort on home_gallery_images(sort_order);

drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

drop trigger if exists trg_home_sections_updated_at on home_sections;
create trigger trg_home_sections_updated_at
  before update on home_sections
  for each row execute function set_updated_at();

drop trigger if exists trg_home_pillars_updated_at on home_pillars;
create trigger trg_home_pillars_updated_at
  before update on home_pillars
  for each row execute function set_updated_at();

-- Row Level Security: same shape as menu_* tables — public read, admin-only
-- write via is_admin() (defined in 0002_admin_role_lockdown.sql).

alter table site_settings enable row level security;
alter table home_sections enable row level security;
alter table home_pillars enable row level security;
alter table home_gallery_images enable row level security;

drop policy if exists "public read site settings" on site_settings;
create policy "public read site settings" on site_settings
  for select using (true);
drop policy if exists "admin write site settings" on site_settings;
create policy "admin write site settings" on site_settings
  for all using (is_admin()) with check (is_admin());

drop policy if exists "public read home sections" on home_sections;
create policy "public read home sections" on home_sections
  for select using (true);
drop policy if exists "admin write home sections" on home_sections;
create policy "admin write home sections" on home_sections
  for all using (is_admin()) with check (is_admin());

drop policy if exists "public read home pillars" on home_pillars;
create policy "public read home pillars" on home_pillars
  for select using (true);
drop policy if exists "admin write home pillars" on home_pillars;
create policy "admin write home pillars" on home_pillars
  for all using (is_admin()) with check (is_admin());

drop policy if exists "public read home gallery images" on home_gallery_images;
create policy "public read home gallery images" on home_gallery_images
  for select using (true);
drop policy if exists "admin write home gallery images" on home_gallery_images;
create policy "admin write home gallery images" on home_gallery_images
  for all using (is_admin()) with check (is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- Storage bucket for CMS images (logo, favicon, section images, gallery).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images', 'site-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "public read site images" on storage.objects;
create policy "public read site images" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "admin insert site images" on storage.objects;
create policy "admin insert site images" on storage.objects
  for insert with check (bucket_id = 'site-images' and is_admin());

drop policy if exists "admin update site images" on storage.objects;
create policy "admin update site images" on storage.objects
  for update using (bucket_id = 'site-images' and is_admin());

drop policy if exists "admin delete site images" on storage.objects;
create policy "admin delete site images" on storage.objects
  for delete using (bucket_id = 'site-images' and is_admin());

-- Seed data: exact current copy, so this migration is a no-op visually.

insert into site_settings (
  id, name, tagline, logo_path, favicon_path, phone, whatsapp, email,
  address_line1, address_district, instagram, facebook,
  google_maps_url, google_business_url, copyright_text, footer_text
) values (
  'default',
  'Vesta House Bademli',
  'Bademli''de taş bir ev',
  '/images/vesta-logo-full.png',
  '/images/vesta-mark.png',
  '0553 898 59 82',
  'https://wa.me/905538985982',
  'info@vestahousebademli.com',
  'Bademli Mahallesi, 1. Sokak No:133',
  'Dikili / İzmir',
  'https://instagram.com/vestahousebademli',
  '',
  '',
  '',
  'Tüm hakları saklıdır.',
  'Liman Meyhanesi'
)
on conflict (id) do nothing;

insert into home_sections (key, eyebrow, title, subtitle, body, cta_label, cta_href, image_path, image_alt, reverse, tone)
values
  ('hero', 'Bademli · Dikili', 'Vesta House', 'Bademli', 'Ege''deki evinize hoş geldiniz.',
   '', '', '/images/hero-tas-ev-aksam.jpg',
   'Vesta House Bademli''nin akşam ışığında taş cephesi ve zeytin ağacı', false, 'light'),

  ('intro', 'Vesta House', '', 'Bademli''nin dar bir sokağında duran bu taş ev, aslına sadık kalınarak onarıldı.',
   'Vesta House Bademli, taş duvarları ve sade bir avlusu olan küçük bir evdir. Deniz ve zeytinliklere yakın, Bademli''nin sakin sokaklarında yer alır. Üç oda, özenle hazırlanmıştır.',
   '', '', null, '', false, 'light'),

  ('pillars_head', 'Felsefemiz', 'Dört sade ilke', '', '', '', '', null, '', false, 'light'),

  ('rooms', 'Odalar', 'Küçük bir evde, özenle hazırlanmış odalar', '',
   'Her oda, taş duvarların arasında kendi karakterini korur: ahşap kirişler, keten dokular, toprak tonları. Sayıları azdır; her biri ayrı ayrı hazırlanmıştır.',
   'Odaları Keşfedin', '/odalar', '/images/oda-genis.jpg',
   'Vesta House Bademli''de taş duvarlı bir oda ve ahşap oyma kapı', false, 'light'),

  ('breakfast', 'Kahvaltı', 'Zeytin ağacının gölgesinde bir sabah', '',
   'Sabahlar avluda serpme bir köy kahvaltısıyla başlar: yöresel peynirler, ev yapımı reçeller ve uzun bir masa.',
   'Kahvaltıyı Keşfedin', '/kahvalti', '/images/avlu-hasir-koltuk.jpg',
   'Vesta House Bademli''nin kahvaltı servisi yapılan avlusu', true, 'light'),

  ('meyhanesi', 'Alt Marka', 'Liman Meyhanesi', '',
   'Gün batımıyla birlikte avlu bir meyhaneye dönüşür. Günün balığı, Ege mezeleri ve uzun bir akşam sofrası.',
   'Liman Meyhanesi''ni Tanıyın', '/liman-meyhanesi', '/images/tas-duvar-oyma-pencere.jpg',
   'Vesta House Bademli''nin taş duvarı ve oyma ahşap penceresi', true, 'dark'),

  ('gallery_head', 'Galeri', 'Karelerle Vesta House', '', '',
   'Tüm Galeriyi Görün', '/galeri', null, '', false, 'light'),

  ('blog_teaser', 'Blog', 'Taş Evin Günlüğünden', '', '',
   'Tüm Yazılar', '/blog', null, '', false, 'light'),

  ('closing_cta', 'Bademli, Dikili', '', '', 'Bademli''de taş bir ev, sizi bekliyor.',
   'Konumu Görün', '/iletisim', '/images/tas-duvar-oyma-pencere.jpg',
   'Vesta House Bademli''nin taş duvarı ve oyma ahşap detayları', false, 'dark')
on conflict (key) do nothing;

insert into home_pillars (icon, title, text, sort_order)
values
  ('stone', 'Taş Ev', 'Bademli''nin yerel taşından örülmüş duvarlar, orijinal hâliyle korundu. Zaman izlerini saklıyoruz.', 0),
  ('olive', 'Zeytin Ağacı', 'Avludaki yaşlı zeytin, günün her saatinde farklı bir gölge ve farklı bir ışık bırakıyor.', 1),
  ('minimal', 'Ege Minimalizmi', 'Gereksiz dekorasyon yok. Kullanılan her eşya, günlük kullanım için seçildi.', 2),
  ('warmth', 'İçtenlik', 'Küçük bir ev ölçeğinde, sade ve özenli bir ağırlama.', 3)
on conflict do nothing;

insert into home_gallery_images (image_path, alt, width, height, sort_order)
values
  ('/images/hero-tas-ev-aksam.jpg', 'Vesta House Bademli''nin akşam ışığında taş cephesi', 2048, 1536, 0),
  ('/images/oyma-kapi-detay.jpg', 'Oyma ahşap giriş kapısı', 1200, 1600, 1),
  ('/images/oda-genis.jpg', 'Taş duvarlı bir oda ve ahşap kapı', 1650, 2200, 2),
  ('/images/avlu-hasir-koltuk.jpg', 'Zeytin ağacı gölgesindeki avlu ve hasır koltuk', 1650, 2200, 3),
  ('/images/tas-duvar-oyma-pencere.jpg', 'Taş duvar ve oyma ahşap pencere detayı', 1650, 2200, 4),
  ('/images/oda-yatak-detay.jpg', 'Beyaz keten örtülü yatak ve katlanmış havlular', 1650, 2200, 5)
on conflict do nothing;
