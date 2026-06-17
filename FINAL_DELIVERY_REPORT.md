# Final Delivery Report

## Snapshot

- Date: 2026-06-17
- Branch: `fix/gate6-legacy-vercel-404`
- Release candidate commit: `1767fc9`
- Final status: `PRODUCTION_RELEASE_PASS`

## Delivered scope

- Locale-aware public routing with Chinese at root and English at `/en`
- Localized shared shell, metadata, canonical, hreflang, sitemap, robots, and selected JSON-LD outputs
- English shell coverage for public top-level routes and representative category/detail templates
- Reserved news routes kept online as non-indexed placeholders instead of publishing fabricated content
- Seed fallback restoration for representative public data routes when local Prisma/PostgreSQL content is unavailable
- Restored sampled legacy liquid-product category/detail route families from audited seed facts so approved legacy URLs return local `200` again
- Fixed public lead-form locale hydration by switching all inquiry entry points to server-resolved `locale` and localized `sourcePage`
- Completed Gate 6 production retry by promoting fix deployment `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` from commit `1767fc98162aa7a99dfa1d30e185399adefcd609`

## Verification summary

- `npm run typecheck`: pass
- `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
- `npm run build`: pass
- Blob offline mirror: `VERIFIED_OFFLINE_MIRROR` for store `store_bf****7AX`, `24/24` objects downloaded, ZIP hash sidecar recorded
- Successful production deployment: `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` from fix commit `1767fc9`
- Public production verification:
  - `/`, `/en`, `/about`, `/contact`, `/en/contact` reachable
  - `/solutions/automatic-coating-line`, `/knowledge/process-knowledge/adjust-spray-voltage`, `/downloads` reachable
  - Legacy liquid route family restored publicly on zh/en category/detail targets, including the previously failing `/products/Manual-Electrostatic-Liquid-Spray-Gun` and `/en/products/Manual-Electrostatic-Liquid-Spray-Gun`
- Vercel deployment metadata confirms live production traffic resolves to `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC`
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

- No new English business-body translations were authored for source-language detail content
- No new runtime or QA dependency was installed to collect Lighthouse scores
- After the final promote, local shell HTTP checks from the agent host were challenged by `403 Vercel Security Checkpoint`, so final production smoke used independent public fetches instead of the local PowerShell path for route reachability

## Accepted known risks

- Some `/en` detail pages still surface verified Chinese source content; translation notice disclosure is present on the audited data-backed detail routes
- 4 pre-existing lint warnings remain in legacy admin/data modules
- Local Lighthouse is unavailable without adding a new package; release-candidate performance evidence relies on existing browser/fetch baselines instead
- Waiver `LIGHTHOUSE_NOT_EXECUTED` remains an accepted QA gap, not a fabricated pass signal

## Release recommendation

- Keep the current production deployment `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` as the live release for this rollout
- Preserve `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB` and `dpl_Ff9h5z2tUAvbNSFvmrNUZCzn12CF` as historical rollback references
- On the next production change, repeat legacy liquid route smoke before and after promotion, and prefer the Vercel promote API path over the CLI promote path in this workspace
