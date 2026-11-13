// Server unit tests for the contact handler and the admin config.
// Run with `npm run test:unit` (Node's built-in test runner).
//
// Nothing real is touched: `fetch` (used for Supabase) is replaced by a fake,
// and email either uses the "log" transport (prints, never sends) or points at
// a closed local port so it fails on purpose.

import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { adminConfig } from '../../server/adminConfig.js';
import { handleContact, resetMailTransportForTests } from '../../server/contact.js';

const valid = {
  name: 'Test Person',
  contact: 'test@example.com',
  business: 'Test Co',
  services: ['Websites'],
  message: 'A short test message about a project.',
  company_url: '',
  elapsed: 5000,
};

const ENV_KEYS = [
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_TRANSPORT',
  'NODE_ENV',
  'VERCEL',
];
let savedEnv;
let realFetch;
let calls;
let ipCounter = 0;
const nextIp = () => `198.51.100.${++ipCounter}`; // fresh address per test, so local counts never collide

// Fake Supabase: records calls; `reply(path, init)` decides the response.
function fakeSupabase(reply = () => new Response(null, { status: 201 })) {
  globalThis.fetch = async (url, init = {}) => {
    const path = new URL(url).pathname;
    calls.push({ path, init, body: init.body ? JSON.parse(init.body) : undefined });
    return reply(path, init);
  };
}

const useSupabase = (secret = 'sb_secret_test') => {
  process.env.SUPABASE_URL = 'https://example.supabase.co/';
  process.env.SUPABASE_SECRET_KEY = secret;
};
const useLogMail = () => {
  process.env.MAIL_TRANSPORT = 'log';
};
const useBrokenMail = () => {
  // nothing listens on port 1: the connection is refused straight away
  Object.assign(process.env, { SMTP_HOST: '127.0.0.1', SMTP_PORT: '1', SMTP_USER: 'x', SMTP_PASS: 'y' });
};
const rpcAllows = (path) =>
  path.endsWith('/rpc/hit_rate_limit')
    ? new Response('0', { status: 200, headers: { 'Content-Type': 'application/json' } })
    : new Response(null, { status: 201 });

beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) delete process.env[key];
  realFetch = globalThis.fetch;
  calls = [];
  resetMailTransportForTests();
  // keep the "log" transport's printout out of the test report
  console.log = () => {};
});

afterEach(() => {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = realFetch;
  resetMailTransportForTests();
});

test('saves the enquiry in Supabase and emails it', async () => {
  useSupabase();
  useLogMail();
  fakeSupabase(rpcAllows);

  const result = await handleContact({ body: valid, ip: nextIp() });

  assert.equal(result.status, 200);
  const insert = calls.find((call) => call.path === '/rest/v1/enquiries');
  assert.ok(insert, 'enquiry was inserted');
  assert.equal(insert.init.method, 'POST');
  assert.deepEqual(insert.body, {
    name: 'Test Person',
    contact: 'test@example.com',
    business: 'Test Co',
    services: ['Websites'],
    message: 'A short test message about a project.',
  });
  assert.equal(insert.init.headers.apikey, 'sb_secret_test');
  assert.equal(insert.init.headers.Authorization, undefined, 'new sb_secret_ keys go in apikey only');

  const rate = calls.find((call) => call.path === '/rest/v1/rpc/hit_rate_limit');
  assert.ok(rate, 'shared rate limit was checked');
  assert.equal(rate.body.p_max, 5);
  assert.equal(rate.body.p_window_seconds, 600);
  assert.ok(!rate.body.p_key.includes('198.51.100'), 'the IP address is hashed, never sent');
});

test('older JWT secret keys are also sent as a Bearer token', async () => {
  useSupabase('eyJhbGciOiJIUzI1NiJ9.test.sig');
  fakeSupabase(rpcAllows);
  await handleContact({ body: valid, ip: nextIp() });
  const insert = calls.find((call) => call.path === '/rest/v1/enquiries');
  assert.equal(insert.init.headers.Authorization, 'Bearer eyJhbGciOiJIUzI1NiJ9.test.sig');
});

test('a failed email still counts as delivered when the enquiry was saved', async () => {
  useSupabase();
  useBrokenMail();
  fakeSupabase(rpcAllows);
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 200);
});

test('a failed save still counts as delivered when the email was sent', async () => {
  useSupabase();
  useLogMail();
  fakeSupabase((path) =>
    path.endsWith('/rpc/hit_rate_limit') ? new Response('0', { status: 200 }) : new Response('boom', { status: 500 })
  );
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 200);
});

test('fails only when both saving and email fail', async () => {
  useSupabase();
  useBrokenMail();
  fakeSupabase((path) =>
    path.endsWith('/rpc/hit_rate_limit') ? new Response('0', { status: 200 }) : new Response('boom', { status: 500 })
  );
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 502);
  assert.equal(result.body.error, 'send_failed');
});

test('the shared rate limit blocks with Retry-After', async () => {
  useSupabase();
  useLogMail();
  fakeSupabase((path) =>
    path.endsWith('/rpc/hit_rate_limit') ? new Response('120', { status: 200 }) : new Response(null, { status: 201 })
  );
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 429);
  assert.equal(result.headers['Retry-After'], '120');
  assert.ok(!calls.some((call) => call.path === '/rest/v1/enquiries'), 'nothing saved when blocked');
});

test('if the shared rate limit is down, it counts locally and still delivers', async () => {
  useSupabase();
  useLogMail();
  fakeSupabase((path) =>
    path.endsWith('/rpc/hit_rate_limit') ? new Response('down', { status: 503 }) : new Response(null, { status: 201 })
  );
  const ip = nextIp();
  for (let i = 0; i < 5; i++) assert.equal((await handleContact({ body: valid, ip })).status, 200);
  assert.equal((await handleContact({ body: valid, ip })).status, 429, 'sixth enquiry in 10 minutes is blocked');
});

test('works with email only (no Supabase)', async () => {
  useLogMail();
  fakeSupabase();
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 200);
  assert.equal(calls.length, 0, 'Supabase was not called');
});

test('reports "not configured" with neither Supabase nor email', async () => {
  fakeSupabase();
  const result = await handleContact({ body: valid, ip: nextIp() });
  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'not_configured');
});

test('spam checks run before anything is saved', async () => {
  useSupabase();
  useLogMail();
  fakeSupabase(rpcAllows);
  assert.equal((await handleContact({ body: { ...valid, company_url: 'x' }, ip: nextIp() })).status, 400);
  assert.equal((await handleContact({ body: { ...valid, elapsed: 100 }, ip: nextIp() })).status, 400);
  assert.equal((await handleContact({ body: { ...valid, name: '' }, ip: nextIp() })).status, 422);
  assert.equal(calls.length, 0, 'Supabase was never called');
});

test('admin config shares only the URL and the publishable key', () => {
  assert.deepEqual(adminConfig({}), { configured: false });
  assert.deepEqual(adminConfig({ SUPABASE_URL: 'https://x.supabase.co' }), { configured: false });
  const config = adminConfig({
    SUPABASE_URL: 'https://x.supabase.co/',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc',
    SUPABASE_SECRET_KEY: 'sb_secret_never_shared',
  });
  assert.deepEqual(config, { configured: true, url: 'https://x.supabase.co', publishableKey: 'sb_publishable_abc' });
  assert.ok(!JSON.stringify(config).includes('sb_secret'), 'the secret key is never included');
});
