# Requirements — Milestone v4.0 Mono Restyle

**Goal:** Strip the site to pure black and white with zero accent, and rebuild the homepage as a
quiet editorial index that reads "here's a bit about me" rather than a founder pitch.

**Spec:** `.planning/sketches/015-mono-passive-home/` variant E (open the file with `#e`). The design
is locked — these requirements describe porting it, not exploring it.

v3.0's requirements are archived at `.planning/milestones/v3.0-REQUIREMENTS.md`.

## v4.0 Requirements

### Mono Design System (MO)
- [x] **MO-01**: Every surface renders on a pure white ground (`#ffffff`) with true black ink (`#000000`) and `rgba(0,0,0,0.14)` hairline borders — no warm paper, no cream, no tinted greys.
- [x] **MO-02**: No accent color exists anywhere in the token layer. Vermilion (`#e5411f`, `#c8381a`, `#a52d13`), cream `#f4ecdd`, and warm paper `#faf9f7` are removed from `globals.css`, including the hardcoded uses outside the token block.
- [x] **MO-03**: Emphasis and interaction states are expressed by inversion (black block on white) and type weight, never by hue — including every hover state that previously used the accent.
- [ ] **MO-04**: Notion inline text colors authored inside posts (amber, orange, blue, gray) render as ink/dim/muted greys, so writing in Notion cannot reintroduce a hue.
- [x] **MO-05**: Hanken Grotesk 800 display type, hard corners (radius 0), and the no-gradients rule are preserved from v3.

### Homepage (HP)
- [ ] **HP-01**: The homepage hero is type-only — the rotating portrait carousel (stage pitch, fireside chat, mushroom blocks) is gone, and no photograph appears above the fold.
- [ ] **HP-02**: Building renders as a Swiss editorial numbered index (`001`, `002`, `003`) whose rows invert to a solid black block on hover.
- [ ] **HP-03**: The writing list renders in terminal format (`~/writing`, dates left, read time right) with no frame around it, so the blog reads as a log rather than a pitch.
- [ ] **HP-04**: The homepage reads as one continuous ground — the alternating light/dark band rhythm is gone.
- [ ] **HP-05**: A visitor can browse work and essays without meeting a subscribe CTA above the footer; Monty Monthly is a quiet footer-level line, not a sticky nav button.

### Motion Subtraction (MS)
- [ ] **MS-01**: The hero link marquee, the pulsing status dot, photo ken-burns, and slide-in-from-side reveals are all removed.
- [ ] **MS-02**: The only surviving scroll motion is a slow opacity fade-up.
- [ ] **MS-03**: `prefers-reduced-motion` is honored across every remaining animation, including the pinboard.

### Things I Love (TL)
- [ ] **TL-01**: The pinboard keeps its shipped behaviour exactly — loose scatter across three start lines, drag, click-to-slide-a-note-up, per-type card kinds, and the Organize-by-topic button.
- [ ] **TL-02**: The pinboard renders in mono: the colored `SWATCHES` array becomes greyscale, `.pb-frame--cream` loses its cream fill, and the note panel is black where it was Vermilion.
- [ ] **TL-03**: Card types remain distinguishable from one another by shape and border weight rather than by hue.

### Site Sweep (SW)
- [ ] **SW-01**: Every page beyond the homepage (writing, blog post, building, project detail, contact, prometheus) renders in the mono system with no accent survivals.
- [ ] **SW-02**: All three `opengraph-image.tsx` routes (root, `blog/[slug]`, `building/[slug]`) generate mono OG images, retiring the hardcoded `#e5411f`.
- [ ] **SW-03**: Photography appears only where it is content — Things I Love cards and Notion project covers. The hero portraits, the wide Prometheus screenshot, and the photo-marquee fallback are retired.

### Dark Mode (DM)
- [ ] **DM-01**: A visitor can switch the entire site between light (white ground, black ink) and dark (black ground, white ink) as a true inversion.
- [ ] **DM-02**: Every element that uses inversion as its emphasis language (index rows, pinboard note panel, tags, buttons) reads correctly in both grounds — an inverted row on a dark ground must not disappear.
- [ ] **DM-03**: The theme choice persists across navigation and reloads with no flash of the wrong ground on first paint.

