import { expect, test } from '@playwright/test';
import { getMeta, routes } from '../src/seo.js';
import { findOverflow, watchErrors } from './helpers.js';

// Every page in the sitemap: loads, has the right title and one h1, and
// hydrates without console errors.
for (const route of routes) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const errors = watchErrors(page);
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(getMeta(route).title);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors, 'console errors').toEqual([]);
  });
}

// Nothing sticks out sideways, from small phones to desktop.
const widths = [320, 360, 768, 1280];
for (const width of widths) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const problems = [];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      for (const item of await findOverflow(page)) problems.push(`${route}: ${item}`);
      // the page itself must never scroll sideways
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (scrollWidth > clientWidth)
        problems.push(`${route}: page scrolls sideways (${scrollWidth}px > ${clientWidth}px)`);
    }
    expect(problems).toEqual([]);
  });
}

test('first-screen fonts are preloaded and load', async ({ page }) => {
  const fontRequests = [];
  page.on('response', (response) => {
    if (response.url().endsWith('.woff2')) fontRequests.push(response.status());
  });
  // The privacy page has no serif accent words, so only the sans font is preloaded there.
  await page.goto('/privacy');
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(1);

  await page.goto('/about');
  const preloads = page.locator('link[rel="preload"][as="font"]');
  await expect(preloads).toHaveCount(2);
  for (const href of await preloads.evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
    const response = await page.request.get(href);
    expect(response.status(), href).toBe(200);
  }
  await page.waitForLoadState('networkidle');
  expect(fontRequests.every((status) => status === 200)).toBe(true);
});

test('GSAP is only downloaded on the home page', async ({ page }) => {
  const gsapRequests = [];
  page.on('request', (request) => {
    if (/gsap-runtime-.+\.js$/.test(request.url())) gsapRequests.push(new URL(page.url()).pathname);
  });
  for (const path of ['/about', '/work', '/contact', '/services/websites']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(gsapRequests, 'GSAP fetched on a page that does not use it').toEqual([]);

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(gsapRequests.length).toBeGreaterThan(0);
});

test('the Node server compresses pages and scripts', async ({ request }) => {
  const page = await request.get('/about', { headers: { 'Accept-Encoding': 'gzip' } });
  expect(page.headers()['content-encoding']).toBe('gzip');
  const script = (await page.text()).match(/src="(\/assets\/index-[^"]+\.js)"/)[1];
  const js = await request.get(script, { headers: { 'Accept-Encoding': 'gzip' } });
  expect(js.headers()['content-encoding']).toBe('gzip');
});

test('pages send the security headers', async ({ request }) => {
  const response = await request.get('/about');
  const headers = response.headers();
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
});

test('unknown pages return a real 404', async ({ page }) => {
  for (const path of ['/this-does-not-exist', '/services/not-a-service']) {
    const response = await page.goto(path);
    expect(response.status(), path).toBe(404);
    await expect(page.locator('h1')).toContainText('This page');
  }
});
