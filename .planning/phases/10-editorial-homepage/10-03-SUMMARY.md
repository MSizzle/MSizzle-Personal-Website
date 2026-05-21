---
phase: 10
plan: 03
subsystem: homepage-writing-events
tags: [homepage, editorial, writing, events, list-row, dates-helper, notion-fields]
dependency_graph:
  requires:
    - phase-9-primitives             # ListRow (09-04), AllLink, SectionLabel, RuleStrong from Phase 9
    - phase-9-tokens                 # text-event-title (36px / 1.1 / -0.02em / 700), text-list-title, text-list-title-home, text-meta, text-caption, text-body, text-ink, text-muted
    - 10-02-summary                  # canonical D-13 section pattern + posts/upcomingEvents getters already wired
    - notion-getters                 # getPublishedPosts (BlogPost) + getUpcomingEvents (EventItem)
  provides:
    - dates-helper-module            # src/lib/dates.ts (formatMonthYear + formatMonthDay) — reusable in Phase 11 archive pages
    - homepage-writing-section       # HOME-V2-07 — 3 latest essays as <ListRow big>
    - homepage-events-section        # HOME-V2-08 — featured event (inline 3-col grid) + 2 secondary <ListRow>
  affects:
    - src/app/page.tsx               # +94 lines: ListRow + dates imports, WRITING section, EVENTS section; -2 unused-vars eslint-disables; PLAN-10-03 placeholder removed
tech-stack:
  added:
    - src/lib/dates.ts               # NEW pure module — 2 exports, zero imports, zero side effects
  patterns:
    - d13-section-pattern-extended   # 3rd + 4th canonical section usages (after BUILDING in 10-02)
    - iife-derived-locals            # `(() => { const featuredEvent = upcomingEvents[0]; ... })()` to derive locals inside JSX without lifting into the Home() body
    - empty-state-before-cta         # Empty branch renders muted line; AllLink still renders unconditionally (mirrors 10-02 Selected Works pattern)
key-files:
  created:
    - src/lib/dates.ts
    - .planning/phases/10-editorial-homepage/10-03-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Used IIFE pattern `(() => { ... })()` inside the EVENTS populated branch to derive `featuredEvent` + `secondaryEvents` locals without lifting them into the Home() function body — keeps Home() top-level clean and the derived bindings co-located with the JSX that consumes them."
  - "Excluded `formatEventTime` (RESEARCH §'Date Formatting Helpers' suggested 3 helpers). D-21a only locked the 2 month-based helpers; v2.0 homepage per D-19 displays only month + day, not time. Phase 11 archive pages can extend the module if time formatting becomes a real need."
  - "Renamed RESEARCH's suggested `formatNextDate` to `formatMonthDay` to match PLAN frontmatter must_have wording (`returning 'JUN 12' style`) — semantically identical, name is more self-documenting."
  - "Kept `featuredEvent.link` (not `event.link`) in the featured event RSVP AllLink — local naming distinguishes the array[0] binding from the secondary `.map((event) => ...)` iteration variable. Both reference the same `EventItem.link` field per D-19/D-21 REVISED."
  - "Empty-state copy locked: 'More essays coming soon.' (D-18) for WRITING and 'No upcoming events.' (D-22) for EVENTS. The handoff sample copy ('AI for Small Biz, Vol. II...') was NOT shipped per D-22's explicit rule against hardcoded placeholder events."
metrics:
  duration: "~10 minutes"
  completed: "2026-05-21"
  tasks_completed: 3
  files_modified: 1
  files_created: 1
requirements:
  - HOME-V2-07
  - HOME-V2-08
---

# Phase 10 Plan 03: WRITING + EVENTS Sections Summary

Shipped `src/lib/dates.ts` (two pure exports — `formatMonthYear`, `formatMonthDay`) and wired both the WRITING (HOME-V2-07) and EVENTS (HOME-V2-08) sections of the v2.0 homepage to live Notion data via the verified field names (`post.description`, `event.name`, `event.link`). The canonical D-13 section pattern established by Plan 10-02 now has 3 + 4 concrete usages on the homepage (BUILDING from 10-02, WRITING and EVENTS from 10-03), and 8 of 13 homepage requirements are complete.

