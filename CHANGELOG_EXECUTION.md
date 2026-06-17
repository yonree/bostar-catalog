# CHANGELOG_EXECUTION

## 2026-06-16

- Created root execution control plane: `AGENTS.md`, `PLANS.md`, `PROJECT_STATE.md`, `DECISIONS.md`, `RISKS.md`, `EVIDENCE_INDEX.md`, `CHANGELOG_EXECUTION.md`
- Promoted `planning/gate1a/gate2-file-ownership.csv` to `agent-file-ownership.csv`
- Added locale infrastructure: `lib/i18n.ts`, `lib/request-context.ts`, `lib/locale-copy.ts`
- Added locale-aware routing/linking components: `components/routing/LocalizedLink.tsx`, `components/layout/LocaleSwitcher.tsx`
- Reworked `middleware.ts` for host canonicalization, locale rewrite, and request context propagation
- Reworked root metadata generation in `app/layout.tsx`
- Reworked public shell and shared linking components for locale-aware navigation
- Updated sitemap and robots outputs for zh/en coverage
- Restored build readiness with `eslint.config.mjs`, `tsconfig.typecheck.json`, updated package scripts, and explicit Prisma generation
- Localized Gate 3 public template copy for English output on home, about, search, and key listing pages
- Added `components/ui/TranslationNotice.tsx` and applied it to English pages that still expose source-language CMS content
- Added `lib/page-metadata.ts` and `lib/site-copy.ts` to centralize localized metadata and shared English site-description fallback
- Updated footer and site-level JSON-LD consumers to use locale-aware shared description copy
- Refreshed authoritative local preview to `http://127.0.0.1:3010` after detecting stale resumed servers on ports `3008` and `3009`
- Localized shell copy for category/detail templates covering product category, knowledge category, and selected solution/article/case/download/video detail routes
- Rotated authoritative preview again to `http://127.0.0.1:3011` after rebuilds that changed shared schema/footer output
- Localized product-detail English shell in `app/products/[categorySlug]/[productSlug]/page.tsx`, including English metadata suffix, shell headings, inquiry block, FAQ shell, and translation notice while leaving product facts unchanged
- Restored seeded product/category fallback reads in `lib/cms-data.ts` so product routes remain testable when the local PostgreSQL/Prisma runtime is unavailable
- Fixed middleware rewrite context preservation so `/en/**` survives internal rewrites with English SSR metadata, `html lang`, canonical, and hreflang output intact
- Revalidated `http://127.0.0.1:3011` on `next start` (PID `31308`) with seeded product-detail smoke for zh/en route pairs
- Localized English metadata and shell copy for `app/cases/[slug]/page.tsx`, `app/downloads/[slug]/page.tsx`, `app/videos/[slug]/page.tsx`, `app/solutions/[slug]/page.tsx`, and `app/knowledge/[categorySlug]/[slug]/page.tsx`
- Expanded seeded fallback reads in `lib/cms-data.ts` to cover article categories/articles, solutions, downloads, videos, cases, and FAQs when local Prisma/PostgreSQL content is unavailable
- Revalidated `http://127.0.0.1:3011` on `next start` (listener PID `24972`) with representative zh/en smoke for case, download, video, solution, and knowledge detail route pairs
- Reworked `app/news/[slug]/page.tsx` into a locale-aware, non-indexed placeholder detail shell with breadcrumb, slug reference, and inquiry CTA instead of a raw placeholder block
- Revalidated `http://127.0.0.1:3011` on `next start` (listener PID `43916`) with zh/en news placeholder route smoke, confirming canonical, hreflang, and `noindex,nofollow` behavior
- Verified remaining public list/category routes on `/en` for canonical, hreflang, indexability, and runtime stability without reopening already-passed detail-route smoke
- Reworked `app/not-found.tsx` into a locale-aware 404 shell and revalidated zh/en missing-route responses on `http://127.0.0.1:3011` (listener PID `21336`)
- Hardened `app/faq/page.tsx` for locale-aware metadata, breadcrumb copy, English translation-notice behavior, and suppression of Chinese-only FAQ schema on `/en`
- Updated `components/ui/TechFaqSection.tsx` to accept locale context and suppress its FAQ JSON-LD outside the Chinese route branch
- Refreshed `http://127.0.0.1:3011` to the latest production build (listener PID `44896`) and verified the remaining static public surfaces on `/en`: `/faq`, `/service`, `/contact`, `/about`, and `/`
- Marked `app/news/page.tsx` as a reserved `noindex,nofollow` route until a verified news source exists, while keeping the URL online
- Removed `/news` from `app/sitemap.ts` static-path coverage so reserved news routes no longer appear in `sitemap.xml`
- Tightened `public/robots.txt` with explicit disallow rules for `/api/admin/`, `/search`, and `/en/search`, then revalidated runtime outputs on `http://127.0.0.1:3011` (listener PID `33248`)
- Removed fabricated `Offer` fields from `components/schema/ProductJsonLd.tsx` and kept only repository-backed product facts plus localized URLs
- Removed the hardcoded placeholder publish date from `components/schema/VideoJsonLd.tsx` and emit `thumbnailUrl` only when a source image exists
- Revalidated structured-data runtime output on `http://127.0.0.1:3011` (listener PID `27160`) for seeded zh/en product and video detail routes
- Added `GATE3_LEGACY_URL_GAP_REPORT.md` to record sampled legacy product URLs that still expect `200` in Gate 1A planning assets but currently lack local source entities
- Added `GATE4_ENTRY_BASELINE.md` to capture the first consolidated Gate 4 smoke baseline over zh/en index pages, representative detail pages, reserved routes, system 404s, sitemap, and robots

