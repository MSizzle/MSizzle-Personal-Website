# Spike Manifest

## Idea
De-risk the validated WebGL homepage direction (sketches 003–005): can a Lusion-grade WebGL homepage ship within this project's perf budget (Vercel free tier + the mobile LCP/PSI gates already won) in the real Next.js / React Three Fiber stack? Presentation-layer only — all existing infra (Notion pipeline, SEO, analytics, RSS, image proxy) stays untouched.

## Requirements (non-negotiable for the real build — emerged from spike 001)
- **LCP must be SSR'd text** (the `<h1>`) or a static poster — NEVER the WebGL `<canvas>`. (Confirmed: text LCP observed at 740 ms.)
- **WebGL canvas = `dynamic(() => import(...), { ssr:false })` wrapped in a `"use client"` loader.** Next.js 16 HARD-FAILS the build if `dynamic({ssr:false})` is called directly inside a Server Component.
- **Mobile gets the static poster, NOT WebGL.** Gate the canvas behind desktop + `pointer:fine` (reuse the deck-homepage `(pointer:coarse)||innerWidth<760` gate). The three.js stack costs ~5.4 s of mobile scripting → perf 41 / TBT 5 s if run on mid-tier phones.
- **Defer canvas mount until after LCP** (requestIdleCallback / IntersectionObserver), not at hydration, so the ~885 kB three chunk never competes with first paint.
- **Move the blob morph to the GPU** (vertex-shader displacement) instead of per-frame JS loop + `computeVertexNormals` — protects FPS on real devices.
- **Keep postprocessing minimal** (Bloom; lazy-load it; drop/trim Noise+Vignette if they cost too much of the ~335 kB gzip deferred payload).
- **Static poster asset `public/hero-blob-poster.webp` must be produced** (still missing) — it is the mobile + fallback hero.
- **Reduced-motion / no-WebGL2 → poster** (already works; reuse `useWebGLSupport` + `FallbackPoster` from Phase 15).
- **Confirm on a Vercel preview (PSI mobile)** once the real build with these cuts exists.

## Stack reality check
Repo is **Next.js 16.2.1 (Turbopack)**, not 15.2.x as CLAUDE.md states. Turbopack's build route table does not print First Load JS; sizes were derived from `build-manifest.json`.

## Spikes

| # | Name | Type | Validates | Verdict | Tags |
|---|------|------|-----------|---------|------|
| 001 | webgl-homepage-perf | standard (4 probes) | Can a WebGL homepage hit the Vercel free-tier + mobile LCP/PSI budget in the real Next/R3F stack? | **GO-WITH-CUTS** | webgl, threejs, r3f, perf, lcp, lighthouse, bundle, fallback |

Experimental code lives on throwaway branch `spike/webgl-perf` (commits b360114, 7d76729) — not merged.
