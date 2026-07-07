---
quick_id: 260707-h76
slug: loves-auto-enrich
date: 2026-07-07
status: in-progress
---

# Quick Task: Things I Love auto-enrichment + on-demand revalidation

## Goal

A row in the "Things I Love" Notion DB with `Name` + `Type` set gets auto-filled:
Subtitle, URL, an AI-drafted Note, and the page **cover** image (poster), by looking
up metadata per type from external sources. Plus a one-click way to refresh the live
site immediately after editing Notion (ISR is otherwise ~30 min).

## Design decisions (settled with user, do not re-litigate)

- Free Notion plan: no webhook button. Triggers are `npm run enrich-loves` (instant)
  + a Vercel cron (daily on Hobby) hitting a token-protected route. Route also accepts
  a single pageId via POST so a Notion button can be added later with no rewrite.
- Fields: fill Subtitle + URL + cover + AI-drafted Note. Only fill EMPTY fields, never
  overwrite user edits, never auto-publish.
- Types: Movie (TMDB), Book (Google Books), YouTube (oEmbed), Place/Thing (Wikipedia).
  Note draft via Anthropic Haiku. No em dashes (hard project rule).
- On-demand revalidation: token-protected `/api/revalidate` (bookmarkable = the "button");
  enrichment auto-revalidates after writes.

## Files

- `src/lib/enrich/{auth,providers,note-draft,index}.ts` — engine + providers
- `scripts/enrich-loves.ts` — CLI (`--dry` supported)
- `src/app/api/enrich-loves/route.ts` — GET scan + POST single page (token-protected)
- `src/app/api/revalidate/route.ts` — on-demand revalidation (token-protected)
- `vercel.json` — daily cron
- `.env.example`, `package.json` (script + tsx/dotenv devDeps)
- `src/__tests__/lib/enrich.test.ts`

## Guardrails

- Idempotent, empty-fields-only, never auto-publish, graceful per-provider failure.
- Keyless sources work with no keys; TMDB + Anthropic behind env flags.
- Reuse Notion rate-limit pattern from notion-loves.ts.
