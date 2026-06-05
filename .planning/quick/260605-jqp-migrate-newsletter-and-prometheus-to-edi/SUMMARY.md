---
quick_id: 260605-jqp
slug: migrate-newsletter-and-prometheus-to-edi
date: 2026-06-05
status: complete
commit: 756b0bd
build: pass
tests: pass
---

# Quick Task Summary: Migrate /newsletter + /prometheus to the editorial layout

Both pages were half-migrated, still using the old narrow `prose` / `max-w-[66ch]`
reading column with `text-section-feature` headings. They now match the editorial
title-block + RuleStrong + row system used across /about, /writing, and /events.

## What changed

### /prometheus (`src/app/prometheus/page.tsx`)
- Replaced the `<article className="max-w-[66ch] prose">` block with the shared
  editorial title block (2-col grid, `── The Studio · 01` label, `Prometheus.`
  page title, muted blurb, 360×480 atmosphere photo at
  `/MSizzle-website-photos/000092530012.jpeg`).
- Content now uses the /about 3-col row pattern
  (`grid md:grid-cols-[180px_1fr_1fr]`, `<Rule />` between rows): What I Do,
  Document Automation (orthodontic), Research Tooling (hospitality), Start a
  project (contact). Wrapped in `<RuleStrong />` top and bottom.
- Contact uses `AllLink` to `https://prometheus.today` and a `mailto:` AllLink to
  `monty@prometheus.today`.
- Preserved: `metadata` export, `FAQS` array (unchanged), and
  `<JsonLd data={buildFaqPageSchema(FAQS)} />`. Stays a SYNC server component.
- Removed: `Breadcrumbs` import + render.

### /newsletter (`src/app/newsletter/page.tsx`)
- Replaced the narrow intro column with the editorial title block
  (`── The Dispatch · 02` label, `Monty Monthly.` page title, muted blurb,
  in-column Subscribe button to Substack, 360×480 atmosphere photo at
  `/MSizzle-website-photos/IMG_0028.jpeg`).
- Recent issues moved into an editorial section using
  `<SectionLabel numeral="02 — Issues">Recent Issues</SectionLabel>` with a
  `mt-[72px]` wrapper. The issue gallery grid, thumbnail handling, and date
  formatting are unchanged. The empty-state branch was reworded to editorial tone.
  Wrapped in `<RuleStrong />` top and bottom.
- Preserved: `metadata` export, `export const revalidate = 86400`, the `async`
  component, and `const issues = await fetchMontyMonthlyIssues(20)`.
- Removed: `Breadcrumbs` import + render.

## Verification

- `npm run build` — pass. `/newsletter` shows `1d` revalidate (confirms
  `revalidate = 86400` preserved); `/prometheus` renders static.
- `npx vitest run` — pass (29 passed, 14 todo, 5 skipped files).
- Grep — neither page imports `Breadcrumbs`; `/prometheus` still references
  `buildFaqPageSchema(FAQS)`; `/newsletter` still references
  `fetchMontyMonthlyIssues`.

## Commit

`756b0bd` — `style(pages): migrate /prometheus + /newsletter to editorial layout — title blocks, atmosphere photos, rows`

Staged only `src/app/prometheus/page.tsx` and `src/app/newsletter/page.tsx`. Not pushed.

## Deviations

- Build lock false-positive (resolved, no code impact): The first `npm run build`
  attempts reported "Another next build process is already running." A leftover
  `next build` process (PID 92774) held the OS-level advisory lock on `.next/lock`.
  Waited for it to exit; the lock cleared (POSIX releases on file-handle close) and a
  fresh build succeeded. No `git clean`, no lock-file deletion, no source changes were
  needed to resolve it.
- The contact row on /prometheus presents both the website AllLink and the email
  AllLink side-by-side (`flex flex-wrap gap-6`) rather than as inline prose links —
  consistent with the AllLink usage pattern elsewhere. Within plan intent.
