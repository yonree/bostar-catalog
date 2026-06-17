# PLANS

## Current sequence

1. Gate 1A close-out: complete
2. Gate 1B engineering readiness: complete
3. Gate 2 implementation: complete
4. Gate 3 content and SEO parity: complete
5. Gate 4 validation and release prep: complete
6. Gate 5 handoff: complete
7. Gate 6 production release: complete
8. Gate 7 post-release stabilization: complete with non-blocking backlog
9. Gate 8 backlog closure and maintenance handoff: complete with business decisions required
10. Gate 9 primary-domain migration and pending-download safety close-out: complete

## Current status

- Gate 1A: complete, `planning/gate1a/**` remains the approved planning archive
- Gate 1B: complete, deterministic local `typecheck` / `lint` / `build` and preview workflow restored
- Gate 2: complete, locale routing, canonical, hreflang, sitemap, robots, and public shell wiring are live
- Gate 3: complete, localized shell and metadata parity implemented for approved public routes
- Gate 4: complete, release-candidate validation and waivers documented
- Gate 5: complete, handoff and delivery control plane prepared
- Gate 6: complete, production retry fix `1767fc9` previously promoted and verified
- Gate 7: `PASS_WITH_NON_BLOCKING_BACKLOG` after production patch `523b6b0` was deployed as `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Gate 8: `MAINTENANCE_HANDOFF_PASS_WITH_BUSINESS_DECISIONS_REQUIRED` after read-only evidence closure for `sample-download.pdf` and `fjbosd.com` / `www.fjbosd.com`, plus maintenance hardening of `scripts/gate7-production-audit.mjs`
- Gate 9: `PRIMARY_DOMAIN_MIGRATION_PASS_WITH_DOWNLOAD_ASSET_PENDING` after the owner-approved `PRIMARY_DOMAIN=https://www.fjbosd.com` migration and `DOWNLOAD=B_PENDING_ASSET` execution were promoted to production deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`

## Gate 7 close-out

- Initial full post-release audit on `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` found four unresolved legacy category routes still returning `404`:
  - `/products/Automatic-Electrostatic-Powder-Rotary-Bell`
  - `/products/Automatic-Electrostatic-Rotary-Bell-Atomizer`
  - `/products/High-Pressure-Airless-Spraying-Equipment`
  - `/products/Testing-Instruments`
- A minimal fallback patch was implemented on branch `fix/gate6-legacy-vercel-404` in commit `523b6b0`.
- Local verification passed on `http://127.0.0.1:3011` after preview restart.
- Preview deployment `dpl_DRV6DRMUZRvxb4jGU79EGcrwLf3v` built successfully and reached `Ready`; direct preview-host fetch from the current agent host timed out, so preview acceptance used Vercel deployment readiness plus local production-build parity.
- Production deployment `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h` is now the live deployment for `https://www.bostarcoating.com`.
- Post-patch full production audit now passes for every approved URL except one business-review orphan asset: `https://www.bostarcoating.com/sample-download.pdf`.

## Gate 8 close-out

- `sample-download.pdf` is no longer an uninvestigated backlog item; it is now a documented owner decision:
  - live zh/en `maintenance-guide` pages still link to it
  - the asset URL returns `404`
  - no in-repo file or verified replacement was found
  - recommended owner answer: `DOWNLOAD=B`
- `fjbosd.com` and `www.fjbosd.com` are no longer an uninvestigated backlog item; they are now a documented owner decision:
  - both aliases are attached to live deployment `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
  - alias hosts serve site content with canonical/hreflang pointing at `https://www.bostarcoating.com`
  - recommended owner answer: `DOMAIN=B`
- `scripts/gate7-production-audit.mjs` now has explicit request timeout, bounded retries, non-fabricated deployment labeling, and non-zero exit signaling for blocking audit failures.

## Gate 9 close-out

- The invalidated Gate 8 domain decision was replaced by the approved owner answer:
  - `DOMAIN=PRIMARY_FJBOSD`
  - sole canonical production origin: `https://www.fjbosd.com`
  - `https://fjbosd.com` -> `https://www.fjbosd.com`
  - `https://www.bostarcoating.com` -> `https://www.fjbosd.com`
  - `https://bostarcoating.com` -> `https://www.fjbosd.com`
- The approved download decision was executed as:
  - `DOWNLOAD=B_PENDING_ASSET`
  - no fake PDF
  - no clickable `404` download on zh/en `maintenance-guide`
  - contact / inquiry entry preserved on the pending state
- Production deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN` now serves `https://www.fjbosd.com` as the only canonical origin while keeping the three non-primary domains as single-hop redirects with path/query preservation.
- Sitemap, robots, Open Graph URL, JSON-LD site URLs, internal absolute URL defaults, and upload fallback redirects are all migrated to `https://www.fjbosd.com`.

## Remaining backlog

- Business-owner asset follow-up only:
  - provide a verified replacement file if the `maintenance-guide` download should become directly downloadable again
- Optional follow-up only:
  - translated English body copy for source-language detail content
  - Lighthouse collection with an approved tooling path

## Next execution slice

- No further autonomous rollout is required for Gate 9.
- The next operator action is either:
  - supply the verified replacement asset for `maintenance-guide`, or
  - start a new maintenance / release slice from production baseline `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`.
