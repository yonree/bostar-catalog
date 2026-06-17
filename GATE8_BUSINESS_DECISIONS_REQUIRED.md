# Gate 8 Business Decisions Required

## Decision 1

- Decision ID: `DOWNLOAD`
- Current fact: live zh/en `maintenance-guide` detail pages link to `/sample-download.pdf`, but the target URL returns a site `404` and no verified source file or approved replacement exists in current evidence.
- Recommended option: `B`
- Alternatives:
  - `A` keep the original file at the same URL after the owner provides the real PDF
  - `C` retire the download after the owner confirms it is not a real business asset
- Impact of doing nothing: users keep clicking a broken download CTA; the orphan `404` remains in the public surface.
- Impact after execution:
  - `A`: current pages keep their CTA and the URL becomes valid
  - `B`: current pages keep their CTA and the URL is preserved or explicitly remapped to a verified replacement
  - `C`: current pages must stop offering the file and the retired URL policy must be documented
- Rollback: restore the prior file target or prior CTA policy
- Owner answer required: `DOWNLOAD=A`, `DOWNLOAD=B`, or `DOWNLOAD=C`

## Decision 2

- Decision ID: `DOMAIN`
- Current fact: `fjbosd.com` and `www.fjbosd.com` are attached to the live Vercel production deployment, serve the BOSTAR homepage, and already canonicalize to `https://www.bostarcoating.com`, but their intended long-term business role is not verified from repository or platform facts alone.
- Recommended option: `B`
- Alternatives:
  - `A` keep the aliases as approved active brand domains
  - `C` detach them from the production project if they are not meant to resolve here
- Impact of doing nothing: the extra reachable host surface remains and future ownership/SEO questions stay open.
- Impact after execution:
  - `A`: aliases continue serving site content
  - `B`: aliases stay owned but collapse to the primary domain with redirect behavior
  - `C`: aliases stop resolving through this production deployment
- Rollback: reattach or restore the prior alias policy if needed
- Owner answer required: `DOMAIN=A`, `DOMAIN=B`, or `DOMAIN=C`

## Resolution (2026-06-17)

- This file is now historical input only; both Gate 8 owner decisions were resolved and executed in Gate 9.
- Final owner-approved answers:
  - `DOWNLOAD=B_PENDING_ASSET`
  - `DOMAIN=PRIMARY_FJBOSD`
- Executed outcome:
  - `https://www.fjbosd.com` is now the sole canonical production origin
  - `https://fjbosd.com`, `https://www.bostarcoating.com`, and `https://bostarcoating.com` now redirect to `https://www.fjbosd.com`
  - live zh/en `maintenance-guide` detail pages no longer expose a clickable `404` download and instead render the approved pending-asset state
- Follow the Gate 9 records for the implementation and evidence trail:
  - `GATE9_BUSINESS_DECISION_IMPLEMENTATION.md`
  - `GATE9_DOMAIN_MIGRATION_REPORT.md`
