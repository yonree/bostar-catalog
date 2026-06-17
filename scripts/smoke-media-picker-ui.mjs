import { chromium } from 'playwright-core';

const baseUrl = process.env.SMOKE_BASE_URL || 'https://www.fjbosd.com';
const adminEmail = process.env.SMOKE_ADMIN_EMAIL || 'admin@bostarcoating.com';
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD;
if (!adminPassword) {
  console.error('请在环境变量 SMOKE_ADMIN_PASSWORD 中设置管理员密码。');
  process.exit(1);
}
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];

  try {
    await login(page);

    const mediaList = await fetchJson(page, '/api/admin/media');
    assert(
      Array.isArray(mediaList.items) && mediaList.items.length > 0,
      '媒体库为空，无法执行选择器回归。'
    );

    await runEntityUiFlow(page, {
      adminPath: '/admin/articles',
      apiPath: '/api/admin/articles',
      fieldName: 'coverImage',
      titleKey: 'title',
      entityLabel: '文章',
    });
    results.push('文章媒体选择器点击回归: PASS');

    await runEntityUiFlow(page, {
      adminPath: '/admin/solutions',
      apiPath: '/api/admin/solutions',
      fieldName: 'coverImage',
      titleKey: 'title',
      entityLabel: '方案',
    });
    results.push('方案媒体选择器点击回归: PASS');

    await runEntityUiFlow(page, {
      adminPath: '/admin/videos',
      apiPath: '/api/admin/videos',
      fieldName: 'coverImage',
      titleKey: 'title',
      entityLabel: '视频',
    });
    results.push('视频媒体选择器点击回归: PASS');

    await runEntityUiFlow(page, {
      adminPath: '/admin/products',
      apiPath: '/api/admin/products',
      fieldName: 'mainImage',
      titleKey: 'name',
      entityLabel: '产品',
    });
    results.push('产品媒体选择器点击回归: PASS');

    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: String(error), results }, null, 2));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

async function login(page) {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
  await page.locator('input[name="email"]').fill(adminEmail);
  await page.locator('input[name="password"]').fill(adminPassword);
  await Promise.all([
    page.waitForURL('**/admin', { timeout: 30000 }),
    page.getByRole('button', { name: '登录' }).click(),
  ]);
}

async function runEntityUiFlow(page, { adminPath, apiPath, fieldName, titleKey, entityLabel }) {
  const list = await fetchJson(page, apiPath);
  const items = list.items || [];
  assert(items.length > 0, `${entityLabel}列表为空。`);

  const item = items.find((entry) => entry?.id && typeof entry?.[titleKey] === 'string');
  assert(item?.id, `没有找到可测试的${entityLabel}记录。`);

  await page.goto(`${baseUrl}${adminPath}`, { waitUntil: 'networkidle' });
  await openEditForm(page, item[titleKey]);

  const mediaInput = page.locator(`form input[name="${fieldName}"]`);
  await mediaInput.waitFor({ state: 'visible', timeout: 10000 });
  const originalValue = await mediaInput.inputValue();

  await openMediaPicker(page, fieldName);
  const modal = page.locator('div.fixed.inset-0');
  await modal.waitFor({ state: 'visible', timeout: 10000 });

  const tiles = modal.locator(
    'button.overflow-hidden.rounded.border.border-line.bg-white.text-left'
  );
  const tileCount = await waitForTileCount(page, tiles, 10000);
  assert(tileCount > 0, `${entityLabel}媒体选择器中没有可点击的媒体卡片。`);

  const targetTile = tiles.first();
  const chosenUrl = await readTileUrl(targetTile);
  assert(chosenUrl, `${entityLabel}无法从媒体卡片读取图片 URL。`);
  await targetTile.click();

  await modal.waitFor({ state: 'hidden', timeout: 10000 });
  await page.waitForTimeout(300);

  const selectedValue = await mediaInput.inputValue();
  assert(selectedValue === chosenUrl, `${entityLabel}选择媒体后，输入框没有回填正确 URL。`);

  const previewUpdated = await page.evaluate((url) => {
    return Array.from(document.querySelectorAll('form img')).some((img) => {
      return img.getAttribute('src') === url || img.currentSrc === url;
    });
  }, chosenUrl);
  assert(previewUpdated, `${entityLabel}选择媒体后，预览图没有更新。`);

  await page.locator('form > button').last().click();
  await waitForPersistedValue(
    page,
    apiPath,
    item.id,
    fieldName,
    chosenUrl,
    `${entityLabel}保存后，后台记录没有更新。`
  );

  await page.goto(`${baseUrl}${adminPath}`, { waitUntil: 'networkidle' });
  await openEditForm(page, item[titleKey]);
  const reopenedValue = await page.locator(`form input[name="${fieldName}"]`).inputValue();
  assert(reopenedValue === chosenUrl, `${entityLabel}保存后重新打开，媒体值没有持久化。`);

  const restoreResult = await fetchJson(page, `${apiPath}/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...item, [fieldName]: originalValue }),
    headers: { 'Content-Type': 'application/json' },
  });
  assert(restoreResult.success === true, `${entityLabel}恢复原值失败。`);
}

async function openEditForm(page, titleText) {
  const row = page
    .locator('table tbody tr')
    .filter({ hasText: String(titleText) })
    .first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  await row.locator('button').first().click();
}

async function openMediaPicker(page, fieldName) {
  const openButton = page
    .locator(`input[name="${fieldName}"]`)
    .locator('xpath=following-sibling::div//button[1]');
  await openButton.click();
}

async function readTileUrl(tile) {
  const img = tile.locator('img').first();
  if ((await img.count()) > 0) {
    const imgSrc = await img.getAttribute('src');
    if (imgSrc) {
      return imgSrc;
    }
  }

  const urlText = tile.locator('p.text-xs').first();
  if ((await urlText.count()) > 0) {
    return (await urlText.textContent()) || '';
  }

  return '';
}

async function waitForTileCount(page, locator, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const count = await locator.count();
    if (count > 0) {
      return count;
    }
    await page.waitForTimeout(250);
  }
  return locator.count();
}

async function waitForPersistedValue(page, apiPath, id, fieldName, expectedValue, message) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    const list = await fetchJson(page, apiPath);
    const item = (list.items || []).find((entry) => entry?.id === id);
    if (item?.[fieldName] === expectedValue) {
      return;
    }
    await page.waitForTimeout(500);
  }
  throw new Error(message);
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
      `接口请求失败 ${path} -> ${result.status}: ${result.text || result.message || 'unknown error'}`
    );
  }

  return result;
}

await main();
