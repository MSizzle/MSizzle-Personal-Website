---
status: complete
phase: 19-project-cards-covers-redesign
source: [19-01-SUMMARY.md, 19-02-SUMMARY.md, 19-03-SUMMARY.md]
started: 2026-07-06T07:45:00Z
updated: 2026-07-06T08:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Homepage Work grid title-cards
expected: The "Past projects." section shows a 2x2 grid of typographic title-cards (no cover images/logos). Each card has a vermilion kicker chip (tag + year), bold title, short dek; fields alternate paper/ink by position.
result: pass
note: Auto-verified via Playwright DOM (2026-07-06): h2 "Past projects.", 4 title-cards (Gene-Own, MAHealth Scanner, Goaltender, Insider Tracking), paper/ink alternation correct, kickers + deks present, 0 imgs in grid.

### 2. /writing cards show reading time, deks, offset-shadow grid
expected: Each essay card shows "N min read", a dek, and a kicker. Cards sit in an offset-shadow grid. Real Notion covers still show where they exist; posts without covers get a typographic title-card face.
result: pass
note: Auto-verified: .card-grid present, 3 cards with real Notion covers (fallback correctly unused; all posts have covers), reading times render ("3 min read", "5 min read", ...), computed shadow 8px 8px 0 #171717.

### 3. /projects cards are always title-cards
expected: Every project card face is a typographic title-card (no cover images anywhere in the grid), alternating paper/ink, kicker "Project" or first tag.
result: pass
note: Auto-verified: 8 title-cards, 0 cover imgs, 4 ink / 4 paper alternation, kickers "Project".

### 4. OG images are on-brand title-cards
expected: Root, blog-post, and project OG images render as paper/ink/vermilion typographic title-cards. No navy background, no gradients.
result: pass
note: Auto-verified: all 3 routes return 200 image/png; rendered PNGs inspected (root "Monty Singer", blog "The Pursuit of Happier-ness" with ESSAY chip + date, project "Gene-Own" with PROJECT chip + description). Paper field, vermilion chips, hard ink offset shadows, montysinger.com mark. No navy/gradients.

### 5. Card hover turns shadow vermilion
expected: Hovering a card in /writing or /projects shifts the hard offset shadow from ink to vermilion.
result: pass
note: Auto-verified: hover computed box-shadow = rgb(229, 65, 31) 8px 8px 0 (= #e5411f vermilion).

### 6. Visual sign-off (human judgment)
expected: Homepage Work grid, /writing, and /projects look right in the browser; title-cards read cleanly and the treatment feels on-brand.
result: pass
note: User confirmed 2026-07-06 ("yes those pages look good"). Separate observation raised during review: two different nav styles across pages — out of Phase 19 scope (nav untouched by 19), tracked as a pending todo, not a Phase 19 gap.

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
