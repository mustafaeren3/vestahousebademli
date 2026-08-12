-- Faz 6: interior-page editorial content (starting with each page's Hero
-- banner -- the concrete /odalar complaint this migration exists to fix).
--
-- New table, additive only. No existing table/column/data touched.
--
-- Why a new table instead of reusing home_sections: home_sections already
-- has this exact column shape, but it's keyed by a single fixed `key` over
-- a closed set of 9 homepage-only section names -- folding interior-page
-- rows into a table literally named "home_sections" would be confusing
-- (this is not the homepage) and would require loosening
-- lib/home/actions.js's SECTION_KEYS whitelist to mix two unrelated
-- concerns. page_sections mirrors home_sections' proven column shape
-- (same names, same RLS pattern) but is keyed by (page_key, section_key)
-- instead -- section_key is always 'hero' today, but the composite key
-- leaves room for a future 'intro'/'closing' row per page without another
-- migration.
--
-- Entity-owned content is NOT duplicated here: room cards stay in `rooms`,
-- blog posts stay in `blog_posts`, menu items stay in the menu tables,
-- contact/address stays in `site_settings`. This table only ever holds a
-- page's own editorial banner/section copy.
--
-- CTA columns are included for schema forward-compatibility (matching
-- home_sections and the brief's own field list) but are NOT wired into
-- PageHero.jsx in this phase -- that component has never rendered a CTA
-- button on any interior page, and adding one would be a visible design
-- change, not just a CMS wiring change. They stay unused/empty until a
-- future phase actually adds that button to the component.

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null default 'hero',
  enabled boolean not null default true,
  eyebrow text not null default '',
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  image_path text,
  image_alt text not null default '',
  media_id uuid references media_library(id),
  cta_label text not null default '',
  cta_href text not null default '',
  cta_target_blank boolean not null default false,
  cta_is_external boolean not null default false,
  cta_aria_label text not null default '',
  cta_active boolean not null default true,
  sort_order integer not null default 0,
  -- No default: stays NULL until an admin actually edits this row (same
  -- reasoning as seo_pages in 0011_seo.sql -- a migration-time default
  -- would stamp all 8 seed rows with the same "just updated" timestamp
  -- even though none of their content actually changed that day).
  updated_at timestamptz
);

create unique index if not exists idx_page_sections_page_section_key
  on page_sections(page_key, section_key);

drop trigger if exists trg_page_sections_updated_at on page_sections;
create trigger trg_page_sections_updated_at
  before update on page_sections
  for each row execute function set_updated_at();

alter table page_sections enable row level security;

drop policy if exists "public read page sections" on page_sections;
create policy "public read page sections" on page_sections
  for select using (true);
drop policy if exists "admin write page sections" on page_sections;
create policy "admin write page sections" on page_sections
  for all using (is_admin()) with check (is_admin());

-- Scoped grants only, no schema-wide grant (schema usage already granted
-- to these roles in 0004_cms_schema.sql).
grant select on page_sections to anon, authenticated;
grant insert, update, delete on page_sections to authenticated;
grant all on page_sections to service_role;

-- Seed: exact current hardcoded copy from each page.jsx's <PageHero />
-- props, so applying this migration changes nothing visible until an
-- admin edits a row from /admin/pages.
insert into page_sections (page_key, section_key, eyebrow, title, subtitle, image_path, image_alt) values
  ('odalar', 'hero',
   'Odalar', 'Sade Odalar', 'Taş evin farklı köşelerinde, kendine özgü üç oda.',
   '/images/oda-yatak-detay.jpg', 'Vesta House Bademli''de bir odanın taş duvarı ve beyaz keten yatağı'),
  ('kahvalti', 'hero',
   'Kahvaltı', 'Serpme Köy Kahvaltısı', 'Zeytin ağacının gölgesinde bir Ege kahvaltısı.',
   '/images/avlu-hasir-koltuk.jpg', 'Vesta House Bademli''nin kahvaltı servisi yapılan avlusu'),
  ('liman-meyhanesi', 'hero',
   'Alt Marka', 'Liman Meyhanesi', 'Gün batımıyla birlikte, Vesta House''un taş avlusu bir meyhaneye dönüşür.',
   '/images/avlu-hasir-koltuk.jpg', 'Vesta House Bademli''nin zeytin ağacı gölgesindeki avlusu'),
  ('bademli', 'hero',
   'Bademli, Dikili', 'Ege''nin Sakin Köşesi', 'İzmir''in Dikili ilçesine bağlı, zeytin ağaçları ve dar taş sokaklarıyla bilinen küçük bir köy.',
   '/images/hero-tas-ev-aksam.jpg', 'Bademli''nin dar sokağında Vesta House''un taş cephesi'),
  ('hakkimizda', 'hero',
   'Hakkımızda', 'Evin Hikâyesi', 'Bademli''de bir taş evin, aslına sadık kalınarak yeniden kullanılabilir hâle getirilme hikâyesi.',
   '/images/oyma-kapi-detay.jpg', 'Vesta House Bademli''nin oyma ahşap giriş kapısı'),
  ('iletisim', 'hero',
   'İletişim', 'Bize Ulaşın', 'Bademli''ye hoş geldiniz. Sorularınız için doğrudan yazabilir ya da arayabilirsiniz.',
   '/images/oyma-kapi-detay.jpg', 'Vesta House Bademli''nin oyma ahşap kapısı'),
  ('galeri', 'hero',
   'Galeri', 'Karelerle Vesta House', 'Taş, ahşap ve zeytin — evin kendi diliyle anlattıkları.',
   '/images/oda-kilim-sandalye.jpg', 'Vesta House Bademli''de kilim ve ahşap sandalyelerin bulunduğu bir oda köşesi'),
  ('blog', 'hero',
   'Blog', 'Taş Evin Günlüğü', 'Dikili ve Bademli üzerine yazılar: gezi notları, Ege mutfağı ve Vesta House''un günlük ritmi.',
   '/images/tas-duvar-oyma-pencere.jpg', 'Vesta House Bademli''nin taş duvarı ve oyma ahşap pencere detayı')
on conflict (page_key, section_key) do nothing;
