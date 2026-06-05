---
quick_id: 260605-jqq
slug: soften-homepage-events-empty-state-copy
date: 2026-06-05
status: planned
---

# Quick Task: Soften homepage Events empty-state copy

## Problem

When there are no upcoming events, the homepage Events section (section 03,
`src/app/page.tsx` ~line 191) renders a flat "No upcoming events." which reads
as neglected/broken. The /events page itself already uses a warmer empty state
("Next gathering being planned. Subscribe to Monty Monthly to hear first.").
Decision (operator): keep the section (Events is a real ongoing offering) but
make the empty copy inviting and on-brand. Do NOT hide the section.

## Task

In `src/app/page.tsx`, the EVENTS section, replace the empty-state paragraph:

FROM:
```tsx
<p className="text-caption text-muted">No upcoming events.</p>
```

TO an inviting line consistent with the /events page tone — a sentence about the
next gathering being planned plus a Substack link to hear first. Keep it as a
single `<p className="text-caption text-muted ...">` (or with a styled inline
link). Suggested copy:
"Next gathering is being planned — small, intentional evenings on AI and
building. Subscribe to Monty Monthly to hear first."
Make "Monty Monthly" a link to `https://montymonthly.substack.com`
(`target="_blank" rel="noopener noreferrer"`, `className="border-b border-ink
text-ink"`) — mirror the existing /events empty-state markup
(src/app/events/page.tsx ~lines 176-187).

Keep the trailing `<AllLink href="/events">All events →</AllLink>` exactly as-is.
Change NOTHING else in the file (do not touch the non-empty branch, the other
sections, HOME_PHOTOS, etc.).

## Verification
- `npm run build` succeeds.
- `npx vitest run` passes (home.test.tsx).
- Grep: "No upcoming events." no longer present in src/app/page.tsx.
