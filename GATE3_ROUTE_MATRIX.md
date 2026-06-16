# GATE3_ROUTE_MATRIX

## Snapshot

- Date: 2026-06-16
- Branch: `feat/gate2-implementation`
- HEAD baseline for this matrix: `3f47ca4d6305bb065ebd6247beec715d36ec4184`
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
- `/faq`
- `/service`
- `/contact`
- `/about`
- `/`
- `/en`
- `/en/about`
- `/en/search`

### SAFE_TO_IMPLEMENT

- sitemap coverage and canonical/hreflang parity audit against current public-route inventory
- remaining system placeholder and reserved-route verification beyond `/_not-found`
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

- Slice: URL, sitemap, and remaining system-route parity audit
- Scope:
  - `app/sitemap.ts`
  - public-route coverage against current route matrix
  - placeholder/reserved routes beyond `/_not-found`

## Deferred slices

- empty/error/loading placeholders beyond `/_not-found`
