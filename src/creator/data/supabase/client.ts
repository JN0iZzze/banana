import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cached) return cached;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !key) {
    throw new Error(
      '[creator] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. Check .env in repo root.',
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