## 2026-06-17

- Extended `lib/page-metadata.ts` so localized page metadata also populates page-level Open Graph and Twitter summary tags
- Switched custom detail-route `generateMetadata` functions for products, cases, downloads, videos, solutions, knowledge, and news placeholders to the shared resolved metadata helper
- Rebuilt the project, refreshed the authoritative preview on `http://127.0.0.1:3011` (listener PID `43888`), and re-audited page-level `og:*`, canonical, hreflang, and robots output on representative zh/en routes
- Recorded a lightweight response-time baseline for `/`, `/en`, `/en/products/manual-powder-coating-gun/manual-powder-spray-gun`, and `/en/news/release-placeholder`
- Created checkpoint commit `22d4d24 feat(gate4): checkpoint localized route parity baseline` while keeping root live control-plane files uncommitted for continued execution
- Added `GATE4_RELEASE_PREP.md` and `GATE5_HANDOFF_DRAFT.md` as the first release-prep and handoff deliverables for the remaining Gate 4 / Gate 5 close-out work
- Restored sampled legacy liquid-product category/detail route families in `lib/data.ts` from audited production inventory so Gate 1A-approved URLs regain local `200` coverage without fabricating new product parameters
- Revalidated the restored legacy-route family on `http://127.0.0.1:3011`, including zh/en canonical, hreflang, `index, follow`, and sitemap coverage
- Reworked `components/lead/LeadForm.tsx` and all public lead-form entry points to use server-resolved `locale` plus localized `sourcePage`, removing the client-pathname locale derivation that conflicted with middleware-based `/en` rewrites
- Rebuilt the project, refreshed the authoritative preview on `http://127.0.0.1:3011` (listener PID `32624`), and revalidated `/en/contact`, `/en`, and restored `/en/products/...` server HTML plus hydrated DOM parity for English lead-form output
- Verified that local Lighthouse tooling is absent (`Get-Command lighthouse` empty, `npx --no-install lighthouse --version` fails without package install) and documented the no-install performance waiver in `DECISIONS.md`
- Collected final desktop/mobile visual evidence through in-app browser screenshots for `/en/contact` and the restored legacy liquid product detail route
- Audited `/en` data-backed detail routes to confirm the manual-verification translation notice is present wherever Chinese source technical content remains
- Promoted the branch state to `RELEASE_CANDIDATE_READY` with Gate 4/Gate 5 handoff artifacts and accepted known-risk documentation, stopping short of Gate 6 production release
- Created final handoff commit `30f2f63 docs(gate5): finalize release candidate handoff`
- Added Gate completion tags `gate-4-pass` and `gate-5-final` at commit `30f2f63`
- Re-ran final Gate 5 close-out validation: `npm run typecheck`, `npm run lint`, and `npm run build` all pass; lint remains at the same 4 pre-existing warnings with no new warnings
- Revalidated the authoritative `3011` preview on `/`, `/en`, `/contact`, `/en/contact`, restored zh/en legacy liquid product detail, `/sitemap.xml`, `/robots.txt`, and `/missing-route-check`, confirming expected status, canonical, hreflang, and robots behavior before the evidence-sync commit
- Promoted the Lighthouse waiver to the explicit marker `LIGHTHOUSE_NOT_EXECUTED` across decision, risk, and delivery control-plane artifacts for Gate 6 precheck consumption
- Created Gate 5 evidence-sync commit `5f731bf docs(gate5): synchronize final release candidate evidence` and tag `gate-5-handoff-2026-06-17`
- Verified the bound Vercel production project, current production deployment, domain reachability, and existing deploy/rollback CLI paths during Gate 6 precheck without exposing secret values
- Blocked Gate 6 production release under `D-010` because the exact production Neon binding and recoverable DB/media backup evidence are not provable from current non-secret local facts
- Added `GATE6_PRODUCTION_RELEASE_REPORT.md` and updated the root control plane to final status `PRODUCTION_RELEASE_BLOCKED_MISSING_INPUT`
