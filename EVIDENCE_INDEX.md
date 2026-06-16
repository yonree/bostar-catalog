# EVIDENCE_INDEX

## Planning inputs

- `planning/gate1a/url/url-decision-manifest.csv`
- `planning/gate1a/ia/target-ia.md`
- `planning/gate1a/i18n/route-pairing-matrix.csv`
- `planning/gate1a/seo-geo/metadata-spec.md`
- `planning/gate1a/qa-release/gate1b-engineering-readiness-plan.md`

## Command evidence

- `npm install`: restored missing local binaries in `node_modules/.bin`
- `npx prisma generate`: generated Prisma Client v6.19.3 successfully
- `npm run typecheck`: pass
- `npm run lint`: pass with warnings only
- `npm run build`: pass with warnings only
- 2026-06-16 resumed Gate 3 validation:
  - `npm run typecheck`: pass after home/search/shared-description localization
  - `npm run lint`: pass with 4 pre-existing warnings
  - `npm run build`: pass with the same 4 warnings
  - `npm run typecheck`: pass after product-detail shell localization, seeded product fallback restoration, and locale-rewrite preservation fix
  - `npm run lint`: pass with the same 4 pre-existing warnings after the product-detail slice
  - `npm run build`: pass with the same 4 pre-existing warnings after the product-detail slice

## Smoke evidence

- Local preview during recovery:
  - stale resumed instances observed on `http://127.0.0.1:3008` and `http://127.0.0.1:3009`
  - authoritative post-build instances rotated through `http://127.0.0.1:3010` to `http://127.0.0.1:3011` after subsequent rebuilds
  - final authoritative preview restarted as `next start --hostname 127.0.0.1 --port 3011`, PID `31308`
- Browser checks performed against:
  - `/`
  - `/en`
  - `/products`
  - `/en/products`
  - `/solutions`
  - `/en/solutions`
- Verified:
  - locale-aware `html lang`
  - locale switcher hrefs
  - canonical path changes between root and `/en`
  - header navigation to `/en/products`
- Additional resumed checks against `http://127.0.0.1:3011`:
  - `/en`: English title, canonical, English hero copy, translation notice, English footer description
  - `/en/about`: English title, canonical, breadcrumb labels, and capability cards
  - `/en/search?q=spray`: English title/placeholder/empty-state, `noindex,nofollow`, canonical, translation notice
  - `/en` organization and website JSON-LD descriptions now use English fallback copy
  - zh seeded product detail: `/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - 200 response
    - title `手动粉末静电喷枪 | BOSTAR GEO`
    - canonical `http://localhost:3000/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - hreflang pair to zh/en URLs present
    - breadcrumb JSON-LD present
    - `BS-PM100` and `0.4-0.7 MPa` unchanged
    - `index, follow`, no runtime error
  - en seeded product detail: `/en/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - 200 response, `html lang=en`
    - title `手动粉末静电喷枪 Product Details | BOSTAR GEO`
    - canonical `http://localhost:3000/en/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - hreflang pair to zh/en URLs present
    - English shell headings plus translation notice present
    - no Chinese shell leakage in title/section/breadcrumb UI
    - `BS-PM100` and `0.4-0.7 MPa` unchanged
    - `index, follow`, no runtime error

## Remaining evidence to collect in later gates

- Lighthouse samples for zh/en template pages
- structured-data URL verification on localized detail pages
- Gate 3 review of remaining CMS/seed-backed detail content parity where approved English source copy is still absent
- URL manifest loader or redirect audit if non-host redirects are activated
