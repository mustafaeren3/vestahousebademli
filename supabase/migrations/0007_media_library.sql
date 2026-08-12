-- Central media library: a single place to hold per-image metadata (alt
-- text, title, caption, SEO filename, which page/entity it belongs to,
-- cover flag, sort order) that today is scattered across each table's own
-- image_path/image_url column with no shared fields for title/caption/
-- filename/page-linkage.
--
-- This is purely additive. No existing image column (home_sections.image_path,
-- home_gallery_images.image_path, rooms.image_path, room_images.image_url,
-- menu_products.image_path) is touched, renamed, or dropped -- every current
-- query and render path keeps working exactly as before. New uploads made
-- through the media library also keep filling those legacy columns, so
-- nothing regresses if a future feature reads only the old column.

create table if not exists media_library (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  url text not null,
  alt_text text not null default '',
  title text not null default '',
  caption text not null default '',
  filename text not null default '',
  linked_entity_type text,
  linked_entity_id text,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_media_library_linked
  on media_library(linked_entity_type, linked_entity_id, sort_order);
create index if not exists idx_media_library_sort on media_library(sort_order);

drop trigger if exists trg_media_library_updated_at on media_library;
create trigger trg_media_library_updated_at
  before update on media_library
  for each row execute function set_updated_at();

alter table media_library enable row level security;

drop policy if exists "public read media library" on media_library;
create policy "public read media library" on media_library
  for select using (true);
drop policy if exists "admin write media library" on media_library;
create policy "admin write media library" on media_library
  for all using (is_admin()) with check (is_admin());

-- Table-level grants, scoped to media_library only (schema-wide USAGE was
-- already granted to these roles in 0004_cms_schema.sql -- not repeated
-- here). RLS still gates every row: anon/authenticated can only ever see
-- what "public read media library" allows, and only is_admin() sessions can
-- actually insert/update/delete under "admin write media library" above.
-- No sequence grants: id uses gen_random_uuid(), no serial/sequence involved.
-- service_role bypasses RLS but still needs the table-level grant to reach it.
grant select on media_library to anon, authenticated;
grant insert, update, delete on media_library to authenticated;
grant all on media_library to service_role;

-- Optional back-reference from existing tables to a media_library row. Every
-- column below is nullable and unused by any current query, so adding it
-- changes nothing until the admin panel starts writing to it.
alter table home_sections add column if not exists media_id uuid references media_library(id);
alter table home_gallery_images add column if not exists media_id uuid references media_library(id);
alter table rooms add column if not exists media_id uuid references media_library(id);
alter table room_images add column if not exists media_id uuid references media_library(id);
alter table menu_products add column if not exists media_id uuid references media_library(id);
