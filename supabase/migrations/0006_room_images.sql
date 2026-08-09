-- Multi-photo room galleries: rooms previously had a single image_path
-- column (one cover photo per room). This adds a one-to-many room_images
-- table so each room can have many gallery photos, while leaving
-- rooms.image_path completely untouched as a legacy/fallback field.
--
-- Nothing is destructive here: no column is dropped, no existing row is
-- modified except to backfill the new nullable `slug` column, and every
-- existing room photo is copied (not moved) into room_images so it keeps
-- working even if room_images ends up empty for some reason.

create table if not exists room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  alt_text text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_room_images_room on room_images(room_id, sort_order);

-- At most one cover photo per room, enforced at the database level so the
-- app never has to reconcile two rows both claiming to be the cover.
create unique index if not exists idx_room_images_one_cover
  on room_images(room_id) where is_cover;

alter table room_images enable row level security;

drop policy if exists "public read room images" on room_images;
create policy "public read room images" on room_images
  for select using (true);
drop policy if exists "admin write room images" on room_images;
create policy "admin write room images" on room_images
  for all using (is_admin()) with check (is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- SEO-stable per-room URLs: /odalar/<slug>. Nullable (so it can be
-- backfilled below without a NOT NULL failure) + unique only where set.
alter table rooms add column if not exists slug text;
create unique index if not exists idx_rooms_slug on rooms(slug) where slug is not null;

-- Backfill slug for existing rooms from their title (Turkish-safe
-- kebab-case, same mapping as lib/menu/slug.js's slugify()).
update rooms
set slug = trim(both '-' from regexp_replace(
  lower(translate(title, 'ğüşıöçĞÜŞİÖÇ', 'gusiocgusioc')),
  '[^a-z0-9]+', '-', 'g'
))
where slug is null;

-- Backfill room_images from the existing single image_path so no photo is
-- lost and no room card ever renders with zero photos after this migration.
insert into room_images (room_id, image_url, sort_order, is_cover, alt_text)
select id, image_path, 0, true, coalesce(nullif(image_alt, ''), title)
from rooms
where image_path is not null and image_path <> ''
  and not exists (select 1 from room_images ri where ri.room_id = rooms.id);
