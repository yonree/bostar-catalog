# GATE3_ROUTE_MATRIX

## Snapshot

- Date: 2026-06-16
- Branch: `feat/gate2-implementation`
- HEAD baseline for this matrix: `d0fb7356ba342bab7212700576c0de55d1386d35`
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
- `/news`
- `/news/[slug]` placeholder route
- `/en`
- `/en/about`
- `/en/search`

### IMPLEMENTED_NOT_VERIFIED

- `/faq`
- `/service`
- `/contact`
- `/about`
- `/`

### SAFE_TO_IMPLEMENT

- static public surface verification for `/faq`, `/service`, `/contact`, `/about`, and `/`
- page-level empty-state wording on list pages backed by seed fallback

### SYSTEM_PLACEHOLDER

- `/news/[slug]` placeholder detail kept as `noindex,nofollow` until verified news content exists
- `/_not-found` localized and verified as a 404/noindex system route

### LEGACY_URL_PENDING

- redirect and old-URL reconciliation still pending against Gate 3 / Gate 4 audit

### BUSINESS_DECISION_REQUIRED

- approved English business-body copy for data-backed Chinese source content
- whether `/news` should remain a reserved index or be hidden pending a real news source

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

- Slice: system route repair plus static public surfaces
- Scope:
  - `/_not-found`
  - `/faq`
  - `/service`
  - `/contact`
  - `/about`
  - `/`

## Deferred slices

- empty/error/loading placeholders beyond `/_not-found`
- legacy URL and sitemap parity audit
