import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright-core';

const portArg = process.argv[2];
const port = Number(portArg || 3001);
const baseUrl = `http://127.0.0.1:${port}`;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const adminEmail = process.env.SMOKE_ADMIN_EMAIL || 'admin@bostarcoating.com';
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD;
if (!adminPassword) {
  console.error('请在环境变量 SMOKE_ADMIN_PASSWORD 中设置管理员密码。');
  process.exit(1);
}
const serverEnv = {
  ...process.env,
  DATABASE_URL: process.env.SMOKE_DATABASE_URL || process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.SMOKE_DATABASE_URL_UNPOOLED || process.env.DATABASE_URL_UNPOOLED,
  NEXT_PUBLIC_SITE_URL: baseUrl,
  ADMIN_EMAIL: process.env.SMOKE_ADMIN_EMAIL || adminEmail,
  ADMIN_PASSWORD_HASH: process.env.SMOKE_ADMIN_PASSWORD_HASH,
  ADMIN_SESSION_SECRET: process.env.SMOKE_ADMIN_SESSION_SECRET,
};
if (!serverEnv.DATABASE_URL || !serverEnv.ADMIN_PASSWORD_HASH || !serverEnv.ADMIN_SESSION_SECRET) {
  console.error(
    '请在环境变量中设置 SMOKE_DATABASE_URL / SMOKE_ADMIN_PASSWORD_HASH / SMOKE_ADMIN_SESSION_SECRET。'
  );
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 400) {
        return;
      }
    } catch {
      // ignore until timeout
    }
    await wait(500);
  }

  throw new Error(`Local server did not become ready within ${timeoutMs}ms: ${url}`);
}

async function fetchJson(page, path, init) {
  const result = await page.evaluate(
    async ({ path, init }) => {
      const response = await fetch(path, {
        ...init,
        credentials: 'include',
        headers: init?.headers || {},
      });
      const text = await response.text();
      try {
        return { status: response.status, ok: response.ok, ...JSON.parse(text) };
      } catch {
        return { status: response.status, ok: response.ok, text };
      }
    },
    { path, init }
  );

  if (!result.ok) {
    throw new Error(
      `API request failed ${path} -> ${result.status}: ${result.text || result.message || 'unknown error'}`
    );
  }

  return result;
}

async function login(page) {
  console.log('[step] open admin login');
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
  console.log('[step] submit admin login');
  await page.locator('input[name="email"]').fill(adminEmail);
  await page.locator('input[name="password"]').fill(adminPassword);
  await Promise.all([
    page.waitForURL('**/admin', { timeout: 30000 }),
    page.locator('button[type="submit"]').click(),
  ]);
}

async function ensureAdminPage(page, path, selector) {
  console.log(`[step] visit ${path}`);
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
  assert(!page.url().includes('/admin/login'), `Unexpected redirect to login for ${path}`);
  const target = page.locator(selector).first();
  await target.waitFor({ state: 'visible', timeout: 10000 });
}

async function waitForPersistedValue(
  page,
  apiPath,
  id,
  fieldName,
  expectedValue,
  timeoutMs = 15000
) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const list = await fetchJson(page, apiPath);
    const item = (list.items || list.leads || []).find((entry) => entry?.id === id);
    if (item?.[fieldName] === expectedValue) {
      return item;
    }
    await wait(500);
  }
  throw new Error(`Timed out waiting for ${apiPath} -> ${fieldName} to become ${expectedValue}`);
}

async function openEditForm(page, rowText) {
  const row = page
    .locator('table tbody tr')
    .filter({ hasText: String(rowText) })
    .first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  await row.locator('button').first().click();
}

