# Gate 9 Domain Migration Report

## Snapshot

- Date: 2026-06-17
- Branch: `fix/gate9-primary-domain-fjbosd`
- Code commit: `062b729`
- Candidate tag: `gate9-fjbosd-domain-migration-candidate-2026-06-17`
- Pre-migration production deployment: `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Preview deployment: `dpl_jyphDTLWbJY3Y8GJuFVhumfcnqAz`
- Post-migration production deployment: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`
- Final status: `PRIMARY_DOMAIN_MIGRATION_PASS_WITH_DOWNLOAD_ASSET_PENDING`

## Approved policy

- `https://www.fjbosd.com` is the only canonical production origin.
- `https://fjbosd.com` permanently redirects to `https://www.fjbosd.com`.
- `https://www.bostarcoating.com` permanently redirects to `https://www.fjbosd.com`.
- `https://bostarcoating.com` permanently redirects to `https://www.fjbosd.com`.
- Redirects preserve path and query.
- `DOWNLOAD=B_PENDING_ASSET` remains in force for `maintenance-guide`.

## Code changes

- Introduced a single site-origin helper in `lib/site-origin.ts`.
- Updated middleware redirect normalization to force `https://www.fjbosd.com`.
- Repointed site metadata defaults, sitemap, robots, Open Graph URL, JSON-LD site URLs, and upload fallback redirects to the new primary origin.
- Reworked `maintenance-guide` zh/en detail pages so they no longer expose a clickable `404` download.

## Verification

### Local

- `npm run typecheck`: pass
- `npm run lint`: pass, still only the same 4 pre-existing warnings
- `NEXT_PUBLIC_SITE_URL=https://www.fjbosd.com npm run build`: pass
- Local `next start` on `http://127.0.0.1:3011`:
  - host-header redirects for `fjbosd.com`, `www.bostarcoating.com`, and `bostarcoating.com` point to `https://www.fjbosd.com`
  - `/`, `/en`, `/downloads/maintenance-guide`, `/en/downloads/maintenance-guide`, `/sitemap.xml`, and `/robots.txt` all emit the new primary domain

### Preview

- Preview deployment `dpl_jyphDTLWbJY3Y8GJuFVhumfcnqAz` reached `Ready`.
- Direct shell fetch of the preview hostname hit the Vercel Authentication wall from the current agent host.
- Preview acceptance therefore used deployment readiness plus local production-build parity.

### Production

- `vercel inspect` confirms `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN` is `Ready` and carries all four business domains.
- Redirect verification is recorded in `GATE9_REDIRECT_RESULTS.csv`.
- Canonical and hreflang verification is recorded in `GATE9_CANONICAL_RESULTS.csv`.
- Additional live checks:
  - homepage `og:url` -> `https://www.fjbosd.com`
  - homepage `Organization` and `WebSite` JSON-LD URLs -> `https://www.fjbosd.com`
  - `https://www.fjbosd.com/sitemap.xml` references only `https://www.fjbosd.com`
  - `https://www.fjbosd.com/robots.txt` references only `https://www.fjbosd.com/sitemap.xml`
  - zh/en `maintenance-guide` detail pages show pending state and no `/sample-download.pdf` href

## Rollback reference

- Pre-migration production baseline remains `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`.
- No rollback was required during Gate 9.
