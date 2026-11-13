import { expect, test } from '@playwright/test';

// Contact API checks. Every request is either invalid or rejected before the
// mail step, and the test server has no mail settings, so no email is sent.

// Like the browser: JSON, from this site's own origin.
let json;
test.beforeEach(({ baseURL }) => {
  json = { 'Content-Type': 'application/json', Origin: new URL(baseURL).origin };
});

const validEnquiry = {
  name: 'Test Person',
  contact: 'test@example.com',
  services: ['Websites'],
  message: 'A short test message about a project.',
};

test('rejects anything but POST', async ({ request }) => {
  const response = await request.get('/api/contact');
  expect(response.status()).toBe(405);
});

test('rejects non-JSON bodies', async ({ request }) => {
  const response = await request.post('/api/contact', {
    headers: { ...json, 'Content-Type': 'text/plain' },
    data: 'hello',
  });
  expect(response.status()).toBe(415);
});

test('rejects broken JSON', async ({ request }) => {
  // A Buffer is sent as-is (a plain string would be JSON-encoded into valid JSON).
  const response = await request.post('/api/contact', { headers: json, data: Buffer.from('{not json') });
  expect(response.status()).toBe(400);
});

test('returns a message for every invalid field', async ({ request }) => {
  const response = await request.post('/api/contact', { headers: json, data: { name: 'a' } });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(Object.keys(body.fields).sort()).toEqual(['contact', 'message', 'name', 'services']);
});

test('drops enquiries that fill the hidden spam field', async ({ request }) => {
  const response = await request.post('/api/contact', { headers: json, data: { company_url: 'spam' } });
  expect(response.status()).toBe(400);
});

test('drops enquiries sent too fast to be a person', async ({ request }) => {
  for (const data of [validEnquiry, { ...validEnquiry, elapsed: 300 }]) {
    const response = await request.post('/api/contact', { headers: json, data });
    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe('too_fast');
  }
});

test('blocks requests from other websites', async ({ request }) => {
  const response = await request.post('/api/contact', {
    headers: { ...json, Origin: 'https://evil.example' },
    data: { name: 'a' },
  });
  expect(response.status()).toBe(403);
});

test('blocks requests with no Origin (scripts and bots)', async ({ request }) => {
  const response = await request.post('/api/contact', {
    headers: { 'Content-Type': 'application/json' },
    data: { ...validEnquiry, elapsed: 5000 },
  });
  expect(response.status()).toBe(403);
});

test('refuses oversized requests', async ({ request }) => {
  const response = await request.post('/api/contact', {
    headers: json,
    data: JSON.stringify({ message: 'x'.repeat(25_000) }),
  });
  expect(response.status()).toBe(413);
});