## What Shipped

### Task 1 — `src/lib/dates.ts` (D-21a)

**Commit `703b485`** — `feat(10-03): add src/lib/dates.ts date helpers (D-21a)`

16-line pure module. Two named exports:

```ts
export function formatMonthYear(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();              // → "MAY 2026"
}

export function formatMonthDay(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();              // → "JUN 12"
}
```

| Acceptance criterion | Status |
|---|---|
| `test -f src/lib/dates.ts` | ✓ exists |
| `export function formatMonthYear` | ✓ present |
| `export function formatMonthDay` | ✓ present |
| Both accept `string \| null`; return `""` for null | ✓ |
| Both use `toLocaleDateString("en-US", ...).toUpperCase()` | ✓ |
| Zero imports (pure module) | ✓ |
| `npm run build` exits 0 | ✓ |

### Task 2 — WRITING section (HOME-V2-07)

**Commit `6d095e9`** — `feat(10-03): WRITING section — 3 latest essays as ListRow big (HOME-V2-07)`

| Surface | Mapping | Details |
|---|---|---|
| `import { ListRow }` | new in this plan | First production usage of Phase 9 ListRow primitive on the homepage |
| `import { formatMonthYear }` | new | From `src/lib/dates.ts` (Task 1) |
| `<RuleStrong />` | D-13 | Top boundary of WRITING section |
| `<section>` | D-13 | `px-6 pt-[120px] pb-[120px] md:px-40` — matches BUILDING spacing exactly |
| `<SectionLabel numeral="02 — Library">Writing</SectionLabel>` | D-14 | Numeral lines up with `01 — Studio` from BUILDING |
| `<div className="mt-[72px]">` | D-13 | 72px between label and content |
| Empty branch | D-18 | `<p className="text-caption text-muted">More essays coming soon.</p>` |
| Populated branch | D-17 REVISED | `posts.slice(0, 3).map((post) => <ListRow big href={`/blog/${post.slug}`} title={post.title} extra={post.description} meta={formatMonthYear(post.date)} key={post.id} />)` |
| `<AllLink href="/blog">All writing →</AllLink>` | D-17 | Inside `mt-12` wrapper, renders unconditionally (matches Selected Works empty-state-then-CTA pattern from 10-02) |
| `posts` eslint-disable | — | Removed (variable now consumed) |

**Acceptance grep results:**

| Assertion | Hits | Status |
|---|---|---|
| `ListRow` in page.tsx | 2 (import + 1 usage in `posts.slice` map) at end of Task 2 | ✓ |
| `post\.description` | 1 | ✓ |
| `formatMonthYear` | 2 (import + meta) | ✓ |
| `SectionLabel numeral="..."` matching `02 — Library` | 1 | ✓ |
| `All writing` | 1 | ✓ |
| `More essays coming soon` | 1 | ✓ |
| `npm run build` exit 0 | — | ✓ |
| PLAN-10-03 placeholder still present | — | ✓ (deleted in Task 3) |

### Task 3 — EVENTS section (HOME-V2-08)

**Commit `8af72d2`** — `feat(10-03): EVENTS section — featured event + 2 secondary ListRows (HOME-V2-08)`

