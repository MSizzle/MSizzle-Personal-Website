---
phase: 10
plan: 02
subsystem: homepage-intro-building
tags: [homepage, editorial, intro-link, building-section, primitives-consumed]
dependency_graph:
  requires:
    - v2.0-homepage-scaffold      # src/app/page.tsx — header + manifesto + epigraph + section placeholders from Plan 10-01
    - phase-9-primitives          # IntroLink, RuleStrong, Rule, SectionLabel, AllLink (09-02..09-08)
    - phase-9-tokens              # text-body-lead, text-feature, text-meta, text-muted, text-ink (09-01)
    - notion-getters              # getFeaturedProjects (carried into page.tsx by 10-01)
  provides:
    - homepage-intro              # Letter-style intro paragraph (HOME-V2-05)
    - homepage-building-section   # BUILDING — Prometheus + Selected Works (HOME-V2-06)
    - section-pattern-canonical   # Reference pattern (RuleStrong → SectionLabel → mt-[72px] content → AllLink) for Plans 10-03/04/05
  affects:
    - src/app/page.tsx            # 11 + 49 lines added; placeholder `PLAN-10-02 INTRO + BUILDING` removed
tech-stack:
  added:
    - none                        # No new deps; only Phase 9 primitives now consumed
  patterns:
    - d13-canonical-section       # RuleStrong → 120px → SectionLabel → 72px → grid rows separated by Rule → 120px → next section
    - selected-works-empty-state  # length === 0 → "Recent work coming soon." text-muted; suffix `+N more` only when length > 8
    - intro-link-inline           # 3× IntroLink components inside a 720px max-width text-body-lead paragraph
key-files:
  created:
    - .planning/phases/10-editorial-homepage/10-02-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Used arbitrary Tailwind values `pt-[120px]`, `pb-[120px]`, `mt-[72px]` per plan D-13 spacing exactly; default Tailwind scale lacks 30/18 utilities mapping cleanly to 120px/72px."
  - "Selected Works empty-state branches BEFORE the AllLink, so 'View all works →' still renders below the empty-state message — keeps the CTA stable across data states (Risk 1 mitigation from 10-RESEARCH)."
  - "Dropped only the `projects` eslint-disable comment; `posts` and `upcomingEvents` retain theirs (consumed by Plan 10-03)."
  - "Verified `project.title` is the canonical field in `src/lib/notion-projects.ts` Project interface — no rename needed."
metrics:
  duration: "~5 minutes"
  completed: "2026-05-21"
  tasks_completed: 2
  files_modified: 1
requirements:
  - HOME-V2-05
  - HOME-V2-06
---

# Phase 10 Plan 02: Editorial Intro + BUILDING Section Summary

Filled the Letter-style intro paragraph (HOME-V2-05) and the BUILDING section with Prometheus + Selected Works rows (HOME-V2-06) into the v2.0 homepage. Both sections sit between the epigraph image (Plan 10-01) and the remaining downstream placeholders (10-03/04/05). The canonical D-13 section pattern — `RuleStrong → SectionLabel → mt-[72px] grid → Rule between rows → next section` — is now in place and ready for verbatim reuse by Plans 10-03 through 10-05.

## What Shipped

### Task 1 — Letter-style intro paragraph (HOME-V2-05)

**Commit `7f2ca22`** — `feat(10-02): letter-style intro paragraph (HOME-V2-05)`

| Surface | Mapping | Details |
|---|---|---|
| `import { IntroLink }` | D-11/D-12 | First Phase 9 primitive consumed in page.tsx |
| Intro `<section>` | HOME-V2-05 / D-11+D-12 | `<section className="px-6 pt-20 md:px-40 md:pt-24">` |
| Intro `<p>` | D-11 | `<p className="max-w-[45rem] text-body-lead text-ink">` — 720px max-width, 22px / 1.55 / -0.005em / 400 |
| Three `<IntroLink>` usages | D-12 verbatim | Prometheus → `https://prometheus.today`, Monty Monthly → `/newsletter`, essays → `/blog` |
| Body copy | D-12 verbatim | "I'm Monty — a builder and a writer. I run Prometheus, … Most of what I make is an attempt to slow something down enough to see it clearly." |

**Acceptance checks (Task 1):**
- `rg "IntroLink"` → 4 (1 import + 3 usages) ✓
- `rg "max-w-\[45rem\]"` → 1 ✓
- `rg "text-body-lead"` → 1 ✓
- `rg "Most of what I make is an attempt to slow something down"` → 1 ✓
- `rg "https://prometheus.today"` → 1 (others appear in Task 2 commit) ✓
- `npm run build` exits 0 — 41 routes prerender ✓

