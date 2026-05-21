---
phase: 11-archive-pages
plan: 04
subsystem: ui
tags: [next-app-router, server-component, isr, notion, editorial-archive, phase-11, wave-3, events]
requires:
  - phase: 11-archive-pages (Plan 11-02)
    provides: "formatDayNumeral() + formatMonthYear() helpers consumed by UpcomingRow"
  - phase: 11-archive-pages (Plan 11-03)
    provides: "EditorialHeader component (active='Events' prop) + v1.0 chrome gate extended to /events"
provides:
  - "/events — ARCH-02 editorial archive route at 30m ISR"
  - "Inline UpcomingRow: 84px (featured) / 56px (non-featured) day numerals — D-18 signature visual"
  - "Past events dense 3-col [120px_1fr_1fr] rows (D-20 REVISED)"
affects:
  - none (parallel-safe — only touched own route file + deleted orphan component)
tech_stack_added: []
tech_stack_patterns:
  - "Inline sub-component pattern (D-19) — UpcomingRow defined above default export, not extracted to shared primitive since only /events consumes it"
  - "Promise.all over getUpcomingEvents + getPastEvents — both return [] on missing env, no try/catch wrapper needed (verified against notion-events.ts lines 144-146 + 184-186)"
  - "AllLink for RSVP CTAs — uses event.link from Notion URL field (site-author-controlled, no user input concatenation)"
  - "3-col Past grid [120px_1fr_1fr] per D-20 REVISED — dropped 4th status column because EventItem has no status field (RESEARCH F3)"
  - "Graceful empty-state for zero upcoming events — Substack outbound link same as /writing subscribe footer"
key_files_created: []
key_files_modified:
  - src/app/events/page.tsx
key_files_deleted:
  - src/components/events/event-cards.tsx
decisions:
  - "Past section 3-col grid [120px_1fr_1fr] per D-20 REVISED — not 4-col with status. EventItem has no status field; plan pre-resolved this before execution."
  - "AllLink used for RSVP CTAs per canonical RESEARCH Pattern 3 — next/link handles external URLs; event.link is site-author-controlled Notion URL field (T-11-04-01 accept)"
  - "Empty-state Monty Monthly outbound link uses plain <a> not AllLink (AllLink uses next/link which renders with router context; external outbound link in paragraph context better as <a>)"
  - "JSDoc comment wording adjusted to avoid false-positive 'use client' grep match in string"
requirements_completed:
  - ARCH-02
metrics:
  duration: "~15 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 2
  files_changed: 2
---

# Phase 11 Plan 04: /events Archive + event-cards Deletion Summary

**One-liner:** `/events` editorial archive (ARCH-02) ships at 30m ISR — title block with IMG_1075.JPG atmosphere photo + Upcoming section with inline UpcomingRow (84px/56px giant day-numeral signature per D-18) + Past section in dense 3-col rows — plus the deletion of the now-orphaned `event-cards.tsx` after verifying zero consumers.

## Was Built

### File 1: `src/app/events/page.tsx` (REWRITTEN in place, 202 lines)

Server Component implementing the ARCH-02 contract per handoff §4 + D-16..D-21:

1. **`<EditorialHeader active="Events" />`** — Events nav label bolded (shared component from Plan 11-03).

2. **Title block** (2-col grid `[1fr_360px]`, photo hidden mobile per RESEARCH § Pitfall 6):
   - `"── The Calendar · 03"` tracked label
   - **`Events.`** in `text-page-title` (D-14 token = 120px, trailing period intentional)
   - Muted blurb: "Small, intentional gatherings on AI, building, and the texture of an attentive life."
   - 360×480 atmosphere photo via `next/image fill` — `IMG_1075.JPG` (PHOTOS[3] per D-16), `saturate-[0.92]` per D-23

3. **`<RuleStrong />`**

4. **Upcoming section** with `<SectionLabel numeral="03 — Upcoming">`:
   - **Inline `<UpcomingRow>` component** (above default export, D-19 — not extracted):
     - `formatDayNumeral(event.date)` + `formatMonthYear(event.date)` (Plan 11-02 helpers)
     - Left column: month/year tracked label above **84px featured** or **56px non-featured** bold day numeral — D-18 signature
     - Middle column: `event.location` (tracked uppercase muted) · `event.name` (40px when featured, `text-event-title` otherwise) · optional `event.description`
     - Right column: "Limited seats" / "Open door" meta + conditional `<AllLink>` RSVP CTA
     - 3-col grid `md:grid-cols-[160px_1fr_200px]` (D-16)
   - **Empty state** when `upcoming.length === 0`: "Next gathering being planned. Subscribe to [Monty Monthly](https://montymonthly.substack.com) to hear first."
   - First upcoming event → `featured={true}` (84px numeral); subsequent → `featured={false}` (56px)

5. **`<RuleStrong />`**

6. **Past section** (omitted entirely when `past.length === 0`):
   - Dense 3-col inline rows: `md:grid-cols-[120px_1fr_1fr]` (D-20 REVISED — no status column)
   - `formatMonthYear(event.date)` · `event.name` · `event.description`
   - Rows wrap in `<Link href={event.link ?? "#"}>` with `border-t border-rule` hairline between

**Module-level exports:**
- `export const revalidate = 1800;` (30-minute ISR — matches / and /writing cadence)
- `export const metadata: Metadata` (title, description, canonical, openGraph per RESEARCH)

**Notion field names verbatim (D-21):** `event.name`, `event.link`, `event.date`, `event.description`, `event.location`

**v1.0 imports removed:** `ScrollReveal`, `Breadcrumbs`, `FeaturedUpcoming`, `UpcomingMini`, `PastEventCard` from `@/components/events/event-cards` — all gone.

