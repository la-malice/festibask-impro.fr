# Agents

## Sources of truth (normative)

- **docs/SPEC.md** — What the system does; functional contract. Do not contradict.
- **docs/DOMAIN.md** — Vocabulary and domain rules. Use for terms and entities.
- **docs/ARCH.md** — Structure and technology. Use for components, stack, and build.
- **docs/WORKFLOW.md** — When to update which doc. Follow for doc changes.
- **docs/ADR/** — Architecture Decision Records (one file per decision). Normative.

Code and changes must align with these. Do not document or implement behavior that contradicts normative docs without updating them first.

## Tracking and operational (not normative)

- **docs/PLAN.md** — Delivery: slices, milestones, task status. Use for progress only; not for defining product behavior.
- **docs/ISSUES.md** — Bugs, limitations, deferred work. Use for problem tracking only.
- **docs/DEVELOPMENT.md** — Setup, commands, contribution. Operational only.

## Agent workflow

1. **Before changing behavior or structure:** Read docs/SPEC.md, docs/DOMAIN.md, docs/ARCH.md. Ensure changes align; update normative docs when behavior or architecture changes.
2. **When planning or reporting:** Use PLAN for “what to do next” and ISSUES for “what’s broken or deferred.”
3. **When updating docs:** Change normative docs when behavior or structure changes; keep PLAN and ISSUES factual (no invented scope).

## Project-specific

- **Témoignages:** Schema and usage are in `docs/temoignages-carousel.md`. Data: `assets/data/temoignages.json`. Do not invent fields; add only what the schema and script support.
- **Build:** Sources live in repo; only `dist/` is built and deployed. Do not commit minified sources; build runs in CI (GitHub Actions) and locally via `npm run build`.
