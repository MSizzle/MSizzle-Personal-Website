# Phase 4: Animation & Polish - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Layer animations across the entire site so it feels "alive and memorable." This includes page transitions between routes, GSAP ScrollTrigger scroll-reveal animations on all pages, parallax effects on the homepage, hover-reveal interactions on project cards, and full `prefers-reduced-motion` support. GSAP and `react-intersection-observer` need to be installed. Lenis needs GSAP ticker sync.

**Requirements covered:** HOME-03, HOME-04, PORT-02, DSGN-03, DSGN-04

</domain>

<decisions>
## Implementation Decisions

### Page Transitions
- **D-01:** Fade + subtle slide transition between all routes. Exit: opacity 1->0, y 0->10px (200ms). Enter: opacity 0->1, y 20px->0 (300ms). Total ~400ms, ease-out easing. Upgrade the existing `template.tsx` opacity-only fade.
- **D-02:** Uniform transitions everywhere — no per-route variations. Same fade+slide on all routes.

### Scroll Animations
- **D-03:** Bold & cinematic scroll animations on the homepage. Content slides up 60-80px + scale 0.95->1 on enter. Staggered children at 0.15s delay. Trigger at 30% into viewport.
- **D-04:** Multiple parallax layers on the homepage — section backgrounds shift at different speeds, decorative elements drift, text elements have subtle rotation.
- **D-05:** Scroll-reveal animations apply to ALL pages (blog listing, projects grid, about page), not just homepage. Consistent animated feel site-wide.
- **D-06:** Animations play once only — elements animate the first time they enter viewport, then stay visible. No replay on re-enter.
- **D-07:** GSAP must be installed and synced with Lenis via RAF ticker in the root layout before any ScrollTrigger sequences are authored.

### Project Card Hover (PORT-02)
- **D-08:** Overlay with CTA on hover — semi-transparent overlay slides up over the card image area with a "View Project ->" button and tags. Title and description remain visible below.
- **D-09:** Mobile tap fallback — first tap shows the overlay with CTA, second tap or tap elsewhere dismisses it. Mirrors desktop hover behavior.

### Reduced Motion
- **D-10:** Full suppression when `prefers-reduced-motion: reduce` is active. No scroll animations, no parallax, no page transition slide (instant opacity swap only), no card hover animation (instant state change), Lenis smooth scroll disabled. Elements just appear.

### Claude's Discretion
- Exact easing curves and spring configs for Motion animations
- GSAP timeline structure and ScrollTrigger pin behavior details
- Which decorative elements get parallax treatment on the homepage
- Stagger timing fine-tuning across different page types
- Whether to use `react-intersection-observer` for simpler reveal triggers or GSAP ScrollTrigger for everything

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Artifacts
- `.planning/REQUIREMENTS.md` — HOME-03, HOME-04, PORT-02, DSGN-03, DSGN-04 definitions
- `.planning/ROADMAP.md` §Phase 4 — Success criteria (jank testing, reduced motion, hover-reveal) and risk notes (AnimatePresence, mobile jank, GSAP+Lenis sync)
- `.planning/phases/03-core-pages/03-CONTEXT.md` — Phase 3 decisions, code context, and component inventory

### Foundation Setup
- `.planning/phases/01-foundation/01-01-SUMMARY.md` — Foundation patterns including template.tsx, LenisProvider, MotionProvider setup

### Project Context
- `.planning/PROJECT.md` — Core value ("feels alive and memorable"), constraints
- `.planning/research/PITFALLS.md` — Pitfall 5 (AnimatePresence exit animations), Pitfall 7 (mobile animation jank)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/template.tsx` — AnimatePresence + m.div with opacity fade already wired. Upgrade to fade+slide per D-01.
- `src/components/providers/motion-provider.tsx` — LazyMotion + domAnimation ready. No changes needed.
- `src/components/providers/lenis-provider.tsx` — Lenis running with lerp 0.1, but NO GSAP sync yet. Needs RAF ticker integration with GSAP per D-07.
- `src/components/projects/project-card.tsx` — Has CSS hover:border-accent/50. Replace with Motion hover-reveal overlay per D-08.

### Established Patterns
- **Provider hierarchy:** ThemeProvider > LenisProvider > MotionProvider (in layout.tsx). New GSAP initialization should integrate with LenisProvider or a sibling provider.
- **Styling:** Tailwind v4 utility classes + CSS variables for design tokens. Animation styles should use inline Motion/GSAP, not CSS animation classes.
- **Client components:** `"use client"` directive for all interactive/animated components. Server components for data fetching.

### Integration Points
- `src/app/layout.tsx` — Root layout with provider hierarchy. GSAP+Lenis sync hooks here or in LenisProvider.
- `src/app/template.tsx` — Page transition wrapper. Upgrade animation config.
- All page components — Need scroll-reveal wrappers or hooks applied to sections.
- `package.json` — GSAP and react-intersection-observer need to be added as dependencies.

### Packages to Install
- `gsap` (3.x) — ScrollTrigger, timeline animations, parallax
- `react-intersection-observer` (9.x) — Optional, for simpler viewport detection if needed alongside GSAP

</code_context>

<specifics>
## Specific Ideas

- "Bold & cinematic" was the explicit choice for scroll intensity — don't hold back on the homepage
- The site's core value is feeling "alive and memorable" — animations are the primary vehicle for this
- Only animate `transform` and `opacity` to avoid mobile jank (per Pitfall 7 in ROADMAP.md)
- Keep all page transitions under 400ms total (per ROADMAP.md risk notes)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-animation-polish*
*Context gathered: 2026-04-02*
