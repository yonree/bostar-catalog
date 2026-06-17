# PLANS

## Current sequence

1. Gate 1A close-out: promote approved planning assets into root control plane.
2. Gate 1B engineering readiness: restore deterministic lint/build/typecheck commands and local preview.
3. Gate 2 implementation: locale routing, middleware, canonical/hreflang, localized shell, sitemap, robots.
4. Gate 3 content and SEO: continue page-level English copy, structured-data localization, and content verification.
5. Gate 4 validation and release prep: smoke regression, URL audit, Lighthouse and rollback checklist.
6. Gate 5 handoff: final changelog, evidence index, risk register close-out, release notes.

## Current status

- Gate 1A: complete, using `planning/gate1a/**` as approved source of truth
- Gate 1B: materially complete for local engineering readiness
- Gate 2: complete, core locale/SEO shell implemented and verified
- Gate 3: complete, public route localization, metadata parity, seed fallback, and legacy sampled URL restoration verified
- Gate 4: complete, build/smoke/visual/perf baseline evidence captured with release-candidate waivers documented
- Gate 5: complete, handoff and final delivery artifacts prepared up to `RELEASE_CANDIDATE_READY`

## Next execution slice

- Gate 5 handoff is closed on commit `5f731bf` with tag `gate-5-handoff-2026-06-17`.
- Gate 6 Blob recovery precondition is now complete through offline mirror verification for store `store_bf****7AX`.
- Gate 6 production deploy was attempted and rolled back; current production is restored to `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB`.
- Do not create another production deployment until legacy liquid category routes `/products/Manual-Electrostatic-Liquid-Spray-Gun` and `/en/products/Manual-Electrostatic-Liquid-Spray-Gun` are reproducibly `200` on a production-like target.
