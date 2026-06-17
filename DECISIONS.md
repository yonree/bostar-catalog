# DECISIONS

## D-001

- Date: 2026-06-16
- Decision: keep Chinese at root paths and English at `/en`, per Gate 1A locale registry.
- Reason: preserves approved URL contract and avoids route tree duplication.

## D-002

- Date: 2026-06-16
- Decision: implement English routing through middleware rewrite plus request headers instead of duplicating all App Router files.
- Reason: lower blast radius, faster rollout, shared templates remain single-source.

## D-003

- Date: 2026-06-16
- Decision: canonical metadata is generated from request pathname at the root layout.
- Reason: removes the previous site-wide fixed canonical `/` bug and enables locale-aware alternates.

## D-004

- Date: 2026-06-16
- Decision: migrate lint from deprecated interactive `next lint` to CLI ESLint flat config.
- Reason: Gate 1B requires non-interactive, repeatable validation.

## D-005

- Date: 2026-06-16
- Decision: introduce `tsconfig.typecheck.json` for standalone typecheck while keeping Next build as the route-type authority.
- Reason: direct `tsc` against `.next/types` was not stable in this workspace.

## D-006

- Date: 2026-06-16
- Decision: keep `/news` and `/en/news` online as reserved routes, but mark them `noindex,nofollow` and remove them from `sitemap.xml` until a verified news source exists.
- Reason: preserves the approved URL surface without presenting placeholder news inventory as indexable content.

## D-007

- Date: 2026-06-16
- Decision: emit only verified product/video schema facts and remove hardcoded offer or publish placeholders that are not backed by repository data.
- Reason: avoids publishing fabricated price, stock, or upload-date signals through JSON-LD.

## D-008

- Date: 2026-06-17
- Waiver: `LIGHTHOUSE_NOT_EXECUTED`
- Decision: do not install Lighthouse during the current rollout; treat existing browser/fetch baselines plus desktop/mobile visual review as the Gate 4 performance evidence set.
- Reason: local `lighthouse` is not installed, `npx --no-install lighthouse --version` confirms no existing package is available, and adding a new QA dependency mid-rollout is not required to verify current release-candidate behavior.

## D-009

- Date: 2026-06-17
- Decision: treat source-language English detail pages as release-candidate acceptable when English shell copy, localized metadata, canonical/hreflang, and the manual-verification translation notice are present.
- Reason: approved English business-body copy is not available in current repository data sources, and publishing fabricated translations would be less correct than shipping verified Chinese source content with explicit disclosure.

## D-010

- Date: 2026-06-17
- Decision: block Gate 6 production release until the exact production Neon binding and recoverable DB/media backup evidence are verifiable without reading protected secret values.
- Reason: the Vercel project, domain aliases, current production deployment, and production env names are verifiable, but encrypted `NEON_PROJECT_ID` prevents a non-secret proof of which accessible Neon project is actually bound to production, and no equivalent non-secret backup evidence was available for the active Blob store.

## D-011

- Date: 2026-06-17
- Decision: treat Vercel -> Neon binding and Neon PITR readiness as verified for Gate 6, and keep the release blocked only on Blob recovery assurance for store `store_bf****7AX`.
- Reason: read-only Vercel integration metadata uniquely ties production database secrets to Neon resource `neon-fuchsia-jacket` / project `odd-****-7926` on branch `main`, Neon metadata confirms a 6-hour history retention window on that project, and code inspection proves `SMTP_*`, `WEBHOOK_*`, and `UPLOAD_PROVIDER` are not runtime blockers. The remaining unverifiable safety gap is Blob restore coverage.

## D-012

- Date: 2026-06-17
- Decision: mark Gate 6 as `PRODUCTION_RELEASE_ROLLED_BACK` after the approved release candidate deployed successfully but failed production smoke on legacy liquid category URL acceptance.
- Reason: Blob recovery assurance was closed with an offline mirror, but the new production deployment returned `404` for `/products/Manual-Electrostatic-Liquid-Spray-Gun` and `/en/products/Manual-Electrostatic-Liquid-Spray-Gun`, which matches the user-defined automatic rollback condition. Production was restored to `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB`.

## D-013

- Date: 2026-06-17
- Decision: restore only the approved legacy liquid route family through an explicit compatibility manifest and selective seed fallback inside `lib/cms-data.ts`.
- Reason: the audited legacy contract required category/detail recovery for specific liquid route families, but a blanket "DB empty -> all seed data" fallback would have risked inventing content for unknown slugs. The approved manifest keeps the recovery scope tight, traceable, and reversible.

## D-014

- Date: 2026-06-17
- Decision: use the Vercel promote API endpoint instead of the CLI promote/rollback commands for the final Gate 6 retry.
- Reason: `vercel promote` and `vercel rollback` returned false team-mismatch and rollback-depth errors in this workspace, while the authenticated API path successfully switched active production traffic for the same project/team context.

## D-015

- Date: 2026-06-17
- Decision: treat external public fetches plus live deployment resolution as the source of truth for the final production smoke after the retry promote.
- Reason: repeated local shell requests from the agent host began receiving `403 Vercel Security Checkpoint`, which no longer represented general public reachability. External fetches still reached the promoted production deployment and confirmed the target route family publicly.

## D-016

- Date: 2026-06-17
- Decision: invalidate the earlier Gate 8 recommendation that would have normalized `fjbosd.com` toward `www.bostarcoating.com`, and instead adopt `https://www.fjbosd.com` as the sole canonical production origin.
- Reason: the business owner explicitly superseded the earlier domain conclusion and approved `PRIMARY_DOMAIN=https://www.fjbosd.com` with permanent redirects from `fjbosd.com`, `www.bostarcoating.com`, and `bostarcoating.com` to the new primary host while preserving path and query.

## D-017

- Date: 2026-06-17
- Decision: execute the download-owner answer as `DOWNLOAD=B_PENDING_ASSET`, keeping `maintenance-guide` online with a pending-state card, no fake PDF, no clickable `404` download, and preserved contact / inquiry entry.
- Reason: a verified replacement file is still unavailable, and publishing fabricated media or leaving a broken CTA would be less correct than holding the asset in an explicit pending state.
