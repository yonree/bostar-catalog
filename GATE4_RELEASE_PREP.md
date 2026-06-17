# Gate 4 Release Preparation

## Snapshot

- Date: 2026-06-17
- Branch: `feat/gate2-implementation`
- HEAD: `30f2f63`
- Authoritative preview: `http://127.0.0.1:3011`
- Latest preview listener PID: `32624`
- Current release status: `RELEASE_CANDIDATE_READY`

## Verified command path

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3011
```

## Required environment variables

Required for app/runtime baseline:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`

Conditional by feature:

- `BLOB_READ_WRITE_TOKEN`: required only for upload API and Vercel Blob-backed media writes
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `WEBHOOK_FEISHU_URL`
- `WEBHOOK_WECHAT_URL`
- `UPLOAD_PROVIDER`

Source evidence:

- `.env.example`
- `.env.production.example`
- `app/api/upload/route.ts`
- `lib/auth.ts`
- `middleware.ts`
- `prisma/schema.prisma`

## Current Gate 4 evidence

- `npm run typecheck`: pass
- `npm run lint`: pass with 4 pre-existing warnings and no new warnings
- `npm run build`: pass with the same 4 pre-existing warnings
- Representative zh/en route audit confirms:
  - localized `title`
  - page-level `og:title`
  - page-level `og:description`
  - page-level `twitter:title`
  - canonical
  - hreflang
  - robots
- Sampled legacy liquid-product route families now return `200` again on zh/en detail and category URLs and are present in `sitemap.xml`
- Lead-form locale parity is verified on `/en/contact` and restored `/en/products/...` through server HTML plus hydrated DOM checks
- Reserved routes remain online with `noindex,nofollow`:
  - `/news`
  - `/en/news`
  - `/news/release-placeholder`
  - `/en/news/release-placeholder`
  - `/search`
  - `/en/search`

## Release blockers

- None unresolved before Gate 6.

## Non-blocking known debt

- 4 pre-existing lint warnings remain in legacy admin/data modules
- Browser screenshot capture timed out in the in-app browser on this machine, but `/en` DOM layout metrics confirmed the page is visibly populated at runtime
- Several `/en` data-backed detail routes still surface verified Chinese source content; this is explicitly disclosed via the manual-verification translation notice per `D-009`
- Local Lighthouse is unavailable without adding a new package; Gate 4 performance evidence is satisfied by existing browser/fetch baselines and visual review per `D-008`

## Rollback notes

- No production deployment or DNS change has been performed in this execution
- No production database write has been performed in this execution
- Safe rollback strategy for the next release candidate:
  1. keep the current production deployment untouched until remaining release blockers are resolved or explicitly waived
  2. if a staging deploy is created from this branch, retain the previous deploy artifact for instant redeploy
  3. keep production environment variables unchanged unless the release checklist explicitly requires a reviewed change
  4. do not run destructive Prisma operations during rollback

## Next action

- Gate 4 remains complete and accepted.
- Finish the final Gate 5 control-plane evidence sync on a clean working tree.
- Enter Gate 6 production precheck immediately after the Gate 5 sync commit and release only if the existing production target, environment, backups, and rollback path are all verifiable.
