// Contact enquiry handler. One implementation, three callers:
//   - the Vite dev server      (vite.config.js)
//   - the Express server       (server/index.js, `npm start`)
//   - the Vercel function      (api/contact.js)
//
// A valid enquiry is saved in Supabase (read it at /admin) and emailed to the
// studio inbox through SMTP (see .env.example). Both happen at once; the
// visitor sees success if at least one of them worked, so a failed email never
// loses an enquiry.

import crypto from 'node:crypto';
import { createTransport } from 'nodemailer';
import { site } from '../src/data/site.js';
import { isEmail, normalizeEnquiry, validateEnquiry } from '../src/lib/contactSchema.js';
import { hitRateLimit, saveEnquiry, supabaseConfig } from './supabase.js';

// The studio inbox, from the same place as the address shown on the site.
const DEFAULT_TO = site.email;
const MAX_BODY_BYTES = 20_000;
// Enquiries sent sooner than this after the form appeared are treated as bots.
const MIN_FILL_MS = 2_000;

/* ----------------------------- rate limiting ----------------------------- */
// At most 5 enquiries per connection per 10 minutes. Addresses are salted and
// hashed, never kept raw. With Supabase the count is shared by every server
// (rows deleted after 10 minutes); without it, each process counts on its own.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const localSalt = crypto.randomBytes(16);
const hits = new Map();

// The salt must be the same on every server for the shared count to work, and
// secret, so the stored hashes can't be reversed: derive it from the secret key.
const hashAddress = (ip, salt) =>
  crypto
    .createHash('sha256')
    .update(salt)
    .update(String(ip || 'unknown'))
    .digest('base64');

async function retryAfterSeconds(ip, store) {
  if (store) {
    try {
      return await hitRateLimit(
        store,
        hashAddress(ip, `isoform-rate:${store.secret}`),
        WINDOW_MS / 1000,
        MAX_PER_WINDOW
      );
    } catch (error) {
      console.error('[contact] Shared rate limit unavailable, counting locally:', error.message);
    }
  }
  return localRetryAfterSeconds(hashAddress(ip, localSalt));
}

function localRetryAfterSeconds(key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) {
    for (const [k, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(k);
    }
  }
  return 0;
}

/* -------------------------------- mailing -------------------------------- */
let cached;

function getTransport() {
  if (cached !== undefined) return cached;
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_TRANSPORT, NODE_ENV, VERCEL } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const port = Number(SMTP_PORT) || 465;
    cached = {
      kind: 'smtp',
      transport: createTransport({
        host: SMTP_HOST,
        port,
        secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      }),
    };
  } else if (MAIL_TRANSPORT === 'log' && NODE_ENV !== 'production' && !VERCEL) {
    // Local testing only: the message is printed to the terminal, not sent.
    cached = { kind: 'log', transport: createTransport({ jsonTransport: true }) };
  } else {
    cached = null;
  }
  return cached;
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]
  );

function composeMail(enquiry) {
  const rows = [
    ['Name', enquiry.name],
    ['Email or phone', enquiry.contact],
    ['Business', enquiry.business || 'Not given'],
    ['Needs help with', enquiry.services.join(', ')],
  ];
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${enquiry.message}\n`;
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="color:#666;vertical-align:top">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`
      )
      .join('') +
    `</table><p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>`;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || DEFAULT_TO;
  return {
    from: { name: 'ISOFORM website', address: from },
    to: process.env.CONTACT_TO || DEFAULT_TO,
    replyTo: isEmail(enquiry.contact) ? enquiry.contact : undefined,
    subject: `New enquiry from ${enquiry.name} (${enquiry.services.join(', ')})`,
    text,
    html,
  };
}

