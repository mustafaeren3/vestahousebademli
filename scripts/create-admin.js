// Creates the default admin account for /admin using the Supabase Auth Admin API.
// Run once after applying supabase/migrations.
//
// Usage:
//   node scripts/create-admin.js
//   node scripts/create-admin.js you@example.com "a-custom-password"
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.

require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Eksik ortam değişkeni: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env.local içinde tanımlı olmalı."
  );
  process.exit(1);
}

const email = process.argv[2] || "admin@vestahousebademli.com";
const password = process.argv[3] || crypto.randomBytes(9).toString("base64url");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Admin hesabı oluşturulamadı:", error.message);
    process.exit(1);
  }

  console.log("Admin hesabı oluşturuldu.");
  console.log("---------------------------------");
  console.log("URL:      /admin/login");
  console.log("E-posta:  ", email);
  console.log("Şifre:    ", password);
  console.log("---------------------------------");
  console.log("Bu şifreyi güvenli bir yere kaydedin; ilk girişten sonra");
  console.log("/admin/settings üzerinden hemen değiştirin.");
}

main();
