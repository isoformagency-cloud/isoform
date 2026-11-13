import { expect, test } from '@playwright/test';

// /admin against a FAKE Supabase. The test server points the admin page at
// https://isoform-test.supabase.co (playwright.config.js); every request to it
// is answered here, so the real Supabase project is never contacted.

const SUPABASE = 'https://isoform-test.supabase.co';

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const fakeJwt = (user) =>
  `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({
    sub: user.id,
    email: user.email,
    role: 'authenticated',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.signature`;

const ADMIN = { id: '11111111-1111-4111-8111-111111111111', email: 'team@isoform.test' };
const OUTSIDER = { id: '22222222-2222-4222-8222-222222222222', email: 'someone@isoform.test' };

const sampleEnquiries = () => [
  {
    id: 'aaaaaaaa-0000-4000-8000-000000000001',
    created_at: '2026-11-12T10:30:00Z',
    updated_at: '2026-11-12T10:30:00Z',
    name: 'Priya Bakery',
    contact: 'priya@example.com',
    business: 'Priya’s Bakes',
    services: ['Websites', 'Branding'],
    message: 'We need an online menu and ordering.',
    status: 'new',
  },
  {
    id: 'aaaaaaaa-0000-4000-8000-000000000002',
    created_at: '2026-11-10T08:00:00Z',
    updated_at: '2026-11-10T08:00:00Z',
    name: 'Ravi Cabs',
    contact: '98765 43210',
    business: '',
    services: ['Automation'],
    message: 'WhatsApp auto replies for bookings please.',
    status: 'replied',
  },
];

// Installs the fake Supabase. Returns the log of write requests it received.
async function fakeSupabase(page, { admins = [ADMIN.id] } = {}) {
  const writes = [];
  let rows = sampleEnquiries();
  await page.route(`${SUPABASE}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (status, body) =>
      route.fulfill({ status, contentType: 'application/json', body: body === undefined ? '' : JSON.stringify(body) });

    if (url.pathname === '/auth/v1/token') {
      const { email, password } = request.postDataJSON();
      const user = [ADMIN, OUTSIDER].find((item) => item.email === email);
      if (!user || password !== 'right-password') {
        return json(400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
      }
      return json(200, {
        access_token: fakeJwt(user),
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        user: {
          id: user.id,
          email: user.email,
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
        },
      });
    }
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204 });
    if (url.pathname === '/rest/v1/admins') {
      const userId = (url.searchParams.get('user_id') || '').replace('eq.', '');
      return json(200, admins.includes(userId) ? [{ user_id: userId }] : []);
    }
    if (url.pathname === '/rest/v1/enquiries') {
      const id = (url.searchParams.get('id') || '').replace('eq.', '');
      if (request.method() === 'GET') return json(200, rows);
      if (request.method() === 'PATCH') {
        writes.push({ method: 'PATCH', id, body: request.postDataJSON() });
        rows = rows.map((row) => (row.id === id ? { ...row, ...request.postDataJSON() } : row));
        return route.fulfill({ status: 204 });
      }
      if (request.method() === 'DELETE') {
        writes.push({ method: 'DELETE', id });
        rows = rows.filter((row) => row.id !== id);
        return route.fulfill({ status: 204 });
      }
    }
    return json(404, { message: `fake Supabase: no handler for ${request.method()} ${url.pathname}` });
  });
  return writes;
}

async function signIn(page, email, password = 'right-password') {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('admin page is private: noindex, not in the sitemap, blocked in robots.txt, no footer', async ({
  page,
  request,
}) => {
  const response = await page.goto('/admin');
  expect(response.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('footer')).toHaveCount(0);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /admin');
});

test('shows a clear message when Supabase is not configured', async ({ page }) => {
  await page.route('**/api/admin-config', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"configured":false}' })
  );
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: /isn’t set up yet/ })).toBeVisible();
});

test('a wrong password shows an error', async ({ page }) => {
  await fakeSupabase(page);
  await page.goto('/admin');
  await signIn(page, ADMIN.email, 'wrong-password');
  await expect(page.getByRole('alert')).toContainText('Invalid login credentials');
});

test('a signed-in user who is not an admin sees no enquiries', async ({ page }) => {
  await fakeSupabase(page);
  await page.goto('/admin');
  await signIn(page, OUTSIDER.email);
  await expect(page.getByRole('heading', { name: 'No admin access' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Enquiries' })).toHaveCount(0);
});

test('an admin can read, filter, update and delete enquiries, and sign out', async ({ page }) => {
  const writes = await fakeSupabase(page);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/admin');
  await signIn(page, ADMIN.email);

  // opens on "New": only the new enquiry
  const list = page.getByRole('list', { name: 'Enquiries' });
  await expect(list.getByRole('heading', { name: 'Priya Bakery' })).toBeVisible();
  await expect(list.getByRole('heading', { name: 'Ravi Cabs' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^All/ })).toContainText('2');

  // "All" shows both; reply shortcuts match the contact type
  await page.getByRole('button', { name: /^All/ }).click();
  await expect(list.getByRole('heading', { name: 'Ravi Cabs' })).toBeVisible();
  await expect(list.getByRole('link', { name: 'Reply by email' })).toHaveAttribute(
    'href',
    /^mailto:priya@example\.com/
  );
  await expect(list.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/919876543210');

  // change a status
  await page.getByLabel('Status of the enquiry from Priya Bakery').selectOption('client');
  await expect
    .poll(() => writes.find((write) => write.method === 'PATCH'))
    .toMatchObject({
      id: 'aaaaaaaa-0000-4000-8000-000000000001',
      body: { status: 'client' },
    });

  // delete, after confirming
  page.once('dialog', (dialog) => dialog.accept());
  await list.getByRole('button', { name: /Delete the enquiry from Ravi Cabs/ }).click();
  await expect(list.getByRole('heading', { name: 'Ravi Cabs' })).toHaveCount(0);
  expect(writes.some((write) => write.method === 'DELETE' && write.id === 'aaaaaaaa-0000-4000-8000-000000000002')).toBe(
    true
  );

  // sign out returns to the sign-in form
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('Supabase is only downloaded on the admin page', async ({ page }) => {
  const supabaseChunks = [];
  page.on('request', (request) => {
    if (/supabase|admin-config/.test(request.url())) supabaseChunks.push(request.url());
  });
  for (const path of ['/', '/about', '/contact']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(supabaseChunks).toEqual([]);
});
