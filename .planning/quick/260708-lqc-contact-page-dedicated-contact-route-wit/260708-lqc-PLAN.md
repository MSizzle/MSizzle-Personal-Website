---
quick_id: 260708-lqc
title: "Contact page — dedicated /contact route with big-list link rows"
status: ready
created: 2026-07-08
mode: quick
plans: 1
tasks: 3
---

# Quick Task 260708-lqc: Dedicated /contact page with big-list link rows

## Task Boundary

Build a dedicated `/contact` route that presents Monty's links as big
brutalist list rows (ListRow DNA), and rewire the nav so "Contact" points to
the new page instead of the `#contact` footer anchor. Footer is unchanged.

## Locked Decisions (do not revisit)

- Dedicated `/contact` route (`src/app/contact/page.tsx`). NOT a footer redesign.
- Big brutalist list rows: numeral | title + reveal-arrow + handle-as-excerpt |
  action-word meta, hover-invert (bg→ink, text→paper) — the ListRow pattern.
- New `src/components/v3/contact-row.tsx`: external-aware ListRow variant that
  renders a plain `<a>`. External links get `target="_blank" rel="noopener noreferrer"`;
  `mailto:` opens in place. Same grid + hover-invert + arrow-reveal classes as ListRow.
- Nav rewire in BOTH `editorial-header.tsx` (Contact `#contact`→`/contact`, move to
  internal-`Link`+active branch, extend `active` type with `"Contact"`) and
  `navigation.tsx` (MOBILE_LINKS href, `activeLabel` derivation for `pathname === "/contact"`,
  `activeLabel` type).
- Brand rules: Vermilion `#e5411f`, NO gradients (hard offset solids only), NO em
  dashes in copy, NO location in copy. Server-first components.

## Links (numerals 01-04, from site-footer.tsx ELSEWHERE)

| # | Label | href | handle | action | external |
|---|-------|------|--------|--------|----------|
| 01 | Email | mailto:monty@prometheus.today | monty@prometheus.today | Say hi | no (mailto) |
| 02 | X / Twitter | https://x.com/thefullmonty0 | @thefullmonty0 | Follow | yes |
| 03 | LinkedIn | https://linkedin.com/in/monty-singer | /in/monty-singer | Connect | yes |
| 04 | Monty Monthly | https://montymonthly.substack.com | montymonthly.substack.com | Subscribe | yes |

---

## Task 1 — ContactRow component (external-aware ListRow variant)

- **files:** `src/components/v3/contact-row.tsx` (new)
- **action:** Create a server component modeled 1:1 on `src/components/v3/list-row.tsx`,
  but rendering a plain `<a href={href}>` instead of `next/link`. Props:
  `numeral`, `title`, `href`, `handle` (rendered in the ListRow `.ex`/excerpt slot),
  `meta` (action word), `external?: boolean`. When `external`, spread
  `{ target: "_blank", rel: "noopener noreferrer" }`; otherwise no target/rel
  (covers `mailto:`). Reuse the exact ListRow classes: `group grid gap-[18px]
  items-center border-b border-border py-[22px] px-[18px] -mx-[18px]
  transition-[background,color] duration-150 hover:bg-text hover:text-bg
  [grid-template-columns:60px_1fr_auto]`. Numeral in `.n` slot (`font-mono text-sm
  text-text-muted group-hover:text-bg`), title (`font-display font-medium uppercase
  tracking-[-0.01em]`) with the opacity-0→100 reveal `→` arrow, handle in excerpt
  slot (`font-sans text-sm text-text-muted normal-case ... group-hover:text-bg
  group-hover:opacity-75`), action meta (`font-mono text-xs uppercase text-text-muted
  whitespace-nowrap group-hover:text-bg`). Use `big` sizing (py-7, text-2xl title)
  so rows read large. No em dashes, no gradients.
- **verify:** `npx tsc --noEmit` clean for the new file; classes match ListRow.
- **done:** ContactRow renders an `<a>` with correct external attrs and the
  hover-invert + arrow-reveal treatment.

## Task 2 — /contact page

- **files:** `src/app/contact/page.tsx` (new)
- **action:** Model on `src/app/building/page.tsx`. Export `metadata` (title
  "Contact", a description like "Get in touch with Monty Singer: email, X, LinkedIn,
  and the Monty Monthly newsletter.", `alternates.canonical: "/contact"`,
  `openGraph` with `url: "/contact"`, `type: "website"`, matching title/description).
  Default export a server component returning: `<PageHeroBand title="Contact"
  crumb="Home / Contact" sub="Want to talk shop, trade ideas, or just say hello? Pick a
  line below and reach out." />`, then `<section className="px-6 md:px-40">` wrapping
  a `<div className="-mx-[18px]">` (so the row bleed/padding matches ListRow) with the
  four `<ContactRow>` entries (data table above), then `<RuleStrong />`. No em dashes,
  no location, no gradients. Add `export const revalidate = 1800;` to match sibling pages.
- **verify:** `npm run build` compiles `/contact`; page shows hero + 4 rows + rule.
- **done:** `/contact` route renders the hero band and the four big link rows.

## Task 3 — Rewire nav to /contact + fix tests

- **files:** `src/components/home-v2/editorial-header.tsx`,
  `src/components/nav/navigation.tsx`,
  `src/__tests__/components/navigation.test.tsx` (only if assertions break),
  `src/__tests__/components/footer.test.tsx` (only if assertions break)
- **action:**
  - `editorial-header.tsx`: change the Contact LINKS entry href `"#contact"` → `"/contact"`.
    Because it is now an internal route, it falls through to the `<Link>`+active branch
    (the `startsWith("#")||external` guard no longer matches). Extend the `active` prop
    type to `"Building" | "Writing" | "Contact"`. Update the component doc comment to note
    Contact is now a route that can be bolded active.
  - `navigation.tsx`: in `MOBILE_LINKS`, change Contact href `'#contact'` → `'/contact'`.
    Extend `activeLabel` type to include `'Contact'` and add
    `: pathname === '/contact' ? 'Contact'` to the derivation. Update the stale comments
    that say "Contact is an in-page anchor" to reflect it is now a route. NOTE: the mobile
    drawer renders `/contact` via the `<Link>` branch (no longer `startsWith('#')`), which
    is correct.
  - Run the two test files; if any assert the Contact link points to `#contact` or is a
    non-route anchor, update those assertions to `/contact`. Do not weaken unrelated assertions.
- **verify:** `npx vitest run src/__tests__/components/navigation.test.tsx
  src/__tests__/components/footer.test.tsx` passes; desktop + mobile "Contact" now link to
  `/contact` and bold as active on that route.
- **done:** Both navs point Contact at `/contact`, active state works, tests green.

## Global Verify

- `npm run build` succeeds (typecheck + `/contact` route generated).
- `npx vitest run` has no NEW failures beyond the 3 known pre-existing homepage
  failures (section-building HD-04, explorative-homepage TD-03/HD-05).
- No em dashes, no gradients, no location introduced in any copy.
