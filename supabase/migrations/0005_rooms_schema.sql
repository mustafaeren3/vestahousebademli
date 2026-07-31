-- Rooms (Odalar page) schema: the three room cards on /odalar were
-- hardcoded in app/(site)/odalar/page.jsx. Same shape as home_pillars /
-- home_gallery_images (a reorderable, enable/disable-able list), seeded
-- with today's exact copy so this migration is a no-op visually.

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  badge text not null default '',
  title text not null default '',
  description text not null default '',
  image_path text,
  image_alt text not null default '',
  tags text[] not null default '{}',
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rooms_sort on rooms(sort_order);

drop trigger if exists trg_rooms_updated_at on rooms;
create trigger trg_rooms_updated_at
  before update on rooms
  for each row execute function set_updated_at();

-- RLS: same shape as home_pillars — public read (the public query filters
-- to enabled=true itself, same pattern as menu_products' active flag),
-- admin-only write via is_admin() (defined in 0002_admin_role_lockdown.sql).

alter table rooms enable row level security;

drop policy if exists "public read rooms" on rooms;
create policy "public read rooms" on rooms
  for select using (true);
drop policy if exists "admin write rooms" on rooms;
create policy "admin write rooms" on rooms
  for all using (is_admin()) with check (is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- Seed data: exact current copy from app/(site)/odalar/page.jsx.

insert into rooms (badge, title, description, image_path, image_alt, tags, sort_order)
values
  ('I', 'Taş Oda',
   'Evin taş duvarlarından birine bitişik oda. Çıplak taş duvarlar, ahşap tavan kirişleri ve toprak tonlarında dokular.',
   '/images/oda-genis.jpg', 'Vesta House''ta taş duvarlı, ahşap kapılı bir oda',
   array['Taş Duvar', 'Ahşap Tavan'], 0),

  ('II', 'Zeytin Odası',
   'Kilim dokuları ve eski ahşap mobilyalarla döşenmiş bir oda. Pencereden avludaki zeytin ağacı görünür.',
   '/images/oda-kilim-sandalye.jpg', 'Vesta House''ta kilim ve ahşap sandalyelerin bulunduğu oda',
   array['Kilim', 'Ahşap Mobilya'], 1),

  ('III', 'Avlu Odası',
   'Taş terasa açılan, hasır koltuklu bir oda. Sabah kahvesi için uygun bir köşe.',
   '/images/oda-yatak-detay.jpg', 'Vesta House''ta beyaz keten örtülü bir yatak ve katlanmış havlular',
   array['Teras Erişimi', 'Doğal Işık'], 2)
on conflict do nothing;
