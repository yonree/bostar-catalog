# BOSTAR UI/UX Redesign Execution Plan

## Baseline

- Branch: `codex/uiux-redesign-phase1`
- Runtime: `Next.js 15`, `React 19`, `Prisma 6`, `PostgreSQL`, `Tailwind 3`
- Baseline checks before this phase:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

## Phase Breakdown

| Phase | Scope | Status | Verification |
| --- | --- | --- | --- |
| 0 | Repository, AGENTS, package, Prisma, lead/upload/mail/webhook/i18n/test baseline review | DONE | file inspection, `git status`, doc review |
| 1 | Lead structured schema, migration SQL, repository/service, richer validation | DONE | `prisma generate --no-engine`, `prisma:validate`, `typecheck` |
| 2 | SMTP adapter, webhook retry/idempotency/signature, notification logs | DONE | unit/integration tests |
| 3 | Private attachment storage, upload hardening, admin download flow | DONE | unit/integration tests |
| 4 | Business-hour 30-minute SLA calculation and state transitions | DONE | unit tests |
| 5 | Integration/E2E/SEO/Cookie regression | DONE | `test:*`, route/noindex smoke |
| 6 | Warning cleanup, docs, final verification and release runbook | DONE | `lint`, `build`, docs review |

## Acceptance Gates

1. Structured lead submission no longer depends on ad hoc `remark` alone.
2. Notification failure does not roll back a persisted lead.
3. Attachments are stored outside public static paths and require admin download.
4. SLA due time is explainable from timezone/workdays/business window config.
5. Zh/en route alias and noindex rules have automated smoke coverage.
6. Lint warnings introduced by this round are zero; historical warnings are either fixed or documented.
