import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Fallbacks keep the client constructible (never crash the page) before
// real Supabase credentials are configured in .env.local; calls simply
// fail gracefully at request time until then.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "not-configured";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            // Server component'ten cookie set edilemez; middleware zaten yönetiyor.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (e) {
            /* ignore */
          }
        },
      },
    }
  );
}