/* ------------------------------ core handler ----------------------------- */
// Returns { status, body, headers? }. Never throws.
export async function handleContact({ body, ip }) {
  const input = body && typeof body === 'object' ? body : {};

  // Honeypot: a field people never see. If it has a value, don't deliver, and
  // say so plainly, so a real person caught by mistake still knows to email us.
  if (typeof input.company_url === 'string' && input.company_url.trim() !== '') {
    return { status: 400, body: { ok: false, error: 'rejected' } };
  }

  const enquiry = normalizeEnquiry(input);
  const fields = validateEnquiry(enquiry);
  if (Object.keys(fields).length > 0) {
    return { status: 422, body: { ok: false, error: 'validation', fields } };
  }

  // Time check: the form reports how long it was open before sending. Real
  // people take far longer than this to fill it in; bots post instantly or
  // skip the form altogether.
  const elapsed = Number(input.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: 400, body: { ok: false, error: 'too_fast' } };
  }

  const store = supabaseConfig();
  const mailer = getTransport();
  if (!store && !mailer) {
    console.error(
      '[contact] Nowhere to deliver enquiries. Set SUPABASE_URL and SUPABASE_SECRET_KEY, and SMTP_HOST, SMTP_USER and SMTP_PASS (see .env.example).'
    );
    return { status: 503, body: { ok: false, error: 'not_configured' } };
  }
  if (!store) console.warn('[contact] Supabase is not configured: this enquiry is emailed but not saved.');
  if (!mailer) console.warn('[contact] Email is not configured: this enquiry is saved but no alert is sent.');

  const wait = await retryAfterSeconds(ip, store);
  if (wait > 0) {
    return { status: 429, body: { ok: false, error: 'rate_limited' }, headers: { 'Retry-After': String(wait) } };
  }

  // Save and email at the same time; success if either works.
  const deliveries = [];
  if (store) deliveries.push(['saving to Supabase', saveEnquiry(store, enquiry)]);
  if (mailer) deliveries.push(['sending the email', sendEnquiryMail(mailer, enquiry)]);
  const results = await Promise.allSettled(deliveries.map(([, promise]) => promise));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const reason = result.reason;
      console.error(`[contact] Failed ${deliveries[index][0]}:`, reason?.code || reason?.message || reason);
    }
  });
  if (results.some((result) => result.status === 'fulfilled')) {
    return { status: 200, body: { ok: true } };
  }
  return { status: 502, body: { ok: false, error: 'send_failed' } };
}

async function sendEnquiryMail(mailer, enquiry) {
  const info = await mailer.transport.sendMail(composeMail(enquiry));
  if (mailer.kind === 'log') {
    console.log(
      '[contact] MAIL_TRANSPORT=log, message not sent:\n' + JSON.stringify(JSON.parse(info.message), null, 2)
    );
  }
}

// For the unit tests: forget the cached mail transport after changing env.
export function resetMailTransportForTests() {
  cached = undefined;
}

/* --------------------------- raw request adapter -------------------------- */
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', (chunk) => {
      if (tooLarge) return; // keep draining, keep nothing
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        reject(Object.assign(new Error('Payload too large'), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(Object.assign(new Error('Invalid JSON'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  // Browsers always send Origin with a POST like the form's, so a missing one
  // means a script or bot, not the website.
  if (!origin) return false;
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Works with plain Node, Connect, Express and Vercel request/response objects.
export async function contactRequest(req, res, { ip } = {}) {
  const send = (status, body, headers = {}) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
    res.end(JSON.stringify(body));
  };

  if (req.method !== 'POST') {
    return send(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' });
  }
  if (
    !String(req.headers['content-type'] || '')
      .toLowerCase()
      .startsWith('application/json')
  ) {
    return send(415, { ok: false, error: 'unsupported_media_type' });
  }
  if (!sameOrigin(req)) {
    return send(403, { ok: false, error: 'forbidden' });
  }

  let body;
  try {
    // Vercel and express.json() provide a parsed body; otherwise read the stream.
    body = req.body && typeof req.body === 'object' ? req.body : await readJson(req);
  } catch (error) {
    if (error.status === 413) {
      // answer, then drop the connection instead of reading the rest of the upload
      res.once('finish', () => req.destroy());
      return send(413, { ok: false, error: 'payload_too_large' }, { Connection: 'close' });
    }
    return send(error.status || 400, { ok: false, error: 'bad_request' });
  }

  const result = await handleContact({ body, ip: ip || req.socket?.remoteAddress });
  return send(result.status, result.body, result.headers);
}
