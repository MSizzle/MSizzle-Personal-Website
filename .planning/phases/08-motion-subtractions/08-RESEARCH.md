# Phase 8: Motion Subtractions - Research

**Researched:** 2026-05-20
**Domain:** Codebase deletion + import-sweep + CSS-keyframe cleanup (Next.js 16 App Router, React 19, Tailwind v4, Motion 12, Lenis, GSAP)
**Confidence:** HIGH (every claim verified against the live codebase via `rg` + file reads)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Deletion Sequencing**
- **D-01:** Atomic plans — one plan per MOTION-XX requirement. Each plan deletes one component file, sweeps every import + JSX call site with `rg`, deletes any companion test if present, and verifies the local build before commit. Mapping: Plan-01=MOTION-01, Plan-02=MOTION-02, Plan-03=MOTION-03, Plan-04=MOTION-04, Plan-05=MOTION-05, Plan-06=MOTION-06, Plan-07=MOTION-08.

**Hero & Section Interim State**
- **D-02:** Delete the JSX call sites entirely in `src/app/page.tsx`:
  - Remove `<PhotoCarousel>` (lines 60–64) and its `getCarouselPhotos()` helper + the `fs`/`path` imports that only feed it.
  - Remove `<RotatingTagline />` (lines 76–78) plus its surrounding `<div className="mt-4">` wrapper.
  - Remove `<WritingsCarousel posts={posts}>` (line 115) — keep the `Writings ↘` link header; if `posts.length > 0`, render the first 3 posts as plain `<Link>` rows. If `posts.length === 0`, keep "More posts coming soon."
  - Remove `<WorksCarousel projects={projects}>` (line 134) — same fallback pattern: first 3 projects as plain text rows, or "Projects coming soon."
- **D-03:** The Events block on `app/page.tsx` keeps its current `FeaturedUpcoming` + `UpcomingMini` + `PastEventCard` structure. Only the cascading delays and the `animate-ping` indicator are touched.

**Cascade Flattening (MOTION-06)**
- **D-04:** Drop the `delay` prop entirely from every call site (`UpcomingMini` and `PastEventCard`) AND from each component's prop signature. `ScrollReveal` keeps its simple opacity/translate fade with no cascade.
- **D-05:** Audit grep for other cascade patterns before commit: `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*" -g '*.tsx' -g '*.ts'`.

**Always-On Animation Sweep (MOTION-05)**
- **D-06:** Sweep all four Tailwind animate-X utility classes — `animate-ping`, `animate-pulse`, `animate-bounce`, `animate-spin`. The four-class grep runs at execution time, not just the verified-today scan.
- **D-07:** Replace the live-dot pattern with a non-pulsing dot. Lines 51–56 of `event-cards.tsx`: keep the static red dot (inner `<span>` on line 54); delete the outer `animate-ping` wrapper `<span>` (line 53).
- **D-08:** Audit `tailwind.config` / `globals.css` for custom keyframes. If any project-defined keyframes loop forever (`infinite`), record them but do not delete in this phase — that's a Phase 9 token-level decision. Surface them in plan SUMMARY for Phase 9.

**Test Cleanup**
- **D-09:** Delete companion `__tests__/*` files for any deleted component as part of the same plan/commit. Verified at context-gather time: no tests currently reference the 4 carousel components. `src/__tests__/animations/scroll-reveal.test.tsx` and `src/__tests__/pages/links.test.tsx` stay.

**Build Verification Gate**
- **D-10:** Per-plan `npm run build` MUST exit 0 before commit. No `--no-verify` shortcuts.
- **D-11:** Phase verification (gsd-verifier) additionally runs `vercel build --prod`. Matches Phase 13's gate and v1.0 retrospective lesson #2 (production-build-as-truth, not local dev/lint).

**Preservation Guarantees (MOTION-08)**
- **D-12:** Do NOT touch `src/components/animations/scroll-reveal.tsx`, the Lenis smooth-scroll wiring (in `src/components/providers/lenis-provider.tsx`), the 200–300ms page-load opacity fade (`src/app/template.tsx`), or `next-themes` integration.
- **D-13:** Do NOT touch `/newsletter`'s clickable carousel.

### Claude's Discretion
- Filename of plans (e.g., `08-PLAN-01-delete-photo-carousel.md`) — follow project's existing phase-plan naming convention.
- Whether to delete the `getCarouselPhotos()` helper in `app/page.tsx` inside Plan-01 or as a follow-up commit — **recommended (and verified safe): same commit as `PhotoCarousel` deletion**. Confirmed via `rg "getCarouselPhotos"` — only 2 references, both in `src/app/page.tsx` (definition + invocation).
- Exact fallback markup for Writings + Works sections (D-02) — minimal `<ul>` or stacked `<Link>`s with `text-xs uppercase tracking-widest` typography matching the section header.

