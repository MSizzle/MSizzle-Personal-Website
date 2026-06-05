---
quick_id: 260605-jqp
slug: restyle-links-page-to-editorial-layout
date: 2026-06-05
status: complete
commit: c9e8117
---

# Summary: Restyle /links to the editorial layout

Rebuilt `src/app/links/page.tsx` from the old plain layout (ScrollReveal +
`max-w-[66ch]` column + underlined `<ul>`) into the editorial system used across
the rest of the site. The page now has the standard title block ("── The Index ·
06" label, `Links.` page title, muted blurb), a 360×480 atmosphere photo
(`/MSizzle-website-photos/IMG_2129.jpeg`), a `RuleStrong` divider, and editorial
link rows styled to match `ListRow` (border-t border-rule, py-7,
`text-list-title` title, right-aligned `text-meta uppercase text-muted` meta with
a subtle `hover:opacity-60`).

## Constraints preserved

- Page remains a synchronous server component — no `async`, no `'use client'`,
  no hooks. The test renders it synchronously and passes.
- Exactly the 3 http links (Twitter/X, LinkedIn, GitHub) carry
  `data-umami-event="links-click-<slug>"`; mailto and the internal `/newsletter`
  link carry none.
- `target="_blank" rel="noopener noreferrer"` kept on http + mailto links;
  `/newsletter` uses `next/link` for client-side nav.
- Email value `monty@prometheus.today` preserved.
- Existing `metadata` export kept verbatim.
- Dropped `ScrollReveal` and `Breadcrumbs` imports.
- Link rows built inline as `<a>` / `<Link>` (NOT `ListRow`), so external links
  can carry target/rel/umami.

## Verification

- Test: `npx vitest run src/__tests__/pages/links.test.tsx` — PASS (1 file, 1 test;
  finds exactly 3 data-umami-event anchors including links-click-linkedin and
  links-click-github).
- Build: `npm run build` — SUCCESS. `/links` prerenders as static content.

## Files changed

- `src/app/links/page.tsx` (1 file, +73 / -38)

## Commit

`c9e8117` — style(links): rebuild /links in editorial layout — title block, atmosphere photo, editorial rows

## Deviations

None. Plan executed exactly as written. Only `src/app/links/page.tsx` was staged;
no other modified/untracked files were touched. Not pushed.
