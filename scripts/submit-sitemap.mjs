import { pathToFileURL } from 'node:url';

export const SITEMAP_URL = 'https://www.navokit.com/sitemap.xml';
const SITE_ORIGIN = 'https://www.navokit.com';
const ALLOWED_PROPERTIES = [
  'https://www.navokit.com/',
  'sc-domain:navokit.com',
  'sc-domain:www.navokit.com',
];

export function selectProperty(entries, configuredProperty) {
  if (configuredProperty && !ALLOWED_PROPERTIES.includes(configuredProperty)) {
    throw new Error('GSC_SITE_URL must be a NavoKit property covering https://www.navokit.com/.');
  }
  const candidates = configuredProperty ? [configuredProperty] : ALLOWED_PROPERTIES;
  const property = candidates.find((candidate) => entries.some((entry) =>
    entry.siteUrl === candidate && ['siteOwner', 'siteFullUser'].includes(entry.permissionLevel)));
  if (!property) {
    throw new Error('No authorized NavoKit property found. Add the service account to the existing Search Console property with owner or full-user access.');
  }
  return property;
}

export function validateSitemap(xml) {
  if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/u.test(xml)) {
    throw new Error('Production sitemap is not a sitemap URL set.');
  }
  const locations = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gu)].map((match) => match[1]);
  if (!locations.length) throw new Error('Production sitemap contains no URLs.');
  for (const location of locations) {
    let url;
    try { url = new URL(location); } catch { throw new Error('Production sitemap contains an invalid URL.'); }
    if (url.origin !== SITE_ORIGIN || url.username || url.password || url.hash || url.search) {
      throw new Error('Production sitemap contains a non-canonical or non-production URL.');
    }
  }
  return locations.length;
}

function credentialsFromEnv(env) {
  if (!env.GCP_SA_KEY) throw new Error('Missing GCP_SA_KEY. Store the service-account JSON in GitHub Actions secrets.');
  let credentials;
  try { credentials = JSON.parse(env.GCP_SA_KEY); } catch { throw new Error('GCP_SA_KEY is not valid JSON.'); }
  if (credentials?.type !== 'service_account' || !credentials.client_email || !credentials.private_key) {
    throw new Error('GCP_SA_KEY must contain a service-account client_email and private_key.');
  }
  return credentials;
}

async function createSearchConsoleClient(credentials) {
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });
  return google.searchconsole({ version: 'v1', auth });
}

async function apiRequest(label, request) {
  try { return await request(); } catch (error) {
    // Never print the raw API error: its request configuration can contain credentials.
    const status = Number(error?.response?.status || error?.code);
    const suffix = Number.isInteger(status) && status >= 400 && status <= 599 ? ` (HTTP ${status})` : '';
    throw new Error(`${label} failed${suffix}. Check that the Search Console API is enabled and the service account has access to the NavoKit property.`);
  }
}

export async function run({
  args = process.argv.slice(2),
  env = process.env,
  fetchImpl = fetch,
  createClient = createSearchConsoleClient,
  log = console.log,
} = {}) {
  if (args.length === 1 && args[0] === '--help') {
    log('Usage: node scripts/submit-sitemap.mjs --dry-run | --submit\nRun --submit only after the production deployment is live.');
    return;
  }
  if (args.length !== 1 || !['--dry-run', '--submit'].includes(args[0])) {
    throw new Error('Specify --dry-run or --submit. This script submits the production sitemap, not individual URLs.');
  }
  const dryRun = args[0] === '--dry-run';
  const credentials = dryRun ? null : credentialsFromEnv(env);
  let response;
  try {
    response = await fetchImpl(SITEMAP_URL, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
  } catch {
    throw new Error('Could not fetch the production sitemap. Confirm the production deployment and canonical URL before submission.');
  }
  if (!response.ok) throw new Error(`Production sitemap returned HTTP ${response.status}.`);
  const urlCount = validateSitemap(await response.text());
  if (dryRun) {
    log(`Dry run: ${SITEMAP_URL} contains ${urlCount} canonical production URLs. No Google authentication or submission performed.`);
    return { dryRun: true, sitemap: SITEMAP_URL, urlCount };
  }

  const client = await apiRequest('Search Console authentication setup', () => createClient(credentials));
  const sites = await apiRequest('Search Console property discovery', () => client.sites.list());
  const siteUrl = selectProperty(sites.data.siteEntry ?? [], env.GSC_SITE_URL);
  await apiRequest('Search Console sitemap submission', () => client.sitemaps.submit({ siteUrl, feedpath: SITEMAP_URL }));
  log(`Submitted ${SITEMAP_URL} to Search Console property ${siteUrl} (${urlCount} sitemap URLs).`);
  const receipt = await apiRequest('Search Console sitemap receipt lookup', () => client.sitemaps.get({ siteUrl, feedpath: SITEMAP_URL }));
  if (receipt.data.path !== SITEMAP_URL) throw new Error('Google accepted the submission, but its sitemap receipt could not be confirmed. Check Search Console.');
  const result = {
    sitemap: SITEMAP_URL,
    property: siteUrl,
    urlCount,
    lastSubmitted: receipt.data.lastSubmitted ?? null,
    isPending: receipt.data.isPending ?? null,
    warnings: receipt.data.warnings ?? null,
    errors: receipt.data.errors ?? null,
  };
  log(JSON.stringify(result, null, 2));
  log('This confirms sitemap submission, not URL indexing or search rankings.');
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
