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
