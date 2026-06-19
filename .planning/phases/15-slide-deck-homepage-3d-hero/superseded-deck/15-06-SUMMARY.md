---
plan: 15-06
status: closed-superseded
date: 2026-06-18
---

# 15-06 Summary — Closed (Superseded)

**Outcome: the slide-deck homepage direction was superseded before this plan completed.**

## What happened
- **Task 1 (automated gate) — DONE.** Full vitest suite (44) green + `next build` clean; VALIDATION.md set to `ready-for-manual-verification`, verification map all green. Commit `0a9a69f`.
- **Task 2 (human-verify checkpoint) — NOT done.** Before the manual deck QA + poster capture, the user reviewed the deck and pivoted the homepage away from the CHOMP slide deck toward an expansive WebGL "explorative scroll-story" (Lusion-grade).
- **Task 3 (poster commit + phase closeout) — superseded** by the re-scope below.

## Why
Red-on-red ("Crimson Poster") hurt legibility and the discrete slide deck didn't match the desired "wandering" feel. New direction validated through sketches 003–005 (`.planning/sketches/`) and de-risked by perf spike 001 (`.planning/spikes/`, verdict GO-WITH-CUTS). See memory [[homepage-webgl-direction]].

## Carry-forward (reusable, NOT thrown away)
- R3F primitives from 15-02/15-03/15-04: `HeroBlob`, `HeroBlobCanvas`, `FallbackPoster`, WebGL2 detection — feed directly into the WebGL homepage.
- Section *content* (Building/Writing/Doing big-list, Prometheus, newsletter, footer) carries forward.
- The still-needed `public/hero-blob-poster.webp` (mobile + fallback hero) moves into the re-scoped phase.
- Superseded as the homepage: the CHOMP deck controller + slides-as-deck navigation.

## Disposition
Phase 15 is **re-scoped in place** to "WebGL Explorative Homepage" (keeps the homepage slot; avoids renumbering Phases 16–18). The deck plan artifacts are archived under `superseded-deck/`. The new direction will be defined via discuss-phase → plan-phase.
