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
