# Resume Handoff — v3.0 Dark Brutalist Rebuild

**Saved:** 2026-06-18
**Branch:** `claude/phase-8-resume` (v3 branch not yet created)

## Where we are

**Milestone v3.0 "Dark Brutalist Rebuild" is initialized and committed.**
- `.planning/PROJECT.md` — Current Milestone = v3.0 (v2.0 moved to Previous).
- `.planning/REQUIREMENTS.md` — 21 requirements (DS / HD / TD / PG / IN / DQ).
- `.planning/ROADMAP.md` — 5 phases, 14–18:
  - **14** Branch & Crimson Poster Foundation
  - **15** Slide-Deck Homepage & 3D Hero
  - **16** Interior Pages on Notion Data (incl. new /uses, /watching)
  - **17** Infra Preservation & SEO Extension
  - **18** QA, Perf Gate & Alias Swap
- `.planning/STATE.md` — milestone switched to v3.0, status planning.

**Design is fully specified by a committed clickable prototype** (the source of truth to port from):
- `.planning/sketches/002-full-site-model/` — open `index.html`; `assets/site.css` + `assets/site.js` are the reference implementation; 11 pages incl. `watching.html`.
- `.planning/sketches/themes/default.css` — locked **Crimson Poster** tokens.
- `.planning/sketches/MANIFEST.md` — all locked design decisions.

**Locked design (Crimson Poster):** crimson-orange field `#d93c1e`; display type in the SAME crimson lifted by a hard BLACK shadow (`--sig` / `--sig-shadow`, `0.055em` offset); outline variant = black stroke; black is the only accent; near-black supporting text; NO gradients. Space Grotesk (display) + JetBrains Mono (labels). Homepage = CHOMP-style wheel slide deck (one gesture = one slide, fresh-gesture detection, 820ms reversal-bypass cool-down, static background) with a near-black glossy morphing 3D object (R3F) that spawns right and flies in from the left per slide. Deck mechanic ported from `~/PrometheusUltra/Client Projects/Chomp/components/Slideshow.tsx`.

**Scope boundary:** PRESENTATION-LAYER rebuild only. KEEP Notion pipeline, image proxy routes, SEO infra (sitemap/robots/feed/JSON-LD), Umami, Notion render components. Delivery: long-lived `v3` branch → Vercel preview → promote prod alias at parity (never `--prebuilt --prod`; watch alias drift).

**User's stated top priority:** "the graphics" — the 3D object + visual fidelity (Phase 15).

## Phase 14 status (IN PROGRESS — planning, no PLAN.md yet)

- `.planning/phases/14-branch-crimson-poster-foundation/14-CONTEXT.md` — committed. Decisions D-01..D-09 locked:
  - Branch `v3` off the current branch (verified `main` is its ancestor, so it carries live code + all v3 planning/sketches). Own Vercel preview; prod untouched until Phase 18 swap.
  - Replace `src/app/globals.css` `@theme` warm-paper tokens with Crimson Poster; drop v2 light/dark (next-themes); signature shadow as a reusable token/utility.
  - Fresh v3 primitive components ported from the prototype; keep old `src/components/editorial/*` + `home-v2/*` until Phase 16, then delete.
  - Swap Inter → Space Grotesk + JetBrains Mono via `next/font/google` in `src/app/layout.tsx`.
  - Deliver a primitives showcase route.
- Plan-phase gate decisions made: **skip research** (port of known prototype on existing stack), **skip ui-phase** (prototype + MANIFEST + CONTEXT ARE the UI contract), run pattern-mapper + plan-checker.
- Was interrupted right after kicking off the pattern-mapper. No `14-PATTERNS.md`, no `14-PLAN.md` written yet.

## Next step

Continue Phase 14 planning, then execute. Either:
- `/gsd-plan-phase 14` (skip research; treat the prototype as the UI contract — no ui-phase), then `/gsd-execute-phase 14`; or
- Skip the ceremony and build Phase 14 directly from `14-CONTEXT.md` + the prototype (branch + crimson tokens + fonts + primitives + showcase).

After 14, the high-value work is **Phase 15** (the slide deck + R3F 3D object) — the "graphics" the user cares most about.
