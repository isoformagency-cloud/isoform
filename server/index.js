// Production server for hosts that run Node directly (`npm run build && npm start`).
// It serves the prerendered site from dist/ and the contact API.
// On Vercel this file is not used: static files and api/contact.js are served by the platform.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import express from 'express';
import { adminConfigRequest } from './adminConfig.js';
import { contactRequest } from './contact.js';

// Reads .env when present. The test server sets IGNORE_DOTENV=1, so tests can
// never pick up real Supabase or email settings from a developer's .env.
if (process.env.IGNORE_DOTENV !== '1') {
  try {
    process.loadEnvFile();
  } catch {
    // no .env file: rely on real environment variables
  }
}

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 3000;

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
// Compress HTML, CSS, JS and JSON (Vercel does this itself; plain Node does not).
app.use(compression());
// Behind a reverse proxy, set TRUST_PROXY=1 so rate limiting sees the visitor's address.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

// Security headers (CSP and friends) come from vercel.json, so this server and
// Vercel always send the same ones. Edit them there.
const vercelConfig = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const securityHeaders = vercelConfig.headers.find((rule) => rule.source === '/(.*)')?.headers ?? [];
if (!securityHeaders.some((header) => header.key === 'Content-Security-Policy')) {
  throw new Error('vercel.json has no Content-Security-Policy header for "/(.*)".');
}

app.use((req, res, next) => {
  for (const { key, value } of securityHeaders) res.setHeader(key, value);
  next();
});

app.all('/api/contact', (req, res) => contactRequest(req, res, { ip: req.ip }));
app.all('/api/admin-config', adminConfigRequest);

app.use(
  express.static(dist, {
    index: false,
    redirect: false,
    setHeaders(res, file) {
      // Vite fingerprints everything in assets/, so it can be cached for good.
      if (file.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Clean URLs: /about -> dist/about.html, /services/websites -> dist/services/websites.html
app.get(/.*/, (req, res) => {
  const clean = req.path.replace(/\/+$/, '') || '/';
  if (clean !== req.path) {
    const query = req.originalUrl.slice(req.path.length);
    return res.redirect(301, clean + query);
  }
  const notFound = () => res.status(404).sendFile(path.join(dist, '404.html'));
  if (!/^\/[a-z0-9\-/]*$/.test(clean)) return notFound();
  const file = path.join(dist, clean === '/' ? 'index.html' : `${clean.slice(1)}.html`);
  if (!file.startsWith(dist + path.sep) || !fs.existsSync(file)) return notFound();
  return res.sendFile(file);
});

app.listen(port, () => {
  console.log(`ISOFORM site running at http://localhost:${port}`);
});
