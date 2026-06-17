# Gate 9 Business Decision Implementation

## Approved owner answers

- `DOMAIN=PRIMARY_FJBOSD`
- `PRIMARY_ORIGIN=https://www.fjbosd.com`
- `DOWNLOAD=B_PENDING_ASSET`

## Implemented domain policy

- Canonical production origin: `https://www.fjbosd.com`
- Permanent redirect domains:
  - `https://fjbosd.com` -> `https://www.fjbosd.com`
  - `https://www.bostarcoating.com` -> `https://www.fjbosd.com`
  - `https://bostarcoating.com` -> `https://www.fjbosd.com`
- Redirect contract:
  - permanent redirect
  - preserve path
  - preserve query
  - no redirect loop
  - no homepage-collapse for legacy subpaths

## Implemented download policy

- `maintenance-guide` keeps its public detail routes online in both locales
- the detail page no longer renders a clickable `/sample-download.pdf` href
- the page now renders an explicit pending-asset card:
  - Chinese: `资料更新中`
  - English: `File Update In Progress`
- contact / inquiry entry remains available through the existing lead form
- no fake asset was generated
- no Blob overwrite was performed

## Implementation scope

- Code and config:
  - `lib/site-origin.ts`
  - `middleware.ts`
  - `lib/site.ts`
  - `lib/site-settings.ts`
  - `public/robots.txt`
  - `app/uploads/[...path]/route.ts`
  - `app/downloads/[slug]/page.tsx`
  - `lib/cms-data.ts`
  - `.env.production.example`
  - `.github/workflows/smoke.yml`
  - `scripts/gate7-production-audit.mjs`
  - `scripts/smoke-cover-render.mjs`
  - `scripts/smoke-media-picker-ui.mjs`
  - `scripts/smoke-regression.mjs`

## Release checkpoints

- Code checkpoint: `062b729` (`fix(gate9): migrate canonical origin to fjbosd`)
- Candidate tag: `gate9-fjbosd-domain-migration-candidate-2026-06-17`
- Preview deployment: `dpl_jyphDTLWbJY3Y8GJuFVhumfcnqAz`
- Production deployment: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`

## Outcome

- Final status: `PRIMARY_DOMAIN_MIGRATION_PASS_WITH_DOWNLOAD_ASSET_PENDING`
