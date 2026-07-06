---
phase: quick/260706-remove-em-dashes
plan: 01
task_count: 1
completed_tasks: 1
commit: d9f12a2
duration_minutes: 15
completed_date: 2026-07-06T12:31:00Z
---

# Quick Task 260706-HAI: Remove Em Dashes from User-Visible Copy

Removed em dashes (—) from all user-visible copy across the website per site owner direction. Em dashes read as an "AI-writing tell" and have been rewritten naturally using colons, commas, parentheses, and prepositions.

## Summary

All 9 em dashes in user-visible strings have been successfully removed and rewritten naturally:

| File | Location | Old | New | Technique |
|------|----------|-----|-----|-----------|
| src/app/about/page.tsx | metadata.description | Monty Singer — builder... | Monty Singer: builder... | Colon separator |
| src/app/about/page.tsx | metadata.openGraph.description | Monty Singer — builder... | Monty Singer: builder... | Colon separator |
| src/app/about/page.tsx | line 41 | businesses — automating | businesses: automating | Colon separator |
| src/app/projects/page.tsx | metadata.description | built — through Prometheus | built through Prometheus | Drop phrase |
| src/app/projects/page.tsx | metadata.openGraph.description | built — through Prometheus | built through Prometheus | Drop phrase |
| src/app/projects/page.tsx | line 68 (PageHero sub) | built — through Prometheus | built through Prometheus | Drop phrase |
| src/lib/uses.ts | line 26 | Cursor AI — VS Code... | Cursor AI (VS Code...) | Parentheses (existing style) |
| src/lib/uses.ts | line 28 | GSD (Get Shit Done) — AI-native... | GSD (Get Shit Done), an AI-native... | Comma + article |
| src/lib/uses.ts | line 34 | Notion — notes, projects... | Notion for notes, projects... | Preposition "for" |
| src/lib/uses.ts | line 42 | Gmail — primary inbox | Gmail as primary inbox | Preposition "as" |
| src/lib/photos.ts | line 29 | Film negative — a year... | Film negative: a year... | Colon separator |

## Execution Notes

**Grep Verification:**
All remaining em dashes (4 total) are in code comments only, as required:
- src/lib/photos.ts line 4: comment
- src/lib/photos.ts line 68: comment
- src/lib/uses.ts line 5: comment
- src/lib/uses.ts line 8: comment

**Test Results:**
- Ran `npx vitest run`
- Result: 3 failed, 116 passed, 19 todo
- Failures: explorative-homepage (×2), section-building (×1) — all pre-existing
- No new failures introduced

**Test Check:**
Grep search found no test assertions on the old copy strings; no test updates were needed.

## Deviations from Plan

None — plan executed exactly as written.

## Files Changed

- src/app/about/page.tsx
- src/app/projects/page.tsx
- src/lib/uses.ts
- src/lib/photos.ts

## Commit

**Hash:** d9f12a2
**Message:** fix(copy): remove em dashes from user-visible copy
