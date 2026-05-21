---
phase: "08-motion-subtractions"
plan: "05"
subsystem: "events"
tags: ["motion", "subtraction", "deletion", "motion-budget", "editorial", "events", "animate-ping"]
dependency_graph:
  requires:
    - "08-04 (last src/app/page.tsx plan — Wave 1 file-conflict serialization handshake; Plan-05 itself touches a DIFFERENT file but ships in the same wave/chain)"
  provides:
    - "FeaturedUpcoming renders with a static red dot — no pulsing ring"
    - "Codebase free of all four always-on Tailwind animation utility classes (animate-ping, animate-pulse, animate-bounce, animate-spin) — closes the D-06 four-class sweep contract"
    - "Unblocks Plan-06 (UpcomingMini + PastEventCard delay-prop deletion) — Plan-06 inherits a clean event-cards.tsx with FeaturedUpcoming already at v2.0 motion budget"
  affects:
    - "src/components/events/event-cards.tsx"
tech_stack:
  added: []
  patterns:
    - "Element-level deletion (D-07): delete the whole <span> wrapper, not just the className — prevents stale DOM-ghost spans surviving the edit (RESEARCH.md Pitfall 6)"
    - "Four-class sweep (D-06): the contract is absence of animate-ping|pulse|bounce|spin across all of src/, not a one-time grep — even if today only animate-ping exists, the sweep is the binding acceptance check"
key_files:
  created: []
  modified:
    - "src/components/events/event-cards.tsx"
  deleted: []
decisions:
  - "Deleted the entire middle <span className=\"animate-ping ...\"> element (not just the class name) per CONTEXT.md D-07 + RESEARCH.md Pitfall 6 — no stale empty span ghost survives in the DOM"
  - "Preserved the outer <span className=\"relative flex h-2 w-2 shrink-0\"> wrapper as the flex parent of the static dot — required by the <h3> layout (heading still uses `flex items-center gap-2`)"
  - "Preserved the inner static <span className=\"relative inline-flex h-2 w-2 rounded-full bg-red-500\" /> — this is the v2.0 still red dot (the surviving visual cue that the heading marks an upcoming event)"
  - "Did NOT modify FeaturedUpcoming's prop signature (`event`, `delay = 0.15`, `priority = false`) — Plan-06 may revisit `delay`, but this plan leaves the signature byte-identical"
  - "Did NOT touch UpcomingMini or PastEventCard — Plan-06 owns those"
  - "Did NOT touch src/app/page.tsx (Plans 01-04 territory, already closed in Wave 1)"
  - "Confirmed animate-pulse, animate-bounce, animate-spin were already 0 hits in src/ before AND after the edit — matches RESEARCH.md verification; only animate-ping removal was actually required"
metrics:
  duration: "<2 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 1
requirements_completed:
  - MOTION-05
validation_task: "8-05-V"
---

# Phase 08 Plan 05: Remove animate-ping from FeaturedUpcoming Summary

**One-liner:** Deleted the `<span className="animate-ping ...">` pulsing-ring element from `FeaturedUpcoming` in `src/components/events/event-cards.tsx` and confirmed via a site-wide four-class sweep (`animate-ping|pulse|bounce|spin`) that no always-on Tailwind animation utility class survives anywhere in `src/`. The featured event card on `/` and `/events` now renders with a single static red dot prefixing the "Upcoming" label — no pulse, no ring.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Remove animate-ping wrapper from FeaturedUpcoming + sweep for other always-on animation classes | 7c1c942 | src/components/events/event-cards.tsx (modified) |

## What Was Removed

### Element-Level Deletion in `FeaturedUpcoming` (event-cards.tsx)

Removed the middle `<span>` child of the flex wrapper inside the `<h3>` "Upcoming" heading:

**Before** (3 spans nested inside `<h3>`):

```jsx
<h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
  </span>
  Upcoming
</h3>
```

**After** (2 spans):

```jsx
<h3 className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest">
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
  </span>
  Upcoming
</h3>
```

The deleted line was:

```jsx
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
```

