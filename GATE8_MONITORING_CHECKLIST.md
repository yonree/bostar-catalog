# Gate 8 Monitoring Checklist

## Release-day checks

- [ ] `git status --porcelain` is clean before release
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` has no new warnings or errors
- [ ] `npm run build` passes
- [ ] `node scripts/gate7-production-audit.mjs` completes without blocking failures
- [ ] `node scripts/smoke-legacy-routes.mjs https://www.bostarcoating.com` passes
- [ ] production deployment resolves to the intended Vercel deployment
- [ ] `/sitemap.xml` and `/robots.txt` return `200`
- [ ] representative zh/en homepage and contact pages return `200`
- [ ] representative legacy category/detail routes return `200`

## SEO checks

- [ ] canonical stays on `https://www.bostarcoating.com`
- [ ] hreflang zh/en pairs remain intact
- [ ] `html lang` matches locale
- [ ] reserved noindex routes stay non-indexed
- [ ] alias hosts do not become primary canonical targets

## Asset and recovery checks

- [ ] Blob offline mirror evidence path is still available
- [ ] Neon restore evidence is still current
- [ ] no new broken download URLs were introduced
- [ ] `sample-download.pdf` decision state is still documented

## Domain checks

- [ ] `vercel inspect https://www.bostarcoating.com` alias list is unchanged or intentionally updated
- [ ] `fjbosd.com` / `www.fjbosd.com` state matches the approved business decision
- [ ] no unexpected extra public aliases appear on production

## Handoff checks

- [ ] `PROJECT_STATE.md` reflects the latest gate and live deployment
- [ ] `EVIDENCE_INDEX.md` references the latest release evidence
- [ ] `RISKS.md` reflects current unresolved items
- [ ] `CHANGELOG_EXECUTION.md` records the latest maintenance action
