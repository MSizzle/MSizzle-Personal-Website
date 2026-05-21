---
phase: "09-design-tokens-editorial-primitives"
status: "pending_human"
created: "2026-05-21"
pending_items: 2
plan_origins:
  - 09-09
deferred_from: "09-09 Task 3 (vercel build --prod phase gate) + perceptual confirmation of warm-paper palette + Inter @ 124px"
---

# Phase 09 — Human UAT (Manual Verification Items)

This file captures the two acceptance items from Phase 9 that require Monty's local environment / human perception and could not be discharged from the resume sandbox. Both should PASS before Phase 9 is formally closed.

## Item 1 — Phase Gate: `vercel build --prod` (CONTEXT.md D-19, SC4)

**Why human-only:** Sandbox `node_modules` is environmentally corrupted (rolldown native binding missing; vercel-installer pre-build corruption of Next.js modules). Same issue Phase 8 hit and documented. Local `npm run build` exits 0 throughout Phase 9 execution — that signal is strong evidence, but the canonical D-19 gate is the production-mode build.

**How to verify (option A — recommended, free):**

Push the current branch to GitHub:
```bash
cd "/Users/Montster/MSizzle Personal Website"
git push origin main:claude/phase-9-resume
```

Vercel auto-builds the preview deployment with `vercel build --prod` semantics. Wait ~1–2 minutes. Check the Vercel dashboard:
- If preview status is `● Ready` → **PASS**, append to this file under `## Resolution`.
- If preview status is `● Error` → **FAIL**; Phase 9 reopens as a regression.

**How to verify (option B — on Mac directly):**

```bash
cd "/Users/Montster/MSizzle Personal Website"
git fetch
git checkout claude/phase-9-resume   # or main, once merged
npm ci
npx vercel build --prod
echo "EXIT=$?"   # expect: EXIT=0
```

**On PASS:** Append to this file under `## Resolution`:
```
### Item 1 — vercel build --prod
- Status: PASS — 2026-MM-DD
- Method: Vercel preview deployment from branch push
- Build: Ready, ~Nm duration, dpl_XXXXXXXXXXXXXX
- Preview URL: https://m-sizzle-personal-website-git-claude-p-XXXXXX-msizzles-projects.vercel.app
```

## Item 2 — Perceptual Confirmation: Warm-Paper Palette + Inter @ 124px

**Why human-only:** Automated build confirms class strings compile and the page renders statically. Only a human in a real browser can observe:
- Warm-paper feel (paper `#F4F2EC` should read warm off-white, not pure white)
- Near-black ink (`#0E0E0C`) with the warm tint (not pure black)
- Inter at 124px renders cleanly without FOUT/FOIT (font-loading flash)
- Hairlines (1px `border-rule`) visible but not heavy
- No accidental dark-mode switch when OS appearance is set to Dark

**How to verify:**

1. After Item 1's preview deploy is `● Ready`, open `{preview-url}/specimen` in Chrome incognito.
2. Hard-reload (Cmd+Shift+R). Open DevTools → Network tab.
3. Confirm: Inter font request returns `200 OK`. The 124px display text in the "Type scale" section doesn't flash from a system font to Inter.
4. Confirm: page background is warm off-white (not pure white); near-black ink (not pure black); hairlines visible.
5. Toggle macOS System Settings → Appearance → Dark. Reload `/specimen`. Page should STILL show warm-paper light palette (dark-mode dropped per CONTEXT.md D-04).
6. Open `{preview-url}/` (the homepage) — should also render with warm-paper palette via the v1.0→v2.0 alias bridge (D-02). Verify the layout still works (header, hero, writings, works, events sections all render).

**On PASS:** Append to this file:
```
### Item 2 — Perceptual confirmation
- Status: PASS — 2026-MM-DD
- Method: Chrome incognito on macOS at /specimen + /
- Observations: warm-paper background, near-black ink, no FOUT/FOIT on Inter 124px, hairlines visible, system dark-mode does not switch the palette, homepage renders cleanly via v1.0 alias bridge
```

**On FAIL:** Record the observed defect verbatim. Most likely issue would be FOUT (Inter falling back to a system font before loading) — fix is to add `display: 'swap'` to the `next/font/google` Inter config in `src/app/layout.tsx`.

---

## Resolution

(append PASS/FAIL records here as items are discharged)
