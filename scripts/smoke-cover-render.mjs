import { chromium } from 'playwright-core';

const baseUrl = process.env.SMOKE_BASE_URL || 'https://www.fjbosd.com';
const adminEmail = process.env.SMOKE_ADMIN_EMAIL || 'admin@bostarcoating.com';
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD;
if (!adminPassword) {
  console.error('请在环境变量 SMOKE_ADMIN_PASSWORD 中设置管理员密码。');
  process.exit(1);
}
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9VE3d1kAAAAASUVORK5CYII=',
  'base64'
);

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
    const existingMedia = mediaList.items?.[0];
    assert(existingMedia?.url, '媒体库中没有可用于封面测试的图片。');

    const articleList = await fetchJson(page, '/api/admin/articles');
    const article = articleList.items?.find((item) => item?.category?.slug && item?.slug);
    assert(article?.id, '没有找到可测试的文章记录。');
    await runCoverFlow({
      page,
      typeLabel: 'article',
      endpoint: '/api/admin/articles',
      item: article,
      nextImage: existingMedia.url,
      publicUrl: `${baseUrl}/knowledge/${article.category.slug}/${article.slug}`,
    });
    results.push('Article cover save and public render: PASS');

    const solutionList = await fetchJson(page, '/api/admin/solutions');
    const solution = solutionList.items?.find((item) => item?.slug);
    assert(solution?.id, '没有找到可测试的方案记录。');
    await runCoverFlow({
      page,
      typeLabel: 'solution',
      endpoint: '/api/admin/solutions',
      item: solution,
      nextImage: existingMedia.url,
      publicUrl: `${baseUrl}/solutions/${solution.slug}`,
    });
    results.push('Solution cover save and public render: PASS');

    const videoList = await fetchJson(page, '/api/admin/videos');
    const video = videoList.items?.find((item) => item?.slug);
    assert(video?.id, '没有找到可测试的视频记录。');
    await runCoverFlow({
      page,
      typeLabel: 'video',
      endpoint: '/api/admin/videos',
      item: video,
      nextImage: existingMedia.url,
      publicUrl: `${baseUrl}/videos/${video.slug}`,
    });
    results.push('Video cover save and public render: PASS');

    const uploadedMedia = await uploadTestImage(page);
    assert(uploadedMedia?.id && uploadedMedia?.url, '测试图片上传后未写入媒体库。');

    try {
      const productList = await fetchJson(page, '/api/admin/products');
      const product = productList.items?.find((item) => item?.category?.slug && item?.slug);
      assert(product?.id, '没有找到可测试的产品记录。');
      await runProductImageFlow({
        page,
        item: product,
        nextImage: uploadedMedia.url,
        publicUrl: `${baseUrl}/products/${product.category.slug}/${product.slug}`,
      });
      results.push('Product upload, render and cache refresh: PASS');
    } finally {
      await deleteMedia(page, uploadedMedia.id);
    }

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

async function uploadTestImage(page) {
  const unique = `smoke-product-${Date.now()}`;
  const uploadResult = await page.evaluate(
    async ({ unique, base64 }) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const formData = new FormData();
      formData.append('file', new File([bytes], `${unique}.png`, { type: 'image/png' }));
      formData.append('title', unique);
      formData.append('alt', unique);
      formData.append('description', 'smoke test image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const text = await response.text();
      try {
        return { status: response.status, ok: response.ok, ...JSON.parse(text) };
      } catch {
        return { status: response.status, ok: response.ok, text };
      }
    },
    { unique, base64: onePixelPng.toString('base64') }
  );
  assert(uploadResult.ok, `上传测试图片失败，状态码 ${uploadResult.status}`);

  await page.waitForTimeout(1000);
  const mediaList = await fetchJson(page, '/api/admin/media');
  const created = mediaList.items?.find(
    (item) => item?.title === unique || item?.filename === `${unique}.png`
  );
  assert(created?.id, '上传成功后，媒体库中没有找到测试图片记录。');
  return created;
}

async function runCoverFlow({ page, typeLabel, endpoint, item, nextImage, publicUrl }) {
  const originalCover = item.coverImage || '';
  const payload = { ...item, coverImage: nextImage };

  const saveResponse = await fetchJson(page, `${endpoint}/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  assert(saveResponse.success === true, `${typeLabel} 保存封面图失败。`);

  await assertPublicImage(page, publicUrl, nextImage, `${typeLabel} 前台未显示新封面图。`);

  const restoreResponse = await fetchJson(page, `${endpoint}/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...item, coverImage: originalCover }),
    headers: { 'Content-Type': 'application/json' },
  });
  assert(restoreResponse.success === true, `${typeLabel} 恢复原封面图失败。`);
}

async function runProductImageFlow({ page, item, nextImage, publicUrl }) {
  const originalMainImage = item.mainImage || '';
  const saveResponse = await fetchJson(page, `/api/admin/products/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...item, mainImage: nextImage }),
    headers: { 'Content-Type': 'application/json' },
  });
  assert(saveResponse.success === true, '产品主图保存失败。');

  await assertPublicImage(page, publicUrl, nextImage, '产品详情页未显示新主图。');

  const restoreResponse = await fetchJson(page, `/api/admin/products/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...item, mainImage: originalMainImage }),
    headers: { 'Content-Type': 'application/json' },
  });
  assert(restoreResponse.success === true, '产品主图恢复失败。');

  const restoreCheck = await page.goto(publicUrl, { waitUntil: 'networkidle' });
  assert(restoreCheck?.ok(), `产品详情恢复后访问失败，状态码 ${restoreCheck?.status()}`);
  const images = await page.evaluate(() =>
    Array.from(document.images).map((img) => img.currentSrc || img.src)
  );
  assert(!images.includes(nextImage), '产品详情页缓存未刷新，仍在显示测试主图。');
}

async function assertPublicImage(page, publicUrl, expectedImage, message) {
  const response = await page.goto(publicUrl, { waitUntil: 'networkidle' });
  assert(response?.ok(), `访问前台页面失败：${publicUrl}，状态码 ${response?.status()}`);
  const images = await page.evaluate(() =>
    Array.from(document.images).map((img) => img.currentSrc || img.src)
  );
  assert(images.includes(expectedImage), message);
}

async function deleteMedia(page, id) {
  const result = await fetchJson(page, `/api/admin/media/${id}`, { method: 'DELETE' });
  assert(result.success === true, '删除测试媒体失败。');
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
