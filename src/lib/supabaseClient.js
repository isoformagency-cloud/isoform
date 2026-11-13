// The browser's Supabase client, for the /admin page only.
//
// Loaded on demand (the Supabase library is a separate download that only
// /admin fetches). The project URL and PUBLISHABLE key come from
// /api/admin-config at runtime, so nothing is baked into the build. What a
// signed-in user can see or change is decided by row-level security in the
// database (supabase/migrations/0001_enquiries.sql): only admins can read enquiries.

let client;

// Resolves to a Supabase client, or null when Supabase isn't configured.
export function getSupabase() {
  client ??= (async () => {
    const response = await fetch('/api/admin-config', { cache: 'no-store' });
    const config = response.ok ? await response.json() : { configured: false };
    if (!config.configured) return null;
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(config.url, config.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'isoform-admin' },
    });
  })().catch((error) => {
    client = undefined; // let the next call try again
    throw error;
  });
  return client;
}
