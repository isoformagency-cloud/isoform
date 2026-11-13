import { defineConfig, devices } from '@playwright/test';

// Smoke tests run against the real production build (dist/), served by
// server/index.js. Run `npm run build` first, or use `npm run check`.
const PORT = 4173;

export default defineConfig({
  testDir: './tests',
  testIgnore: 'unit/**', // server unit tests run with `npm run test:unit`
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // On Windows, use the installed Google Chrome: Windows Smart App Control
        // blocks Playwright's own (unsigned) test browser. A fresh temporary
        // profile is used, never your normal Chrome profile.
        ...(process.platform === 'win32' ? { channel: 'chrome' } : {}),
      },
    },
  ],
  webServer: {
    command: 'node server/index.js',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 30_000,
    // Safe by design: .env is ignored, mail is blank (no email can be sent),
    // there is no Supabase secret key (nothing can be saved), and /admin talks
    // to a fake Supabase address that the admin tests answer themselves.
    env: {
      PORT: String(PORT),
      IGNORE_DOTENV: '1',
      SMTP_HOST: '',
      SMTP_USER: '',
      SMTP_PASS: '',
      MAIL_TRANSPORT: '',
      SUPABASE_URL: 'https://isoform-test.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
      SUPABASE_SECRET_KEY: '',
    },
  },
});
