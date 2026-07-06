---
created: 2026-07-06T08:08:45.509Z
title: Redesign Things I Love section as treasure-hunt collage
area: ui
files:
  - src/components/home/section-loves.tsx
---

## Problem

Monty wants the homepage "Things I love" section to go beyond the current
PhotoMarquee strip. Direction (his words, 2026-07-06): different YouTube
videos, books, and "kind of a collage of different things I like" as a
background, "so it's kind of like a treasure hunt" - visitors discover
items by exploring the collage.

Current implementation: section-loves.tsx renders a RailBox (num 03,
"Things I love"), an h2 ("Things I love outside of work."), and a
full-bleed PhotoMarquee of labeled cards. That is a linear strip, not a
discoverable collage.

## Solution

TBD - needs a sketch pass before becoming a phase (consistent with how
sketches 003-010 locked prior homepage directions). Considerations for the
sketch:

- Collage background of mixed media: YouTube video thumbnails/embeds, book
  covers, places, hobbies, scattered at varied sizes/rotations
- "Treasure hunt" = discoverability: items revealed on hover/scroll or
  hidden among decorative elements; ambient CSS/IO motion only (no
  WebGL/Lenis per the locked photo-forward direction)
- Must respect site rules: no gradients (offset solids only), hard
  corners, Vermilion #e5411f accent, no em dashes in copy
- Content source: could be hardcoded to start, or a Notion database later
  (like /uses Watching section which already has 70 YouTube links)

Suggested route: /gsd-sketch "things-i-love treasure-hunt collage", then
promote to a phase once a direction is picked.

## Resolution (2026-07-07)

Sketched as `.planning/sketches/012-things-i-love-pinboard/` (draggable pinboard
chosen from a 4-option scope round; spread-out layout approved by Monty). Built
the code side as a gated feature:
- `src/lib/notion-loves.ts` — getLovesItems() loader (mirrors notion-projects.ts)
- `src/components/home/pinboard.tsx` — client Pinboard (drag / bring-to-front /
  click-to-reveal + mobile stack downgrade)
- pinboard styles appended to globals.css
- wired page.tsx -> ExplorativeHomepage -> section-loves.tsx, with graceful
  fallback to the PhotoMarquee until the DB is populated
- tests: notion-loves, pinboard, section-loves (suite 156 pass / 0 fail)

Gated behind `NOTION_LOVES_DB_ID` (schema: Name/Type/Note/URL/Subtitle/Published/
Order + page cover for images). Switches on once Monty creates + shares the Notion
DB and sets the env var. No visible change until then.
