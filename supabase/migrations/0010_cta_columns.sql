-- CTA button metadata for home_sections. Every homepage CTA (hero, rooms,
-- breakfast, meyhanesi, gallery_head, blog_teaser, closing_cta) already has
-- cta_label/cta_href; this adds the missing internal/external, new-tab,
-- active/inactive and aria-label controls the admin panel needs to manage
-- buttons properly, without touching cta_label/cta_href themselves.
--
-- All four columns are new, all have safe defaults matching today's actual
-- behavior (every existing CTA is currently an internal same-tab link that
-- always renders when cta_label/cta_href are set), so this migration is a
-- no-op until an admin changes one of these fields.

alter table home_sections add column if not exists cta_target_blank boolean not null default false;
alter table home_sections add column if not exists cta_is_external boolean not null default false;
alter table home_sections add column if not exists cta_aria_label text not null default '';
alter table home_sections add column if not exists cta_active boolean not null default true;
