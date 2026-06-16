# GATE3_ROUTE_MATRIX

## Snapshot

- Date: 2026-06-16
- Branch: `feat/gate2-implementation`
- HEAD baseline for this matrix: `22d4d24`
- Preview target: `http://127.0.0.1:3011`

## Status buckets

### COMPLETED_AND_VERIFIED

- `/products`
- `/products/[categorySlug]`
- `/products/[categorySlug]/[productSlug]`
- `/cases`
- `/cases/[slug]`
- `/downloads`
- `/downloads/[slug]`
- `/videos`
- `/videos/[slug]`
- `/solutions`
- `/solutions/[slug]`
- `/knowledge`
- `/knowledge/[categorySlug]`
- `/knowledge/[categorySlug]/[slug]`
- `/faq`
- `/service`
- `/contact`
- `/about`
- `/`
- `/en`
- `/en/about`
- `/en/search`
- legacy liquid-product family sample:
  - `/products/Manual-Electrostatic-Liquid-Spray-Gun`
  - `/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`
  - `/products/Manual-Electrostatic-Liquid-Spray-Gun/manual-liquid-electrostatic-spray-gun`
  - `/products/Automatic-Electrostatic-Liquid-Spray-Gun`
  - `/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`
  - matching `/en/**` route pairs above

### SAFE_TO_IMPLEMENT

- sitemap coverage and canonical/hreflang parity audit against current public-route inventory
- remaining system placeholder and reserved-route verification beyond `/_not-found`
- page-level empty-state wording on list pages backed by seed fallback

### SYSTEM_PLACEHOLDER

- `/news` reserved index kept online as `noindex,nofollow` until verified news inventory exists
- `/news/[slug]` placeholder detail kept as `noindex,nofollow` until verified news content exists
- `/_not-found` localized and verified as a 404/noindex system route

### LEGACY_URL_RESTORED

- sampled legacy liquid-product route family restored from audited production inventory; see `GATE3_LEGACY_URL_GAP_REPORT.md`
- zh/en detail/category pairs now return `200`, retain canonical/hreflang, and reappear in `sitemap.xml`

### BUSINESS_DECISION_REQUIRED

- approved English business-body copy for data-backed Chinese source content

## Completed slice

- Slice: remaining public list and category pages
- Verified routes:
  - `/en/products`
  - `/en/products/manual-powder-coating-gun`
  - `/en/cases`
  - `/en/downloads`
  - `/en/videos`
  - `/en/solutions`
  - `/en/knowledge`
  - `/en/knowledge/selection-guide`
  - `/en/news`
- Verified signals:
  - `html lang`
  - title / description
  - canonical
  - hreflang
  - robots
  - translation-notice behavior where expected
  - no runtime error

## Current active slice

- Slice: Gate 4 release-prep and handoff evidence close-out after legacy URL restoration
- Scope:
  - route-validation evidence on already verified surfaces
  - visual/performance sampling inputs
  - release-candidate blocker reduction after `R-005` closure
  - Gate 4 entry-condition evidence gaps

## Deferred slices

- empty/error/loading placeholders beyond `/_not-found`
