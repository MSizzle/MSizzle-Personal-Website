---
phase: "10-editorial-homepage"
status: "pending_human"
created: "2026-05-21"
pending_items: 6
plan_origins:
  - 10-07
deferred_from: "MOTION-07 perceptual gate (D-41) + D-40 vercel build phase gate + full visual QA"
---

# Phase 10 — Human UAT (Manual Verification Items)

This file captures the 6 items requiring Monty's local environment / human perception. All 13 Phase 10 requirements verify clean at the code level (18/18 must_haves, `npm run build` exit 0, 41 routes prerender, all Notion field names + token usage + chrome gate + ManifestoReveal implementation correct). The items below need real-browser observation.

## Item 1 — Phase Gate: `vercel build --prod` (D-40)

**Why human-only:** Sandbox node_modules corruption (same issue Phase 8/9 hit and documented). Local `npm run build` is green throughout Plans 10-01..10-07.

**How to verify (recommended — Vercel preview):**
```bash
cd "/Users/Montster/MSizzle Personal Website"
git push origin main:claude/phase-10-resume
```
Vercel auto-builds preview with `vercel build --prod` semantics. Check dashboard:
- `● Ready` → **PASS**, record below
- `● Error` → **FAIL**, reopen Phase 10

## Item 2 — Manifesto Letter-Stagger Signature Interaction (MOTION-07 / D-41)

**Why human-only:** Perceptual signature interaction; only a human in a browser can see the 18ms per-letter stagger fire correctly.

**How to verify:**
1. Open preview URL (or `npm ci && npm run dev` locally) → `http://localhost:3000/` in Chrome **incognito** (so sessionStorage starts clean)
2. Hard-reload (Cmd+Shift+R). Observe: each letter of "BRING FIRE / TO HUMANITY." slides up from below + fades in. Total duration ~700ms with 18ms offset per letter. Cumulative across both lines.
3. Click any nav link (e.g., About), then click "Monty Singer" to return to `/`. The manifesto should render **without** the stagger animation (sessionStorage gate caught it).
4. Open a NEW incognito tab and load `/`. The animation should fire again (sessionStorage is tab-scoped).

**On PASS:** Record observed delay/duration in Resolution section.
**On FAIL:** Most likely culprit is the `m` import being wrong (`motion` instead of `m`) — check `src/components/home-v2/manifesto-reveal.tsx`. Or matchMedia issue at the breakpoint boundary.

## Item 3 — Reduced-Motion Fallback (MOTION-07)

**Why human-only:** OS-level accessibility setting.

**How to verify:**
1. macOS System Settings → Accessibility → Display → toggle "Reduce motion" ON.
2. Open new incognito tab → `/`.
3. Manifesto should fade in over 300ms as full lines, no per-letter stagger.
4. Restore "Reduce motion" OFF.

## Item 4 — Dark-Mode Palette Stability (QA-V2-05 carryforward from Phase 9)

**Why human-only:** System dark-mode is OS-level.

**How to verify:**
1. macOS System Settings → Appearance → Dark.
2. Reload `/`. Page should STILL show warm-paper light palette (dark-mode dropped per Phase 9 D-04).

## Item 5 — Full Editorial Homepage Visual QA (SC1, SC2, SC3, SC4)

**Why human-only:** Perceptual confirmation of all 9 sections in handoff fidelity.

**How to verify (1440px desktop):**
1. Open `/` in incognito Chrome at 1440px width.
2. Confirm sections in this exact order with bold rules between:
   - Header (Monty Singer + 5-link nav baseline-aligned)
   - Manifesto (BRING FIRE / TO HUMANITY. at 124px uppercase)
   - Meta row (32px hairline + EST. 2026 · WASHINGTON, D.C.)
   - Epigraph photo (1120×540, film photograph)
   - Letter-style intro paragraph (22px, 3 inline IntroLinks)
   - BUILDING (Prometheus row + Selected Works row, hairline between)
   - WRITING (3 latest essays as big ListRows + "All writing →")
   - EVENTS (featured event with NEXT · date + 2 secondary ListRows + "All events →")
   - PHOTOGRAPHS (6-plate asymmetric 12-col grid with mix-blend captions + "Photo Archive →")
   - PERSONAL (3-card grid with top ink borders)
   - Inverted ink footer (4 columns + bottom row with copyright + socials)
3. Cross-reference each section against `.planning/research/editorial-redesign-handoff/preview.html` if needed.

## Item 6 — Mobile Parity at 390px (HOME-V2-12)

**Why human-only:** Visual rhythm at narrow widths.

**How to verify:**
1. Chrome DevTools → device toggle → 390px width (iPhone 13/14 reference).
2. Confirm:
   - Manifesto renders 3 lines at 56px: BRING / FIRE TO / HUMANITY.
   - Photographs collapse to 2-col grid (6 plates → 3 rows of 2)
   - Footer columns stack vertically with hairline dividers between each
   - All tap targets feel ≥44px (no tiny links that miss-tap)
   - No horizontal overflow / no scrolling sideways
3. Toggle to 1024px and back to confirm breakpoint transitions cleanly.

---

## Resolution

(append PASS/FAIL records here as items are discharged)
