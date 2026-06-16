# RISKS

## R-001 English body copy incomplete

- Impact: `/en` pages remain structurally available but much entity/body content is still Chinese.
- Current mitigation: shell, navigation, locale switching, lead form, canonical and hreflang are live.
- Trigger to escalate: before release approval for public English SEO indexing.

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