### Task 2 — BUILDING section (HOME-V2-06)

**Commit `d3138cc`** — `feat(10-02): BUILDING section — Prometheus + Selected Works (HOME-V2-06)`

| Surface | Mapping | Details |
|---|---|---|
| Imports added | D-13–D-16 | `RuleStrong`, `Rule`, `SectionLabel`, `AllLink` |
| `<RuleStrong />` | D-13 pattern | 2px strong rule above the section (top boundary) |
| BUILDING `<section>` | D-13 | `px-6 pt-[120px] pb-[120px] md:px-40` — 120px vertical breathing room |
| `<SectionLabel numeral="01 — Studio">Building</SectionLabel>` | D-14 | `text-label uppercase` + muted numeral right-aligned |
| Row container | D-15 | `mt-[72px]` gap from label to first row |
| Row 1 — Prometheus | D-15 | 3-col grid `180px_1fr_1fr` on md+, single col on mobile. Tag: "Active · AI Studio". Title: "Prometheus" in `text-feature`. Blurb: orthodontic + hospitality copy verbatim from handoff. CTA: `<AllLink href="https://prometheus.today">prometheus.today →</AllLink>`. |
| `<Rule />` | D-16 | 1px hairline between Row 1 and Row 2 |
| Row 2 — Selected Works | D-15+D-16 | Tag: `Archive · {projects.length} projects` (live count). Title: "Selected Works" in `text-feature`. Blurb: `projects.slice(0, 8).map(p => p.title).join(", ")` + `${count > 8 ? " +N more" : ""}`. Empty state: `<p className="text-muted">Recent work coming soon.</p>`. CTA: `<AllLink href="/projects">View all works →</AllLink>`. |
| `projects` consumption | — | `eslint-disable` removed; variable now drives Row 2 dynamically |
| PLAN-10-02 placeholder | — | Removed (rg returns 0); PLAN-10-03/04/05 placeholders remain |

**Acceptance checks (Task 2):**
- `rg 'SectionLabel numeral="01 — Studio">Building'` → 1 ✓
- `rg "text-feature"` → 2 (Prometheus + Selected Works titles) ✓
- `rg "View all works"` → 1 ✓
- `rg "projects\.slice\(0, 8\)"` → 1 ✓
- `rg "Recent work coming soon"` → 1 ✓
- `rg "PLAN-10-02"` → 0 (placeholder removed) ✓
- `rg "Archive · "` → 1 ✓
- `rg "Prometheus"` → 3 (intro IntroLink + import line + BUILDING row title) ✓
- 5 imports from `@/components/editorial/*` (IntroLink, RuleStrong, Rule, SectionLabel, AllLink) ✓
- `npm run build` → ✓ Compiled successfully (41 routes prerender)

## Phase 9 Primitives Consumed

This plan is the first to actually consume Phase 9 editorial primitives in the live homepage (the `/specimen` route doesn't count — it's a discovery aid). Five primitives are now imported in `src/app/page.tsx`:

| Primitive | Used For |
|---|---|
| `IntroLink` | 3× inline links inside the letter-style intro paragraph |
| `RuleStrong` | Top boundary of BUILDING section |
| `Rule` | Between Prometheus and Selected Works rows |
| `SectionLabel` | "Building" + "01 — Studio" header |
| `AllLink` | "prometheus.today →" and "View all works →" CTAs |

This validates the Phase 9 primitive surface against real-world consumption — the prop signatures (`{ children, href }` for IntroLink/AllLink, `{ children, numeral? }` for SectionLabel, no props for Rule/RuleStrong) all matched downstream usage with zero adaptation needed.

## Decisions Made

### Arbitrary Tailwind values for D-13 spacing

The handoff specifies exact pixel values: 120px above/below sections, 72px between SectionLabel and content. Tailwind's default scale doesn't include `pt-30`/`mt-18` mapping cleanly to those values. Two options:

1. Use closest standard scale (e.g., `pt-28` = 112px, `pt-32` = 128px) — within ~8px of the spec.
2. Use Tailwind v4 arbitrary values (`pt-[120px]`, `mt-[72px]`) — pixel-exact.

Chose (2). Tailwind v4 supports arbitrary values natively, the handoff spacing is part of the editorial rhythm (D-13 explicitly calls out the numbers), and arbitrary values are the canonical Tailwind v4 idiom for one-off design tokens. Plans 10-03/04/05 will copy the same `pt-[120px]` / `pb-[120px]` / `mt-[72px]` pattern.

### Empty-state placement (Risk 1 mitigation)

Per 10-RESEARCH Risk 1, an empty `projects` array would produce strings like `Archive · 0 projects` and an empty blurb. The plan specified a fallback "Recent work coming soon.". I placed the conditional INSIDE the blurb cell, BEFORE the AllLink wrapper — so:

