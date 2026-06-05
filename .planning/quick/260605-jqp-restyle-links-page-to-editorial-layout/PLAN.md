---
quick_id: 260605-jqp
slug: restyle-links-page-to-editorial-layout
date: 2026-06-05
status: planned
---

# Quick Task: Restyle /links to the editorial layout

## Problem

`src/app/links/page.tsx` still uses the old plain layout (ScrollReveal + a bare
`max-w-[66ch]` column + underlined `<ul>`). It's in the main nav, so it's the
most-visible page that doesn't match the editorial system used by /writing,
/events, /about, /photos, /projects.

## Hard constraints (DO NOT BREAK)

- **Test contract** — `src/__tests__/pages/links.test.tsx` renders the page
  SYNCHRONOUSLY (`render(<LinksPage />)`) and asserts EXACTLY 3 anchors carry
  `data-umami-event` (the http links: twitter, linkedin, github), and that
  `links-click-linkedin` + `links-click-github` are among them. So:
  - The page MUST stay a **synchronous server component** (no `async`, no client hooks).
  - http(s) links MUST keep `data-umami-event="links-click-<slug>"` where slug =
    `label.toLowerCase().replace(/[\s/]+/g, '-')` (e.g. "Twitter / X" → `twitter-x`).
  - mailto and internal (`/newsletter`) links MUST NOT have `data-umami-event`.
- Keep `target="_blank" rel="noopener noreferrer"` on http + mailto links;
  internal `/newsletter` uses client-side nav (no new tab).
- Keep the existing email value `monty@prometheus.today` (set in task 260605-jdy).
- Keep the existing `metadata` export (title/description/canonical/openGraph) as-is.

## Approach

Rebuild the page body with the editorial title-block + RuleStrong + editorial
link rows. Reuse existing primitives: `RuleStrong`. Do NOT use `ListRow` for the
link rows (it renders `next/link` and can't carry target/rel/umami the way these
external links need) — build the rows inline as `<a>`/`<Link>` matching ListRow's
visual (border-t border-rule, py-7, `text-list-title` title, `text-meta uppercase
text-muted` meta on the right). Drop the `Breadcrumbs` + `ScrollReveal` imports.

### Title block (match /about + /photos skeleton)
- Section: `<section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">`
- 2-col grid `md:grid-cols-[1fr_360px]`, `items-end`, `gap-10 md:gap-20`.
- Left: label `── The Index · 06` (`text-label uppercase text-muted`), then
  `<h1 className="mt-6 text-page-title uppercase text-ink">Links.</h1>`, then a
  muted blurb (`mt-10 max-w-[35rem] text-body-lead text-muted`), e.g.:
  "Every way to reach me or follow along — email, the socials, and the monthly
  letter. The rest of the internet is noise; this is the signal."
- Right (`hidden md:block`): 360×480 atmosphere photo, `bg-rule-strong`,
  `object-cover saturate-[0.92]`, `alt=""`, `sizes="360px"`:
  `src="/MSizzle-website-photos/IMG_2129.jpeg"`.

### RuleStrong

### Link rows section
`<section className="px-6 md:px-40">` wrapping a list. Define a LINKS array of
`{ label, href, meta }`:
- Email · `mailto:monty@prometheus.today` · meta `monty@prometheus.today`
- Twitter / X · `https://x.com/thefullmonty0` · meta `@thefullmonty0`
- LinkedIn · `https://linkedin.com/in/monty-singer` · meta `in/monty-singer`
- GitHub · `https://github.com/MSizzle` · meta `@MSizzle`
- Newsletter · `/newsletter` · meta `Monty Monthly`

Render each as a row. Compute `isHttp = href.startsWith('http')`,
`isMailto = href.startsWith('mailto')`, `opensNewTab = isHttp || isMailto`.
- For http/mailto → `<a href target={opensNewTab?'_blank'} rel ...>` and spread
  `isHttp ? { 'data-umami-event': 'links-click-' + label.toLowerCase().replace(/[\s/]+/g,'-') } : {}`.
- For internal (`/newsletter`) → `next/link` `<Link>`.
- Row visual (both cases): `flex items-baseline justify-between gap-6 border-t border-rule py-7 first:border-t-0`,
  title `text-list-title text-ink`, meta `shrink-0 text-meta uppercase text-muted`.
  Add a subtle hover (e.g. `transition-opacity hover:opacity-60` on the row).
- Add bottom padding on the section (e.g. `pb-24 md:pb-32`).

## Verification
- `npx vitest run src/__tests__/pages/links.test.tsx` passes (3 tracked links).
- `npm run build` succeeds.
- Grep: page has no `ScrollReveal` / `Breadcrumbs` imports; still exports `metadata`.
