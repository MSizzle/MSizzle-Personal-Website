---
quick_id: 260708-lqc
title: "Contact page — dedicated /contact route with big-list link rows"
status: complete
date: 2026-07-08
commit: "committed to main"
---

# Quick Task 260708-lqc — Summary

Built a dedicated `/contact` route presenting Monty's links as big brutalist
list rows, and rewired the primary nav so "Contact" points to the page instead
of the `#contact` footer anchor.

## What changed

**New files**
- `src/components/v3/contact-row.tsx` — external-aware sibling of `ListRow`.
  Renders a plain `<a>` (so it can carry `mailto:` and `target`/`rel`), with the
  exact ListRow DNA: 60px numeral | title + reveal-arrow + handle | action-word
  meta, hover-invert (bg→ink, text→paper), `big` sizing. External links get
  `target="_blank" rel="noopener noreferrer"`; `mailto:` opens in place.
- `src/app/contact/page.tsx` — server page modeled on `/building`. `PageHeroBand`
  (vermilion, "Contact", crumb "Home / Contact", warm sub), a section of four
  ContactRows (Email · Say hi / X · Follow / LinkedIn · Connect / Monty Monthly ·
  Subscribe), closed by `<RuleStrong />`. Full `metadata` (canonical `/contact`,
  openGraph). `revalidate = 1800`.

**Edited**
- `src/components/home-v2/editorial-header.tsx` — Contact href `#contact`→`/contact`
  (now flows through the internal-`Link`+active branch); `active` prop type extended
  with `"Contact"`; doc comment updated.
- `src/components/nav/navigation.tsx` — MOBILE_LINKS Contact `#contact`→`/contact`;
  `activeLabel` type + derivation extended so `pathname === "/contact"` bolds Contact.
- `src/app/sitemap.ts` — added `/contact` to the static routes (priority 0.8).
- `src/__tests__/components/navigation.test.tsx`, `footer.test.tsx` — updated stale
  doc comments only; no assertions needed changing (footer keeps `id="contact"`).

## Verification

- `npx tsc --noEmit` — no errors in any changed file. (Pre-existing unrelated
  errors remain in `src/__tests__/seo/robots.test.ts`, untouched here.)
- `npm run build` — compiles; `/contact` prerenders as a static route (30m revalidate).
- `npx vitest run` navigation + footer + sitemap tests — 15/15 pass.
- Visual check (Playwright, 1280px): hero band, active "Contact" nav, four rows,
  RuleStrong, footer intact. Confirmed matching the locked design.

## Notes

- Committed to main at Monty's request (the 10 contact-task files only; the
  repo's other deliberate uncommitted work, e.g. pending builds 2026-07-07, was
  left untouched and out of the commit).
- Footer's `id="contact"` retained as a harmless stable in-page anchor even though
  the nav no longer targets it.
