# BOSTAR Execution Agents

## Current mode

- Execution branch: `feat/gate2-implementation`
- Orchestrator: Codex main agent
- Subagents: not started
- Planning archive: `planning/gate1a/**`
- Live execution control plane: root-level files in this repository

## Active roles

- Orchestrator: coordinates Gate status, branch discipline, verification, rollback notes, and cross-file sequencing.
- Frontend architecture: owns locale routing, middleware, metadata, sitemap, robots, and public shell wiring.
- Content and SEO: owns canonical/hreflang behavior, metadata policy application, and sitemap coverage.
- QA and release: owns lint/build/typecheck execution, local preview checks, and evidence capture.

## File ownership

- Root control files: Orchestrator only
- `app/**`, `components/**`, `lib/**`, `public/**`: implementation phase owners under orchestrator control
- `planning/gate1a/**`: archive only; use as approved source input, do not overwrite for live status
- `agent-file-ownership.csv`: canonical file-level ownership seed promoted from Gate 1A

## Execution rules

- Preserve production URLs or provide rewrite/redirect behavior before route changes.
- Chinese remains default locale at root paths; English uses `/en`.
- Do not remove admin or data paths while public refactor is in progress.
- Do not install new runtime dependencies without recording the reason in `DECISIONS.md` and `CHANGELOG_EXECUTION.md`.
- Treat build-breaking issues as Gate blockers; treat lint warnings as tracked debt unless they affect correctness.
