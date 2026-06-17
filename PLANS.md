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
- Gate 6 production precheck is complete. Vercel -> Neon binding, Neon PITR readiness, and SMTP/Webhook/Upload-provider runtime behavior are verified.
- Gate 6 remains blocked only on Blob recovery evidence for production store `store_bf****7AX`.
- Do not create a production deployment until that Blob recovery guarantee is supplied and written into `GATE6_PRODUCTION_RELEASE_REPORT.md`.
