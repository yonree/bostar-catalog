# Gate 3 Legacy URL Restoration Report

## Snapshot

- Date: 2026-06-17
- Branch: `feat/gate2-implementation`
- HEAD baseline: `22d4d24`
- Preview target: `http://127.0.0.1:3011`

## Scope

Focused restoration and revalidation of Gate 1A legacy liquid-product URLs that the approved planning assets still expect to remain `200`.

## Restored routes

1. `GET /products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`
   - Current preview: `200`, `index, follow`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` line 96 marks target status `200`
     - `audit/04-production-url-inventory.csv` line 96 records a production snapshot with title `鎵嬪姩娑蹭綋闈欑數鍠锋灙 (姘存补閫氱敤绯诲垪) | BOSTAR`
   - Current repo state:
     - restored through audited seed fallback in `lib/data.ts`
     - zh/en route pair returns `200` with canonical/hreflang intact

2. `GET /products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`
   - Current preview: `200`, `index, follow`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` line 88 marks target status `200`
     - `audit/04-production-url-inventory.csv` line 88 records a production snapshot with title `楂樻€ц兘娑蹭綋鑷姩闈欑數鍠锋灙鎺у埗绯荤粺 | BOSTAR`
   - Current repo state:
     - restored through audited seed fallback in `lib/data.ts`
     - zh/en route pair returns `200` with canonical/hreflang intact

3. Category landing pages under the same legacy families
   - `/products/Manual-Electrostatic-Liquid-Spray-Gun`
   - `/products/Automatic-Electrostatic-Liquid-Spray-Gun`
   - Planning evidence:
     - `planning/gate1a/url/url-decision-manifest.csv` lines 87 and 95 mark these as `RESTORE_200`
   - Current repo state:
     - current preview returns `200` on zh/en pairs
     - category landing pages are rebuilt from the restored audited seed entities and reappear in `sitemap.xml`

## Restoration method

The original `404` gap was not caused by locale rewrite or slug normalization. The local implementation lacked repository-backed product/category entities for the legacy liquid-product families that still exist in the approved planning assets. Restoration used only audited route facts already captured in `audit/04-production-url-inventory.csv`, promoted into the local seed fallback without inventing new product parameters.

## Verification

- `/products/Manual-Electrostatic-Liquid-Spray-Gun`
- `/en/products/Manual-Electrostatic-Liquid-Spray-Gun`
- `/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`
- `/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`
- `/products/Manual-Electrostatic-Liquid-Spray-Gun/manual-liquid-electrostatic-spray-gun`
- `/en/products/Manual-Electrostatic-Liquid-Spray-Gun/manual-liquid-electrostatic-spray-gun`
- `/products/Automatic-Electrostatic-Liquid-Spray-Gun`
- `/en/products/Automatic-Electrostatic-Liquid-Spray-Gun`
- `/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`
- `/en/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`
- `/sitemap.xml` includes the restored zh/en category/detail paths above

## Disposition

- `R-005` is locally closed for the sampled liquid-product family routes captured in Gate 1A planning assets.
- Keep monitoring broader legacy-route audit coverage, but do not treat this sampled family as an open Gate 4 blocker anymore.
