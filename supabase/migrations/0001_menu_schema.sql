-- Menu management schema: categories, products, per-language translations.
-- Prices, images, availability, order and allergens are shared across languages;
-- only name/description live in the *_translations tables, so editing one
-- language can never overwrite another.

create extension if not exists "pgcrypto";

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_category_translations (
  category_id uuid not null references menu_categories(id) on delete cascade,
  locale text not null check (locale in ('tr', 'en', 'de', 'el')),
  name text not null,
  primary key (category_id, locale)
);

create table if not exists menu_products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  slug text unique not null,
  price numeric(10, 2) not null default 0,
  currency text not null default '₺',
  image_path text,
  allergens text[] not null default '{}',
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  is_vegetarian boolean not null default false,
  is_spicy boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_product_translations (
  product_id uuid not null references menu_products(id) on delete cascade,
  locale text not null check (locale in ('tr', 'en', 'de', 'el')),
  name text not null,
  description text not null default '',
  primary key (product_id, locale)
);

create index if not exists idx_menu_products_category on menu_products(category_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_menu_categories_updated_at on menu_categories;
create trigger trg_menu_categories_updated_at
  before update on menu_categories
  for each row execute function set_updated_at();

drop trigger if exists trg_menu_products_updated_at on menu_products;
create trigger trg_menu_products_updated_at
  before update on menu_products
  for each row execute function set_updated_at();

-- Row Level Security: menu content isn't sensitive, so reads are public
-- (the public /menu API filters to active=true itself); writes require
-- an authenticated session, which in this single-admin app means the
-- one admin account created via scripts/create-admin.js.

alter table menu_categories enable row level security;
alter table menu_category_translations enable row level security;
alter table menu_products enable row level security;
alter table menu_product_translations enable row level security;

drop policy if exists "public read categories" on menu_categories;
create policy "public read categories" on menu_categories
  for select using (true);
drop policy if exists "admin write categories" on menu_categories;
create policy "admin write categories" on menu_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read category translations" on menu_category_translations;
create policy "public read category translations" on menu_category_translations
  for select using (true);
drop policy if exists "admin write category translations" on menu_category_translations;
create policy "admin write category translations" on menu_category_translations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read products" on menu_products;
create policy "public read products" on menu_products
  for select using (true);
drop policy if exists "admin write products" on menu_products;
create policy "admin write products" on menu_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read product translations" on menu_product_translations;
create policy "public read product translations" on menu_product_translations
  for select using (true);
drop policy if exists "admin write product translations" on menu_product_translations;
create policy "admin write product translations" on menu_product_translations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Fresh Supabase projects don't always carry forward default grants to
-- anon/authenticated/service_role for tables created outside the dashboard;
-- RLS policies alone aren't enough without these underlying grants.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- Storage bucket for product images (public read, admin write).
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "public read menu images" on storage.objects;
create policy "public read menu images" on storage.objects
  for select using (bucket_id = 'menu-images');

drop policy if exists "admin insert menu images" on storage.objects;
create policy "admin insert menu images" on storage.objects
  for insert with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

drop policy if exists "admin update menu images" on storage.objects;
create policy "admin update menu images" on storage.objects
  for update using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete menu images" on storage.objects;
create policy "admin delete menu images" on storage.objects
  for delete using (bucket_id = 'menu-images' and auth.role() = 'authenticated');
