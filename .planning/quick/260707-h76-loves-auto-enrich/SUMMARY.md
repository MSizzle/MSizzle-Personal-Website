---
quick_id: 260707-h76
slug: loves-auto-enrich
date: 2026-07-07
status: complete
commit: pending
---

# Summary: Things I Love auto-enrichment + on-demand revalidation

## What shipped

An enrichment engine that fills in "Things I Love" Notion rows from just a Name +
Type, plus one-click site revalidation.

- **Engine** `src/lib/enrich/` — per-type providers behind one `enrichAll` / `enrichById`:
  - Movie → TMDB (poster, director, year) — needs `TMDB_API_KEY`
  - Book → Google Books, falling back to / backfilling cover from Open Library (no key)
  - YouTube → oEmbed (channel + thumbnail, no key)
  - Place / Thing → Wikipedia (lead image, short description, no key)
  - Note draft → Anthropic Haiku (`ANTHROPIC_API_KEY`), first person, no em dashes
  - Poster is written to the Notion **page cover** (matches how the pinboard reads covers)
- **Triggers**
  - `npm run enrich-loves` (add `-- --dry` to preview) — instant, on demand
  - `GET /api/enrich-loves` — token-protected scan, wired to a daily Vercel cron
  - `POST /api/enrich-loves` — single page by id (ready for a future Notion button webhook)
- **On-demand revalidation** `GET|POST /api/revalidate?token=…` — bookmarkable "refresh"
  button; enrichment auto-revalidates after real writes.

## Guarantees

- Idempotent: only fills EMPTY fields, never overwrites, never auto-publishes.
- Graceful per-provider failure (skips, never writes junk); keyless sources work with no keys.
- `withRetry` now also retries transient network blips (not just Notion rate-limits).

## Verified

- `tsc` clean on all new files; 8 unit tests pass (needs-enrichment logic + book
  provider incl. Open Library fallback).
- Dry-run then real run against the live DB enriched 3 rows; read back from Notion
  confirms cover + subtitle + url written, and an existing cover was preserved.

## Follow-ups / notes

- Vercel Hobby throttles crons to ~once/day, so the daily schedule is the reality;
  `npm run enrich-loves` is the instant path. Documented in the plan.
- Requires `TMDB_API_KEY`, `ANTHROPIC_API_KEY`, `ENRICH_LOVES_TOKEN` in env to unlock
  movies, Notes, and the routes (see `.env.example`).
- Separate requested feature still open: a "shuffle / draw a card" fun mechanic on the
  Things I Love section (frontend/animation; own task).