- Empty state renders: `<p className="text-muted">Recent work coming soon.</p>` + the AllLink "View all works →".
- Populated state renders: comma-joined titles + optional `+N more` suffix + the AllLink.

The CTA stays visible in both states, which is correct: even an empty `Featured` set on Notion shouldn't hide the path to `/projects`. The tag `Archive · 0 projects` does render in the empty case — defensible since it's literally accurate; if visual review flags it, a future polish pass can swap to "Archive · — projects" or similar.

### Kept other eslint-disable comments

`posts` and `upcomingEvents` are still unconsumed — they wait for Plan 10-03 (WRITING + EVENTS). Their eslint-disable lines stay. Only `projects` had its eslint-disable removed because this plan consumes it.

## Deviations from Plan

### Auto-fixed Issues
None — the plan was specified concretely enough that both tasks executed exactly as written, with no Rule 1/2/3 fixes required.

### Notes (not deviations)

**1. The `+N more` suffix uses backticks rather than string concat**
- Plan `<action>` showed: ``projects.slice(0, 8).map((p) => p.title).join(", ") + (projects.length > 8 ? ` +${projects.length - 8} more` : "")``
- Acceptance grep checked: ``projects\.slice\(0, 8\)`` — passes with either string-concat or template-literal expressions.
- Implementation uses an explicit `{ ... }{ ... }` JSX expression pair: `{projects.slice(0, 8).map((p) => p.title).join(", ")}{projects.length > 8 ? ` +${projects.length - 8} more` : ""}`. Semantically identical to the spec; reads cleanly in JSX.

**2. `project.title` field confirmed correct**
- Additional context flagged uncertainty about whether the project name field was `title` or `name`.
- Confirmed via `src/lib/notion-projects.ts`: the `Project` interface declares `title: string` (line 41), populated from `props["Name"] || props["Title"] || props["title"]` (lines 55–59).
- Used `p.title` — no adjustment needed.

## Build & Verification

- `npm run build` exits 0 after Task 1 AND after Task 2.
- 41 routes prerender, including `/` as a static page with 30m revalidate.
- No new build warnings beyond the pre-existing Node `url.parse` deprecation (upstream, untouched).
- `/` route compiles into the same static slot as before — render path is unaffected by the new sections.

## Files Touched

| File | Action | Commit |
|---|---|---|
| src/app/page.tsx | modified — added IntroLink import + intro section | 7f2ca22 |
| src/app/page.tsx | modified — added RuleStrong/Rule/SectionLabel/AllLink imports + BUILDING section + removed PLAN-10-02 placeholder + dropped projects eslint-disable | d3138cc |

## Setup for Downstream Plans

The canonical D-13 section pattern is in production. Plans 10-03, 10-04, 10-05 each replace their respective placeholder comment (`PLAN-10-03 WRITING + EVENTS`, `PLAN-10-04 PHOTOGRAPHS`, `PLAN-10-05 PERSONAL + FOOTER`) with sections that match this exact skeleton:

```tsx
<RuleStrong />
<section className="px-6 pt-[120px] pb-[120px] md:px-40">
  <SectionLabel numeral="0N — Topic">Section Title</SectionLabel>
  <div className="mt-[72px]">
    {/* rows separated by <Rule /> */}
  </div>
</section>
```

Plan 10-03 already has access to `posts` and `upcomingEvents` at the top of `Home()`; both just need their eslint-disable lines dropped and consumed.

`src/app/page.tsx` is now ~165 lines (well within budget). 6 of the 13 homepage requirements are now shipped (HOME-V2-01..06).

## Known Stubs
None. Both sections render real data:
- Intro paragraph: static copy, no data dependency
- BUILDING Row 1 (Prometheus): static copy + external URL — intentional, not a stub
- BUILDING Row 2 (Selected Works): driven by `getFeaturedProjects()` from Notion. Empty-state ("Recent work coming soon.") is intentional UX, not a stub.

## Threat Flags
None — no new auth, no new input handling, no new network endpoints. Plan 10-01's defensive try/catch around `getFeaturedProjects()` continues to absorb Notion API failures into an empty array, which falls through cleanly to the empty-state branch.

## Self-Check: PASSED

- src/app/page.tsx — FOUND (modified twice)
- Commit 7f2ca22 — FOUND in git log (Task 1)
- Commit d3138cc — FOUND in git log (Task 2)
- `npm run build` — PASSED (Compiled successfully)
- All 7 grep acceptance assertions for Task 1 — PASSED
- All 9 grep acceptance assertions for Task 2 — PASSED
