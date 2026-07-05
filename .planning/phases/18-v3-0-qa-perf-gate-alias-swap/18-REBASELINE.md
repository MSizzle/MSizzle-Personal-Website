# Phase 18 Re-Baseline against 17.4 (2026-07-05)

**Why:** 18-01/02/03/05 evidence was captured at `5a97f54`, **61 commits** before the entire
17.4 photo-forward homepage restyle landed (Vermilion palette, portrait `<Image>` column,
alternating bands, Monty Monthly carousel, WebGL removal, gradient removal). The prior gate
measured a homepage that no longer exists. This note re-validates the automated gates against
current HEAD `0d96bc1`.

## Build (re: 18-01) — PASS
- `rm -rf .next && npm run build` → exit 0, clean.
- 39 static pages generated. Route table matches R-3 (no `/watching` `/newsletter` `/events`
  `/photos` `/links` as pages; all are redirects). ISR: `/portfolio` `/projects` `/writing`
  `/blog/[slug]` `/projects/[slug]` at 30m revalidate.

## Mobile Lighthouse (re: 18-03) — PASS (consistent with prior baseline)
Local prod server, mobile form factor, simulated throttling, 3 runs:

| Run | Perf | LCP | TBT | CLS |
|-----|------|-----|-----|-----|
| 1 (cold cache) | 68 | 4.6s | 350ms | 0 |
| 2 | 93 | 3.1s | 50ms | 0 |
| 3 | 95 | 3.0s | 30ms | 0 |

**Median Perf = 93, LCP ~3.1s, CLS 0.** Run 1 is the documented localhost cold-cache outlier
(same pattern 18-02 recorded: run-1 78 → 100). Localhost simulated throttling is pessimistic vs
the Vercel CDN, so production will score higher. This is on par with 18-03's prior baseline (95
"at floor"); **17.4 did not materially regress mobile performance.**

### LCP element — still text, quirk still N/A
The hero `<Photo>` portrait slots (`src/components/home/hero.tsx:55-57`) render **without a
`src`**, so they are CSS placeholder blocks (no image download). LCP remains the `<h1>`
marker-block text "Create Order". The `nextjs16-fetchpriority-quirk` memory stays N/A for a text
LCP. **Future note:** when real portrait images are added with `priority`, set
`fetchPriority="high"` explicitly and re-check LCP.

## Theme / single-mode (re: 18-05) — PASS (structural finding unchanged)
- `next-themes` / `ThemeProvider`: **0 usages** → single fixed theme, no FOUC risk.
- globals.css "dark" matches are `.photo.dark` (dark photo VARIANT for dark bands), not dark MODE.
- The only change vs 18-05 is the palette NAME: **Ink & Vermilion (`#e5411f`)**, not the rejected
  Pumpkin Amber. Single-mode ship conclusion holds.

## No-gradients rule — PASS
- globals.css: 4 "gradient" string matches, **all comments** stating "no gradient" / "removed".
  Zero real gradient declarations. Brutalist hard-offset-solids rule holds.

## Test suite — PASS
- `npx vitest run` → **139 passed, 0 failed**, 4 skipped files, 19 todo. The previously-noted
  failing homepage tests (`preexisting-failing-homepage-tests`) were resolved during the 17.4
  test rewrites.

## Net verdict
All automated Phase 18 gates re-pass against the 17.4 shipping code. No blockers. Ready for the
18-06 human GO/NO-GO sign-off.
