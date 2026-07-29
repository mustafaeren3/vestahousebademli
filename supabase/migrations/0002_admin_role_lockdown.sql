-- Security hardening: writes were gated on `auth.role() = 'authenticated'`,
-- which trusts ANY logged-in Supabase user — including someone who signs
-- up directly against the public anon key (Supabase projects allow email
-- signups by default). This app has exactly one legitimate writer: the
-- admin created by scripts/create-admin.js, tagged with
-- raw_app_meta_data.role = 'admin'. app_metadata (unlike user_metadata)
-- can only be set by an admin/service-role call, so it's safe to use for
-- authorization — a self-registered user can never grant it to themselves.

create or replace function is_admin()
returns boolean as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$ language sql stable;

drop policy if exists "admin write categories" on menu_categories;
create policy "admin write categories" on menu_categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write category translations" on menu_category_translations;
create policy "admin write category translations" on menu_category_translations
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write products" on menu_products;
create policy "admin write products" on menu_products
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write product translations" on menu_product_translations;
create policy "admin write product translations" on menu_product_translations
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin insert menu images" on storage.objects;
create policy "admin insert menu images" on storage.objects
  for insert with check (bucket_id = 'menu-images' and is_admin());

drop policy if exists "admin update menu images" on storage.objects;
create policy "admin update menu images" on storage.objects
  for update using (bucket_id = 'menu-images' and is_admin());

drop policy if exists "admin delete menu images" on storage.objects;
create policy "admin delete menu images" on storage.objects
  for delete using (bucket_id = 'menu-images' and is_admin());
