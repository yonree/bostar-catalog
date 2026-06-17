# Gate 6 Production Release Report

## Snapshot

- Date: 2026-06-17
- Branch: `feat/gate2-implementation`
- Release candidate commit: `5f731bf`
- Release candidate tag: `gate-5-handoff-2026-06-17`
- Final status: `PRODUCTION_RELEASE_BLOCKED_MISSING_INPUT`

## Production platform and routing

- Platform: Vercel
- Bound Vercel project: `bostar-geo-website`
- Vercel project id: `prj_Snv902TWIACH7i5hQc3jeRgv20Z0`
- Vercel org id: `team_wiV97iL3q7MEbe71U8rFU9HC`
- Current production deployment id: `dpl_7GyQnXHosWMRooQauqjrXXV5r6KB`
- Current production deployment url: `https://bostar-geo-website-nfu62kovg-yonree-s-projects.vercel.app`
- Current production deployment created at: `2026-05-27 21:51:48 +08:00`
- Current production aliases:
  - `https://bostarcoating.com`
  - `https://www.bostarcoating.com`
  - `https://bostar-geo-website.vercel.app`

## Release baseline

- Candidate release commit for any future production deploy: `5f731bf`
- Candidate release commit message: `docs(gate5): synchronize final release candidate evidence`
- Local validation on candidate release commit:
  - `npm run typecheck`: pass
  - `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
  - `npm run build`: pass with the same 4 pre-existing warnings and no new warnings
  - local smoke on `http://127.0.0.1:3011`: pass for `/`, `/en`, `/contact`, `/en/contact`, restored zh/en legacy liquid product detail, `/sitemap.xml`, `/robots.txt`, and `/missing-route-check`
- Release environment:
  - Node: `v26.2.0`
  - npm: `11.13.0`
  - `package-lock.json` SHA256: `F4DBEE3F87C1BEE14F8DF75E91C4E0B8E9C7204DCE0CC484ED259BF3C5392163`

## Production precheck findings

### Verified

- `vercel whoami` succeeds and returns an authenticated account.
- `vercel inspect www.bostarcoating.com` resolves the live production deployment and confirms `target=production`, `status=Ready`.
- `https://www.bostarcoating.com/` returns `200`.
- `vercel env ls production` confirms presence of these production env names:
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `NEXT_PUBLIC_SITE_URL`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH`
  - `ADMIN_SESSION_SECRET`
  - `BLOB_READ_WRITE_TOKEN`
  - `BLOB_STORE_ID`
  - `BLOB_WEBHOOK_PUBLIC_KEY`
- `vercel deploy --help` confirms the existing production deployment path is available via Vercel CLI.
- `vercel rollback --help` confirms the rollback path is available via Vercel CLI.
- Accessible Neon account state confirms multiple candidate `bostar-catalog` projects exist and all expose point-in-time history retention metadata.

### Not verifiable under current constraints

- Exact production Neon project binding:
  - `NEON_PROJECT_ID` exists in Vercel production env names, but its value is encrypted.
  - Multiple accessible Neon projects named `bostar-catalog` exist.
  - Reading the decrypted production secret would violate the current no-secret-read boundary.
- Production database backup evidence:
  - Neon project metadata shows history retention on candidate projects, but the exact production-bound Neon project cannot be proven from non-secret facts.
  - Therefore the actual production DB restore target cannot be certified.
- Production media backup evidence:
  - `BLOB_STORE_ID` and `BLOB_READ_WRITE_TOKEN` existence prove a Vercel Blob store is configured.
  - No non-secret local evidence proves recoverable backup/version coverage for the active production store.
- Optional production env completeness:
  - `SMTP_*`, `WEBHOOK_*`, and `UPLOAD_PROVIDER` do not appear in the current Vercel production env listing.
  - It is not yet confirmed whether these omissions are intentional for production.

## Release decision

- Decision: do not create a new production deployment.
- Reason: Gate 6 requires verifiable production target identity plus recoverable backup evidence for database and media. Those proofs are incomplete under the current no-secret-read boundary.

## Verified deployment and rollback command paths

- Prospective production deploy command path: `vercel deploy --prod --yes`
- Verified rollback command path for the current stable production deployment: `vercel rollback dpl_7GyQnXHosWMRooQauqjrXXV5r6KB -y`

## No-op production safety record

- Production deployment executed: `no`
- Production rollback executed: `no`
- DNS modified: `no`
- Production database written: `no`
- Production media written: `no`
- Real leads submitted: `no`

## Minimal inputs required to unblock Gate 6

1. Non-secret confirmation of which Neon project is bound to production for this Vercel site.
2. Confirmation or evidence that the bound production Neon project has a recoverable backup or point-in-time restore path acceptable for release.
3. Confirmation or evidence that the active Vercel Blob store has recoverable backup/version coverage acceptable for release.
4. Clarification whether `SMTP_*`, `WEBHOOK_*`, and `UPLOAD_PROVIDER` are intentionally absent in production or should be populated before release.
