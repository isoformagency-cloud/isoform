// Server-side access to Supabase, through its REST API (plain fetch, no SDK).
// Uses the SECRET key, which must never reach the browser: it is only read
// here, on the server (Vercel function, Express server or Vite dev server).
//
// Environment (see .env.example):
//   SUPABASE_URL          https://<project-ref>.supabase.co
//   SUPABASE_SECRET_KEY   sb_secret_... (or the older service_role key)

const TIMEOUT_MS = 8_000;

export function supabaseConfig(env = process.env) {
  const url = String(env.SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '');
  const secret = String(env.SUPABASE_SECRET_KEY || '').trim();
  return url && secret ? { url, secret } : null;
}

function headers(secret) {
  const result = { apikey: secret, 'Content-Type': 'application/json' };
  // Older keys are JWTs ("eyJ...") and also go in Authorization; new sb_secret_
  // keys are sent in the apikey header only.
  if (secret.startsWith('eyJ')) result.Authorization = `Bearer ${secret}`;
  return result;
}

async function call(config, path, { headers: extra = {}, ...init }) {
  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: { ...headers(config.secret), ...extra },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 200);
    throw new Error(`Supabase ${response.status} on ${path}: ${detail}`);
  }
  return response;
}

// Saves one validated enquiry (see supabase/migrations/0001_enquiries.sql).
export async function saveEnquiry(config, enquiry) {
  const { name, contact, business, services, message } = enquiry;
  await call(config, '/rest/v1/enquiries', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ name, contact, business, services, message }),
  });
}

// Shared spam limit: records one attempt for `key` and returns 0 when allowed,
// or the number of seconds to wait.
export async function hitRateLimit(config, key, windowSeconds, max) {
  const response = await call(config, '/rest/v1/rpc/hit_rate_limit', {
    method: 'POST',
    body: JSON.stringify({ p_key: key, p_window_seconds: windowSeconds, p_max: max }),
  });
  return Number(await response.json()) || 0;
}
