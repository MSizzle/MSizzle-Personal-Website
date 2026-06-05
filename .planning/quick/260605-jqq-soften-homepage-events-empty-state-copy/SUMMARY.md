---
quick_id: 260605-jqq
slug: soften-homepage-events-empty-state-copy
date: 2026-06-05
status: complete
commit: bde1ae5
---

# Quick Task Summary: Soften homepage Events empty-state copy

## What changed

Replaced the flat homepage Events empty-state paragraph in `src/app/page.tsx`:

- **Before:** `<p className="text-caption text-muted">No upcoming events.</p>`
- **After:** An inviting line — "Next gathering is being planned — small,
  intentional evenings on AI and building. Subscribe to **Monty Monthly** to
  hear first." — where "Monty Monthly" links to
  `https://montymonthly.substack.com` (`target="_blank"`,
  `rel="noopener noreferrer"`, `className="border-b border-ink text-ink"`),
  mirroring the existing /events page empty-state markup.

The section is intentionally kept (not hidden), per operator decision — Events
is a real ongoing offering.

## Scope guard

Single atomic change. Nothing else touched: the non-empty events branch, the
`<AllLink href="/events">All events →</AllLink>`, `HOME_PHOTOS`, and all other
sections are exactly as-is. 1 file changed, 13 insertions, 1 deletion.

## Verification

- **Build:** `npm run build` succeeded — "Compiled successfully", 42/42
  static pages generated.
- **Tests:** `npx vitest run` passed — 13 test files passed (5 skipped),
  29 tests passed (14 todo).
- **Grep:** "No upcoming events." no longer present in `src/app/page.tsx`
  (match count 0).

## Commit

`bde1ae5` — copy(home): warm up Events empty state — invite to next gathering
via Monty Monthly

Committed to branch `claude/phase-8-resume`. Not pushed.