### Deferred Ideas (OUT OF SCOPE)
- Custom keyframe animations in `globals.css` / `tailwind.config` — recorded in this research's "Orphan Animations after Deletion" subsection but **only the `scroll-left` keyframe block plus its two utility classes are recommended for opportunistic deletion in this phase** because they become provably-orphaned dead code after MOTION-01/03/04 delete their only call sites. Phase 9 owns the broader token-level animation budget.
- Cascade delays on `/blog`, `/projects`, `/links` — only `events` is explicitly in MOTION-06. **Verified at research time:** no accumulator-style `i * 0.N` delays exist on those pages (see Pitfall 3 below). Sole accumulator sites are `/` and `/events`.
- Dark-mode editorial palette — Phase 13.
- Manifesto reveal interaction (MOTION-07) — Phase 10.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MOTION-01 | Delete photo auto-scroll carousel and all references | Verified: `PhotoCarousel` defined in `src/components/home/photo-carousel.tsx`; sole call site `src/app/page.tsx:7,62`; helper `getCarouselPhotos` defined at `src/app/page.tsx:19` and only invoked at line 53; uses `fs`+`path` imports at lines 1-2; relies on CSS class `animate-scroll-left` defined in `src/app/globals.css:97-99` (no other consumer — see Orphan Animations). |
| MOTION-02 | Delete rotating tagline and all references | Verified: `RotatingTagline` defined in `src/components/home/rotating-tagline.tsx`; sole call site `src/app/page.tsx:10,77`; uses `useEffect` + `setInterval(3500)` — a 3.5s-loop timer that needs cleanup at unmount (already handled in component but the *component* is what's being deleted). |
| MOTION-03 | Delete hover-triggered works carousel and all references | Verified: `WorksCarousel` defined in `src/components/home/works-carousel.tsx`; sole call site `src/app/page.tsx:9,134`; uses CSS class `animate-scroll-hover` (shared with WritingsCarousel — see Orphan Animations). Note prop `referenceCount={posts.length}` on line 134 — a cross-section coupling that disappears with the component. |
| MOTION-04 | Delete hover-triggered writings carousel and all references | Verified: `WritingsCarousel` defined in `src/components/home/writings-carousel.tsx`; sole call site `src/app/page.tsx:8,115`; uses `animate-scroll-hover` (shared with WorksCarousel). |
| MOTION-05 | Remove `animate-ping` and any other always-on CSS animations site-wide | Verified: only `animate-ping` instance is `src/components/events/event-cards.tsx:53` inside `FeaturedUpcoming`. `animate-pulse`, `animate-bounce`, `animate-spin` — **zero hits in codebase today.** Custom keyframes `scroll-left` defined in `globals.css:88-95` and the two utility classes `animate-scroll-left` (line 97-99) + `animate-scroll-hover` (line 102-109) loop `infinite` — see "Orphan Animations after Deletion." |
| MOTION-06 | Flatten cascading ScrollReveal delays on event and blog card lists | Verified: cascade-delay sites are exactly **four lines** site-wide (`src/app/page.tsx:175,192` and `src/app/events/page.tsx:66,85`). Both UpcomingMini and PastEventCard accept a *required* `delay` prop; FeaturedUpcoming accepts *optional* `delay = 0.15`. **CRITICAL:** `src/components/animations/scroll-reveal.tsx` is currently a 9-line no-op `<div>` wrapper — the `delay` prop is *accepted but never used*. Cascade flattening is a type-signature + JSX cleanup, not a runtime behavior removal. |
| MOTION-08 | Lenis smooth scroll + 200–300ms page-load fade preserved | Verified: Lenis is wired in `src/components/providers/lenis-provider.tsx` (client provider mounted inside `RootLayout` between `ThemeProvider` and `MotionProvider`). Page-load fade lives in **`src/app/template.tsx`** — `<m.div>` with 300ms `easeOut` opacity 0→1 + y:20→0, route-keyed by `pathname`, reduced-motion fallback to 150ms opacity-only. Both files MUST NOT be touched. |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

Phase 8 specifically engages these directives:

- **GSD Workflow Enforcement:** All file changes must flow through a GSD command. Phase 8 work is gated by `/gsd:execute-phase`.
- **Stack lock-in:** Motion 12 (`motion/react`), Lenis, GSAP 3, Tailwind v4, Next.js App Router. Phase 8 *removes* code; no new dependencies are introduced or considered.
- **"What NOT to Use" list (CLAUDE.md):** `react-notion-x`, Google Analytics, Supabase free tier for Umami, Pages Router, CSS Modules, `next-sitemap`, Contentlayer. Phase 8 must not reintroduce any of these.
- **Production domain is `montysinger.com`** (Namecheap registrar/DNS), NOT msizzle.com — Phase 8 doesn't touch domain wiring; informational only.
- **`vercel build --prod` is the production-readiness gate** (codified in v1.0 Phase 6 plan 06-01 and CLAUDE.md derived guidance). D-11 is the explicit Phase 8 application.

---

## Summary

Phase 8 is a 7-requirement subtraction phase. Every claim in CONTEXT.md was verified against the live codebase and the picture is clean, but **three load-bearing findings reshape execution**:

1. **`ScrollReveal` is already a 9-line no-op `<div>` wrapper** (`src/components/animations/scroll-reveal.tsx:1-9`). The `delay` prop is accepted in the type signature but **never read**. MOTION-06 cascade flattening is a type-signature + JSX prop-drop, not a behavior change. The test `src/__tests__/animations/scroll-reveal.test.tsx` mocks `motion/react` for an implementation that no longer exists — the mocks are dead code but harmless. *Do not get drawn into "fixing" the no-op implementation; D-12 forbids touching this file in Phase 8.*

2. **`src/app/events/page.tsx` is a second call site for cascading `delay={... + i * 0.0X}`** (lines 66, 85). CONTEXT.md hints at this in D-04 and "Integration Points" but the file was not on the explicit deletion-site map. Plan-06 (MOTION-06) must edit BOTH `src/app/page.tsx` AND `src/app/events/page.tsx` AND `src/components/events/event-cards.tsx` to be complete. All four accumulator sites verified: only `src/app/page.tsx:175,192` + `src/app/events/page.tsx:66,85` — no hits on `/blog`, `/projects`, `/links`.

3. **The custom `scroll-left` keyframe + its two utility classes (`animate-scroll-left`, `animate-scroll-hover`) in `src/app/globals.css:88-116` are consumed *only* by the three deleted carousels.** After MOTION-01/03/04 delete the call sites, these CSS rules become orphaned dead code that loops `infinite`. They are functionally always-on CSS animations — they just have no DOM nodes to animate. **Recommendation:** delete the `scroll-left` keyframe + both utility classes + the `@media (prefers-reduced-motion: reduce)` block at lines 111-116 in the same commit as MOTION-04 (or a small follow-up commit in Plan-04). This stays consistent with D-08's "record but defer" stance because the rules are *provably orphaned* by Phase 8 itself — they don't represent a token-level design decision Phase 9 needs to weigh in on.

**Primary recommendation:** Treat Plan-01 (MOTION-01), Plan-02 (MOTION-02), Plan-03 (MOTION-03), Plan-04 (MOTION-04) as a **serialized wave** (single executor, sequential commits) because all four edit the same file `src/app/page.tsx`. Treat Plan-05 (MOTION-05 animate-ping) and Plan-06 (MOTION-06 cascade) as **parallelizable in a second wave** because they touch a different file (`src/components/events/event-cards.tsx`) and a separate route file (`src/app/events/page.tsx`). Plan-07 (MOTION-08 preservation) is a verification-only plan and runs after everything else.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Photo carousel motion loop | Browser (CSS animation) | Frontend Server (SSR markup) | Pure CSS keyframe animation; SSR renders the static div + image markup, the browser runs `scroll-left 40s linear infinite`. Deletion removes both the consumer (page.tsx JSX) and the producer (CSS rule). |
| Hover-triggered carousels (Works/Writings) | Browser (CSS `:hover` + animation-play-state) | — | Fully client-side hover behavior; no SSR coupling. Deletion is a pure delete. |
| Rotating tagline | Browser (`setInterval` + state) | Frontend Server | Client component with `useEffect`-driven timer. Deletion removes the timer and the `useState` index. |
| `animate-ping` pulse on featured event dot | Browser (Tailwind utility) | Frontend Server | SSR emits the `<span>` with the class; browser runs the animation. Deletion is a single `<span>` removal in JSX. |
| ScrollReveal delay cascade | Browser (was-once) → No-op today | Frontend Server | `ScrollReveal` is currently a passthrough `<div>`; the `delay` prop is type-only. Plan-06 is a TypeScript prop-signature edit, not a behavior change. |
| Lenis smooth scroll | Browser (client provider) | — | Mounted in client provider hierarchy in `RootLayout`. **Preserved.** |
| 200–300ms page-load fade | Browser (Motion AnimatePresence in `src/app/template.tsx`) | — | App Router `template.tsx` re-mounts on route change; Motion handles enter/exit transitions. **Preserved.** |

---

## Standard Stack

Phase 8 is a deletion phase — no new dependencies are introduced. The stack relevant to *what stays* and *what is preserved*:

### Core (preserved)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Motion (`motion/react`) | 12.38.0 [VERIFIED: package.json] | Page-transition fade in `template.tsx`; `useReducedMotion` hook in providers | Standard Next.js App Router animation primitive; React 19 compatible. |
| Lenis | 1.3.21 [VERIFIED: package.json] | Smooth scroll, mounted in `LenisProvider` with GSAP ticker | The locked decision from v1.0 (CLAUDE.md confirms); GSAP-driven RAF avoids ScrollTrigger desync. |
| GSAP | 3.14.2 [VERIFIED: package.json] | RAF ticker for Lenis (via `gsap.ticker.add`) | Drives Lenis RAF; preserved with Lenis. |
| Tailwind CSS | v4 [VERIFIED: package.json] | Utility-class styling | CSS-first config; the `animate-*` utilities and custom keyframes live in `src/app/globals.css`. |
| Next.js | 16.2.1 [VERIFIED: package.json] | Framework, App Router, ISR | Per CLAUDE.md the project shipped on Next.js 16 (not the recommended 15.x); works fine per v1.0 retrospective. |
| React | 19.2.4 [VERIFIED: package.json] | UI runtime | Required by Motion 12 + Next 16. |
| Vitest | 4.1.2 [VERIFIED: package.json] | Test framework | `npm run test` runs unit tests including the Lenis provider, template fade, and ScrollReveal tests. |

### Installation
**No `npm install` step in this phase.** This is a pure deletion phase.

### Verified Versions (via package.json on disk)
| Package | Version installed | Notes |
|---------|------------------|-------|
| `motion` | 12.38.0 | Preserved — drives `template.tsx` page-load fade |
| `lenis` | 1.3.21 | Preserved — drives smooth scroll |
| `gsap` | 3.14.2 | Preserved — drives Lenis RAF |
| `next` | 16.2.1 | Build target |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `tailwindcss` | ^4 | Custom keyframes in `globals.css`, not in tailwind.config (none exists) |

---

## Package Legitimacy Audit

> **Not applicable to Phase 8.** This phase installs zero new packages. No registry-verification, slopcheck, or postinstall audit is required. The phase only edits existing source files and deletes existing source files.

---

## Architecture Patterns

### Provider Hierarchy (preserved, do not touch)

```
<html lang="en">
  <body>
    <ThemeProvider>            ← next-themes (light/dark)
      <LenisProvider>          ← Lenis smooth scroll + GSAP ticker  [D-12 preserves]
        <MotionProvider>       ← LazyMotion + MotionConfig reducedMotion="user"
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
        </MotionProvider>
      </LenisProvider>
    </ThemeProvider>
    <UmamiAnalytics />
    <VisitSurvey />
  </body>
</html>
```

Location: `src/app/layout.tsx:61-83`. The 4 children of `<body>` (`ThemeProvider`, `UmamiAnalytics`, `VisitSurvey`, and the `<span>` footer watermark) are out of scope.

### Page-Transition Fade (preserved, do not touch)

`src/app/template.tsx` — App Router `template.tsx` re-mounts on every route change. The `<m.div>` with `AnimatePresence mode="wait"` produces the 200–300ms opacity + 20px-y enter and 10px-y exit. Reduced-motion users get a 150ms opacity-only fallback. This is MOTION-08's "200–300ms page-load fade." **D-12 preserves it.**

Covered by test `src/__tests__/animations/template.test.tsx` — that test must still pass after Phase 8.

### Deletion-Pattern Template (one plan)

```
1. rg <ComponentName> -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' --line-number
   → enumerate every reference (import, JSX, prop, test mock)

2. For each reference: edit/delete with the appropriate tool
   - JSX call site → delete the element + any wrapper div added for it
   - import statement → remove the line
   - companion test → delete the file (if any) — Phase 8 has zero such tests
   - dead helper function → delete (e.g., getCarouselPhotos)
   - now-unused imports (fs, path) → delete

3. Delete the component file: rm src/components/<feature>/<kebab-name>.tsx

4. npm run build   → must exit 0 [D-10]

5. Commit: chore(phase-08): MOTION-XX delete <Component>
```

### Anti-Patterns to Avoid

- **Regex-only deletion.** Do not `sed`-out import lines or JSX blocks. The codebase has 4 imports + 4 JSX call sites + 1 helper + 2 helper-only imports (`fs`, `path`) in a single 207-line file. Use the Edit tool with full line context.
- **Forgetting `src/app/events/page.tsx` in MOTION-06.** It has the same `delay={0.25 + i * 0.05}` and `delay={0.35 + i * 0.03}` pattern as `src/app/page.tsx`. Both must be flattened; missing one leaves cascade behavior alive on `/events`.
- **Touching `src/components/animations/scroll-reveal.tsx`.** D-12 preserves it. Even though the file is a no-op today, Phase 9/10 may swap it for a real implementation — Phase 8's job is to stop *consuming* the `delay` prop, not to redesign the component.
- **Deleting the `scroll-reveal.test.tsx` mock-only test.** The test still asserts the component renders children. Useful for downstream phases. Leave it alone.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Import-site sweep | Custom find-replace script | `rg <ComponentName>` (ripgrep, available) | ripgrep is the established sweep tool per CONTEXT.md D-01 and is fast + accurate. The 4-component case is small enough to manually edit. |
| Reduced-motion handling for replaced markup | Custom CSS query | Tailwind `motion-safe:` / `motion-reduce:` variants or `useReducedMotion()` hook | Already used in `template.tsx`, `lenis-provider.tsx`, `visit-survey.tsx`. Phase 8 introduces no new motion so this is largely informational. |
| Build verification | Custom shell harness | `npm run build` (then `vercel build --prod` at phase gate) | Matches v1.0 lesson #5 — production build is truth. |

**Key insight:** This is a deletion phase. The "don't hand-roll" list is shorter than usual because nothing is being *built*. The risk is over-engineering the deletion — e.g., writing a "deprecation banner" or a "feature flag" for the carousels. Just delete them.

---

## Runtime State Inventory

> Phase 8 is a deletion phase that removes UI components — not a rename/refactor/migration affecting runtime state. However, the orphan-CSS-keyframe risk is the closest analog. The table below is the inventory.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases, datastores, or persistent records reference the deleted component names. Notion CMS schemas are not touched. | None |
| Live service config | None — Umami event names, Vercel project config, Notion database IDs are unaffected. The 4 deleted carousels consume Notion-sourced data but the consumption disappears with them; the Notion data sources remain intact (and are reused by Phase 10's editorial homepage). | None |
| OS-registered state | None — no cron tasks, scheduled jobs, or systemd-equivalent registrations. | None |
| Secrets / env vars | None — the deletion does not touch `NOTION_TOKEN`, `NOTION_DATABASE_ID`, or any other env. The PhotoCarousel reads from `/public/MSizzle-website-photos/` via filesystem, not from env. | None |
| Build artifacts / installed packages | **Custom CSS keyframe `scroll-left` (`src/app/globals.css:88-95`) and its two utility classes `animate-scroll-left` + `animate-scroll-hover` (lines 97-109) plus the reduced-motion override at lines 111-116** become orphaned dead code after MOTION-01/03/04 delete their only consumers. Verified consumers (only 3): `photo-carousel.tsx:17`, `writings-carousel.tsx:19`, `works-carousel.tsx:22`. | Delete the keyframe + 2 utility classes + reduced-motion block from `globals.css` opportunistically in Plan-04 (last carousel deletion). |

**The canonical question — what runtime systems still have the old motion after every file is updated?**

After plans 01–06 ship:
- The CSS `@keyframes scroll-left` block is still in the bundle but has no consumer DOM nodes (dead code).
- The `.animate-scroll-left` and `.animate-scroll-hover` utility classes still exist but are unused (dead code).
- The `@media (prefers-reduced-motion: reduce)` rule scoped to those two classes still exists but matches nothing (dead code).
- **Recommendation:** clean these in the same commit as the last carousel deletion (Plan-04) since they are unambiguously orphan. Document the removal in Plan-04's SUMMARY so Phase 9 can confirm the globals.css cleanup is complete before introducing the warm-paper palette.

Nothing else lingers. There are no stored timers, no localStorage flags, no service-worker registrations, no `setInterval` references outside the 4 deleted components, no cached worker scripts.

---

## Common Pitfalls

### Pitfall 1: Missing the second call site for cascading delay (`src/app/events/page.tsx`)
**What goes wrong:** Plan-06 (MOTION-06) only edits `src/app/page.tsx` and `src/components/events/event-cards.tsx`. The `/events` route still cascades.
**Why it happens:** CONTEXT.md describes the deletion in terms of `app/page.tsx` first; the `/events` route is mentioned only in "Integration Points" ("`event-cards.tsx` is imported by both `app/page.tsx` AND `app/events/page.tsx`"). Easy to overlook.
**How to avoid:** Plan-06 must explicitly list THREE files in its `## Files Changed` section: `src/app/page.tsx`, `src/app/events/page.tsx`, `src/components/events/event-cards.tsx`. Verification: after the plan, `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*"` returns zero hits.
**Warning signs:** A grep for `i * 0.0` patterns post-deletion still returns 2 hits.

### Pitfall 2: `ScrollReveal` no-op confusion
**What goes wrong:** Executor tries to "fix" the empty `ScrollReveal` implementation, thinking the `delay` prop should still produce a fade.
**Why it happens:** Trained pattern says "ScrollReveal with delay = staggered fade-in." But `src/components/animations/scroll-reveal.tsx` is currently:
```tsx
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
```
The `delay` prop is in the interface but the function destructures only `{ children, className }`. The implementation is a no-op `<div>`.
**How to avoid:** D-12 says "do not touch `src/components/animations/scroll-reveal.tsx`." Plan-06 changes the *call-site* props and the *prop signatures* of `UpcomingMini` / `PastEventCard` / `FeaturedUpcoming`. The component itself stays as-is.
**Warning signs:** A plan adds an `import { m, useReducedMotion } from "motion/react"` to `scroll-reveal.tsx`. Block it.

### Pitfall 3: Assuming `/blog`, `/projects`, `/links` cascade
**What goes wrong:** Plan-06 over-scopes to "flatten cascade everywhere" and edits routes that don't actually cascade.
**Why it happens:** Surface assumption — "if `/events` cascades, others probably do too." But verified via `rg "i\s*\*\s*0\.\d+|0\.\d+\s*\+\s*i\s*\*"` — the **only four hits** are the two on `src/app/page.tsx` and the two on `src/app/events/page.tsx`. The `/blog/page.tsx`, `/projects/page.tsx`, and `/links/page.tsx` routes do wrap their content in `ScrollReveal` (with fixed `delay={0}` or `delay={0.15}`), but they don't cascade by index. Since `ScrollReveal` is a no-op anyway, the fixed delays do nothing today either; Plan-06 has no reason to touch those files.
**How to avoid:** Limit Plan-06's scope to the verified four lines + the three component signatures. Do not touch `/blog`, `/projects`, `/links`.
**Warning signs:** A plan adds `src/app/blog/page.tsx` to its Files Changed list.

### Pitfall 4: Leaving the `fs` / `path` imports after deleting `getCarouselPhotos`
**What goes wrong:** Lines 1-2 of `src/app/page.tsx` (`import fs from "fs"; import path from "path";`) become unused imports after the helper is deleted. Build will fail with `@typescript-eslint/no-unused-vars` or similar.
**Why it happens:** Three deletions in one file; easy to forget the head imports.
**How to avoid:** Plan-01 explicitly enumerates the imports to remove: `fs`, `path`, `PhotoCarousel`. Verification: after Plan-01, the first 20 lines of `src/app/page.tsx` should NOT mention `fs`, `path`, `PhotoCarousel`, or `getCarouselPhotos`.
**Warning signs:** `npm run build` fails with a "declared but never used" error.

### Pitfall 5: Leaving orphan `scroll-left` CSS after carousel deletions
**What goes wrong:** Plans 01/03/04 remove the carousels but leave `@keyframes scroll-left` and the `animate-scroll-*` utility classes in `globals.css`. Strictly speaking, every "always-on" CSS animation rule survives the deletion — there's just nothing for it to animate.
**Why it happens:** D-08 instructs to "record but defer" custom keyframes to Phase 9. But this keyframe is *provably orphaned by Phase 8 itself* — no design decision required.
**How to avoid:** Plan-04 (or whichever plan deletes the last `animate-scroll-*` consumer) also deletes lines 88-116 of `src/app/globals.css` (the `@keyframes scroll-left` block, both utility classes, and the scoped reduced-motion override). Record this in the Plan-04 SUMMARY so Phase 9 doesn't re-discover it.
**Warning signs:** A grep on `globals.css` for `scroll-left` returns hits after Plan-04 ships.

### Pitfall 6: Removing `animate-ping` but leaving the outer `<span>` wrapper
**What goes wrong:** Plan-05 deletes the class name but keeps an empty `<span>` wrapping the dot — silent and looks fine in dev, but leaves dead markup.
**Why it happens:** D-07 says "delete the outer `animate-ping` wrapper `<span>` (line 53)" — the whole element, not just the class.
**How to avoid:** Plan-05's after-state for `src/components/events/event-cards.tsx:51-56` is:
```tsx
<h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
  </span>
  Upcoming
</h3>
```
The outer `<span className="relative flex h-2 w-2 shrink-0">` and inner static red dot stay; the middle `animate-ping` span is gone.
**Warning signs:** Visual diff still shows two `<span>` children inside the wrapper `<span>` after Plan-05.

---

## Code Examples

Verified patterns extracted from the live codebase (not external docs — this is a project-internal phase).

### Example 1: Current page.tsx call sites for the 4 deletions (Plans 01–04)

```tsx
// src/app/page.tsx — current state
import fs from "fs";                                                  // line 1 — DELETE in Plan-01
import path from "path";                                              // line 2 — DELETE in Plan-01
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { getUpcomingEvents, getPastEvents } from "@/lib/notion-events";
import { PhotoCarousel } from "@/components/home/photo-carousel";        // line 7 — DELETE in Plan-01
import { WritingsCarousel } from "@/components/home/writings-carousel";  // line 8 — DELETE in Plan-04
import { WorksCarousel } from "@/components/home/works-carousel";        // line 9 — DELETE in Plan-03
import { RotatingTagline } from "@/components/home/rotating-tagline";    // line 10 — DELETE in Plan-02

function getCarouselPhotos(): string[] { /* lines 19-30 */ }             // DELETE in Plan-01

// In JSX:
//   lines 60-64: <PhotoCarousel ... />                                  DELETE in Plan-01
//   lines 76-78: <div className="mt-4"><RotatingTagline /></div>        DELETE in Plan-02
//   line 115:    <WritingsCarousel posts={posts} />                     REPLACE in Plan-04
//   line 134:    <WorksCarousel projects={projects} ... />              REPLACE in Plan-03
```

### Example 2: Cascade-delay flattening (Plan-06, the FOUR sites)

```tsx
// BEFORE — src/app/page.tsx:175
<UpcomingMini key={event.id} event={event} delay={0.2 + i * 0.05} />
// AFTER
<UpcomingMini key={event.id} event={event} />

// BEFORE — src/app/page.tsx:192
<PastEventCard key={event.id} event={event} delay={0.25 + i * 0.03} />
// AFTER
<PastEventCard key={event.id} event={event} />

// BEFORE — src/app/events/page.tsx:66
<UpcomingMini key={event.id} event={event} delay={0.25 + i * 0.05} />
// AFTER
<UpcomingMini key={event.id} event={event} />

// BEFORE — src/app/events/page.tsx:85
<PastEventCard key={event.id} event={event} delay={0.35 + i * 0.03} />
// AFTER
<PastEventCard key={event.id} event={event} />

// BEFORE — src/components/events/event-cards.tsx prop signatures
export function UpcomingMini({ event, delay }: { event: EventItem; delay: number; }) { ... }
export function PastEventCard({ event, delay }: { event: EventItem; delay: number; }) { ... }
export function FeaturedUpcoming({ event, delay = 0.15, priority = false }: { event: EventItem; delay?: number; priority?: boolean; }) { ... }
// AFTER — drop `delay` from signature; ScrollReveal stays but with no delay arg
//   (since ScrollReveal is a no-op div today, the `delay={delay}` becomes `delay={0}` or just `<ScrollReveal>` with no prop)
```

Note: per D-04, "If `ScrollReveal` requires a delay prop, pass `delay={0}` explicitly inside the component (not from the parent)." The current `ScrollReveal` interface allows `delay?: number` (optional), so the executor can drop the prop entirely from the inner JSX too.

### Example 3: animate-ping removal (Plan-05)

```tsx
// BEFORE — src/components/events/event-cards.tsx:51-56
<h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
  </span>
  Upcoming
</h3>

// AFTER
<h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
  </span>
  Upcoming
</h3>
```

The outer container span stays (needed for the `flex` parent). Only the middle pulsing span is removed.

### Example 4: Orphan-CSS cleanup (Plan-04 follow-up)

```css
/* DELETE these lines from src/app/globals.css (lines 88-116) */
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-scroll-left {
  animation: scroll-left 40s linear infinite;
}

.animate-scroll-hover {
  animation: scroll-left 80s linear infinite;
  animation-play-state: paused;
}

.group:hover .animate-scroll-hover {
  animation-play-state: running;
}

@media (prefers-reduced-motion: reduce) {
  .animate-scroll-left,
  .animate-scroll-hover {
    animation: none;
  }
}
```

---

## Orphan Animations after Deletion

This is the precise inventory of CSS animation rules that become dead code after Phase 8 deletions:

| Asset | File:Lines | Used By (before Phase 8) | Used By (after Phase 8) | Disposition |
|-------|-----------|--------------------------|------------------------|-------------|
| `@keyframes scroll-left` | `globals.css:88-95` | `animate-scroll-left`, `animate-scroll-hover` | Nothing | **Delete in Plan-04** |
| `.animate-scroll-left` | `globals.css:97-99` | `PhotoCarousel` (deleted in Plan-01) | Nothing | **Delete in Plan-04** |
| `.animate-scroll-hover` | `globals.css:102-105` | `WritingsCarousel` (deleted in Plan-04), `WorksCarousel` (deleted in Plan-03) | Nothing | **Delete in Plan-04** |
| `.group:hover .animate-scroll-hover` | `globals.css:107-109` | Same as `.animate-scroll-hover` | Nothing | **Delete in Plan-04** |
| `@media (prefers-reduced-motion: reduce)` scoped block | `globals.css:111-116` | Same as above two utilities | Nothing | **Delete in Plan-04** |
| `animate-ping` (Tailwind built-in) | `event-cards.tsx:53` | `FeaturedUpcoming` | Nothing | **Delete in Plan-05** (no CSS edit needed — Tailwind built-in) |

**Verification command for executor after Plan-04 + Plan-05:**
```bash
rg "scroll-left|animate-scroll-|animate-ping|animate-pulse|animate-bounce|animate-spin" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**'
```
Expected: zero hits.

---

## State of the Art

| Old Approach (v1.0) | Current Approach (post-Phase 8) | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-scrolling photo carousel (CSS `animation: scroll-left 40s linear infinite`) | No homepage carousel | Phase 8 | Hero section loses its first visual; Phase 10 replaces with a single full-bleed letterbox photo (HOME-V2-04). |
| `setInterval`-driven rotating tagline (3.5s cycle) | No rotating tagline | Phase 8 | Hero section loses sub-tagline; Phase 10 replaces with a static letter-style intro paragraph (HOME-V2-05). |
| Hover-triggered horizontal scrollers for Works/Writings (`animate-scroll-hover` + `:hover`-toggled play state) | Plain list of 3 items per section | Phase 8 | Section content remains visible without motion; Phase 10 swaps for editorial `ListRow` primitives. |
| Pulsing red dot on featured event (`animate-ping`) | Static red dot | Phase 8 | Visual emphasis becomes typography-driven, matching the editorial brief's "calling card from someone who builds polished software but doesn't need to prove it with motion." |
| Cascading `delay={0.X + i * 0.0Y}` on event lists | Same-time fade (or no-op since `ScrollReveal` is a no-op) | Phase 8 | List items appear simultaneously; cascade illusion gone. |

**Deprecated/outdated:**
- The custom `scroll-left` CSS keyframe — orphaned by Phase 8 deletions; recommended to delete in Plan-04.
- The `delay` prop signature on `UpcomingMini`, `PastEventCard`, `FeaturedUpcoming` — type cleanup as part of Plan-06.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Deleting the `scroll-left` keyframe in Plan-04 is "in scope" — it's provably orphaned by Phase 8 itself, not a token-level design decision. | Orphan Animations, Pitfall 5 | LOW. If user prefers to defer to Phase 9, leave the CSS in `globals.css`; it harmlessly does nothing post-deletion. Tracked separately rather than in this phase doesn't change visible behavior. |
| A2 | The `ScrollReveal` no-op state is intentional and will be left as-is per D-12. | Pitfall 2 | LOW. D-12 explicitly says "Do NOT touch `src/components/animations/scroll-reveal.tsx`." Even if surprising, the directive is locked. |
| A3 | Plans 01–04 should serialize (single executor) because they edit the same file. Plans 05 + 06 can parallelize because they touch different files. | Summary, Plan Slicing | LOW. If a Wave 1 / Wave 2 split causes confusion, fall back to all-serial — Phase 8 is small enough that serial execution adds <10 minutes total. |
| A4 | `src/__tests__/animations/scroll-reveal.test.tsx` stays untouched even though its `motion/react` mock describes an implementation that no longer exists. | Summary, Pitfall 2 | LOW. The test asserts `screen.getByText("Revealed content")` which still passes with the no-op div. Adapting the test is out of scope; the test continues to provide a smoke check. |

All other findings in this research are verified against the live codebase via `rg`, `cat`/`Read`, or direct file inspection — no other assumptions.

---

## Open Questions

1. **Should the `scroll-left` CSS keyframe deletion happen in Plan-04 or a separate Plan-04a?**
   - What we know: The keyframe and both utility classes are unambiguously orphaned by Phase 8 deletions.
   - What's unclear: D-08 says "record but defer" custom keyframes to Phase 9. A1 above proposes treating this specific keyframe as in-scope because Phase 8 itself orphans it.
   - Recommendation: Include the CSS deletion in Plan-04's commit (the last carousel deletion). If the planner disagrees, a follow-up commit in Plan-04 is equally acceptable. Phase 9 should NOT have to handle this — the work is provably trivial.

2. **For Plan-06, should `UpcomingMini` / `PastEventCard` continue wrapping their JSX in `<ScrollReveal>` at all, or should the wrappers be removed too?**
   - What we know: `ScrollReveal` is a no-op `<div>` today; wrapping in it adds a useless `<div>` to the DOM.
   - What's unclear: D-12 forbids touching `scroll-reveal.tsx`, but D-04 only mentions the `delay` prop, not the wrapper presence.
   - Recommendation: Keep the `<ScrollReveal>` wrapper but drop the `delay` prop. This preserves Phase 10/11's option to swap `ScrollReveal` for a real implementation without re-editing every consumer.

3. **Plan-07 (MOTION-08 verification) — what's the smoke check?**
   - What we know: MOTION-08 is a preservation requirement, not a deletion.
   - What's unclear: Whether Plan-07 needs its own verification artifact or is folded into Phase 13 QA.
   - Recommendation: Plan-07 is a small verification plan with three checks: (a) `src/app/template.tsx` unchanged, (b) `src/components/providers/lenis-provider.tsx` unchanged, (c) browser smoke at `/` confirms scroll feels smooth and the route fade fires. The existing tests (`template.test.tsx`, `lenis-provider.test.tsx`) provide the automated portion.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `next build` | ✓ (assumed — project shipped on it) | per `package.json` engines (none pinned) | — |
| npm | `npm run build`, `npm run test` | ✓ | per project | — |
| ripgrep (`rg`) | Import-site sweep (D-01, D-05, D-06) | ✓ (used to perform this research) | — | `grep -r` (slower, also works) |
| Vercel CLI | `vercel build --prod` (D-11) | ✓ | 54.2.0 [VERIFIED: `vercel --version` on the user's machine] | None — phase gate requires this |
| Vitest | `npm run test` (companion-test deletion verification) | ✓ | 4.1.2 [VERIFIED: package.json] | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 [VERIFIED: package.json] |
| Config file | `vitest.config.ts` (jsdom environment, setupFiles `./src/__tests__/setup.ts`, `@` alias to `./src`) |
| Quick run command | `npm run test -- --run` (one-shot, no watch) |
| Full suite command | `npm run test -- --run` (same; project has no separate full vs. quick) |

Note: `package.json` does not currently define a `test` script. Vitest is available via `npx vitest` or by adding a `"test": "vitest"` script. Per the project's existing setup the canonical command is `npx vitest run` — verify with `vitest.config.ts`.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MOTION-01 | `PhotoCarousel` deleted, no imports remain, `getCarouselPhotos()` removed, `fs`/`path` imports removed | grep-absence + build | `rg "PhotoCarousel\|photo-carousel\|getCarouselPhotos"` returns 0 hits; `npm run build` exits 0 | ✅ (manual rg + existing build script) |
| MOTION-02 | `RotatingTagline` deleted, no imports remain | grep-absence + build | `rg "RotatingTagline\|rotating-tagline"` returns 0 hits; `npm run build` exits 0 | ✅ |
| MOTION-03 | `WorksCarousel` deleted, no imports remain | grep-absence + build | `rg "WorksCarousel\|works-carousel"` returns 0 hits; `npm run build` exits 0 | ✅ |
| MOTION-04 | `WritingsCarousel` deleted, no imports remain | grep-absence + build | `rg "WritingsCarousel\|writings-carousel"` returns 0 hits; `npm run build` exits 0 | ✅ |
| MOTION-05 | `animate-ping` removed from event-cards, no other always-on `animate-*` utilities exist | grep-absence | `rg "animate-ping\|animate-pulse\|animate-bounce\|animate-spin"` returns 0 hits | ✅ |
| MOTION-06 | Accumulator-style `delay` props removed from all 4 call sites and from `UpcomingMini`/`PastEventCard` signatures | grep-absence + TypeScript | `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*"` returns 0 hits; `npm run build` exits 0 (TS would catch a missing-prop usage) | ✅ |
| MOTION-08 | Lenis provider unchanged, `template.tsx` unchanged, `scroll-reveal.tsx` unchanged | file-hash + unit tests | `git diff` shows no changes to those three files; `npx vitest run src/__tests__/animations/template.test.tsx src/__tests__/animations/scroll-reveal.test.tsx src/__tests__/providers/lenis-provider.test.tsx` passes | ✅ (existing tests cover all three) |

### Sampling Rate
- **Per task commit:** `npm run build` (D-10 — production-mode build, not lint-only)
- **Per wave merge:** `npm run build` + `npx vitest run` (existing test suite — confirms `template.test.tsx`, `scroll-reveal.test.tsx`, `lenis-provider.test.tsx` still pass)
- **Phase gate:** `vercel build --prod` (D-11) + the full grep-absence sweep enumerated above

### Wave 0 Gaps
- **None.** The existing test infrastructure (`vitest.config.ts`, `src/__tests__/setup.ts`, the three preservation-target tests) covers all phase requirements. No new test files need to be authored. No fixture work needed.
- If the planner wants a stronger MOTION-08 guard, an *optional* enhancement is adding a single integration test that renders `<RootLayout>{ <p>x</p> }</RootLayout>` and asserts the page renders without error — but it's not required to satisfy the success criteria.

---

## Security Domain

Phase 8 is a pure deletion phase touching client-rendered React components and CSS. No new authentication, authorization, session, input-validation, or cryptographic code is introduced. The ASVS table below documents that explicitly.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — (no auth code touched; deletion does not introduce auth concerns) |
| V3 Session Management | no | — (no session code touched) |
| V4 Access Control | no | — (no access control surfaces touched) |
| V5 Input Validation | no | — (no user input handled by deleted components) |
| V6 Cryptography | no | — (no crypto code touched) |
| V14 Configuration | yes (informational) | The `vercel build --prod` gate (D-11) doubles as a configuration-regression check — env-var mismatches surface there per v1.0 retrospective lesson. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidentally removing a server-only boundary | Tampering | None of the deleted files are server-only — all 4 carousels are `'use client'` components and `RotatingTagline` is also client. `getCarouselPhotos` runs server-side (`fs.readdirSync`) but only reads from `/public/` — no secret exposure risk. |
| Re-introducing a leaked secret via copy-paste during deletion | Information disclosure | Phase 13's D-14 client-bundle secret scan (QA-V2-06) provides the durable backstop. Phase 8's deletions reduce surface, not expand it. |

No new threat patterns are introduced by Phase 8.

---

## Plan Slicing Recommendation

Per the additional-context request, here is the wave-assignment recommendation.

### Files Edited Per Plan

| Plan | Requirement | File(s) Edited | File(s) Deleted |
|------|-------------|----------------|------------------|
| Plan-01 | MOTION-01 | `src/app/page.tsx` (imports + JSX + helper) | `src/components/home/photo-carousel.tsx` |
| Plan-02 | MOTION-02 | `src/app/page.tsx` (import + JSX) | `src/components/home/rotating-tagline.tsx` |
| Plan-03 | MOTION-03 | `src/app/page.tsx` (import + JSX) | `src/components/home/works-carousel.tsx` |
| Plan-04 | MOTION-04 | `src/app/page.tsx` (import + JSX), `src/app/globals.css` (delete orphan keyframes) | `src/components/home/writings-carousel.tsx` |
| Plan-05 | MOTION-05 | `src/components/events/event-cards.tsx` (delete `<span class="animate-ping" />`) | — |
| Plan-06 | MOTION-06 | `src/app/page.tsx`, `src/app/events/page.tsx`, `src/components/events/event-cards.tsx` | — |
| Plan-07 | MOTION-08 | — (verification only — `git diff` of preserved files + smoke test) | — |

### Wave Assignment

**Wave 1 (serialize — all touch `src/app/page.tsx`):**
- Plan-01 → Plan-02 → Plan-03 → Plan-04 (in this order — Plan-04 also touches globals.css but no other plan does, so ordering is by least-coupled file changes)

**Wave 2 (parallelizable — different files from Wave 1):**
- Plan-05 (touches `src/components/events/event-cards.tsx`)
- Plan-06 (touches `src/components/events/event-cards.tsx` AND `src/app/page.tsx` AND `src/app/events/page.tsx`)

**Note on Plan-05 vs Plan-06 collision:** Both edit `src/components/events/event-cards.tsx`. Plan-05 removes a JSX element from `FeaturedUpcoming`'s body; Plan-06 removes the `delay` prop from `UpcomingMini` + `PastEventCard` signatures (and optionally from `FeaturedUpcoming`'s signature too). The edits are in different function bodies and signatures so they're conceptually parallelizable, but in practice **easier to serialize Plan-05 → Plan-06** to avoid merge conflicts during a single executor session.

**Also note on Plan-06 + Wave 1 collision:** Plan-06 edits `src/app/page.tsx`, which is also edited by Plans 01–04. Plan-06 must run AFTER Plan-01..04 to avoid edit conflicts on `src/app/page.tsx`. So the safe ordering is:

```
Plan-01 → Plan-02 → Plan-03 → Plan-04 → Plan-05 → Plan-06 → Plan-07
```

Full serial. The "parallelization" optimization here saves <2 minutes for a single executor and introduces real merge risk; recommend full serial.

**Final recommendation:** **All 7 plans run sequentially in a single wave**, in the order above. Phase 8's total surface is small (4 component deletes, 1 CSS-element delete, 1 prop-cascade flatten, 1 verification) and a single executor in sequence is the simplest path. The total wall-clock per the v1.0 phase-7 throughput precedent (11 plans in 3 days) suggests Phase 8 completes in under a day at this granularity.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `src/app/page.tsx` — read in full
- `src/app/events/page.tsx` — read in full
- `src/app/template.tsx` — read in full (page-load fade implementation)
- `src/app/layout.tsx` — read in full (provider hierarchy)
- `src/app/globals.css` — read in full (custom keyframes)
- `src/components/animations/scroll-reveal.tsx` — read in full (no-op state verified)
- `src/components/animations/parallax-layer.tsx` — read in full (also no-op, but unused)
- `src/components/events/event-cards.tsx` — read in full
- `src/components/home/photo-carousel.tsx` — read in full
- `src/components/home/writings-carousel.tsx` — read in full
- `src/components/home/works-carousel.tsx` — read in full
- `src/components/home/rotating-tagline.tsx` — read in full
- `src/components/providers/lenis-provider.tsx` — read in full
- `src/components/providers/motion-provider.tsx` — read in full
- `src/__tests__/animations/scroll-reveal.test.tsx` — read in full
- `src/__tests__/animations/template.test.tsx` — read in full
- `src/__tests__/pages/links.test.tsx` — read in full
- `src/__tests__/pages/home.test.tsx` — read in full (it.todo placeholders)
- `src/__tests__/setup.ts` — read in full
- `package.json` — read in full (deps + scripts verified)
- `vitest.config.ts` — read in full
- `next.config.ts` — read (head only — redirects + image hosts)
- `.planning/phases/08-motion-subtractions/08-CONTEXT.md` — read in full
- `.planning/REQUIREMENTS.md` — read in full
- `.planning/STATE.md` — read in full
- `.planning/ROADMAP.md` — read in full
- `.planning/RETROSPECTIVE.md` — read in full
- `.planning/research/editorial-redesign-handoff/README.md` — read in full
- `CLAUDE.md` — read in full
- `.planning/config.json` — read in full

### Sweeps performed (HIGH confidence — direct grep)
- `rg "PhotoCarousel|WritingsCarousel|WorksCarousel|RotatingTagline|photo-carousel|writings-carousel|works-carousel|rotating-tagline"` — 14 hits, all enumerated
- `rg "getCarouselPhotos"` — 2 hits (definition + invocation in `src/app/page.tsx`)
- `rg "animate-ping|animate-pulse|animate-bounce|animate-spin"` — 1 hit (`event-cards.tsx:53`)
- `rg "UpcomingMini|PastEventCard|FeaturedUpcoming"` — confirms 2 call-site files (`src/app/page.tsx`, `src/app/events/page.tsx`)
- `rg "delay\s*[=:]"` — enumerated all 25+ hits; only 4 are accumulator-style
- `rg "i\s*\*\s*0\.\d+|0\.\d+\s*\+\s*i\s*\*"` — exactly 4 hits (the cascade sites)
- `rg "ScrollReveal"` — enumerated all 50+ hits across pages, components, tests
- `rg "Lenis|lenis"` — confirms wiring in `src/components/providers/lenis-provider.tsx`
- `rg "animate-scroll-left|animate-scroll-hover|scroll-left"` — 11 hits, all enumerated; only 3 consumers (the deleted carousels)
- `rg "useReducedMotion|prefers-reduced-motion"` — confirms reduced-motion handling in template, lenis-provider, visit-survey, and globals.css
- `rg "PhotoCarousel|WritingsCarousel|WorksCarousel|RotatingTagline|animate-scroll" src/__tests__/` — 0 hits (CONTEXT.md D-09 verified clean)
- `which vercel && vercel --version` — `/opt/homebrew/bin/vercel` `54.2.0`

### Secondary (MEDIUM confidence — documented but not executed)
- CLAUDE.md stack table — informational; phase 8 introduces no new packages
- The editorial-redesign-handoff README — informational; phase 8 doesn't build the editorial design, it only clears the canvas

### Tertiary (LOW confidence)
- None. Every claim in this research is verified against the on-disk codebase or against CONTEXT.md's locked decisions.

---

## Metadata

**Confidence breakdown:**
- Phase scope & decisions: HIGH — CONTEXT.md is explicit; this research verified every claim against the codebase
- Call-site enumeration: HIGH — exhaustive `rg` sweeps with explicit hit counts
- Orphan CSS identification: HIGH — `scroll-left` keyframe's consumers fully enumerated; provably dead post-Phase 8
- Preservation file identification (template.tsx, lenis-provider.tsx, scroll-reveal.tsx): HIGH — read in full; test coverage confirmed
- Wave-assignment recommendation: MEDIUM — based on file-overlap analysis; the all-serial recommendation is conservative but justified
- `vercel build --prod` availability: HIGH — verified via `which vercel` returning `/opt/homebrew/bin/vercel` v54.2.0

**Research date:** 2026-05-20
**Valid until:** 2026-06-04 (15 days — Phase 8's surface is small and the codebase rarely changes outside GSD workflows; if any of the 4 carousel files or `src/app/page.tsx` or `src/app/events/page.tsx` changes before Phase 8 ships, re-run the sweeps before planning).
