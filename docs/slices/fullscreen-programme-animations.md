# Fullscreen programme — animations and auto-schedule

Slice: **Fullscreen programme — animations and auto-schedule**  
Status: **Planned**

## What we keep (no change)

The existing fullscreen programme stays as-is and works well:

- **Layout:** Events displayed by day (same grid, one “event” per slot per day). No new event types, no layout change.
- **Interaction:** User can click a **date** (day card) to choose the day; click an **event** (slot) to put it in the spotlight / highlight it (“overshadow”). That behaviour is preserved.
- **Close:** Button and Escape still exit fullscreen.

We do not rework or replace this; we only add capabilities on top of it.

## Current state (for context)

- **Fullscreen:** `index.html` `#programFullscreenContainer`, `assets/js/script.js` ~L1226–1418. Three-day grid, day cards, slot buttons; click day → active day; click slot → selection/overshadow. No per-block animation/carousel and no time-based behaviour yet.
- **Programme blocks:** Slots per day include ateliers, format long (Braquage, Commis d'Office, Promo 2006), matchs (Belgique, EDF, Suisse), pauses, accueil, “à demain”, “soirée musicale” (Samedi), etc.

## Slice goal

Improve fullscreen by adding (1) an associated animation or carousel for each programme block when that block is selected/overshadowed, and (2) on show days, automatic time-based display of the right content. Layout and day/event selection behaviour remain unchanged.

---

## Part A — Per-block animation (addition)

- **Build on existing selection:** When the user clicks an event (slot) in fullscreen, the event is already put in the spotlight/overshadow. We add: for that selected block, show an **associated animation or carousel** (description + carousel/animation).
- For **each programme block:** allow an “animation” to be attached — either a **custom animation** (e.g. “Direction buvette”, “à demain”, soirée musicale intro) or **reuse of an existing carousel** (témoignages, EDF player slider, spectacle pitch).
- Same fullscreen page; no layout change. Examples: click “Braquage” → block stays highlighted + description + Braquage carousel; click “Match EDF” → block highlighted + EDF player carousel; click “Pause” → optional buvette animation.

---

## Part B — Auto-schedule (show day only, addition)

- **Addition only:** Use device date and time (festival dates 2026-05-15 to 2026-05-17).
- **On the day of the show**, automatically:
  - **As an event approaches:** Every few minutes, show information about “what’s next” (e.g. countdown or teaser for the next slot).
  - **During breaks:** Show the block’s animation (e.g. pause → “Direction buvette”).
  - **End of day:** Show thanks + “à demain” (or “à l’année prochaine” for Dimanche).
  - **Samedi soirée musicale:** When relevant, show intro/content for the musical evening.

---

## Constraint — No animation during shows

- Never run carousels/animations **during** actual performances, so as not to disturb the show.
- During format long, matchs, or long-form slots: fullscreen keeps showing the programme (existing layout; optional static “in progress”); no animated/carousel content.
- Animations and auto-schedule apply only **outside** those performance windows (before, after, or during breaks).

---

## Summary

| What we keep | Existing fullscreen layout; display events by day; click date → choose day; click event → put in spotlight (overshadow). No layout or selection behaviour change. |
| Part A (add) | Per-block animation: attach animation or carousel to each block; when user selects an event (existing behaviour), also show that block’s description + animation/carousel. |
| Part B (add) | Auto-schedule: on show day, use current time to auto-show “what’s next”, break screens, end-of-day, soirée musicale. |
| Constraint   | No animation during shows (only programme or static view). |

---

## Doc updates when implementing

- **docs/SPEC.md:** Extend “Programme” / fullscreen: per-block animation, auto-schedule, rule “no animation during shows”.
- **docs/DOMAIN.md:** Optional: define “programme block”, “block animation”, “show window” (time range when a show is on) if new domain terms are introduced.
- **docs/ARCH.md:** If new data (e.g. programme schedule with times, block–animation mapping) is added (JSON or in script), document it.

## Out of scope for this slice

- **No backend:** Schedule and block–animation mapping can be client-side (config in JS or static JSON) so the site stays static.
- **Content of animations:** The slice describes capability (attach animation/carousel to block; auto-trigger by time). Actual assets (e.g. “Direction buvette” screen, “à demain” screen) are content tasks, not necessarily part of the first dev slice.
- **EDF / témoignages reuse:** Reusing existing carousels in fullscreen is in scope; changing how those carousels work on the main page is not required by this slice.
