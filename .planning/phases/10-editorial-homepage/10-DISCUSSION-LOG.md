# Phase 10: Editorial Homepage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-05-21
**Phase:** 10-editorial-homepage
**Mode:** `--auto` — Claude auto-selected recommended option for every gray area.
**User instruction (standing from Phase 8):** "use the claude design hand off as context" → `.planning/research/editorial-redesign-handoff/README.md` is the canonical design contract.
**Areas discussed:** Manifesto text, plan slicing, stagger implementation, photographs source, featured event treatment, mobile breakpoint, nav link targets, static-vs-dynamic content boundary, client/server component boundary, reduced-motion fallback.

---

## Manifesto Text

| Option | Description | Selected |
|---|---|---|
| `BRING FIRE / TO HUMANITY.` (2 lines, Prometheus-themed) | Locked by ROADMAP HOME-V2-02 | ✓ |
| `I BUILD / MACHINES THAT / THINK CAREFULLY.` (3 lines, handoff default) | The original handoff manifesto | |
| `MAKE FEWER THINGS. / MAKE THEM MEAN MORE.` (alternate) | Handoff alternate | |
| `SOFTWARE IS A WAY / OF READING THE WORLD.` (alternate) | Handoff alternate | |

**Notes:** ROADMAP HOME-V2-02 locks this. Alternates are deferred.

---

## Plan Slicing

| Option | Description | Selected |
|---|---|---|
| ONE mega-plan: rewrite page.tsx in one shot | Large commit, single deliverable | |
| 13 plans (one per requirement) | Maximum granularity; significant chain overhead | |
| 7 plans, serialized by section grouping | Header+Hero / Intro+BUILDING / WRITING+EVENTS / PHOTOGRAPHS / PERSONAL+Footer / Mobile sweep / Manifesto stagger | ✓ |
| 9–10 plans (one per section + mobile + interaction) | More granular but each adds chain overhead | |

**Notes:** All plans modify `src/app/page.tsx`. They serialize naturally via depends_on. 7 plans balance review granularity with execution efficiency.

---

## Manifesto Stagger Implementation

| Option | Description | Selected |
|---|---|---|
| `<ManifestoReveal>` client component using `motion/react` stagger + `useReducedMotion()` | Idiomatic React + motion; SSR-safe (markup server-rendered, animation client-hydrated) | ✓ |
| Raw CSS keyframes with class-based trigger | Smaller bundle but harder reduced-motion handling | |
| GSAP timeline | Already installed but overkill for one signature interaction | |
| Vanilla setTimeout + style mutation | What the handoff prototype used; not idiomatic React | |

**Notes:** sessionStorage gate (`gsd:manifesto-shown`) tab-scoped. `useReducedMotion()` falls back to 300ms opacity fade.

---

## Photographs Source

| Option | Description | Selected |
|---|---|---|
| Hard-code 6 PHOTOS[0..5] filenames in page.tsx | Matches handoff exactly; defers data-source decisions to Phase 11 `/photos` | ✓ |
| Filesystem-scan `/public/MSizzle-website-photos/` at build time | Matches v1.0 pattern, but Phase 8 deleted the helper | |
| Pull from Notion | New data source; out of scope for Phase 10 | |

**Notes:** All 6 photos confirmed present at context-gather time. Filesystem-loaded gallery deferred to Phase 11.

---

## Featured Event Component

| Option | Description | Selected |
|---|---|---|
| New inline `<HomeFeaturedEvent>` component inside page.tsx | Used once; extract later if Phase 11 reuses | ✓ |
| Rewrite `FeaturedUpcoming` in `src/components/events/event-cards.tsx` | Breaks /events page until Phase 11 redesigns it | |
| New `src/components/home-v2/featured-event.tsx` extracted now | Premature extraction | |

**Notes:** Keep legacy `FeaturedUpcoming` for /events until Phase 11 redesigns that route.

---

## Mobile Breakpoint

| Option | Description | Selected |
|---|---|---|
| Tailwind `md:` (768px), mobile-first | Default styles target 390px; md: enables desktop overrides | ✓ |
| Custom 390px breakpoint | Out-of-scale with Tailwind defaults | |
| Mobile-only / desktop-only files | Splits a single homepage across multiple files | |

**Notes:** Handoff specifies 390px mobile / 1440px desktop reference. md:768px sits cleanly between them.

---

## Nav Link Targets

| Option | Description | Selected |
|---|---|---|
| Writing → /blog (until Phase 11 ships /writing); other links to existing routes | Pragmatic; ships now | ✓ |
| Pre-create /writing as a stub | Wasted work; Phase 11 builds it properly | |
| Writing → /writing (404 until Phase 11) | Broken link in production for the gap | |

**Notes:** Phase 11 swaps /blog → /writing when the archive page ships. Photo Archive link → /photos remains a 404 until Phase 11; acceptable per handoff timeline.

---

## Static vs Dynamic Content

| Option | Description | Selected |
|---|---|---|
| Hardcode manifesto/meta/intro/labels/footer copy; pull BUILDING/WRITING/EVENTS from Notion | Matches handoff; Notion getters already wired | ✓ |
| Pull manifesto from Notion (CMS-driven manifesto rotation) | Deferred per REQUIREMENTS.md "Future Requirements" | |

**Notes:** Manifesto rotation deferred. All other dynamic content uses existing Notion data sources.

---

## Component Boundary

| Option | Description | Selected |
|---|---|---|
| page.tsx is Server Component; `<ManifestoReveal>` is the only client child | Minimal client bundle; static markup SSRed | ✓ |
| Whole page.tsx as client component | Larger client bundle, breaks ISR cache semantics | |

**Notes:** Phase 10 preserves Server-Component-by-default discipline from Phase 9.

---

## Reduced-Motion Fallback

| Option | Description | Selected |
|---|---|---|
| `useReducedMotion()` → 300ms full-line opacity fade | Handoff-specified fallback | ✓ |
| Skip animation entirely | Loses the first-paint signal | |
| Run full stagger regardless | Violates `prefers-reduced-motion` accessibility | |

**Notes:** Implemented inside `<ManifestoReveal>`. sessionStorage flag set in both branches.

---

## Claude's Discretion

- Exact pixel-mapping of handoff measurements to Tailwind utilities (4px base)
- File path for `<ManifestoReveal>` (recommended: `src/components/home-v2/manifesto-reveal.tsx`)
- Extracting `<HomeFeaturedEvent>` later if reuse emerges
- Mobile manifesto line-break (2 lines at 56px vs 3 lines) — finalize during plan-check based on visual test

## Deferred Ideas

- Manifesto alternates from handoff
- Generalized photo data source (Phase 11 `/photos`)
- Phase 11 link target updates
- Dark-mode editorial palette
- Mobile hamburger menu
- Internationalization
