---
spike: 001
name: webgl-homepage-perf
type: standard
validates: "Given the real Next 16 / R3F app, when a postprocessed WebGL hero renders on an isolated route with the canvas dynamically imported (ssr:false), then the route stays within the project's mobile LCP/PSI + bundle budget"
verdict: GO-WITH-CUTS
related: []
tags: [webgl, threejs, r3f, perf, lcp, lighthouse, bundle, fallback, nextjs16]
---

# Spike 001: WebGL Homepage Perf

## What This Validates
Can a Lusion-grade WebGL homepage (sketch 005 fidelity) ship within the Vercel free-tier + mobile LCP/PSI budget in the real Next.js 16 / React Three Fiber stack? Four probes, risk-ordered.

## How It Was Run
Throwaway branch `spike/webgl-perf` off `v3`. Added `@react-three/postprocessing` + `postprocessing`; built an isolated `/spike-webgl` route reusing Phase 15's `HeroBlob`/`HeroBlobCanvas`/`FallbackPoster`. Text `<h1>` as intended LCP; canvas via `dynamic({ssr:false})` behind a `"use client"` loader; Bloom+Noise+Vignette; Lenis scroll-dolly; reduced-motion/no-WebGL2 fallback. Measured with `next build` (bundle), headless mobile Lighthouse (LCP), puppeteer-CDP rAF sampling (FPS), and vitest (fallback). Experimental code is on the branch; this doc is the persisted knowledge.

## Results (measured)

### Probe 001 — bundle/build cost — PASS
- Build succeeds (after the Next 16 fix below).
- `/spike-webgl` First Load JS: **167.4 kB gzip — identical to baseline `/about` & `/links`.** The WebGL hero adds **0 kB First Load JS** (it's `dynamic({ssr:false})`).
- Deferred async payload (loads after hydration): **~335 kB gzip / ~1,134 kB raw**, largest chunk 885 kB raw / 231 kB gzip = three core + fiber + postprocessing.
- Verdict: the *bundle architecture* is correct — cost is fully deferred. The risk is the deferred chunk's **execution**, not initial bytes.

### Probe 002 — mobile LCP (local Lighthouse, simulated throttle) — FAIL on gate / architecture CONFIRMED
- `/spike-webgl`: **perf 41 · LCP 6077 ms · TBT 5065 ms · CLS 0 · SI 4355 ms · FCP 2739 ms**.
- Baseline `/about`: **perf 97 · LCP 2684 ms · TBT 14 ms**.
- **LCP element = the text `<h1>` (confirmed)**: observed FCP == observed LCP == 740 ms (same node); SSR HTML contains the `<h1>` and zero `<canvas>` (curl-verified).
- Cause: bootup attributes **~5.4 s of scripting** to the 885 kB three chunk on throttled mobile; Lighthouse's simulation models that main-thread contention as delaying LCP and inflating TBT.
- Conclusion: architecture is right (text LCP, 0 First-Load-JS, deferred canvas) but **running three.js on mid-tier mobile blows the budget**.

### Probe 003 — runtime FPS under throttle — PARTIAL
- puppeteer-core → system Chrome, mobile viewport, 4x CPU throttle (verified 3.03x via busy-loop). Idle/scroll FPS pinned ~120 (vsync-capped desktop GPU) — **not a trustworthy mobile proxy**.
- Real mobile risk is startup cost (probe 002), not steady FPS. Watch item: per-frame `computeVertexNormals` on the main thread. **Needs real mid-tier Android confirmation.**

### Probe 004 — reduced-motion / no-WebGL fallback — PASS
- vitest 2/2 green: WebGL2 `getContext`→null renders poster `<img>`, no `<canvas>`; `prefers-reduced-motion`→poster, no canvas. Gate = (WebGL2 AND not reduced-motion) else poster.

## Investigation Trail / Surprises
- **Next 16 build hard-fails** on `dynamic({ssr:false})` inside a Server Component ("`ssr: false` is not allowed with next/dynamic in Server Components"). Fix: call `dynamic()` in a tiny `"use client"` loader and import that from the server page. (Spike caught this exactly as intended.)
- Repo is **Next.js 16.2.1 (Turbopack)**, not 15.2.x (CLAUDE.md is stale). Turbopack route table omits First Load JS → derived from `build-manifest.json`.
- Headless/desktop FPS is misleading for this workload; **startup cost is the mobile killer**, not frame rate.

## Go/No-Go: GO-WITH-CUTS
Desktop can ship the full WebGL hero (text stays LCP, 0 First-Load-JS). **Mobile MUST fall back to the static poster.** Required cuts for the real build:
1. **No WebGL on mobile** — gate canvas behind desktop + `pointer:fine`; serve the poster on phones (removes the 5.4 s mobile scripting hit). Reuse deck-homepage's existing gate.
2. **Defer canvas mount until after LCP / on idle** (requestIdleCallback or IntersectionObserver), not at hydration.
3. **GPU vertex-shader displacement** for the blob morph (drop per-frame JS loop + `computeVertexNormals`).
4. **Trim postprocessing** — Bloom only if possible; lazy-load; reconsider Noise/Vignette.
5. **Produce `public/hero-blob-poster.webp`** (mobile + fallback hero).
6. **Confirm on Vercel preview PSI mobile** once the cut-down real build exists.
