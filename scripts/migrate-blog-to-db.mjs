// One-off migration: copies content/blog/*.md into the new blog_posts
// table. Run once after applying supabase/migrations/0008_blog_posts.sql:
//
//   node scripts/migrate-blog-to-db.mjs
//
// Idempotent by design: uses upsert with ignoreDuplicates, so a slug that
// already exists in the table is left untouched (never overwritten) --
// safe to re-run without reverting any edit already made in the admin
// panel. The .md files are only read here, never modified or deleted.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Eksik ortam değişkeni: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env.local içinde tanımlı olmalı."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const POSTS_DIR = path.join(process.cwd(), "content/blog");

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Bulunamadı: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  console.log(`${files.length} blog yazısı bulundu.\n`);

  let inserted = 0;
  let skipped = 0;

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);

    const row = {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      content: content.trim(),
      category: data.category || "",
      tags: data.tags || [],
      cover_image: data.coverImage || "",
      cover_image_alt: data.coverImageAlt || "",
      seo_title: data.seoTitle || "",
      seo_description: data.seoDescription || "",
      faq: data.faq || [],
      status: "published",
      published_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "slug", ignoreDuplicates: true })
      .select();

    if (error) {
      console.error(`HATA (${slug}):`, error.message);
      process.exitCode = 1;
      continue;
    }

    if (result && result.length > 0) {
      console.log(`EKLENDİ   ${slug}`);
      inserted += 1;
    } else {
      console.log(`ATLANDI   ${slug} (zaten mevcut, değiştirilmedi)`);
      skipped += 1;
    }
  }

  console.log(`\nTamamlandı: ${inserted} eklendi, ${skipped} zaten vardı.`);
  console.log("content/blog/*.md dosyaları arşiv olarak korunuyor, silinmedi.");
}

main();
