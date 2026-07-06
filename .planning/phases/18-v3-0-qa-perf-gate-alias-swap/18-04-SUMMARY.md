# 18-04 SUMMARY — Route Health, Redirects, R-4 Content Gate

**Status:** COMPLETE (re-baselined against 17.4 HEAD `0d96bc1`, 2026-07-05)
**Verdict:** PASS — see `18-04-EVIDENCE.md`

## What was done
Executed the D-05 route/redirect/content gate against a local production server (`npm run build`
+ `npm run start`) because the Vercel preview is SSO-gated (Path C, same as 18-02/03). Re-baselined
because the original gate targeted commit `5a97f54`, 61 commits before the 17.4 restyle.

## Results
- **8/8 live routes** return 200 (`/`, `/about`, `/projects`, `/portfolio`, `/writing`, `/uses`,
  `/prometheus`, `/blog/feed.xml`).
- **5/5 redirects** resolve to correct targets as 308 permanent (`/watching`→`/uses`,
  `/newsletter`→`/writing`, `/events`→`/`, `/photos`→`/`, `/links`→`/about`). Note: Next.js
  `permanent: true` emits 308, not the "301" the original plan text assumed.
- **R-4 portfolio content gate: CLEARED** — `/portfolio` shows 8 real Notion Featured project
  cards, 0 empty-state. No pre-launch Notion action required.
- Homepage → `/portfolio` link present; `/uses` Watching section live (70 YouTube links); Notion
  cover proxy live on `/writing` (180 refs).
- Phase 16 deferred 4-item checklist: all PASS (palette now Ink & Vermilion `#e5411f`, not the
  rejected Pumpkin Amber).

## Deviations
- Plan text said "5 x 301 redirects"; actual is 308 (correct modern permanent-redirect status).
  Recorded as PASS with the clarification, not a failure.
- Palette markers in the plan were pre-17.4 (Pumpkin Amber/`#f5a623`); corrected to the shipping
  Ink & Vermilion text markers before running.

## Artifacts
- `18-04-EVIDENCE.md` (route/redirect/content tables + verdict)
- `18-REBASELINE.md` (build, perf, theme, gradients, tests re-baseline)
