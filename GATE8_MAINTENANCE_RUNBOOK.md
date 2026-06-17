# Gate 8 Maintenance Runbook

## Scope

- Production domain: `https://www.bostarcoating.com`
- Stable production deployment baseline: `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Stable tag baseline: `post-release-stable-2026-06-17`
- Approved URL audit helper: `scripts/gate7-production-audit.mjs`
- Legacy smoke helper: `scripts/smoke-legacy-routes.mjs`

## Before each release

1. Check Git state:
   - `git status --porcelain`
   - `git log --oneline --decorate -5`
2. Run local validation:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
3. Run URL and legacy checks:
   - `$env:GATE7_DEPLOYMENT_ID='<deployment-id>'; node scripts/gate7-production-audit.mjs`
   - `node scripts/smoke-legacy-routes.mjs https://www.bostarcoating.com`
4. Confirm SEO surfaces:
   - `/sitemap.xml`
   - `/robots.txt`
   - representative zh/en homepage, contact, product category, product detail
5. Confirm recovery prerequisites:
   - Blob offline mirror path still exists or has a fresher verified replacement
   - Neon PITR / restore evidence is still current
6. Confirm deployment target:
   - `vercel inspect https://www.bostarcoating.com`
   - correct team, project, and target environment

## After each release

1. Resolve live production deployment:
   - `vercel inspect https://www.bostarcoating.com`
2. Smoke primary pages:
   - `/`
   - `/en`
   - `/about`
   - `/en/about`
   - `/contact`
   - `/en/contact`
3. Smoke legacy surfaces:
   - representative legacy category routes
   - representative legacy detail routes
4. Confirm metadata surfaces:
   - canonical
   - hreflang
   - `html lang`
   - robots
5. Confirm shared system outputs:
   - `/sitemap.xml`
   - `/robots.txt`
   - `404`
6. Confirm runtime support paths:
   - download detail page
   - knowledge detail page
   - solution detail page
   - lead form locale shell

## Daily checks

- `vercel inspect https://www.bostarcoating.com`
- homepage and `/en` response check
- one legacy category and one legacy detail response check
- `/robots.txt` response check

## Weekly checks

- `node scripts/gate7-production-audit.mjs`
- `$env:GATE7_DEPLOYMENT_ID='<deployment-id>'; node scripts/gate7-production-audit.mjs`
- `node scripts/smoke-legacy-routes.mjs https://www.bostarcoating.com`
- sampled zh/en metadata review for product, solution, knowledge, and contact
- verify `sample-download.pdf` and domain-decision items have not silently changed state

## Monthly checks

- re-verify Blob offline mirror presence and extractability
- re-verify Neon restore/PITR evidence
- re-check extra aliases attached to the production deployment
- review whether Gate 8 business decisions have been resolved and documented

## Rollback notes

- Production rollback baseline before future changes must be recorded from `vercel inspect`
- Do not rely on undocumented ad hoc redirects or file replacements
- If legacy category/detail URLs regress again, stop and audit against:
  - `planning/gate1a/url/url-decision-manifest.csv`
  - `GATE7_PRODUCTION_URL_RESULTS.csv`
  - `GATE7_SEO_RESULTS.csv`

## Open business decisions

- `DOWNLOAD=A/B/C`
- `DOMAIN=A/B/C`
