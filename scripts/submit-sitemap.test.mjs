import assert from 'node:assert/strict';
import { test } from 'node:test';
import { run, selectProperty, SITEMAP_URL, validateSitemap } from './submit-sitemap.mjs';

const sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.navokit.com/en</loc></url><url><loc>https://www.navokit.com/zh</loc></url></urlset>';
const env = { GCP_SA_KEY: JSON.stringify({ type: 'service_account', client_email: 'test@example.invalid', private_key: 'test-key-never-sent' }) };
const fetchImpl = async (url, options) => {
  assert.equal(url, SITEMAP_URL);
  assert.equal(options.redirect, 'error');
  return new Response(sitemap);
};
const log = () => {};

test('only an existing authorized property covering the canonical host is selected', () => {
  const entries = [
    { siteUrl: 'https://www.navokit.com/', permissionLevel: 'siteRestrictedUser' },
    { siteUrl: 'https://navokit.com/', permissionLevel: 'siteOwner' },
    { siteUrl: 'sc-domain:navokit.com', permissionLevel: 'siteFullUser' },
  ];
  assert.equal(selectProperty(entries), 'sc-domain:navokit.com');
  assert.throws(() => selectProperty(entries, 'https://www.navokit.com/'), /No authorized/);
  assert.throws(() => selectProperty(entries, 'sc-domain:example.org'), /must be a NavoKit/);
  assert.throws(() => selectProperty([]), /No authorized/);
});

test('bad live sitemaps cannot reach Google submission', () => {
  assert.equal(validateSitemap(sitemap), 2);
  for (const value of [
    '<html>Deployment pending</html>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
    sitemap.replaceAll('www.navokit.com', 'preview.example.org'),
    sitemap.replace('/en</loc>', '/en?preview=true</loc>'),
    sitemap.replace('/en</loc>', '/en#section</loc>'),
    sitemap.replace('https://www.navokit.com/en', 'https://user:secret@www.navokit.com/en'),
  ]) assert.throws(() => validateSitemap(value));
});

test('dry run fetches the public sitemap without reading credentials or creating a Google client', async () => {
  const result = await run({
    args: ['--dry-run'], env: { GCP_SA_KEY: 'not-json' }, fetchImpl, log,
    createClient: () => assert.fail('Dry run must not authenticate'),
  });
  assert.deepEqual(result, { dryRun: true, sitemap: SITEMAP_URL, urlCount: 2 });
});

test('live execution requires explicit mode and credentials before any requests', async () => {
  const noFetch = () => assert.fail('Must not fetch');
  for (const args of [[], ['src/content/blog/en/post.md'], ['--submit', '--dry-run']]) {
    await assert.rejects(run({ args, env: {}, fetchImpl: noFetch, log }), /Specify --dry-run or --submit/);
  }
  await assert.rejects(run({ args: ['--submit'], env: {}, fetchImpl: noFetch, log }), /Missing GCP_SA_KEY/);
  await assert.rejects(run({ args: ['--submit'], env: { GCP_SA_KEY: '{secret' }, fetchImpl: noFetch, log }), /not valid JSON/);
});

test('live sitemap is validated before property discovery and submission', async () => {
  await assert.rejects(run({
    args: ['--submit'], env, log,
    fetchImpl: async () => new Response('<html>preview</html>'),
    createClient: () => assert.fail('Invalid sitemap must stop authentication'),
  }), /not a sitemap/);
});

test('submission uses the selected existing property and verifies a matching receipt', async () => {
  const calls = [];
  const createClient = async () => ({
    sites: { list: async () => ({ data: { siteEntry: [{ siteUrl: 'sc-domain:navokit.com', permissionLevel: 'siteOwner' }] } }) },
    sitemaps: {
      submit: async (params) => { calls.push(['submit', params]); return { status: 204 }; },
      get: async (params) => {
        calls.push(['get', params]);
        return { data: { path: SITEMAP_URL, isPending: true, lastSubmitted: '2026-10-09T00:00:00Z' } };
      },
    },
  });
  const result = await run({ args: ['--submit'], env, fetchImpl, createClient, log });
  const params = { siteUrl: 'sc-domain:navokit.com', feedpath: SITEMAP_URL };
  assert.deepEqual(calls, [['submit', params], ['get', params]]);
  assert.equal(result.isPending, true);
  assert.equal(result.lastSubmitted, '2026-10-09T00:00:00Z');
});

test('API failures are useful without echoing secrets or raw request configuration', async () => {
  const createClient = async () => ({ sites: { list: async () => {
    throw Object.assign(new Error('private-key-and-bearer-token'), { response: { status: 403 } });
  } } });
  await assert.rejects(run({ args: ['--submit'], env, fetchImpl, createClient, log }), (error) => {
    assert.match(error.message, /property discovery failed \(HTTP 403\)/);
    assert.doesNotMatch(error.message, /private-key|bearer-token/);
    return true;
  });
});
