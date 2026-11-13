// GET /api/admin-config: tells the /admin page which Supabase project to sign
// in to. Only the PUBLISHABLE key is shared: it is designed to be public, and
// row-level security (supabase/migrations) decides what it can do. The secret
// key never leaves the server.
//
// Read at request time, so the same build works with any Supabase project and
// no keys are baked into the JavaScript.

export function adminConfig(env = process.env) {
  const url = String(env.SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '');
  const publishableKey = String(env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  return url && publishableKey ? { configured: true, url, publishableKey } : { configured: false };
}

export function adminConfigRequest(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }
  res.statusCode = 200;
  res.end(JSON.stringify(adminConfig()));
}
