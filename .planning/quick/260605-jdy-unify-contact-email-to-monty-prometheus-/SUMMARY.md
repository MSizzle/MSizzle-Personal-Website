---
quick_id: 260605-jdy
slug: unify-contact-email-to-monty-prometheus-
date: 2026-06-05
status: complete
commit: 3aabd7487cd65f034db8c84d5b3876559faf32ea
---

# Summary: Unify contact email + fix "Reading List" footer label

Unified all site contact emails to the single canonical address
**monty@prometheus.today** (Prometheus business email, won't expire like the
Georgetown student address), replacing the two prior addresses
(mds345@georgetown.edu and montydsinger@gmail.com). Also relabeled the
misleading footer link "Reading List" -> "Links" (href /links unchanged, since
it points to social profiles, not a reading list).

## Files changed (4)

- src/app/links/page.tsx — LINKS "Email" mailto -> monty@prometheus.today
- src/app/prometheus/page.tsx — "get in touch" mailto -> monty@prometheus.today
- src/components/home-v2/ink-footer.tsx — three edits: footer label
  "Reading List" -> "Links"; "Contact" mailto -> monty@prometheus.today;
  bottom-row "Email" mailto -> monty@prometheus.today
- src/lib/rss/blog-feed.ts — RSS <author> -> monty@prometheus.today (Monty Singer)
  ((Monty Singer) suffix preserved)

## Verification

- grep -rn "mds345@georgetown.edu" src -> empty (pass)
- grep -rn "montydsinger@gmail.com" src -> empty (pass)
- grep -rn "Reading List" src -> empty (pass)
- npm run build -> succeeded
- npx vitest run -> 13 test files passed / 5 skipped; 29 tests passed / 14 todo; 0 failed

## Deviations

None — plan executed exactly as written.
