# DECISIONS

## D-001

- Date: 2026-06-16
- Decision: keep Chinese at root paths and English at `/en`, per Gate 1A locale registry.
- Reason: preserves approved URL contract and avoids route tree duplication.

## D-002

- Date: 2026-06-16
- Decision: implement English routing through middleware rewrite plus request headers instead of duplicating all App Router files.
- Reason: lower blast radius, faster rollout, shared templates remain single-source.

## D-003

- Date: 2026-06-16
- Decision: canonical metadata is generated from request pathname at the root layout.
- Reason: removes the previous site-wide fixed canonical `/` bug and enables locale-aware alternates.

## D-004

- Date: 2026-06-16
- Decision: migrate lint from deprecated interactive `next lint` to CLI ESLint flat config.
- Reason: Gate 1B requires non-interactive, repeatable validation.

## D-005

- Date: 2026-06-16
- Decision: introduce `tsconfig.typecheck.json` for standalone typecheck while keeping Next build as the route-type authority.
- Reason: direct `tsc` against `.next/types` was not stable in this workspace.

## D-006

- Date: 2026-06-16
- Decision: keep `/news` and `/en/news` online as reserved routes, but mark them `noindex,nofollow` and remove them from `sitemap.xml` until a verified news source exists.
- Reason: preserves the approved URL surface without presenting placeholder news inventory as indexable content.
