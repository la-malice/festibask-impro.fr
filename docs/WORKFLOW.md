# Documentation Workflow

When to update which document. Keeps normative docs and tracking docs consistent with the codebase and intent.

## Normative docs (sources of truth)

| Document | Update when |
|----------|-------------|
| **docs/SPEC.md** | Behavior, scope, or capabilities change (e.g. new section, new integration, change in what the site does or does not do). |
| **docs/DOMAIN.md** | New domain terms, entities, or rules (e.g. new content type, new field in temoignages.json, new domain rule). |
| **docs/ARCH.md** | Structure or technology changes (e.g. new build step, new dependency, new deploy target). |
| **docs/slices/charte-graphique.md** | Palette, typographie ou règles d’usage de la charte changent (nouvelle couleur, nouveau type de bouton, convention programme, etc.). Toute évolution de design doit s’y refléter. |
| **AGENTS.md** (root) | Governance or agent workflow changes (e.g. new source of truth, new convention). |
| **docs/ADR/** | A significant architecture decision is made or revisited; one ADR per decision. |

## Tracking and operational

| Document | Update when |
|----------|-------------|
| **docs/PLAN.md** | Slices, milestones, or tasks change (e.g. new slice, task done, phase change). |
| **docs/ISSUES.md** | A bug is found, a limitation is accepted, or work is deferred (add/close/update entry). |
| **docs/DEVELOPMENT.md** | Setup, commands, or contribution steps change (e.g. new script, new env var). |

## Rules

- Do not contradict normative docs in code or other docs without updating the normative doc first.
- Keep docs/PLAN.md and docs/ISSUES.md factual; do not use them to define product behavior (that belongs in docs/SPEC.md, docs/DOMAIN.md).
- When in doubt: behavior → docs/SPEC.md; vocabulary/entities → docs/DOMAIN.md; build/stack/structure → docs/ARCH.md; design/couleurs/typo → docs/slices/charte-graphique.md.
