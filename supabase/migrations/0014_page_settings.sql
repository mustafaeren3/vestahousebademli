-- Page-level publish switch (Faz 8). page_sections' `enabled` column only
-- ever meant "is the Hero banner visible" (see 0013's comment) -- there was
-- no way to take a whole interior page down while keeping its content rows
-- intact. This adds a small, separate, page_key-keyed table instead of
-- overloading page_sections with page-wide semantics it was never designed
-- to carry.
--
-- Additive only: no existing table, column, or row is touched. Until an
-- admin flips a page off, this is a no-op -- every page defaults to
-- is_active=true, and lib/pages/queries.js's getPageIsActive() treats a
-- missing row (or a missing table, before this migration is applied) the
-- same as "active" too, so a slow/failed rollout can never accidentally
-- take a page down.

create table if not exists page_settings (
  page_key   text primary key,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Seed the one page that currently uses this (Kahvaltı). Other page_keys
-- get no row at all until an admin screen for them exists -- getPageIsActive
-- already treats "no row" as active, so that's fine.
insert into page_settings (page_key, is_active)
values ('kahvalti', true)
on conflict (page_key) do nothing;
