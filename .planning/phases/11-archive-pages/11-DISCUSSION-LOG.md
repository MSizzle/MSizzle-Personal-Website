# Phase 11: Archive Pages - Discussion Log

> **Audit trail only.** Decisions in CONTEXT.md.

**Date:** 2026-05-21
**Phase:** 11-archive-pages
**Mode:** `--auto` (handoff is canonical context per standing instruction)

**Areas discussed:** Route strategy (/writing new vs replace /blog); /events in-place rewrite; /photos new route; YearBlock primitive location; photos data source; email-subscribe footer reuse; v1.0 chrome gate extension; plan slicing.

---

## /writing routing

| Option | Selected |
|---|---|
| Create new /writing route; keep /blog/[slug] permalinks | ✓ |
| Replace /blog in place | |
| Both /writing and /blog alias to same view | |

Notes: New /writing is the editorial archive. /blog/[slug] permalinks untouched; Phase 12 owns /blog/page.tsx.

## /events strategy

| Option | Selected |
|---|---|
| Replace /events in place | ✓ |
| Create /events-v2 alongside | |

## /photos source

| Option | Selected |
|---|---|
| New src/lib/photos.ts data module with explicit year mapping | ✓ |
| Filesystem mtime read | |
| Notion-driven (defer) | |

## YearBlock primitive

| Option | Selected |
|---|---|
| Shared primitive at src/components/editorial/year-block.tsx | ✓ |
| Inline per archive page | |

## Email-subscribe footer (/writing)

| Option | Selected |
|---|---|
| Reuse existing /newsletter integration; embed minimal form | ✓ |
| New pipeline | |

## v1.0 chrome gate extension

| Option | Selected |
|---|---|
| Extend pathname gate to include /writing, /events, /photos | ✓ |
| Keep gate at /-only; let v2.0 routes get the v1.0 chrome | |

## Plan slicing

| Option | Selected |
|---|---|
| 5 plans, 3 waves (YearBlock + photos data parallel → /writing → /events + /photos parallel) | ✓ |
| 3 plans (one per archive) | |
| 4 plans (YearBlock folded into /writing) | |

## Claude's Discretion

- JSDoc minimal per CLAUDE.md
- UpcomingRow inline (not extracted) — single consumer
- Sticky year label offset = `top-9` initially, adjust per visual test
- Default photo years = 2025 if uncertain; surface for Monty to correct

## Deferred

- Notion-driven photo data source
- /blog index restyle
- Per-archive RSS feeds
- More photos
- Dark-mode variants
