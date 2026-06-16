# Gate 3 Legacy URL Gap Report

## Snapshot

- Date: 2026-06-16
- Branch: `feat/gate2-implementation`
- HEAD baseline: `a4191e7f853f3490b569de3bc1fc980ba1f9f7de`
- Preview target: `http://127.0.0.1:3011`

## Scope

Focused audit of Gate 1A legacy product URLs that the approved planning assets still expect to remain `200`.

## Verified gaps

1. `GET /products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`
   - Current preview: `404`, `noindex`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` line 96 marks target status `200`
     - `audit/04-production-url-inventory.csv` line 96 records a production snapshot with title `手动液体静电喷枪 (水油通用系列) | BOSTAR`
   - Current repo state:
     - no matching product entity found in `lib/data.ts`
     - preview path is not failing from a case-only mismatch; it is failing from missing local content

2. `GET /products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`
   - Current preview: `404`, `noindex`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` line 88 marks target status `200`
     - `audit/04-production-url-inventory.csv` line 88 records a production snapshot with title `高性能液体自动静电喷枪控制系统 | BOSTAR`
   - Current repo state:
     - no matching product entity found in `lib/data.ts`
     - local route resolution has no surviving source record to render

3. Category landing pages under the same legacy families remain unresolved
   - `/products/Manual-Electrostatic-Liquid-Spray-Gun`
   - `/products/Automatic-Electrostatic-Liquid-Spray-Gun`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` lines 87 and 95 mark these as `RESTORE_200`
   - Current repo state:
     - current preview returns `404`
     - no approved local content source exists to restore a faithful category landing page

## Root cause

The unresolved routes are not blocked by locale rewrite, canonical generation, or simple slug normalization. The local implementation lacks repository-backed product/category entities for the legacy liquid-product families that still exist in the approved URL planning assets.

## Disposition

- Treat as a Gate 3 residual gap and Gate 4 release-prep blocker for legacy URL parity.
- Do not fabricate replacement product facts from partial audit metadata.
- Continue Gate 3 and Gate 4 work on routes that already have repository-backed content.
