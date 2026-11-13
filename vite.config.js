import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { adminConfigRequest } from './server/adminConfig.js';
import { contactRequest } from './server/contact.js';

// Serves POST /api/contact from the Vite dev server, using the same handler
// as the Express server and the Vercel function.
function contactApi() {
  return {
    name: 'isoform-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        contactRequest(req, res, { ip: req.socket?.remoteAddress });
      });
      server.middlewares.use('/api/admin-config', adminConfigRequest);
    },
  };
}

const SERVER_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
  'CONTACT_TO',
  'MAIL_TRANSPORT',
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
];

export default defineConfig(({ mode }) => {
  // make the mail settings from .env visible to the dev API (never to the client bundle)
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of SERVER_ENV_KEYS) {
    if (env[key] && process.env[key] === undefined) process.env[key] = env[key];
  }

  return {
    plugins: [react(), tailwindcss(), contactApi()],
    define: {
      __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      target: 'es2022',
      assetsInlineLimit: 2048,
    },
  };
});
