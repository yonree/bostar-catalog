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
- Gate 2: in progress, core locale/SEO shell implemented
- Gate 3: partial, route-level locale support exists; page-level English content remains incomplete
- Gate 4: in progress, local build and smoke evidence captured
- Gate 5: not started

## Next execution slice

- Expand localized content beyond shell/navigation/form labels.
- Localize structured data URLs and page-level metadata titles/descriptions where still Chinese-only on `/en`.
- Add redirect/URL manifest loader only if non-host path redirects become active in approved manifest.
