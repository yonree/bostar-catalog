# Gate 8 Backlog Decision Report

## Snapshot

- Date: 2026-06-17
- Working branch: `codex/gate8-maintenance-handoff`
- Stable production baseline: `post-release-stable-2026-06-17` at `9b37b31`
- Live production deployment: `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Execution mode: read-only evidence collection plus maintenance-tooling hardening

## Item 1: `sample-download.pdf`

- Classification: `BUSINESS_OWNER_DECISION_REQUIRED`
- Current URL: `https://www.bostarcoating.com/sample-download.pdf`
- Current production status: `404`
- Referencing pages:
  - `https://www.bostarcoating.com/downloads/maintenance-guide`
  - `https://www.bostarcoating.com/en/downloads/maintenance-guide`
- Sitemap status: `NOT_IN_SITEMAP`
- Repository file status: `NOT_PRESENT`
- Blob evidence status: `NO_MATCHING_OBJECT_NAME_VERIFIED`

### Evidence

1. Repository search found no `sample-download.pdf` under the project workspace or `public/**`.
2. `prisma/seed-data.ts` seeds download slug `maintenance-guide` with `fileUrl: '/sample-download.pdf'`.
3. Production zh/en download detail pages return `200`, expose their own canonical and hreflang pairs, and both render a live anchor to `/sample-download.pdf`.
4. `https://www.bostarcoating.com/sample-download.pdf` returns a site `404` HTML response, not a PDF asset:
   - `Content-Type: text/html; charset=utf-8`
   - localized not-found heading rendered in the page body
   - `robots: noindex`
   - canonical falls back to `https://www.bostarcoating.com`
5. `sitemap.xml` includes `downloads/maintenance-guide` but does not include `sample-download.pdf`.
6. The existing Gate 6 Blob offline mirror has no verified filename or content evidence that maps to `sample-download.pdf`.
7. Local seed fallback in `lib/cms-data.ts` maps seeded downloads to `fileUrl: '#'`, so local fallback does not prove a valid production asset exists.

### Field audit

| Field | Result |
| --- | --- |
| File path / Blob path | `NOT_VERIFIED` |
| File name | `sample-download.pdf` |
| MIME | `NOT_VERIFIED`; production returns HTML `404` |
| File size | `NOT_VERIFIED` |
| SHA-256 | `NOT_VERIFIED` |
| Upload time | `NOT_VERIFIED` |
| Current page references | `maintenance-guide` zh/en detail pages |
| Sitemap reference | `NO` |
| Content-model reference | `YES`, seeded `fileUrl` for `maintenance-guide` |
| Download button copy | localized zh download CTA / `Download File` |
| Actual brand/manual content | `NOT_VERIFIED` |
| Obvious test placeholder | `SUSPECTED_BUT_NOT_PROVEN` |
| Formal replacement file | `NOT_VERIFIED` |

### Options

#### Option A: Keep

- Use only if the PDF is a real production asset and the business owner can provide the original file.
- Page impact: zh/en `maintenance-guide` pages remain unchanged.
- URL impact: keep `/sample-download.pdf`.
- SEO impact: broken-asset `404` disappears once the file is restored.
- Download impact: current broken CTA becomes valid.
- Rollback: remove the restored file and revert to current `404` behavior.

#### Option B: Replace

- Use only if a verified formal replacement file exists.
- Page impact: zh/en `maintenance-guide` pages can keep the current CTA surface.
- URL impact: preferred path is to preserve `/sample-download.pdf` or point it to an approved replacement with an explicit mapping.
- SEO impact: avoids leaving a broken asset URL behind.
- Download impact: fixes the current broken CTA without inventing new copy.
- Rollback: restore the previous file target or revert the mapping.

#### Option C: Retire

- Use only if business confirms this was a test placeholder and no live page should keep offering it.
- Page impact: remove or change the CTA on zh/en `maintenance-guide` pages.
- URL impact: define an intentional retired response policy before removing references.
- SEO impact: eliminates the orphaned broken asset after references are removed.
- Download impact: users stop seeing a dead download path.
- Rollback: restore the prior CTA and asset policy.

