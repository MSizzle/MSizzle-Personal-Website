# Monty's v4.0 post-Phase-21 revisions (captured 2026-07-22)

Spoken feedback from the Phase 21/22 sessions. Captured here because the earlier
round was never written down and was lost to a context clear. All items are
homepage / writing / contact surface work, i.e. Phase 21 + Phase 23 territory,
not Phase 22 (pinboard).

## 1. Nav hidden on load, hero centered, wave-curl reveal

- `StickyNav` (`src/components/home/sticky-nav.tsx`, mounted at
  `src/components/home/explorative-homepage.tsx:2`) must NOT render at scrollY 0.
- Hero is centered in the viewport on first paint (today it is top-aligned:
  `hero.tsx` uses `pt-24 md:pt-52`).
- On first scroll the nav comes up, curling down like a wave off the box edge.

**Conflict to resolve before building:** Phase 21 requirement MS-02 stripped
homepage motion to a single slow opacity fade and explicitly deleted every other
ambient motion source. A wave-curl reveal reverses that decision. Monty wants it;
log it as an intentional amendment, not a regression.

## 2. Homepage Writing section: blog posts only

`src/components/home/section-writing.tsx` currently merges `posts` (Notion blog)
and `montyIssues` (Substack RSS) into one newest-first list. Drop the Monty
Monthly rows. Homepage Writing shows blog posts only.

Touches: `section-writing.tsx`, its `montyIssues` prop, the page.tsx wiring in
`src/app/page.tsx`, and `src/__tests__/home/*` coverage of the merged list.

## 3. /writing page: capped grid + click-to-expand, bigger Monty Monthly

`src/app/writing/page.tsx` today renders a year-grouped card grid of all posts,
then a `NewsletterCarousel` under a small `Monty Monthly` h3.

- Show roughly two rows of post panels, then a click-to-expand control that
  reveals the rest.
- The Monty Monthly section stays where it is but becomes MUCH larger. It should
  read as a dedicated section, not a footnote under the essays.

Expansion needs a client component; the page is currently an async server
component, so the expand control has to be a "use client" island.

## 4. Contact page: row titles must invert on hover

On `/contact`, hovering a row inverts the numeral, handle, and action word, but
the row title (`Email`, `X / Twitter`, `LinkedIn`, `Monty Monthly`) does not
appear to follow. Titles must change color with the rest of the row.

Relevant: `src/components/v3/contact-row.tsx:57` (title div carries no explicit
color, inherits from the `<a>`'s `hover:text-bg`) and the global `a { color:
inherit }` at `src/app/globals.css:66`. Diagnose live in `npm run dev` before
editing; the static read suggests it should already inherit.

## 5. Hero paragraph: line-per-sentence + contact link

`src/components/home/hero.tsx:31` renders three sentences as one flowed
paragraph. Each sentence starts on its own line:

    Founder of Prometheus, an applied AI company.
    I love technology, biology, and self-improvement.
    If you like these as well, we'll get along.

Only the phrase **"we'll get along."** is a link to `/contact`. Not the whole
sentence, not the whole paragraph.
