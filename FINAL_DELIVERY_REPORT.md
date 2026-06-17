# Final Delivery Report

## Snapshot

- Date: 2026-06-17
- Branch: `feat/gate2-implementation`
- Release candidate commit: `5f731bf`
- Final status: `PRODUCTION_RELEASE_ROLLED_BACK`

## Delivered scope

- Locale-aware public routing with Chinese at root and English at `/en`
- Localized shared shell, metadata, canonical, hreflang, sitemap, robots, and selected JSON-LD outputs
- English shell coverage for public top-level routes and representative category/detail templates
- Reserved news routes kept online as non-indexed placeholders instead of publishing fabricated content
- Seed fallback restoration for representative public data routes when local Prisma/PostgreSQL content is unavailable
- Restored sampled legacy liquid-product category/detail route families from audited seed facts so approved legacy URLs return local `200` again
- Fixed public lead-form locale hydration by switching all inquiry entry points to server-resolved `locale` and localized `sourcePage`

## Verification summary

- `npm run typecheck`: pass
- `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
- `npm run build`: pass
- Blob offline mirror: `VERIFIED_OFFLINE_MIRROR` for store `store_bf****7AX`, `24/24` objects downloaded, ZIP hash sidecar recorded
- Production deploy attempt: created `dpl_Ff9h5z2tUAvbNSFvmrNUZCzn12CF` from approved release candidate `5f731bf`
- Automatic rollback: restored production to `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB` after legacy liquid category route smoke failed
- zh/en route smoke: pass for core top-level routes, representative detail routes, reserved routes, system 404s, sitemap, and robots
- legacy liquid-product sampled route family: pass on zh/en category/detail pairs with canonical, hreflang, `index, follow`, and sitemap presence
- visual review:
  - desktop `/en/contact`: stable English shell, form, and footer rendering
  - mobile `/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`: stable stacked layout with translation notice and source-language body
- performance evidence:
  - existing fetch/browser baselines recorded on `http://127.0.0.1:3011`
  - no local Lighthouse binary/package was available without installing a new dependency
  - waiver: `LIGHTHOUSE_NOT_EXECUTED`

## Not done

- Gate 6 production release was not left in place because post-release smoke failed on legacy liquid category route acceptance and production was rolled back
- No new English business-body translations were authored for source-language detail content
- No new runtime or QA dependency was installed to collect Lighthouse scores

## Accepted known risks

- Some `/en` detail pages still surface verified Chinese source content; translation notice disclosure is present on the audited data-backed detail routes
- 4 pre-existing lint warnings remain in legacy admin/data modules
- Local Lighthouse is unavailable without adding a new package; release-candidate performance evidence relies on existing browser/fetch baselines instead
- Waiver `LIGHTHOUSE_NOT_EXECUTED` remains an accepted QA gap, not a fabricated pass signal

## Release recommendation

- Do not reattempt Gate 6 until legacy liquid category routes are reproducibly `200` on a production-like Vercel target
- Keep the current production deployment `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB` available as the rollback target
- Resume from the immutable Gate 5 handoff commit `5f731bf` after the legacy route acceptance gap is fixed and revalidated
