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
  - `npm run typecheck`: pass after remaining detail-shell localization and seeded detail fallback restoration
  - `npm run lint`: pass with the same 4 pre-existing warnings after the remaining detail-shell slice
  - `npm run build`: pass with the same 4 pre-existing warnings after the remaining detail-shell slice

## Smoke evidence

- Local preview during recovery:
  - stale resumed instances observed on `http://127.0.0.1:3008` and `http://127.0.0.1:3009`
  - authoritative post-build instances rotated through `http://127.0.0.1:3010` to `http://127.0.0.1:3011` after subsequent rebuilds
  - final authoritative preview restarted as `next start --hostname 127.0.0.1 --port 3011`, listener PID `24972` (spawned via `npm run start -- --hostname 127.0.0.1 --port 3011`, parent PID `16760`)
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
    - title `鎵嬪姩绮夋湯闈欑數鍠锋灙 | BOSTAR GEO`
    - canonical `http://localhost:3000/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - hreflang pair to zh/en URLs present
    - breadcrumb JSON-LD present
    - `BS-PM100` and `0.4-0.7 MPa` unchanged
    - `index, follow`, no runtime error
  - en seeded product detail: `/en/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - 200 response, `html lang=en`
    - title `鎵嬪姩绮夋湯闈欑數鍠锋灙 Product Details | BOSTAR GEO`
    - canonical `http://localhost:3000/en/products/manual-powder-coating-gun/manual-powder-spray-gun`
    - hreflang pair to zh/en URLs present
    - English shell headings plus translation notice present
    - no Chinese shell leakage in title/section/breadcrumb UI
    - `BS-PM100` and `0.4-0.7 MPa` unchanged
    - `index, follow`, no runtime error
  - zh/en seeded remaining detail pairs:
    - case: `/cases/hardware-powder-coating-case` and `/en/cases/hardware-powder-coating-case`
      - 200 response on both locales
      - titles `五金制品喷涂项目案例 | BOSTAR GEO` and `五金制品喷涂项目案例 Case Study | BOSTAR GEO`
      - canonical and hreflang zh/en pair present
      - breadcrumb JSON-LD present
      - English `Case Studies` shell present
      - `index, follow`, no runtime error
    - download: `/downloads/powder-gun-catalog` and `/en/downloads/powder-gun-catalog`
      - 200 response on both locales
      - titles `粉末静电喷枪产品画册 | BOSTAR GEO` and `粉末静电喷枪产品画册 Download | BOSTAR GEO`
      - canonical and hreflang zh/en pair present
      - breadcrumb JSON-LD present
      - English `Downloads`, `Resource Type`, and access CTA shell present
      - `index, follow`, no runtime error
    - video: `/videos/powder-gun-operation` and `/en/videos/powder-gun-operation`
      - 200 response on both locales
      - titles `粉末静电喷枪基础操作 | BOSTAR GEO` and `粉末静电喷枪基础操作 Video | BOSTAR GEO`
      - canonical and hreflang zh/en pair present
      - breadcrumb JSON-LD present
      - English `Video Center` and `Video Summary` shell present
      - `index, follow`, no runtime error
    - solution: `/solutions/hardware-powder-coating` and `/en/solutions/hardware-powder-coating`
      - 200 response on both locales
      - titles `五金件粉末喷涂解决方案 | BOSTAR GEO` and `五金件粉末喷涂解决方案 Solution | BOSTAR GEO`
      - canonical and hreflang zh/en pair present
      - breadcrumb JSON-LD present
      - English `Solutions`, `Consult This Solution`, and `Frequently Asked Questions` shell present
      - `index, follow`, no runtime error
    - knowledge: `/knowledge/selection-guide/how-to-choose-electrostatic-spray-gun` and `/en/knowledge/selection-guide/how-to-choose-electrostatic-spray-gun`
      - 200 response on both locales
      - titles `静电喷枪怎么选？ | BOSTAR GEO` and `静电喷枪怎么选？ Knowledge Article | BOSTAR GEO`
      - canonical and hreflang zh/en pair present
      - breadcrumb JSON-LD present
      - English `Knowledge Center`, `Frequently Asked Questions`, and inquiry CTA shell present
      - `index, follow`, no runtime error

## Remaining evidence to collect in later gates

- Lighthouse samples for zh/en template pages
- structured-data URL verification on localized detail pages
- Gate 3 review of remaining CMS/seed-backed content parity where approved English source copy is still absent
- URL manifest loader or redirect audit if non-host redirects are activated