async function testProductEditAndMediaPicker(page, results) {
  console.log('[step] product edit and media picker');
  const productList = await fetchJson(page, '/api/admin/products');
  const product = productList.items?.find((item) => item?.id && item?.name && item?.categoryId);
  assert(product?.id, 'No product available for smoke test');

  await page.goto(`${baseUrl}/admin/products`, { waitUntil: 'networkidle' });
  await openEditForm(page, product.name);

  const summaryField = page.locator('textarea[name="summary"]');
  await summaryField.waitFor({ state: 'visible', timeout: 10000 });
  const originalSummary = await summaryField.inputValue();
  const marker = ` [smoke-${Date.now()}]`;
  await summaryField.fill(`${originalSummary}${marker}`);
  await page.locator('form button[type="submit"]').click();
  const savedProduct = await waitForPersistedValue(
    page,
    '/api/admin/products',
    product.id,
    'summary',
    `${originalSummary}${marker}`
  );
  results.push('Product edit save: PASS');

  const mediaInput = page.locator('form input[name="mainImage"]');
  const originalImage = await mediaInput.inputValue();
  await mediaInput.locator('xpath=following-sibling::div//button[1]').click();
  const modal = page.locator('div.fixed.inset-0');
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  const tiles = modal.locator(
    'button.overflow-hidden.rounded.border.border-line.bg-white.text-left'
  );
  const tileCount = await tiles.count();
  assert(tileCount > 0, 'Media picker has no media items');
  const targetTile = tiles.first();
  const chosenUrl =
    (await targetTile.locator('img').first().getAttribute('src', { timeoutMs: 10000 })) || '';
  assert(chosenUrl, 'Unable to read selected media URL');
  await targetTile.click();
  await modal.waitFor({ state: 'hidden', timeout: 10000 });
  assert(
    (await mediaInput.inputValue()) === chosenUrl,
    'Media picker did not write selected URL into mainImage'
  );
  await page.locator('form button[type="submit"]').click();
  await waitForPersistedValue(page, '/api/admin/products', product.id, 'mainImage', chosenUrl);
  results.push('Product media picker save: PASS');

  await fetchJson(page, `/api/admin/products/${product.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...savedProduct, summary: originalSummary, mainImage: originalImage }),
    headers: { 'Content-Type': 'application/json' },
  });
  results.push('Product test data restore: PASS');
}

async function testDownloadLeadFlow(page, results) {
  console.log('[step] download lead flow');
  const downloadList = await fetchJson(page, '/api/admin/downloads');
  const download = downloadList.items?.find((item) => item?.id && item?.slug && item?.fileUrl);
  assert(download?.id, 'No download record available for smoke test');

  const originalDownload = { ...download };
  await fetchJson(page, `/api/admin/downloads/${download.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...download, requireLeadForm: true, isPublished: true }),
    headers: { 'Content-Type': 'application/json' },
  });

  const leadName = `SmokeLead-${Date.now()}`;
  await page.goto(`${baseUrl}/downloads/${download.slug}`, { waitUntil: 'networkidle' });
  await page.locator('input[name="name"]').fill(leadName);
  await page.locator('input[name="company"]').fill('Smoke QA');
  await page.locator('input[name="phone"]').fill('13800138000');
  await page.locator('input[name="email"]').fill('smoke@example.com');
  await page.locator('input[name="region"]').fill('Shanghai');
  await page.locator('textarea[name="message"]').fill('Local smoke lead test');
  await page.locator('form button').click();

  const lead = await waitForLead(page, leadName);
  results.push('Download lead submit: PASS');

  await page.goto(`${baseUrl}/admin/leads`, { waitUntil: 'networkidle' });
  const leadRow = page.locator('table tbody tr').filter({ hasText: leadName }).first();
  await leadRow.waitFor({ state: 'visible', timeout: 10000 });
  const statusSelect = leadRow.locator('select');
  await statusSelect.selectOption('contacted');
  await waitForPersistedValue(page, '/api/admin/leads', lead.id, 'status', 'contacted');
  await statusSelect.selectOption('invalid');
  await waitForPersistedValue(page, '/api/admin/leads', lead.id, 'status', 'invalid');
  results.push('Lead status flow: PASS');

  await fetchJson(page, `/api/admin/downloads/${download.id}`, {
    method: 'PUT',
    body: JSON.stringify(originalDownload),
    headers: { 'Content-Type': 'application/json' },
  });
  results.push('Download form setting restore: PASS');
}

async function waitForLead(page, leadName, timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const leadResult = await fetchJson(page, '/api/admin/leads');
    const found = (leadResult.leads || []).find((item) => item?.name === leadName);
    if (found) {
      return found;
    }
    await wait(500);
  }
  throw new Error(`Lead was not created for ${leadName}`);
}

async function main() {
  const results = [];
  console.log('[step] start local server');
  const server = spawn('npm.cmd', ['run', 'start', '--', '--port', String(port)], {
    cwd: process.cwd(),
    env: serverEnv,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverOutput = '';
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });

  try {
    console.log('[step] wait for local server');
    await waitForServer(`${baseUrl}/admin/login`);
    console.log('[step] launch browser context');
    const context = await browser.newContext();
    const page = await context.newPage();

    await login(page);
    results.push('Admin login: PASS');

    await ensureAdminPage(page, '/admin', 'h1');
    await ensureAdminPage(page, '/admin/products', 'table tbody tr');
    await ensureAdminPage(page, '/admin/articles', 'table tbody tr');
    await ensureAdminPage(page, '/admin/downloads', 'table tbody tr');
    await ensureAdminPage(page, '/admin/faqs', 'table tbody tr');
    await ensureAdminPage(page, '/admin/media', "table, input[type='file']");
    await ensureAdminPage(page, '/admin/settings', "form input[name='siteName']");
    await ensureAdminPage(page, '/admin/leads', 'table tbody tr, table tbody td');
    results.push('Admin page load sweep: PASS');

    await testProductEditAndMediaPicker(page, results);
    await testDownloadLeadFlow(page, results);

    console.log('[step] completed');
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: String(error),
          results,
          serverOutput: serverOutput.slice(-4000),
        },
        null,
        2
      )
    );
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (!server.killed) {
      server.kill();
    }
  }
}

await main();
