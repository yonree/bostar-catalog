import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadSubmission } from '@/lib/validators';

test('parseLeadSubmission maps richer metadata and attachment tokens', () => {
  const result = parseLeadSubmission({
    locale: 'en',
    name: 'Alice',
    company: 'Acme',
    email: 'alice@example.com',
    country: 'Vietnam',
    workpiece: 'Cabinet panel',
    workpieceMaterial: 'Steel',
    coatingMaterial: 'Epoxy powder',
    target: 'Request a quotation',
    capacity: '1200/day',
    demandType: 'Request a Quotation',
    message: 'Need faster color change',
    sourcePage: '/en/products',
    sourceType: 'product',
    attachmentTokens: ['tok_1'],
    privacyConsent: true,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'powder',
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.data.locale, 'en');
  assert.equal(result.data.workpieceMaterial, 'Steel');
  assert.equal(result.data.attachmentTokens?.[0], 'tok_1');
  assert.equal(result.data.utmSource, 'google');
});

test('parseLeadSubmission rejects missing contact channel or privacy consent', () => {
  const noChannel = parseLeadSubmission({
    name: 'Alice',
    company: 'Acme',
    country: 'China',
    target: 'Quote',
    privacyConsent: true,
  });
  assert.equal(noChannel.ok, false);

  const noConsent = parseLeadSubmission({
    name: 'Alice',
    company: 'Acme',
    email: 'alice@example.com',
    country: 'China',
    target: 'Quote',
    privacyConsent: false,
  });
  assert.equal(noConsent.ok, false);
});
