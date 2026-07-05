# Phase 16: Interior Pages on Notion Data - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-19
**Phase:** 16-interior-pages-on-notion-data
**Areas discussed:** Page feel & big photos, /uses content & data, /watching content & data, Nav & footer composition
**Mode:** Interactive for the first questions, then `--auto` (recommended defaults) for the remainder.

---

## Page feel & big photos

| Option | Description | Selected |
|--------|-------------|----------|
| Calm + big photo moments | Reading-first, native scroll, subtle reveals, punctuated by large/full-bleed photos | ✓ |
| Pure calm / type-led | Stay close to prototype 002; minimal imagery | |
| Kinetic throughout | Carry v3 marquees/animated type onto interior pages | |

**User's choice:** Calm + big photo moments
**Notes:** Resolves the prototype-002-calm vs. recent large-photo-direction tension toward photos while keeping reading legible. Homepage stays the only kinetic page.

| Option (Where photos land — multi-select) | Selected |
|---|---|
| Project detail hero (full-bleed Notion cover) | ✓ |
| Essay reading view hero (cover when present) | ✓ |
| Works & Writing indexes (photo-forward) | ✓ |
| About / Photos band | ✓ |

**User's choice:** All four surfaces.

| Index layout | Selected |
|---|---|
| Photo grid of cards | ✓ |
| List rows + thumbnails | |
| Keep text list, photos on detail only | |

**User's choice:** Photo grid of cards.
**Notes (auto):** Year-grouping kept as section headers within the grid.

---

## /uses content & data

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded TS file | Typed file like photos.ts; version-controlled | ✓ |
| New Notion DB | New DB + loader, editable from Notion | |
| Reuse existing pattern | Something else | |

**User's choice:** Hardcoded TS file
**Notes (auto):** Keep prototype's 4 groups (AI & Development, Productivity, Communication, Hardware); Hardware entries are TODO placeholders for Monty to fill.

---

## /watching content & data (auto-resolved)

| Decision | Selected |
|---|---|
| Data source | Hardcoded TS file (consistent with /uses + photos.ts) |
| Thumbnails | Auto-derived from YouTube video ID |
| Layout | Card grid (thumb + title + channel), opens YouTube in new tab |
| Seed content | Prototype's 6 titles as placeholders for real video IDs/URLs |

---

## Nav & footer composition (auto-resolved)

| Decision | Selected |
|---|---|
| Primary desktop nav | Keep focused 5 (Work, Writing, Events, About, Links) |
| Footer | Full sitemap incl Uses, Watching, Prometheus, Newsletter, Photos |
| Active states | Pathname-based (reuse existing navigation.tsx mapping) |
| Breadcrumbs | Home/Section/Title on detail pages + new pages |
| Mobile | Existing hamburger drawer with full link set |

---

## Claude's Discretion

- Repaint v2 primitives vs. adopt `src/components/v3/*` vs. build fresh photo-forward components.
- Card grid breakpoints, image aspect ratios, scroll-reveal timings (within perf budget; respect reducedMotion).
- Index excerpt sources (Writing: getPostExcerpt; Works: description).
- Related essays: keep existing RelatedEssays logic (shared tags, recency fallback).

## Deferred Ideas

- Move /uses and/or /watching into Notion (start hardcoded; revisit if editing friction).
- Move /photos into Notion (unchanged pre-existing deferral).
- Fill real Hardware values + real /watching video list (content fill, Monty-owned, non-blocking).
