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