Net file change: **-1 line** (one self-closing JSX element removed; no whitespace fix-ups needed because the outer wrapper's indentation already accommodates the surviving child).

### Why Element-Level, Not Class-Level (D-07 + RESEARCH.md Pitfall 6)

Per CONTEXT.md decision D-07 and RESEARCH.md "Pitfall 6: Removing animate-ping but leaving the outer span wrapper": stripping only the `animate-ping` class — i.e., turning the span into `<span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />` — would leave a 60%-opacity solid red disk overlapping the static dot, producing a visible visual artifact (a faded halo around the static dot). The correct deletion removes the element entirely so the only remaining child of the flex wrapper is the static dot itself. This plan honored that.

### What Was Preserved (CONTEXT.md D-12 + Plan-06 boundary)

The following were explicitly **not touched**:

- **Outer flex wrapper** `<span className="relative flex h-2 w-2 shrink-0">` — required as the flex parent of the static dot inside the heading layout (`<h3 className="flex items-center gap-2 ...">`).
- **Inner static dot** `<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />` — the surviving "upcoming" visual cue.
- **"Upcoming" literal text** inside the `<h3>`.
- **`<h3>` className** (`flex items-center gap-2 text-xs font-normal uppercase tracking-widest`) — unchanged.
- **`FeaturedUpcoming` prop signature** `{ event, delay = 0.15, priority = false }` — unchanged. Plan-06 may revisit `delay`, but THIS plan leaves the signature byte-identical.
- **The surrounding `<article>`, `<Image>`, title `<h4>`, date `<p>`, description, Register link** — all unchanged.
- **`UpcomingMini`** and **`PastEventCard`** — byte-identical to pre-plan state (Plan-06 territory).
- **`src/components/animations/scroll-reveal.tsx`**, **`src/components/providers/lenis-provider.tsx`**, **`src/app/template.tsx`** — D-12 preservation guard.
- **`src/app/page.tsx`** — not touched in this plan (Plans 01–04 already closed Wave 1 page.tsx work).

## Four-Class Sweep (D-06) — Confirmed Zero Hits

Per CONTEXT.md decision D-06, the contract is absence of all four always-on Tailwind animation utilities across `src/`, not just `animate-ping`. Confirmed after edit:

```
$ rg "animate-(ping|pulse|bounce|spin)" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' src/
(no matches — exit 1)
```

**Pre-edit state** (verified against RESEARCH.md grep counts at phase start):

- `animate-ping`: 1 hit (`src/components/events/event-cards.tsx:53`)
- `animate-pulse`: 0 hits
- `animate-bounce`: 0 hits
- `animate-spin`: 0 hits

**Post-edit state**:

- All four: 0 hits.

So in practice, the four-class sweep collapsed to a one-class removal — but the sweep remains the binding contract per D-06, and was re-run post-edit to verify nothing surfaced from any source file that escaped RESEARCH.md's grep. Nothing did. `animate-pulse`, `animate-bounce`, `animate-spin` were all already zero before AND after the edit.

## Verification

Per `08-VALIDATION.md` task `8-05-V`:

- `rg "animate-(ping|pulse|bounce|spin)" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' src/` → **0 hits** ✓
- `rg -c 'Upcoming' src/components/events/event-cards.tsx` → **3** (heading text + two function references — the literal `Upcoming` heading text preserved) ✓
- `rg -c 'rounded-full bg-red-500' src/components/events/event-cards.tsx` → **1** (the surviving static dot — confirms the post-edit wrapper has exactly one child span) ✓
- `npm run build` → **exits 0** (Next.js 16, 40 static pages generated, no warnings) ✓
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` → **(empty)** — pure in-file line removal, no file deletions ✓
- `UpcomingMini` + `PastEventCard` byte-identical to pre-plan state (verified by inspecting `git diff` scope: only lines 51–56 of `event-cards.tsx` touched) ✓

## Deviations from Plan

None. Plan-05 executed exactly as written, in a single commit. The pre-edit grep counts matched RESEARCH.md's verification (1 hit on `animate-ping`, 0 hits on the other three utilities), so the "additional hit surfaces" branch in the plan's Task-1 action step 5 was never triggered. No surprises.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-05 is part of the canonical motion-deletion subset
- **D-03** — Featured event card v2.0 visual state is a static dot, not a pulsing ring
- **D-06** — Four-class sweep (`animate-ping|pulse|bounce|spin`) is the binding acceptance contract; re-run post-edit, returned 0 hits
- **D-07** — Element-level deletion (delete the whole `<span>`, not just the class) — no stale DOM ghost survives
- **D-08** — No orphan CSS to purge (Tailwind utility classes are JIT-generated; deleting all references is sufficient — there is no `globals.css` keyframe or rule to remove for `animate-ping`)
- **D-10** — `npm run build` exit 0 is the per-plan gate (verified green)
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx; did not touch `src/app/page.tsx`; did not touch UpcomingMini or PastEventCard
- **D-13** — Single atomic commit (one file touched, one deletion, sweep verified inline before commit)

## Threat Flags

None. Threat T-08-05 (Tampering — `FeaturedUpcoming` JSX structure) was disposition `mitigate`, mitigated by `npm run build` + existing `event-cards` import sites (`src/app/page.tsx`, `src/app/events/page.tsx`) compiling against the unchanged prop signature. Build green. No new network endpoints, auth paths, file access patterns, or schema changes.

## Known Stubs

None. The static red dot is the intended v2.0 final state for this slot per CONTEXT.md D-03 (not a placeholder for future motion — the absence of pulse IS the v2.0 motion-budget compliance). The dot stays as the "upcoming" visual cue indefinitely.

## Plan-06 Handoff Note

After this plan, `src/components/events/event-cards.tsx` has:

- `FeaturedUpcoming` at v2.0 motion budget (static dot, no pulse) — DONE
- `UpcomingMini` still has its `delay` prop (Plan-06 will drop) — UNCHANGED
- `PastEventCard` still has its `delay` prop (Plan-06 will drop) — UNCHANGED

Plan-06 inherits a clean `FeaturedUpcoming` and only needs to address the cascading-delay props on `UpcomingMini` + `PastEventCard`. The four-class sweep contract (D-06) is now satisfied site-wide — Plan-06's verify step can re-run the sweep as a regression check without needing to remove anything.

## Phase 8 Wave 1 Status at Close of Plan-05

- Plan 01 — PhotoCarousel deleted (MOTION-01) ✓
- Plan 02 — RotatingTagline deleted (MOTION-02) ✓
- Plan 03 — WorksCarousel deleted + minimal `<ul>` fallback (MOTION-03) ✓
- Plan 04 — WritingsCarousel deleted + `globals.css` carousel-rule purge (MOTION-04) ✓
- Plan 05 — `animate-ping` removed from FeaturedUpcoming (MOTION-05) ✓ — THIS PLAN
- Plan 06 — UpcomingMini + PastEventCard delay-prop deletion (MOTION-06) — next
- Plan 07 — TBD per ROADMAP — next

After Plan-05, the always-on Tailwind animation utility class category is **fully closed** across `src/`. The remaining Phase 8 motion-deletion work (Plan-06) is prop-shape simplification, not motion-class removal.

## Self-Check: PASSED

- `src/components/events/event-cards.tsx` confirmed modified — `animate-ping` line removed, outer flex wrapper + inner static dot preserved ✓
- Commit `7c1c942` confirmed present in `git log` ✓
- `rg "animate-(ping|pulse|bounce|spin)" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' src/` returns 0 hits ✓
- `rg -c 'Upcoming' src/components/events/event-cards.tsx` returns 3 (literal `Upcoming` heading text preserved) ✓
- `rg -c 'rounded-full bg-red-500' src/components/events/event-cards.tsx` returns 1 (surviving static dot) ✓
- `npm run build` exits 0 (verified inline before commit; 40 static pages generated) ✓
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` returns empty — no accidental file deletions ✓
- `UpcomingMini` + `PastEventCard` byte-identical to pre-plan state (`git diff` scope confirmed limited to lines 51–56) ✓
