# Phase 8: Motion Subtractions - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning
**Mode:** `--auto` (Claude auto-selected recommended option for every gray area; user redirected to use the Claude Design editorial-redesign handoff as the canonical context)

<domain>
## Phase Boundary

Phase 8 is a **pure subtraction**. It deletes v1.0's competing motion artifacts so Phases 9–12 can build the editorial system on a clean canvas — without breaking any currently shipping route.

**In scope (7 requirements):** MOTION-01 (photo carousel delete), MOTION-02 (rotating tagline delete), MOTION-03 (works carousel delete), MOTION-04 (writings carousel delete), MOTION-05 (`animate-ping` + all-always-on CSS animation sweep), MOTION-06 (ScrollReveal cascade flattening), MOTION-08 (preserve Lenis + 200–300ms page-load fade).

**Out of scope:** MOTION-07 (manifesto letter-stagger — that's Phase 10). All token, primitive, homepage rebuild, archive page, sub-page restyle, and QA work. **No replacement components.** The hero, Writings, Works, and Events sections lose their carousels; their text + list-style fallbacks remain so the route still renders.

</domain>

<decisions>
## Implementation Decisions

### Deletion Sequencing
- **D-01:** **Atomic plans — one plan per MOTION-XX requirement.** Each plan deletes one component file, sweeps every import + JSX call site with `rg`, deletes any companion test if present, and verifies the local build before commit. Mapping: Plan-01=MOTION-01, Plan-02=MOTION-02, Plan-03=MOTION-03, Plan-04=MOTION-04, Plan-05=MOTION-05, Plan-06=MOTION-06, Plan-07=MOTION-08 (verification — Lenis + page-fade still working).

### Hero & Section Interim State
- **D-02:** **Delete the JSX call sites entirely.** Specifically in `src/app/page.tsx`:
  - Remove the `<PhotoCarousel>` block (lines 60–64) and its `getCarouselPhotos()` helper + the `fs`/`path` imports that only feed it.
  - Remove the `<RotatingTagline />` block (lines 76–78) plus its surrounding `<div className="mt-4">` wrapper.
  - Remove `<WritingsCarousel posts={posts}>` (line 115) — keep the `Writings ↘` link header; if `posts.length > 0`, render the first 3 posts as plain `<Link>` rows (title + date) so the section is not empty between Phase 8 and Phase 10. If `posts.length === 0`, keep the existing "More posts coming soon." copy.
  - Remove `<WorksCarousel projects={projects}>` (line 134) — same fallback pattern: first 3 projects as plain text rows, or "Projects coming soon." copy.
- **D-03:** **The Events block on `app/page.tsx` keeps its current `FeaturedUpcoming` + `UpcomingMini` + `PastEventCard` structure.** Only the cascading delays and the `animate-ping` indicator are touched; the section layout itself is untouched until Phase 10 rewrites it.

### Cascade Flattening (MOTION-06)
- **D-04:** **Drop the `delay` prop entirely** — from every call site (`UpcomingMini` and `PastEventCard` in `src/app/page.tsx` and any other render site) AND from each component's prop signature (`src/components/events/event-cards.tsx`). The underlying `ScrollReveal` keeps its simple opacity/translate fade with **no cascade** — items reveal together when scrolled into view. If `ScrollReveal` requires a delay prop, pass `delay={0}` explicitly inside the component (not from the parent).
- **D-05:** **Audit grep for other cascade patterns** before commit: `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*" -g '*.tsx' -g '*.ts'`. Any other accumulator-style delay-by-index pattern gets flattened the same way.

### Always-On Animation Sweep (MOTION-05)
- **D-06:** **Sweep all four Tailwind animate-X utility classes** — `animate-ping`, `animate-pulse`, `animate-bounce`, `animate-spin`. Today only `animate-ping` is in use (`src/components/events/event-cards.tsx:53` — `FeaturedUpcoming`'s red dot indicator). Today's grep is the floor, not the contract: the requirement is "delete `animate-ping` + any other always-on CSS animation." The plan runs the four-class grep at execution time, not just the verified-today scan.
- **D-07:** **Replace the live-dot pattern with a non-pulsing dot.** Lines 51–56 of `event-cards.tsx`: keep the static red dot (the inner `<span>` on line 54); delete the outer `animate-ping` wrapper `<span>` (line 53). Keep "Upcoming" heading and layout untouched.
- **D-08:** **Audit `tailwind.config` / `globals.css` for custom keyframes.** If any project-defined keyframes exist that loop forever (`infinite`), record them but do not delete in this phase — that's a Phase 9 token-level decision. Surface them in the plan SUMMARY so Phase 9 picks them up.

### Test Cleanup
- **D-09:** **Delete companion `__tests__/*` files for any deleted component** as part of the same plan/commit. Verified at context-gather time: **no tests currently reference the 4 carousel components**, so this is effectively a no-op. `src/__tests__/animations/scroll-reveal.test.tsx` and `src/__tests__/pages/links.test.tsx` stay — they exercise `ScrollReveal`, which stays. If new tests for `event-cards` rely on the `delay` prop signature, update them to drop the prop arg, not just regex-delete the file.

### Build Verification Gate
- **D-10:** **Per-plan `npm run build` MUST exit 0 before commit.** Each plan's verification step runs the build; a failing build means the import sweep missed a call site and the plan is incomplete. No `--no-verify` shortcuts.
- **D-11:** **Phase verification (gsd-verifier) additionally runs `vercel build --prod`.** Matches Phase 13's gate and the v1.0 retrospective lesson #2 (production-build-as-truth, not local dev/lint).

### Preservation Guarantees (MOTION-08)
- **D-12:** **Do NOT touch** `src/components/animations/scroll-reveal.tsx`, the Lenis smooth-scroll wiring (likely in `src/app/layout.tsx` or a client provider), the 200–300ms page-load opacity fade, or `next-themes` integration. These are the only surviving site-wide motion per the handoff, and Phase 10 still depends on them.
- **D-13:** **Do NOT touch** `/newsletter`'s clickable carousel. The handoff explicitly preserves it as the lone clickable-carousel exception; Phase 12 governs its restyle.

### Claude's Discretion
- Filename of plans (e.g., `08-PLAN-01-delete-photo-carousel.md`) — follow the project's existing phase-plan naming convention from v1.0 milestones.
- Whether to delete the `getCarouselPhotos()` helper in `app/page.tsx` (lines 19–30) inside Plan-01 (MOTION-01) or as a follow-up cleanup commit in the same plan — recommended: same commit as `PhotoCarousel` deletion, since it has no other caller (verify with `rg "getCarouselPhotos"`).
- Exact fallback markup for the Writings + Works sections (D-02) — keep it minimal: a `<ul>` or stacked `<Link>`s with the same `text-xs uppercase tracking-widest` typography already used on the section header. Phase 10 replaces this anyway.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Design Contract (v2.0 source of truth)
- `.planning/research/editorial-redesign-handoff/README.md` — **The canonical context for this entire milestone.** §"Motion Budget — strict" defines what stays (Lenis, page-load fade, one signature manifesto interaction) and what goes (zero looping animations, zero auto-scrollers, zero carousels, zero hover-triggered scrollers). Read this BEFORE planning Phase 8.
- `.planning/research/editorial-redesign-handoff/README.md` §"Implementation Notes for the Developer" — explicit "Avoid" list (carousels, auto-scrollers, hover-triggered horizontal scroll, pulsing dots, rotating taglines, multiple simultaneous animation loops). Phase 8's deletion list maps 1:1 to this Avoid list.

### Milestone & Phase Context
- `.planning/ROADMAP.md` §"Phase 8: Motion Subtractions" — phase boundary, dependencies, success criteria, risks. Note risk callout: every plan must `rg <ComponentName>` before deleting.
- `.planning/REQUIREMENTS.md` §"Motion Budget" — MOTION-01 through MOTION-08 with exact target paths (`components/home/photo-carousel.tsx` etc.) and behaviors.
- `.planning/PROJECT.md` — milestone context (v2.0 Editorial Redesign).
- `.planning/RETROSPECTIVE.md` (v1.0) — lesson #2 (production-build-as-truth, not local dev/lint) drives D-11.

### Codebase Targets (verified at context-gather time)
- `src/app/page.tsx` — imports all 4 carousels + RotatingTagline (lines 7–10); call sites at 60–64, 76–78, 115, 134. Also `UpcomingMini delay` at 175 and `PastEventCard delay` at 192.
- `src/components/home/photo-carousel.tsx` — MOTION-01 target
- `src/components/home/rotating-tagline.tsx` — MOTION-02 target
- `src/components/home/works-carousel.tsx` — MOTION-03 target
- `src/components/home/writings-carousel.tsx` — MOTION-04 target
- `src/components/events/event-cards.tsx:51–56` — `animate-ping` site (MOTION-05) inside `FeaturedUpcoming`. Same file holds `UpcomingMini` and `PastEventCard` whose `delay` props are removed for MOTION-06.
- `src/components/animations/scroll-reveal.tsx` — **stays**, motion budget D-12.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (untouched by Phase 8)
- `src/components/animations/scroll-reveal.tsx` — used by Events + Blog + Projects + Links pages; the cascade flattening removes the `delay` prop pattern in call sites but the component itself stays as the per-item fade primitive Phase 10/11 will keep using.
- Lenis smooth scroll wiring — preserved per D-12.
- `next/font` Inter integration in `src/app/layout.tsx` — preserved (Phase 9 will reuse it with the editorial type scale).
- `next-themes` — preserved.

### Established Patterns
- Each page (`/blog`, `/events`, `/links`, `/projects`) already wraps its list with `ScrollReveal` and passes per-item `delay={i * 0.X}`. Phase 8 only flattens cascading delays where they accumulate (`UpcomingMini`, `PastEventCard`); single-item-list delays still need a sweep to confirm.
- The homepage `app/page.tsx` does data fetching with try/catch swallow + ISR `revalidate = 1800`. Phase 8 doesn't touch this; the fallback markup added in D-02 reuses the existing `posts` / `projects` / `upcomingEvents` / `pastEvents` arrays already in scope.
- Naming convention: components live in `src/components/<feature>/<kebab-name>.tsx` and export `PascalCase` named exports.

### Integration Points
- `src/app/page.tsx` is the only call site for all 4 v1.0 carousels (verified via `rg`). Single point of deletion sweep per component.
- `src/components/events/event-cards.tsx` is imported by both `app/page.tsx` AND `app/events/page.tsx`. The `delay` prop signature change (D-04) ripples to both — the executor must grep `delay=` on every render of `UpcomingMini` and `PastEventCard` before declaring MOTION-06 done.

### Verified Clean
- No tests in `src/__tests__/` import any of the 4 deleted-component module names. D-09 is effectively a no-op for this phase.
- `animate-pulse`, `animate-bounce`, `animate-spin` — none in use today. Only `animate-ping` at `event-cards.tsx:53`. D-06's four-class sweep is precaution, not active cleanup beyond `animate-ping`.

</code_context>

<specifics>
## Specific Ideas

- **From the handoff:** "*A calling card from someone who builds polished software but doesn't need to prove it with motion.*" — Phase 8's job is to make this claim true before Phase 9–12 dresses it.
- **Manifesto interaction (MOTION-07) is OUT of this phase.** Per the handoff, the letter-stagger is the *one signature interaction* of the redesign and lives in Phase 10. Do not pre-build, scaffold, or even import `motion/react` for it here. (`motion` package stays installed; it has other uses in Phase 10.)
- **The newsletter carousel is sanctioned.** The handoff explicitly preserves `/newsletter`'s clickable carousel as the lone exception. D-13 codifies this.

</specifics>

<deferred>
## Deferred Ideas

- **Custom keyframe animations defined in `globals.css` or `tailwind.config`** (if any surface during MOTION-05 sweep) — recorded but not removed in Phase 8. Phase 9 (Design Tokens & Editorial Primitives) is the right home for token-level animation budget decisions.
- **Cascade delays on `/blog`, `/projects`, `/links`** — only `events` page cascades are explicitly in MOTION-06. If other pages cascade, surface them at planning time and decide per-plan whether to flatten now (cheap, in scope) or defer to Phase 12 (Sub-page Restyle Sweep). Recommend flattening now if grep finds them, since the motion-budget contract is site-wide.
- **Dark-mode editorial palette** — Phase 13 / future requirement, not this phase.
- **Manifesto reveal interaction (MOTION-07)** — Phase 10.

</deferred>

---

*Phase: 8-Motion Subtractions*
*Context gathered: 2026-05-20*