### File 2: `src/components/events/event-cards.tsx` (DELETED)

Orphaned after the /events rewrite. Deletion protocol:

1. `rg "event-cards" src/` returned **0 matches** (Task 1 committed first, no remaining consumers)
2. `git rm src/components/events/event-cards.tsx` — staged as deletion
3. `npm run build` exits 0 after deletion — confirmed no hidden consumer was missed

The `src/components/events/` directory remains (git tracks files not directories); no sibling files were affected.

## Inline UpcomingRow Signature

```tsx
function UpcomingRow({
  event,
  featured = false,
  last = false,
}: {
  event: EventItem;
  featured?: boolean;
  last?: boolean;
}) {
  const dayNum = formatDayNumeral(event.date);
  const monthYr = formatMonthYear(event.date);
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-baseline gap-6 md:grid-cols-[160px_1fr_200px] md:gap-14",
        featured ? "pb-14" : "py-10",
        !last && "border-b border-rule"
      )}
    >
      <div className="leading-none">
        <div className="text-meta uppercase text-muted">{monthYr}</div>
        <div
          className={cn(
            "mt-2 font-bold leading-[0.9] tracking-[-0.04em] text-ink",
            featured ? "text-[84px]" : "text-[56px]"
          )}
        >
          {dayNum}
        </div>
      </div>
      {/* middle + right columns omitted for brevity */}
    </div>
  );
}
```

## Empty-State Copy (zero upcoming events)

```
Next gathering being planned. Subscribe to Monty Monthly to hear first.
```

"Monty Monthly" is wrapped in `<a href="https://montymonthly.substack.com" target="_blank" rel="noopener noreferrer" className="border-b border-ink text-ink">`.

## Verification Results (11-04-V)

| Gate | Result |
|------|--------|
| `rg "Events\." src/app/events/page.tsx` ≥1 hit | PASS (2) |
| `rg "formatDayNumeral" src/app/events/page.tsx` ≥1 hit | PASS (3) |
| `rg "text-\[84px\]" src/app/events/page.tsx` ≥1 hit | PASS (1) |
| `rg "text-\[56px\]" src/app/events/page.tsx` ≥1 hit | PASS (1) |
| `rg 'EditorialHeader active="Events"' src/app/events/page.tsx` ≥1 hit | PASS (2) |
| `rg "event-cards" src/app/events/page.tsx` = 0 | PASS (0) |
| `rg "use client" src/app/events/page.tsx` = 0 | PASS (0) |
| `rg "ScrollReveal\|Breadcrumbs" src/app/events/page.tsx` = 0 | PASS (0) |
| `rg "IMG_1075" src/app/events/page.tsx` ≥1 hit | PASS (2) |
| `rg "text-page-title" src/app/events/page.tsx` ≥1 hit | PASS (1) |
| `rg "getUpcomingEvents\|getPastEvents" src/app/events/page.tsx` ≥2 hits | PASS (6) |
| `rg "event\.name" src/app/events/page.tsx` ≥1 hit | PASS (3) |
| `rg "event\.link" src/app/events/page.tsx` ≥1 hit | PASS (4) |
| `rg "md:grid-cols-\[160px_1fr_200px\]" src/app/events/page.tsx` ≥1 hit | PASS (1) |
| `rg "md:grid-cols-\[120px_1fr_1fr\]" src/app/events/page.tsx` ≥1 hit | PASS (1) |
| `! test -f src/components/events/event-cards.tsx` | PASS |
| `rg "event-cards" src/` = 0 across entire src/ | PASS (0) |
| `npm run build` exits 0 | PASS — `/events 30m 1y` in routes manifest |
| `/events` still in routes manifest | PASS |

## rg "event-cards" Final Verification Output

```
$ rg "event-cards" src/
(no output)
$ echo $?
1
```

Zero matches across all of `src/` after both Task 1 (rewrite) and Task 2 (delete) completed.

## Phase 10 Homepage Regression Check

The Phase 10 homepage (`src/app/page.tsx`) renders events inline using `ListRow` — it has never imported from `event-cards.tsx`. The deletion of `event-cards.tsx` creates no regression on `/`.

Verified: `rg "event-cards" src/app/page.tsx` returns 0 hits.

## Deviations from Plan

None substantive — plan executed exactly as written.

The one micro-decision: the JSDoc comment in the default export was worded to avoid containing the literal string "use client" (which would have caused the acceptance criteria grep to report a false positive). The original wording "no 'use client'" was replaced with "Server Component (async)" — same semantic intent, no false match.

## Known Stubs

None — all data flows from Notion (getUpcomingEvents / getPastEvents) with graceful empty states. No hardcoded placeholder content.

## Threat Flags

No new threat surface beyond what the plan's threat model already covers. The rewrite removes the client-bound `<ScrollReveal>` pattern (was a client component chain risk) and replaces it with a pure Server Component — strictly reducing attack surface.

## Commits

- `acffb1e` — `feat(11-04): rewrite /events route in place — ARCH-02 editorial archive` (Task 1)
- `7483a06` — `chore(11-04): delete orphaned event-cards.tsx — zero consumers after /events rewrite` (Task 2)

## Self-Check: PASSED

- `src/app/events/page.tsx` exists with 202 lines — confirmed via write
- `src/components/events/event-cards.tsx` does not exist — confirmed via `! test -f`
- Commit `acffb1e` confirmed via `git log`
- Commit `7483a06` confirmed via `git log`
- All 19 verification gates pass
- `npm run build` exits 0; `/events 30m 1y` in routes manifest
- ARCH-02 success criteria satisfied
