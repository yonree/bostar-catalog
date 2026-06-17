# PROJECT_STATE

## Snapshot

- Date: 2026-06-17
- Working branch: `fix/gate9-primary-domain-fjbosd`
- Stable production baseline branch: `codex/gate8-maintenance-handoff`
- Stable production baseline tag: `maintenance-handoff-2026-06-17`
- Stable production baseline commit: `d7265f9`
- Maintenance tooling commit: `bde0346`
- Gate 9 candidate commit: `062b729`
- Gate 9 candidate tag: `gate9-fjbosd-domain-migration-candidate-2026-06-17`
- Current local preview: `http://127.0.0.1:3011`
- Current gate: `PRIMARY_DOMAIN_MIGRATION_PASS_WITH_DOWNLOAD_ASSET_PENDING`
- Production domain: `https://www.fjbosd.com`
- Live production deployment: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`

## Completed in Gate 8

- Recovered from the Gate 7 stable baseline on a clean worktree and verified that production still resolves to `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Audited `sample-download.pdf` end to end with read-only evidence:
  - no in-repo file under the workspace or `public/**`
  - live zh/en `maintenance-guide` pages still link to `/sample-download.pdf`
  - the asset URL returns production `404`
  - no verified replacement asset was found
- Audited `fjbosd.com` and `www.fjbosd.com` with read-only Vercel, DNS, and HTTP checks:
  - both aliases are attached to the live production deployment
  - `fjbosd.com` redirects to `https://www.fjbosd.com/`
  - alias-host HTML serves site content but canonicalizes to `https://www.bostarcoating.com`
- Hardened `scripts/gate7-production-audit.mjs`:
  - added explicit request timeout handling
  - added bounded retries
  - removed stale default deployment-id attribution
  - added non-zero exit signaling for blocking audit failures
- Created Gate 8 maintenance handoff artifacts:
  - `GATE8_BACKLOG_DECISION_REPORT.md`
  - `GATE8_MAINTENANCE_RUNBOOK.md`
  - `GATE8_MONITORING_CHECKLIST.md`
  - `GATE8_BUSINESS_DECISIONS_REQUIRED.md`

## Completed in Gate 9

- Superseded the invalidated Gate 8 domain recommendation with the approved owner answer:
  - `DOMAIN=PRIMARY_FJBOSD`
  - `PRIMARY_ORIGIN=https://www.fjbosd.com`
  - `fjbosd.com` -> `https://www.fjbosd.com`
  - `www.bostarcoating.com` -> `https://www.fjbosd.com`
  - `bostarcoating.com` -> `https://www.fjbosd.com`
- Executed the approved download decision:
  - `DOWNLOAD=B_PENDING_ASSET`
  - no fake PDF was created
  - `maintenance-guide` zh/en detail pages now show a pending-state card instead of a clickable `404` download
  - contact / lead-form entry remains available on the pending state
- Centralized the canonical site origin in `lib/site-origin.ts` and rewired middleware, sitemap, robots, upload fallback redirects, and site metadata defaults to `https://www.fjbosd.com`
- Verified Gate 9 local production-build parity on `http://127.0.0.1:3011`:
  - legacy and apex host-header requests redirect to `https://www.fjbosd.com` with path/query preservation
  - `/`, `/en`, `/downloads/maintenance-guide`, `/en/downloads/maintenance-guide`, `/sitemap.xml`, and `/robots.txt` all emit the new primary origin and no longer reference `www.bostarcoating.com`
- Built preview deployment `dpl_jyphDTLWbJY3Y8GJuFVhumfcnqAz` and production deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN` from commit `062b729`
- Completed public production verification:
  - `https://www.fjbosd.com` serves canonical content
  - `https://fjbosd.com` redirects in one hop to `https://www.fjbosd.com`
  - `https://www.bostarcoating.com` redirects in one hop to `https://www.fjbosd.com`
  - `https://bostarcoating.com` redirects in one hop to `https://www.fjbosd.com`
  - representative `/en/products`, legacy liquid path, product category, knowledge category, and zh/en `maintenance-guide` pages all canonicalize to `https://www.fjbosd.com`

