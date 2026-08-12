-- Blog moves from filesystem-based content/blog/*.md (parsed at request time
-- with gray-matter/marked, never admin-editable) into a real table so posts
-- can be created, edited, and drafted from the admin panel.
--
-- content/blog/*.md files are NOT deleted by this migration or by the
-- one-off scripts/migrate-blog-to-db.mjs script that copies them in --
-- they stay in the repo as an archive/backup.
--
-- status/published_at exist from day one here (unlike the other content
-- tables, which get them in a later migration) because "taslak / yayınlandı
-- durumu" was one of the explicit requirements for the blog CMS itself.
--
-- status defaults to 'draft' (not 'published') so a low-level insert that
-- forgets to set status can never accidentally go live. published_at is
-- nullable with no default: a new draft has no publish date until
-- lib/blog/actions.js's updateBlogPost() stamps it once, the first time the
-- post is actually set to 'published' -- editing an already-published post,
-- or draft -> published -> draft -> published again, never overwrites that
-- original stamp. The one-off migrate-blog-to-db.mjs script still sets both
-- status='published' and published_at=<original frontmatter date> directly
-- for the 6 pre-existing posts, since they were already live.

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  excerpt text not null default '',
  content text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  cover_image text not null default '',
  cover_image_alt text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  faq jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_blog_posts_published_at on blog_posts(published_at desc);

drop trigger if exists trg_blog_posts_updated_at on blog_posts;
create trigger trg_blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

alter table blog_posts enable row level security;

-- Public can only ever see published posts. Combined (OR'd, since RLS
-- policies are permissive by default) with the admin policy below, an
-- is_admin() session also sees drafts -- no separate admin-select policy
-- needed since "for all" already covers select.
drop policy if exists "public read published blog posts" on blog_posts;
create policy "public read published blog posts" on blog_posts
  for select using (status = 'published');
drop policy if exists "admin write blog posts" on blog_posts;
create policy "admin write blog posts" on blog_posts
  for all using (is_admin()) with check (is_admin());

-- Table-level grants, scoped to blog_posts only -- same minimal pattern as
-- 0007_media_library.sql (no schema-wide grants, no sequence grants since
-- id uses gen_random_uuid()).
grant select on blog_posts to anon, authenticated;
grant insert, update, delete on blog_posts to authenticated;
grant all on blog_posts to service_role;