### Recommendation

- Recommended business answer: `DOWNLOAD=B`
- Reason: the URL is currently linked from live zh/en pages, so replacing it with a verified formal file preserves user intent and avoids guessing whether the file should be retired.
- Single owner question: should `maintenance-guide` keep a real downloadable PDF at `/sample-download.pdf`, be replaced by another approved file, or be retired entirely?

## Item 2: `fjbosd.com` / `www.fjbosd.com`

- Classification: `BUSINESS_OWNER_DECISION_REQUIRED`
- Current deployment binding: both aliases resolve to production deployment `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Current public behavior:
  - `https://fjbosd.com` -> `308` -> `https://www.fjbosd.com/`
  - `https://www.fjbosd.com/` -> `200`
- Current page behavior at alias host:
  - homepage content renders
  - canonical points to `https://www.bostarcoating.com`
  - hreflang points to `https://www.bostarcoating.com` / `/en`
  - robots: `index, follow`

### Evidence

1. `vercel inspect https://www.bostarcoating.com` shows the live deployment alias set includes:
   - `https://fjbosd.com`
   - `https://www.fjbosd.com`
   - `https://bostarcoating.com`
   - `https://www.bostarcoating.com`
2. `vercel domains ls` shows `fjbosd.com` exists under the same Vercel team with third-party registrar handling.
3. Public DNS resolves:
   - `fjbosd.com` -> `216.198.79.1`
   - `www.fjbosd.com` -> `d192d1c81372909d.vercel-dns-017.com`
4. Alias hosts serve the same homepage content as the main site, not a dedicated redirect-only target.
5. Alias-host HTML already declares the primary domain as canonical and hreflang target.
6. `robots.txt` and `sitemap.xml` are reachable on the alias host, but the sitemap content lists primary-domain URLs and does not emit `fjbosd.com` URLs.
7. No repository or sitemap reference was found that intentionally promotes `fjbosd.com` as a primary brand domain.

### Options

#### Option A: Keep as-is

- Use only if `fjbosd.com` is an approved active brand domain that should remain publicly reachable on its own host.
- Page impact: none.
- URL impact: alias host continues serving `200` pages.
- SEO impact: canonical reduces duplication, but the extra accessible host surface remains.
- Rollback: later unify to the main domain or detach the alias.

#### Option B: Keep ownership, unify with 301

- Use if the domain is still owned by the brand but should collapse to the declared primary host.
- Page impact: none on primary-domain pages.
- URL impact: alias host should redirect to `https://www.bostarcoating.com`.
- SEO impact: strongest reduction of duplicate-host access while preserving historical traffic.
- Rollback: remove the redirect and restore the alias behavior if needed.

#### Option C: Detach from the project

- Use only if the domain is confirmed unused or not supposed to point at this production project.
- Page impact: alias-host requests stop resolving through the BOSTAR production deployment.
- URL impact: detached domain behavior depends on registrar/DNS follow-up outside this repository.
- SEO impact: duplicate-host surface disappears, but any residual traffic is lost unless a separate redirect is established first.
- Rollback: reattach the domain and restore the prior alias routing.

### Recommendation

- Recommended business answer: `DOMAIN=B`
- Reason: current evidence shows the aliases are reachable and likely intentional at the infrastructure level, but the live site already treats `www.bostarcoating.com` as the sole canonical brand host.
- Single owner question: should `fjbosd.com` remain an approved brand domain, be normalized to the primary domain with a redirect, or be detached from the production project?

## Gate 8 result

- Final state: `MAINTENANCE_HANDOFF_PASS_WITH_BUSINESS_DECISIONS_REQUIRED`
- Autonomous changes intentionally not performed:
  - no file deletion or replacement for `sample-download.pdf`
  - no Blob mutation
  - no domain detach
  - no DNS or redirect change
