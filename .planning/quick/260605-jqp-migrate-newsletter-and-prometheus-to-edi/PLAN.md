---
quick_id: 260605-jqp
slug: migrate-newsletter-and-prometheus-to-edi
date: 2026-06-05
status: planned
---

# Quick Task: Migrate /newsletter + /prometheus to the editorial layout

## Problem

Both pages are half-migrated: they use the old narrow `prose` / `max-w-[66ch]`
reading column with `text-section-feature` headings instead of the editorial
title-block + RuleStrong + row system the rest of the site uses. Bring both up
to match /about, /writing, /events.

## Hard constraints (DO NOT BREAK)

- `/newsletter` must keep its dynamic Substack fetch
  (`fetchMontyMonthlyIssues(20)`), `export const revalidate = 86400`, the issue
  gallery (with thumbnail + empty-state fallback), and its `metadata` export.
- `/prometheus` must keep its `JsonLd` FAQ schema (`buildFaqPageSchema(FAQS)`)
  and `FAQS` array unchanged (SEO), and its `metadata` export.
- Keep `monty@prometheus.today` as the contact email (set in 260605-jdy).
- Both stay server components. `/newsletter` stays `async` (it awaits the fetch);
  `/prometheus` stays sync.
- Drop the now-unneeded `Breadcrumbs` import from each (the editorial pages don't
  render a breadcrumb bar — /about, /writing, /events don't). If removing it
  flags an unused import, ensure no other reference remains.

## Shared editorial title-block pattern (copy from src/app/about/page.tsx)
`<section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">` →
2-col grid `md:grid-cols-[1fr_360px] items-end gap-10 md:gap-20`. Left: label
(`text-label uppercase text-muted`), `<h1 className="mt-6 text-page-title
uppercase text-ink">`, muted blurb (`mt-10 max-w-[35rem] text-body-lead
text-muted`). Right (`hidden md:block`): 360×480 `bg-rule-strong` photo,
`object-cover saturate-[0.92]`, `alt=""`, `sizes="360px"`.

## Task A — /prometheus (src/app/prometheus/page.tsx)

Keep imports: Metadata, JsonLd, buildFaqPageSchema, FAQS, metadata export.
Add editorial imports: Image, RuleStrong, Rule, AllLink, SectionLabel.
Remove: Breadcrumbs.

Body:
1. `<JsonLd data={buildFaqPageSchema(FAQS)} />` (keep — it renders no visible markup).
2. Title block:
   - label `── The Studio · 01`
   - h1 `Prometheus.`
   - blurb: "AI integrations and education. I help businesses implement AI into
     their workflows — custom automation pipelines, tool integration, and
     hands-on training. Built to outlive the next platform shift."
   - atmosphere photo `src="/MSizzle-website-photos/000092530012.jpeg"`.
3. `<RuleStrong />`
4. Content section `<section className="px-6 pt-[120px] pb-[120px] md:px-40">`
   using the /about 3-col row pattern
   (`grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12`,
   `<Rule />` between rows):
   - Row "What I Do" — meta `Services`, feature `What I Do`, body = the 4 bullet
     items as a short list or comma sentence (Custom AI automation pipelines; AI
     tool implementation & integration; AI education & training for teams;
     workflow optimization).
   - Row "Orthodontic practice" — meta `Case Study · Healthcare`, feature
     `Document Automation`, body = the existing orthodontic paragraph (PDF →
     PowerPoint, HIPAA-compliant local architecture).
   - Row "Hospitality company" — meta `Case Study · Hospitality`, feature
     `Research Tooling`, body = the existing hospitality paragraph.
   - Row "Work with Prometheus" — meta `Contact`, feature `Start a project`,
     body: visit prometheus.today (AllLink to https://prometheus.today) or email
     (AllLink/anchor `mailto:monty@prometheus.today`).
5. `<RuleStrong />`

## Task B — /newsletter (src/app/newsletter/page.tsx)

Keep imports: Metadata, Image, fetchMontyMonthlyIssues, revalidate, metadata,
async component + `const issues = await fetchMontyMonthlyIssues(20)`.
Add editorial imports: RuleStrong, SectionLabel. Remove: Breadcrumbs.

Body:
1. Title block:
   - label `── The Dispatch · 02`
   - h1 `Monty Monthly.`
   - blurb: "A monthly letter on what I'm building, learning, and thinking
     about — essays on AI, entrepreneurship, philosophy, and life. One email a
     month, no firehose."
   - In the LEFT column, below the blurb, keep a Subscribe button (`mt-10
     inline-block border border-ink px-7 py-3 text-label uppercase text-ink
     transition-opacity hover:opacity-80 no-underline`) → href
     `https://montymonthly.substack.com`, target _blank, rel noopener.
   - atmosphere photo `src="/MSizzle-website-photos/IMG_0028.jpeg"`.
2. `<RuleStrong />`
3. Recent issues section `<section className="px-6 pt-[120px] pb-[120px]
   md:px-40">`:
   - `<SectionLabel numeral="02 — Issues">Recent Issues</SectionLabel>` then a
     `mt-[72px]` wrapper.
   - Keep the existing issue gallery grid (`grid grid-cols-2 md:grid-cols-3 gap-4
     md:gap-6`, each card with thumbnail aspect box + title + formatted date)
     EXACTLY as the current data mapping, just inside the editorial section.
   - Keep the empty-state branch (issues.length === 0) but reword to editorial
     tone, e.g.: "Issues land here once the archive syncs. In the meantime,
     subscribe on Substack to catch the next one." with the Substack link.

## Verification
- `npm run build` succeeds.
- `npx vitest run` passes.
- Grep: neither page imports `Breadcrumbs`; /prometheus still has `buildFaqPageSchema(FAQS)`; /newsletter still has `fetchMontyMonthlyIssues`.
