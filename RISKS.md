# RISKS

## R-001 English body copy incomplete

- Impact: several `/en` data-backed detail pages still surface verified Chinese source titles/body copy.
- Current mitigation: English shell, navigation, metadata, locale switching, lead form, canonical and hreflang are live; audited detail routes now display the manual-verification translation notice before source-language technical content.
- Trigger to escalate: if a fully translated English content launch is required rather than a release candidate built on verified source-language facts.

## R-002 Existing warnings in non-target modules

- Impact: lint/build output still contains warnings in admin and utility files.
- Current mitigation: warnings are tracked, not promoted to blocking errors in this slice.
- Trigger to escalate: if warnings expand into correctness or hydration issues.

## R-003 Structured data locale coverage partial

- Impact: some schema components may still emit default-locale URLs or default copy.
- Current mitigation: root metadata, sitemap, robots, route-level alternates, reserved news-route indexing policy, and verified-fact product/video schema output are correct.
- Trigger to escalate: before Gate 4 SEO acceptance.

## R-004 Local preview depends on generated Prisma Client

- Impact: clean environments require `prisma generate` before build/start.
- Current mitigation: preserved `postinstall` and recorded the requirement in evidence and changelog.
- Trigger to escalate: if CI or clean checkout fails to generate client automatically.

## R-005 Legacy product URLs lack local source entities

- Impact: sampled Gate 1A legacy liquid-product families previously blocked Gate 4 because required `200` routes returned `404`.
- Current mitigation: resolved locally on 2026-06-17 by restoring audited seed-backed category/detail entities in `lib/data.ts`; zh/en route, metadata, and sitemap parity revalidated on `http://127.0.0.1:3011`.
- Trigger to escalate: only if broader legacy URL audit finds additional uncovered families beyond the restored sampled routes.

## R-006 Lighthouse evidence gap

- Impact: no fresh Lighthouse score is available for the release candidate.
- Current mitigation: waiver `LIGHTHOUSE_NOT_EXECUTED` is explicitly accepted under `D-008`; browser/fetch baselines plus desktop/mobile visual review remain the recorded performance evidence set.
- Trigger to escalate: if Gate 6 or post-release monitoring requires quantified Lighthouse scoring before or immediately after production release.

## R-007 Legacy production route acceptance gap

- Impact: Gate 6 cannot remain deployed because legacy liquid category routes `/products/Manual-Electrostatic-Liquid-Spray-Gun` and `/en/products/Manual-Electrostatic-Liquid-Spray-Gun` fail acceptance on Vercel production smoke.
- Current mitigation: production has already been rolled back to `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB`; Blob recovery assurance is now covered by offline mirror evidence and is no longer the active blocker.
- Trigger to escalate: before any next production deploy attempt, reproduce and fix the route-family `404` on a production-like target, then rerun Gate 6 smoke against the fixed candidate.
