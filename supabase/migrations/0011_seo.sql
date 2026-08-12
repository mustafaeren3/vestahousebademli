-- Faz 5: centralized SEO management.
--
-- Two additive pieces, no destructive changes, no schema-wide grants
-- (scoped per-table grants only, per explicit Faz 5 requirement):
--
-- 1. seo_pages: one row per *static* public route that today has its SEO
--    metadata hardcoded as `export const metadata = {...}` directly in its
--    page.jsx (or, for "/", no page-level metadata at all -- it only
--    inherits the root layout's site-wide default). Seeded here with each
--    page's exact current copy, so applying this migration is a no-op for
--    the public site until an admin actually edits a row from /admin/seo.
--
--    Entity-owned pages are deliberately NOT given a seo_pages row, to
--    avoid duplicating data that already has a home:
--      - blog posts already have their own seo_title/seo_description
--        columns (0008_blog_posts.sql) -- untouched here.
--      - room detail pages get seo_title/seo_description added directly
--        to `rooms` below, mirroring the blog_posts pattern, instead of a
--        seo_pages row keyed by a synthetic 'room:<slug>' route_key.
--
-- 2. rooms.seo_title / rooms.seo_description: nullable, additive. NULL
--    means "no SEO override yet" -- app code already falls back to
--    room.title / room.description, so this is a no-op until set.

create table if not exists seo_pages (
  id uuid primary key default gen_random_uuid(),
  route_key text not null unique,
  path text not null,
  seo_title text not null default '',
  meta_description text not null default '',
  canonical_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  og_title text not null default '',
  og_description text not null default '',
  og_image text,
  twitter_title text not null default '',
  twitter_description text not null default '',
  twitter_image text,
  -- No default: stays NULL until an admin actually edits this row (the
  -- trigger below stamps it on that first real UPDATE). If this defaulted
  -- to now(), every seed row would get the same migration-run timestamp,
  -- and the sitemap would report all 10 static pages as "just updated" on
  -- migration day even though none of their content actually changed.
  updated_at timestamptz
);

create unique index if not exists idx_seo_pages_route_key on seo_pages(route_key);

drop trigger if exists trg_seo_pages_updated_at on seo_pages;
create trigger trg_seo_pages_updated_at
  before update on seo_pages
  for each row execute function set_updated_at();

alter table seo_pages enable row level security;

-- Public read: generateMetadata() for every public route reads this table
-- (via the same anon-key public client every other public query uses), so
-- it needs to be readable without an admin session, same as home_sections,
-- rooms, etc. Admin-only write via is_admin(), same pattern as every other
-- CMS table in this project.
drop policy if exists "public read seo pages" on seo_pages;
create policy "public read seo pages" on seo_pages
  for select using (true);
drop policy if exists "admin write seo pages" on seo_pages;
create policy "admin write seo pages" on seo_pages
  for all using (is_admin()) with check (is_admin());

-- Scoped grants only (no `grant all on all tables in schema public` here,
-- unlike earlier migrations -- explicit Faz 5 requirement to keep this
-- migration minimum-privilege). schema usage was already granted to these
-- roles in 0004_cms_schema.sql.
grant select on seo_pages to anon, authenticated;
grant insert, update, delete on seo_pages to authenticated;
grant all on seo_pages to service_role;

-- Seed: exact current hardcoded copy from each page.jsx / the root layout's
-- inherited default for "/", so this migration changes nothing visible
-- until an admin edits a row.
insert into seo_pages (route_key, path, seo_title, meta_description) values
  ('home', '/',
   'Vesta House Bademli | Bademli''de taş bir ev',
   'Bademli, Dikili''de taş bir ev. Vesta House Bademli; sade odalar, bir avlu ve Liman Meyhanesi''nin akşam sofrasını bir araya getiriyor.'),
  ('odalar', '/odalar',
   'Odalar',
   'Vesta House Bademli''de taş duvarlı üç oda: Taş Oda, Zeytin Odası ve Avlu Odası. Toplam 3 oda, 6 yatak kapasiteli butik bir taş ev.'),
  ('kahvalti', '/kahvalti',
   'Kahvaltı',
   'Vesta House Bademli''de serpme köy kahvaltısı: yöresel peynirler, ev yapımı reçeller ve zeytin ağacının gölgesinde uzun bir sabah.'),
  ('liman-meyhanesi', '/liman-meyhanesi',
   'Liman Meyhanesi',
   'Liman Meyhanesi, Vesta House Bademli''nin taş avlusunda akşamları açılan Ege meyhanesi. Günün balığı, mezeler ve uzun bir akşam sofrası.'),
  ('galeri', '/galeri',
   'Galeri',
   'Vesta House Bademli''den kareler: taş cephe, oyma ahşap kapılar, zeytin ağacının gölgesindeki avlu ve Liman Meyhanesi.'),
  ('bademli', '/bademli',
   'Bademli',
   'Bademli: İzmir''in Dikili ilçesine bağlı, zeytin ağaçları ve sakin sokaklarıyla bilinen küçük bir Ege köyü.'),
  ('hakkimizda', '/hakkimizda',
   'Hakkımızda',
   'Vesta House Bademli''nin hikâyesi: Bademli''de bir taş evin, aslına sadık kalınarak onarılması.'),
  ('iletisim', '/iletisim',
   'İletişim',
   'Vesta House Bademli''ye ulaşın: Bademli Mahallesi, Dikili / İzmir. Telefon, e-posta, WhatsApp ve Instagram üzerinden bize yazabilirsiniz.'),
  ('blog', '/blog',
   'Blog',
   'Dikili ve Bademli üzerine yazılar: gezi rehberleri, Ege mutfağı, zeytin hasadı ve Vesta House Bademli''den notlar.'),
  ('menu', '/menu',
   'Menü | Vesta House Bademli',
   'Vesta House Bademli ve Liman Meyhanesi dijital menüsü.')
on conflict (route_key) do nothing;

-- Room SEO overrides. NULL = "use room.title / room.description", exactly
-- what the app already does today -- so this is a no-op until an admin
-- sets one from /admin/seo.
alter table rooms add column if not exists seo_title text;
alter table rooms add column if not exists seo_description text;
