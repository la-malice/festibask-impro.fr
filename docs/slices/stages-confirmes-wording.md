# Stages masterclass → stages confirmés (wording)

Slice: **Renommer stages masterclass en stages confirmés**  
Status: **Done** (implémenté avec 4 stages distincts Samedi)

## Context and rationale

The festival will offer **confirmed internships** (stages confirmés) instead of positioning them as "masterclasses". Speakers will be less prestigious than initially expected but more accessible, still interesting, and better suited to **filling the workshops**. This slice is content/UX only: terminology and copy changes, no new features.

## Implementation note (fév. 2026)

Implémentation dépassant le scope initial : au lieu de 2 slots génériques, **4 stages confirmés distincts** ont été ajoutés (Samedi 10h Salle 1 & 2, Samedi 14h Salle 1 & 2) avec titres, descriptions et intervenants réels. IDs : `atelier-samedi-10h-salle1`, `atelier-samedi-10h-salle2`, `atelier-samedi-14h-salle1`, `atelier-samedi-14h-salle2`.

## What we keep (no change)

- **Stages section:** Same layout, flip cards, registration and waitlist buttons, Sibforms modals.
- **Saturday slots:** 10h and 14h atelier slots; now 2 salles per slot (4 stages total).
- **IDs / anchors:** Updated to `atelier-samedi-10h-salle1`, etc.; programme grid links updated.

We do not change behaviour, forms, or data schema.

## Current state (for context)

- **Stages:** `index.html` stages section; atelier cards with flip, instructor bio, "COMPLET" / waitlist; programme grid links to `#atelier-samedi-10h-masterclass` and `#atelier-samedi-14h-masterclass`.
- **Wording:** "MASTER CLASS IMPRO", "masterclass", "master class" appear in titles, intro copy, instructor bio, FAQ, and form radio. DOMAIN.md defines Atelier/Stage as "initiation, masterclass, famille".
- **CSS:** [assets/css/style.css](assets/css/style.css) has selectors and comments referencing `masterclass` (e.g. `#atelier-samedi-10h-masterclass`, `#atelier-samedi-14h-masterclass`).

## Slice goal

Replace "masterclass" / "Master Class" with "stage confirmé" (or equivalent wording) everywhere. Update instructor bio copy so it no longer promises "artiste reconnu·e" and instead presents confirmed internships as accessible and interesting. Ensure all anchors and selectors stay consistent after ID renames.

---

## Touchpoints

| Location | Current | Change |
|----------|---------|--------|
| **docs/DOMAIN.md** L18 | "Workshop (initiation, masterclass, famille)" | "Workshop (initiation, stage confirmé, famille)" or similar. |
| **index.html** | IDs `atelier-samedi-10h-masterclass`, `atelier-samedi-14h-masterclass` | Rename to e.g. `atelier-samedi-10h-confirme`, `atelier-samedi-14h-confirme`; update all `href="#atelier-samedi-…-masterclass"` to match. |
| **index.html** | "MASTER CLASS IMPRO" (h3, salle boxes) | Replace with wording for confirmed stage, e.g. "STAGE IMPRO CONFIRMÉ" or "STAGE CONFIRMÉ". |
| **index.html** | Intro copy: "perfectionner ou prendre une master class" | "perfectionner ou suivre un stage confirmé" (or equivalent). |
| **index.html** | Instructor bio: "L'intervenant qui animera cette masterclass sera annoncé… artiste reconnu·e…" | Reword to reflect confirmed internship: intervenant confirmé, stage ouvert à tous, etc. (exact copy TBD with content). |
| **index.html** | FAQ / tarifs: "Stages Initiation, Famille ou Master Class" | "Stages Initiation, Famille ou Confirmé". |
| **index.html** | Form radio: "Master class" | "Stage confirmé" (or "Confirmé"). |
| **index.html** | HTML comments: "Masterclass Perfectionnement" | e.g. "Stage confirmé (perfectionnement)". |
| **assets/css/style.css** | Selectors and comments with `masterclass` | Update to match new IDs (e.g. `#atelier-samedi-10h-confirme`, `#atelier-samedi-14h-confirme`). |

---

## Summary

| What we keep | Stages section layout; flip cards; registration/Sibforms; two Saturday slots. No behaviour or schema change. |
| Goal | Replace all "masterclass" / "Master Class" wording with "stage confirmé"; update instructor bio to present confirmed internships as accessible and interesting; rename IDs/anchors/selectors for consistency. |

---

## Doc updates when implementing

- **docs/DOMAIN.md:** Update Atelier/Stage definition: "masterclass" → "stage confirmé" (or equivalent).
- **docs/PLAN.md:** Mark this slice as Done when implementation is complete.

## Out of scope for this slice

- No change to Sibforms, Brevo, or registration flow.
- No new data schema or JSON; only labels and copy.
- Exact French wording for "stage confirmé" and instructor bio can be refined at implementation time with content owner.
