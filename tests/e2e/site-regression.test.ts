import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

async function waitForServer(url: string, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

test('site route, SEO and cookie regression smoke', async (t) => {
  const port = 3321;
  const child =
    process.platform === 'win32'
      ? spawn('cmd', ['/c', 'npm', 'run', 'start', '--', '--port', String(port)], {
          cwd: process.cwd(),
          env: {
            ...process.env,
            PORT: String(port),
          },
          stdio: 'ignore',
        })
      : spawn('npm', ['run', 'start', '--', '--port', String(port)], {
          cwd: process.cwd(),
          env: {
            ...process.env,
            PORT: String(port),
          },
          stdio: 'ignore',
        });

  t.after(() => {
    child.kill();
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(baseUrl);

  const home = await fetch(baseUrl);
  const homeHtml = await home.text();
  assert.match(homeHtml, /cookie-policy/);
  assert.match(homeHtml, /support/);

  const englishApplications = await fetch(`${baseUrl}/en/applications`);
  const englishHtml = await englishApplications.text();
  assert.equal(englishApplications.status, 200);
  assert.match(englishHtml, /Applications/);
  assert.match(englishHtml, /Request a Quotation/);

  const legacyService = await fetch(`${baseUrl}/service`, { redirect: 'manual' });
  assert.equal(legacyService.status, 301);
  assert.equal(legacyService.headers.get('location'), '/support');

  const legacySolutions = await fetch(`${baseUrl}/en/solutions`, { redirect: 'manual' });
  assert.equal(legacySolutions.status, 301);
  assert.equal(legacySolutions.headers.get('location'), '/en/applications');

  const thankYou = await fetch(`${baseUrl}/thank-you`);
  const thankYouHtml = await thankYou.text();
  assert.match(thankYouHtml, /noindex/);

  const search = await fetch(`${baseUrl}/search?q=powder`);
  const searchHtml = await search.text();
  assert.match(searchHtml, /noindex/);

  const fallbackDownload = await fetch(`${baseUrl}/support/downloads/troubleshooting-checklist`);
  const fallbackDownloadHtml = await fallbackDownload.text();
  assert.equal(fallbackDownload.status, 200);
  assert.match(fallbackDownloadHtml, /troubleshooting-checklist|喷涂故障排查清单/);
});
