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

- Impact: broader Gate 7 production audit proved that legacy category coverage can regress independently from previously restored detail coverage.
- Current mitigation: resolved on 2026-06-17 by extending audited seed-backed compatibility coverage for the remaining approved legacy category family in `lib/data.ts`, `lib/legacy-compatibility.ts`, and `lib/cms-data.ts`; full production re-audit now clears all approved legacy route families except the explicit business-review orphan asset.
- Trigger to escalate: if a future deployment changes the compatibility manifest or product fallback layer and any approved legacy category/detail route drops out of `GATE7_PRODUCTION_URL_RESULTS.csv`.

## R-006 Lighthouse evidence gap

- Impact: no fresh Lighthouse score is available for the release candidate.
- Current mitigation: waiver `LIGHTHOUSE_NOT_EXECUTED` is explicitly accepted under `D-008`; browser/fetch baselines plus desktop/mobile visual review remain the recorded performance evidence set.
- Trigger to escalate: if Gate 6 or post-release monitoring requires quantified Lighthouse scoring before or immediately after production release.

## R-007 Legacy production route acceptance gap

- Impact: this was the active Gate 6 release blocker because legacy liquid category routes `/products/Manual-Electrostatic-Liquid-Spray-Gun` and `/en/products/Manual-Electrostatic-Liquid-Spray-Gun` failed acceptance on the prior public deployment baseline.
- Current mitigation: resolved in production by promoting fix commit `1767fc9`, which restores the approved legacy liquid category/detail family through a selective compatibility manifest and verified public route reachability on the promoted deployment `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC`.
- Trigger to escalate: only if a future production deployment changes `lib/cms-data.ts`, `lib/legacy-compatibility.ts`, or the audited legacy route family and those exact URLs are not re-smoked before release.

## R-008 Local agent IP hits Vercel security checkpoint

- Impact: direct shell-based HTTP smoke from the current agent host can receive `403 Vercel Security Checkpoint`, which makes local PowerShell fetches unreliable as the sole production verification channel after repeated deployment testing.
- Current mitigation: final production smoke is anchored on live deployment resolution plus external public fetches, while local shell requests are treated as host-specific challenge evidence only.
- Trigger to escalate: if all independent public verification channels start returning the same 403 challenge, or if human browser verification reports a public access failure.

## R-009 Orphaned public asset remains unresolved

- Impact: `https://www.bostarcoating.com/sample-download.pdf` still resolves to `404` and has no verified in-repo source file or approved replacement target.
- Current mitigation: Gate 8 verified that live zh/en `maintenance-guide` detail pages still link to the asset, documented the decision surface in `GATE8_BACKLOG_DECISION_REPORT.md`, and recommended owner answer `DOWNLOAD=B` instead of fabricating a file or retiring the URL without approval.
- Trigger to escalate: if business requires the file to remain publicly reachable, confirms a verified replacement, or approves retirement of the download CTA.

## R-010 Extra production aliases remain attached to the Vercel project

- Impact: the live production deployment for `www.bostarcoating.com` also carries `fjbosd.com` and `www.fjbosd.com` aliases, which expands the public surface beyond the declared primary domain.
- Current mitigation: Gate 8 verified the aliases are live on `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`, serve site content, and canonicalize to the primary host; no alias or DNS mutation was made, and the owner-decision path is recorded in `GATE8_BACKLOG_DECISION_REPORT.md` with recommended answer `DOMAIN=B`.
- Trigger to escalate: if those aliases are unintended, if they should be normalized with redirect behavior, or if a future release changes alias ownership or exposure.
