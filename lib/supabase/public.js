import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// For public, RLS-open reads used in Server Components that should stay
// statically generated (site_settings, home_sections, ...). Unlike
// lib/supabase/server.js, this never touches next/headers' cookies() —
// reading cookies in a Server Component forces the whole route (and, from
// the root layout, the whole site) into dynamic rendering. These reads
// don't need a user session at all, so there's nothing to gain from the
// cookie-aware client and a lot of static-generation performance to lose.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "not-configured";

export function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
