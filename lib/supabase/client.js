import { createBrowserClient } from "@supabase/ssr";

// Fallbacks keep the client constructible (never crash the page) before
// real Supabase credentials are configured in .env.local; calls simply
// fail gracefully at request time until then.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "not-configured";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
