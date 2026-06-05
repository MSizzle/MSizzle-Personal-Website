---
quick_id: 260605-jdy
slug: unify-contact-email-to-monty-prometheus-
date: 2026-06-05
status: planned
---

# Quick Task: Unify contact email + fix "Reading List" footer label

## Problem

The site exposes two different contact emails depending on the page
(`mds345@georgetown.edu` on /links + /prometheus; `montydsinger@gmail.com` in
the footer + RSS), which is confusing and undermines credibility. Operator
chose a single canonical address: **monty@prometheus.today** (Prometheus
business email — won't expire like the Georgetown student address).

Separately, the footer link labeled "Reading List" actually points to /links
(social profiles), so the label is misleading.

## Tasks

1. **Replace `mds345@georgetown.edu` → `monty@prometheus.today`** (keep `mailto:` prefix):
   - `src/app/links/page.tsx` line ~20 (LINKS array "Email" entry)
   - `src/app/prometheus/page.tsx` line ~89 ("get in touch" mailto)

2. **Replace `montydsinger@gmail.com` → `monty@prometheus.today`**:
   - `src/components/home-v2/ink-footer.tsx` line ~50 (footer "Contact" mailto)
   - `src/components/home-v2/ink-footer.tsx` line ~87 (footer bottom-row "Email" mailto)
   - `src/lib/rss/blog-feed.ts` line ~28 (`<author>` field — change the address
     but keep the ` (Monty Singer)` suffix → `monty@prometheus.today (Monty Singer)`)

3. **Relabel footer link** — `src/components/home-v2/ink-footer.tsx` line ~38:
   change `{ label: "Reading List", href: "/links" }` label from "Reading List"
   to **"Links"** (href stays `/links`).

## Verification
- `grep -rn "mds345@georgetown.edu\|montydsinger@gmail.com" src` returns nothing.
- `grep -rn "Reading List" src` returns nothing.
- `npm run build` succeeds; `npx vitest run` passes (note: links.test.tsx asserts
  the mailto Email link is NOT umami-tracked — changing the address doesn't affect that).

## Out of scope
- /links visual restyle (#1) — separate task.
- Any non-email content.