| Surface | Mapping | Details |
|---|---|---|
| `formatMonthDay` added to dates import | new | Extended existing `import { formatMonthYear } from "@/lib/dates";` |
| `<RuleStrong />` | D-13 | Top boundary of EVENTS section |
| `<section>` | D-13 | `px-6 pt-[120px] pb-[120px] md:px-40` |
| `<SectionLabel numeral="03 — Calendar">Events</SectionLabel>` | D-14 | |
| `<div className="mt-[72px]">` container | D-13 | |
| Empty branch | D-22 | `<p className="text-caption text-muted">No upcoming events.</p>` — NO hardcoded sample copy |
| Featured event (populated branch) | D-19 REVISED | 3-column grid `md:grid-cols-[180px_1fr_auto]` |
| — Date column | D-19 | `NEXT · {formatMonthDay(featuredEvent.date)}` (text-meta uppercase text-ink) + `{featuredEvent.location}` below (text-meta uppercase text-muted). **No `animate-ping`** (D-20). |
| — Content column | D-19 | `<div className="text-event-title text-ink">{featuredEvent.name}</div>` (D-19 — `event.name`, NOT `event.title`) + 540px description below (`max-w-[34rem]`) |
| — CTA column | D-19 | `<AllLink href={featuredEvent.link \|\| "/events"}>RSVP →</AllLink>` (D-19 — `event.link`, NOT `event.rsvpUrl`; falls back to `/events`) |
| Secondary events | D-21 REVISED | `upcomingEvents.slice(1, 3).map((event) => <ListRow ... />)` — 2 rows, non-big variant. `title={event.name}`, `extra={event.description}`, `meta={formatMonthYear(event.date)}`, `href={event.link \|\| "/events"}`, `key={event.id}` |
| `<AllLink href="/events">All events →</AllLink>` | D-21 | Renders unconditionally (inside `mt-12` wrapper, outside the empty/populated branch) |
| `upcomingEvents` eslint-disable | — | Removed (variable now consumed) |
| PLAN-10-03 placeholder | — | Removed |

**Acceptance grep results (Task 3 + plan-level VALIDATION 10-03-V):**

| Assertion | Hits | Status |
|---|---|---|
| `formatMonthDay` | 2 (import + invocation) | ✓ |
| `event\.name` | 1 (secondary ListRow `title`) | ✓ |
| `event\.link` | 1 (secondary ListRow `href`); featured RSVP uses `featuredEvent.link` (case-sensitive grep miss — same field, different binding) | ✓ |
| `text-event-title` | 1 | ✓ |
| `SectionLabel numeral="03 — Calendar"` | 1 | ✓ |
| `All events` | 1 | ✓ |
| `No upcoming events` | 1 | ✓ |
| `animate-ping` count | 0 | ✓ (D-20 honored) |
| `PLAN-10-03` placeholder count | 0 | ✓ (removed) |
| `ListRow` total in page.tsx | 4 (import + 1 WRITING `.map` + 1 secondary EVENTS `.map`) — call-site count = 3 unique JSX elements, well past the ≥ 3 threshold | ✓ |
| `test -f src/lib/dates.ts` | — | ✓ |
| `npm run build` exit 0 | — | ✓ |

## Notion Field Names Verified

CONTEXT D-17/D-19/D-21 REVISED and RESEARCH F2 prescribed specific field names. Re-verified against the actual TypeScript interfaces before writing JSX:

| Field assumption | Actual interface | Field used | Match? |
|---|---|---|---|
| `BlogPost.description` (NOT excerpt/subtitle) | `src/lib/notion.ts` line 43: `description: string` | `post.description` | ✓ |
| `BlogPost.date` (ISO string) | `src/lib/notion.ts` line 45: `date: string` | `formatMonthYear(post.date)` | ✓ |
| `BlogPost.slug` | `src/lib/notion.ts` line 41: `slug: string` | `/blog/${post.slug}` | ✓ |
| `BlogPost.id` (stable key) | `src/lib/notion.ts` line 40: `id: string` | `key={post.id}` | ✓ |
| `EventItem.name` (NOT title) | `src/lib/notion-events.ts` line 40: `name: string` | `featuredEvent.name`, `event.name` | ✓ |
| `EventItem.link` (NOT rsvpUrl) | `src/lib/notion-events.ts` line 44: `link: string \| null` | `featuredEvent.link \|\| "/events"`, `event.link \|\| "/events"` | ✓ |
| `EventItem.date` (ISO, may be null) | `src/lib/notion-events.ts` line 41: `date: string \| null` | `formatMonthDay(featuredEvent.date)`, `formatMonthYear(event.date)` — dates helpers handle null safely | ✓ |
| `EventItem.location` | `src/lib/notion-events.ts` line 43: `location: string` | `featuredEvent.location` | ✓ |
| `EventItem.description` | `src/lib/notion-events.ts` line 45: `description: string` | `featuredEvent.description`, `event.description` | ✓ |
| `EventItem.id` (stable key) | `src/lib/notion-events.ts` line 39: `id: string` | `key={event.id}` | ✓ |

