# Agents

## Sources of truth (normative)

- **docs/SPEC.md** — What the system does; functional contract. Do not contradict.
- **docs/DOMAIN.md** — Vocabulary and domain rules. Use for terms and entities.
- **docs/ARCH.md** — Structure and technology. Use for components, stack, and build.
- **docs/WORKFLOW.md** — When to update which doc. Follow for doc changes.
- **docs/ADR/** — Architecture Decision Records (one file per decision). Normative.
- **docs/slices/charte-graphique.md** — Charte graphique : couleurs (hex, variables CSS), typographie (Hubot Sans, hiérarchie), recommandations d’usage (boutons, titres, programme). Toute proposition de design doit respecter cette charte.
- **docs/SPEC-Malix.md** — Spécification fonctionnelle du mini-jeu Malix (comportement, périmètre, mécaniques, stockage, tests). Source de vérité pour le jeu sous /malix.

Code and changes must align with these. Do not document or implement behavior that contradicts normative docs without updating them first.

## Tracking and operational (not normative)

- **docs/PLAN.md** — Delivery: slices, milestones, task status. Use for progress only; not for defining product behavior.
- **docs/ISSUES.md** — Bugs, limitations, deferred work. Use for problem tracking only.
- **docs/DEVELOPMENT.md** — Setup, commands, contribution. Operational only.

## Agent workflow

1. **Before changing behavior or structure:** Read docs/SPEC.md, docs/DOMAIN.md, docs/ARCH.md. Ensure changes align; update normative docs when behavior or architecture changes.
2. **Before proposing or implementing design (couleurs, typos, composants visuels):** Read docs/slices/charte-graphique.md. Propositions et implémentations doivent rester dans les clous de la charte (variables CSS, usage des couleurs et typo). En cas d’écart, mettre à jour la charte en priorité ou justifier dans un ADR.
3. **When planning or reporting:** Use PLAN for “what to do next” and ISSUES for “what’s broken or deferred.”
4. **When updating docs:** Change normative docs when behavior or structure changes; keep PLAN and ISSUES factual (no invented scope).

## Project-specific

- **Témoignages:** Schema and usage are in `docs/temoignages-carousel.md`. Data: `assets/data/temoignages.json`. Do not invent fields; add only what the schema and script support.
- **Build:** Sources live in repo; only `dist/` is built and deployed. Do not commit minified sources; build runs in CI (GitHub Actions) and locally via `npm run build`.
- **Malix:** Mini-jeu enfant sous /malix ; spec dans docs/SPEC-Malix.md. Strictement isolé du site principal (aucun code Malix dans index.html, script.js, style.css ; chargement uniquement sous /malix).