### Delivery & Quality (DQ)
- [x] **DQ-01**: The restyle is developed on a branch and reviewable on a Vercel preview URL before it replaces production.
- [ ] **DQ-02**: The site passes its existing perf budget (LCP / PSI mobile gates) after the restyle.
- [ ] **DQ-03**: The vitest suite passes, including the SEO regression gate (sitemap, robots, feed, metadata, JSON-LD) proven intact through the restyle.
- [ ] **DQ-04**: Production is promoted by explicit alias swap with no alias drift (never `--prebuilt --prod`).
- [ ] **DQ-05**: A human visual QA pass over every route signs off the mono system before the alias swap.

## Future Requirements (deferred)
- Real photography direction for the pinboard cards (currently Notion page covers and YouTube thumbnails).
- A real reading-time value from Notion for the terminal writing block, rather than a computed estimate.

## Out of Scope

| Excluded | Reasoning |
|----------|-----------|
| Any accent color, including a "rare" one | Monty rejected orange and clay outright and chose pure black/white. Reintroducing a hue anywhere defeats the milestone. |
| Content / IA changes | v4.0 is a restyle. Routes, nav, and copy structure stay as v3 left them. |
| Notion pipeline, SEO, analytics, image proxy changes | Infrastructure is validated and untouched by a palette and layout change. |
| New homepage exploration | Sketch 015 variant E is the locked spec; further sketching would be rework. |
| Phase 18's original QA against the v3 design | Superseded — the restyle invalidates that QA, so it is re-run against v4.0 instead (carried into DQ-01..DQ-05). |

## Traceability

All 27 v4.0 requirements map to exactly one phase. No orphans, no duplicates.

| Requirement | Phase | Phase Name | Status |
|-------------|-------|------------|--------|
| MO-01 | Phase 20 | Mono Token Foundation | Complete |
| MO-02 | Phase 20 | Mono Token Foundation | Complete |
| MO-03 | Phase 20 | Mono Token Foundation | Complete |
| MO-04 | Phase 23 | Site Sweep & Mono OG | Pending |
| MO-05 | Phase 20 | Mono Token Foundation | Complete |
| HP-01 | Phase 21 | Mono Homepage Rebuild | Pending |
| HP-02 | Phase 21 | Mono Homepage Rebuild | Pending |
| HP-03 | Phase 21 | Mono Homepage Rebuild | Pending |
| HP-04 | Phase 21 | Mono Homepage Rebuild | Pending |
| HP-05 | Phase 21 | Mono Homepage Rebuild | Pending |
| MS-01 | Phase 21 | Mono Homepage Rebuild | Pending |
| MS-02 | Phase 21 | Mono Homepage Rebuild | Pending |
| MS-03 | Phase 22 | Things I Love in Mono | Pending |
| TL-01 | Phase 22 | Things I Love in Mono | Pending |
| TL-02 | Phase 22 | Things I Love in Mono | Pending |
| TL-03 | Phase 22 | Things I Love in Mono | Pending |
| SW-01 | Phase 23 | Site Sweep & Mono OG | Pending |
| SW-02 | Phase 23 | Site Sweep & Mono OG | Pending |
| SW-03 | Phase 23 | Site Sweep & Mono OG | Pending |
| DM-01 | Phase 24 | True Inversion Dark Mode | Pending |
| DM-02 | Phase 24 | True Inversion Dark Mode | Pending |
| DM-03 | Phase 24 | True Inversion Dark Mode | Pending |
| DQ-01 | Phase 20 | Mono Token Foundation | Complete |
| DQ-02 | Phase 25 | v4.0 QA, Perf Gate & Alias Swap | Pending |
| DQ-03 | Phase 25 | v4.0 QA, Perf Gate & Alias Swap | Pending |
| DQ-04 | Phase 25 | v4.0 QA, Perf Gate & Alias Swap | Pending |
| DQ-05 | Phase 25 | v4.0 QA, Perf Gate & Alias Swap | Pending |

**Coverage by phase:**

| Phase | Requirements | Count |
|-------|--------------|-------|
| Phase 20 — Mono Token Foundation | MO-01, MO-02, MO-03, MO-05, DQ-01 | 5 |
| Phase 21 — Mono Homepage Rebuild | HP-01, HP-02, HP-03, HP-04, HP-05, MS-01, MS-02 | 7 |
| Phase 22 — Things I Love in Mono | MS-03, TL-01, TL-02, TL-03 | 4 |
| Phase 23 — Site Sweep & Mono OG | MO-04, SW-01, SW-02, SW-03 | 4 |
| Phase 24 — True Inversion Dark Mode | DM-01, DM-02, DM-03 | 3 |
| Phase 25 — v4.0 QA, Perf Gate & Alias Swap | DQ-02, DQ-03, DQ-04, DQ-05 | 4 |
| **Total** | | **27** |