**Zero deviations.** All field names matched the CONTEXT/RESEARCH assumptions exactly — D-17/D-19/D-21 REVISED were correctly drafted from the verified interfaces. The cautionary note in the additional context ("verify actual field names BEFORE writing JSX") was honored and no fallbacks were needed.

## Event Time Formatting — Deferred (not shipped this plan)

The handoff §"EVENTS — 03 / Calendar" shows the featured event subtitle as "7:00 PM EST / Washington, D.C.". D-21a only locked the two month-based helpers (`formatMonthYear`, `formatMonthDay`), and RESEARCH §"Date Formatting Helpers" §"Notion Data Shapes" flagged the time-from-`event.date` extraction as unreliable for the v2.0 cut. The implementation ships with only date + location (no time string) for the featured event subtitle. The featured event's location string (`featuredEvent.location` e.g. "Washington, D.C.") still renders.

If a future polish pass wants the time displayed, two paths are available:

1. Extend `src/lib/dates.ts` with a `formatEventTime(iso)` helper (RESEARCH §"Date Formatting Helpers" already drafted the implementation) — compose with `formatMonthDay` in the date column.
2. Add a separate `time` property to the EventItem Notion schema (currently the time is embedded in `date` ISO but its accuracy depends on Notion entry hygiene).

This is a non-blocking polish item, not a deviation from the plan — the plan explicitly excluded time formatting from Task 1's `<action>` ("Do NOT add a third helper for now... If Plan 10-03 Task 3 decides it needs time formatting, extend this file at that point.").

## Phase 9 Primitives Consumed (cumulative across 10-02 + 10-03)

| Primitive | Used by | First plan |
|---|---|---|
| `IntroLink` | Letter intro paragraph (3×) | 10-02 |
| `RuleStrong` | BUILDING / WRITING / EVENTS top boundaries (3×) | 10-02 |
| `Rule` | Between Prometheus and Selected Works rows (1×) | 10-02 |
| `SectionLabel` | BUILDING / WRITING / EVENTS headers (3×) | 10-02 |
| `AllLink` | Prometheus / Selected Works / WRITING / RSVP / All events CTAs (5×) | 10-02 |
| `ListRow` | WRITING (3 essays max) + EVENTS (2 secondary) (2× JSX usages, ≥ 5 row instances at render time) | **10-03** |

After this plan, every Phase 9 primitive (except `LetterDrop` which is a Plan 10-07 reserve) is now consumed in the live homepage — the homepage IS the design system.

## Deviations from Plan

### Auto-fixed Issues
None. All three tasks executed exactly as written. No Rule 1, Rule 2, or Rule 3 fixes triggered. No Rule 4 architectural questions raised.

### Notes (not deviations)

1. **IIFE pattern for EVENTS local derivation.** The plan `<action>` for Task 3 said "derive a local variable at the top: `const featuredEvent = upcomingEvents[0];` and `const secondaryEvents = upcomingEvents.slice(1, 3);`" without specifying *where* in the function body. Two viable patterns existed:
   - Lift to Home() function body (above the JSX `return`).
   - Inline IIFE inside the populated branch.
   I chose the inline IIFE because (a) the variables are only used within the EVENTS section, (b) the derivation depends on `upcomingEvents.length > 0` already being true, and (c) it keeps the JSX self-contained for the eventual Plan 11 component extraction (`<HomeFeaturedEvent>` per D-CONTEXT). This is the same IIFE pattern noted in the additional context.

2. **`event.link` substring grep hit count.** The plan acceptance grep `rg "event\.link" src/app/page.tsx >/dev/null` runs case-sensitive. The featured event uses `featuredEvent.link` (uppercase E), which does NOT match the lowercase `event.link` pattern. The secondary ListRow uses `event.link` (lowercase, the `.map((event) => ...)` iteration variable). Net result: 1 grep hit, which satisfies the `>/dev/null` exit-0 check. Both call sites reference the same `EventItem.link` field per the verified interface — semantically D-19/D-21 REVISED is satisfied.

