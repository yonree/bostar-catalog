import test from 'node:test';
import assert from 'node:assert/strict';
import { isPendingDownloadAsset } from '@/lib/site-origin';

test('isPendingDownloadAsset treats placeholder file markers as pending', () => {
  assert.equal(isPendingDownloadAsset('#'), true);
  assert.equal(isPendingDownloadAsset('/sample-download.pdf'), true);
  assert.equal(isPendingDownloadAsset('https://www.fjbosd.com/sample-download.pdf'), true);
  assert.equal(isPendingDownloadAsset('/uploads/real-file.pdf'), false);
});