## Active blockers

- No hard blocker remains inside repository-controlled work
- Business decisions are now resolved:
  - `DOWNLOAD=B_PENDING_ASSET`
  - `DOMAIN=PRIMARY_FJBOSD`
- Remaining non-blocking follow-up:
  - publish the real replacement asset only after the owner provides the verified file and target policy

## Latest verification

- Gate 8 tooling verification:
  - `node scripts/gate7-production-audit.mjs` with explicit live deployment id and bounded request policy:
    - `PASS_301`: `58`
    - `PASS_200`: `65`
    - `EXPECTED_NOINDEX`: `1`
    - `BUSINESS_REVIEW_REQUIRED`: `1`
    - `BLOCKING_FAILURES`: `0`
  - `npm run typecheck`: pass
  - `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
  - `npm run build`: pass with the same 4 pre-existing warnings and no new warnings
- Gate 8 production fact verification:
  - `vercel inspect https://www.bostarcoating.com`: live deployment remains `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
  - `vercel domains ls`: `fjbosd.com` remains present under the same Vercel team
  - public fetch:
    - `https://www.bostarcoating.com/sample-download.pdf` -> `404`
    - `https://www.bostarcoating.com/downloads/maintenance-guide` -> `200`
    - `https://www.bostarcoating.com/en/downloads/maintenance-guide` -> `200`
    - `https://fjbosd.com` -> `308` -> `https://www.fjbosd.com/`
    - `https://www.fjbosd.com/` -> `200`
- Gate 9 code verification:
  - `npm run typecheck`: pass
  - `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
  - `NEXT_PUBLIC_SITE_URL=https://www.fjbosd.com npm run build`: pass
- Gate 9 preview verification:
  - `vercel deploy --yes --build-env NEXT_PUBLIC_SITE_URL=https://www.fjbosd.com --env NEXT_PUBLIC_SITE_URL=https://www.fjbosd.com`: preview deployment `dpl_jyphDTLWbJY3Y8GJuFVhumfcnqAz`
  - `vercel inspect https://bostar-geo-website-h0vvy345o-yonree-s-projects.vercel.app`: `Ready`
  - direct shell fetch against the preview hostname returned the Vercel Authentication wall, so preview acceptance used deployment readiness plus local production-build parity
- Gate 9 production verification:
  - `vercel inspect https://bostar-geo-website-4ztdadjpu-yonree-s-projects.vercel.app`: pre-migration production deployment `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
  - `vercel inspect https://bostar-geo-website-mwa7r7qxg-yonree-s-projects.vercel.app`: post-migration production deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`
  - public fetch:
    - `https://www.fjbosd.com/` -> `200`, canonical `https://www.fjbosd.com`
    - `https://fjbosd.com/` -> `308` -> `https://www.fjbosd.com/`
    - `https://www.bostarcoating.com/` -> `301` -> `https://www.fjbosd.com/`
    - `https://bostarcoating.com/` -> `301` -> `https://www.fjbosd.com/`
    - `https://www.bostarcoating.com/en/products?ref=gate9` -> `301` -> `https://www.fjbosd.com/en/products?ref=gate9`
    - `https://bostarcoating.com/products/Manual-Electrostatic-Liquid-Spray-Gun?src=legacy` -> `301` -> `https://www.fjbosd.com/products/Manual-Electrostatic-Liquid-Spray-Gun?src=legacy`
    - `https://www.fjbosd.com/sitemap.xml` contains only `www.fjbosd.com`
    - `https://www.fjbosd.com/robots.txt` points only to `https://www.fjbosd.com/sitemap.xml`
    - live zh/en `maintenance-guide` pages no longer expose `/sample-download.pdf` as a clickable href

## Next task

- Gate 9 primary-domain migration is complete.
- Next operator action is optional only:
  - publish a verified replacement file for `maintenance-guide`, or
  - keep the current pending-asset state until a verified asset exists.