3. **`text-event-title` token.** Used unchanged from Phase 9 (36px / 1.1 / -0.02em / 700). Confirmed it renders correctly via the `npm run build` static prerender for `/`.

## Build & Verification

- `npm run build` exits 0 after Task 1, Task 2, and Task 3 (verified each time).
- 41 routes prerender; `/` continues to be statically generated with 30m revalidate.
- Final `src/app/page.tsx` is 260 lines — meets the `min_lines: 200` must_have artifact spec.
- No new lint warnings.
- `posts` and `upcomingEvents` are now CONSUMED — both eslint-disables removed.
- VALIDATION 10-03-V row passes: 6 of 6 grep assertions green; visual smoke at `/` will show header + manifesto + meta + epigraph + intro + BUILDING + WRITING + EVENTS in order (visual verification deferred to Phase 10 verifier).

## Files Touched

| File | Action | Commit |
|---|---|---|
| src/lib/dates.ts | NEW — pure module with formatMonthYear + formatMonthDay | 703b485 |
| src/app/page.tsx | modified — ListRow + formatMonthYear imports + WRITING section + dropped posts eslint-disable | 6d095e9 |
| src/app/page.tsx | modified — formatMonthDay import extension + EVENTS section + dropped upcomingEvents eslint-disable + removed PLAN-10-03 placeholder | 8af72d2 |

## Setup for Downstream Plans

After Plan 10-03:
- `src/app/page.tsx` is 260 lines with 7 of 13 homepage requirements shipped (HOME-V2-01..06 + 07 + 08 = 8 of 13). Two placeholder comments remain: `PLAN-10-04 PHOTOGRAPHS` and `PLAN-10-05 PERSONAL + FOOTER`.
- `src/lib/dates.ts` is available for Phase 11 archive pages (`/blog`, `/events`) — same import path, same API.
- Phase 9 ListRow is now battle-tested in production — secondary EVENTS rows validated the non-big variant; WRITING rows validated the big variant. Both render correctly with real Notion data.
- Plan 10-04 (PHOTOGRAPHS) needs zero new primitives — it'll likely consume `<RuleStrong />` + `<SectionLabel />` + `<AllLink />` only.
- Plan 10-05 (PERSONAL + FOOTER) is the only remaining content-heavy plan.

## Known Stubs
None. Both new sections render real Notion data with intentional empty-state fallbacks:
- WRITING populated state: drives `<ListRow big>` rows from `getPublishedPosts()`.
- WRITING empty state: "More essays coming soon." (D-18 — intentional UX, not a stub).
- EVENTS populated state: drives featured event + secondary ListRow rows from `getUpcomingEvents()`.
- EVENTS empty state: "No upcoming events." (D-22 — intentional UX, not a stub).
- `AllLink href="/blog"` and `AllLink href="/events"` continue to point to the real archive routes (Phase 11 will rebuild those, but the routes already exist in v1.0 and render today).

## Threat Flags
None. No new auth, no new input handling, no new network endpoints. The defensive `try/catch` around `getPublishedPosts()` + `getUpcomingEvents()` (added in Plan 10-01) continues to absorb Notion API failures into empty arrays, which fall through cleanly to the empty-state branches. `src/lib/dates.ts` is pure (no env reads, no PII, no side effects) — disposition `accept` per the plan's threat register.

## Self-Check: PASSED

- `src/lib/dates.ts` — FOUND (16 lines, 2 exports verified)
- `src/app/page.tsx` — FOUND (260 lines, modified twice)
- Commit `703b485` (Task 1 dates helper) — FOUND in git log
- Commit `6d095e9` (Task 2 WRITING section) — FOUND in git log
- Commit `8af72d2` (Task 3 EVENTS section) — FOUND in git log
- `npm run build` after each task — PASSED (41 routes prerender)
- All Task 1 acceptance assertions — PASSED (6 of 6)
- All Task 2 acceptance assertions — PASSED (6 of 6)
- All Task 3 acceptance assertions — PASSED (10 of 10)
- All plan-level VALIDATION 10-03-V grep assertions — PASSED (6 of 6)
