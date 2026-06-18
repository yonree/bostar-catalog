import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLocaleAlternates, internalPathToPublicPath, localizeHref, resolvePathRouting } from '@/lib/i18n';

test('route registry maps chinese and english solution/application paths', () => {
  assert.equal(internalPathToPublicPath('/solutions', 'en'), '/applications');
  assert.equal(localizeHref('/solutions', 'en'), '/en/applications');
  assert.equal(localizeHref('/knowledge', 'en'), '/en/resources');
});

test('resolvePathRouting preserves localized english public path and internal content path', () => {
  const routing = resolvePathRouting('/en/applications');
  assert.equal(routing.locale, 'en');
  assert.equal(routing.internalPathname, '/solutions');
  assert.equal(routing.canonicalPublicPath, '/en/applications');
});

test('buildLocaleAlternates returns zh/en and x-default pairs', () => {
  const alternates = buildLocaleAlternates('/solutions');
  assert.deepEqual(alternates, {
    'zh-CN': '/solutions',
    en: '/en/applications',
    'x-default': '/solutions',
  });
});
