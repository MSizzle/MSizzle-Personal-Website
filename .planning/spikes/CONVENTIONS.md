# Spike Conventions

Patterns established while spiking the WebGL homepage. New spikes + the real build follow these unless the question requires otherwise.

## Stack
- **Next.js 16.2.1 (App Router, Turbopack)** — NOT 15.x (CLAUDE.md is stale). React 19.
- 3D: **three 0.184 + @react-three/fiber 9.6** (already in the project from Phase 15). Postprocessing via **@react-three/postprocessing**.
- Smooth scroll: **lenis 1.3** (already in the project).

## Hard rules learned (perf + Next 16)
- **`dynamic(() => import(...), { ssr:false })` must live in a `"use client"` component.** Calling it inside a Server Component hard-fails the Next 16 build. Pattern: `page.tsx` (server) → imports `*-loader.tsx` (`"use client"`, owns the `dynamic()` call) → loads the R3F canvas.
- **LCP = SSR'd text or static poster, never the canvas.** Keep the canvas out of SSR markup.
- **WebGL is desktop-only.** Gate behind desktop + `pointer:fine`; mobile/`pointer:coarse`/small-viewport/reduced-motion/no-WebGL2 → static poster. (Reuse deck-homepage gate + `useWebGLSupport` + `FallbackPoster`.)
- **Defer canvas mount until after LCP / on idle**, not at hydration.
- **Push per-vertex morph to a GPU vertex shader** — avoid per-frame JS `computeVertexNormals` on the main thread.
- The three.js stack is ~885 kB raw / 231 kB gzip in a deferred chunk; ~5.4 s scripting on throttled mobile. Acceptable on desktop (deferred, 0 First-Load-JS), unacceptable to execute on mid-tier mobile.

## Measurement
- Bundle: derive First Load JS from `.next/.../build-manifest.json` (Turbopack route table omits it).
- Lighthouse: `npx -y lighthouse <url> --only-categories=performance --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox"`.
- FPS: headless/desktop FPS is misleading (vsync-capped) — confirm on a real mid-tier Android.

## Structure
- Experimental spike code on a throwaway branch (`spike/<name>`), never merged. Persisted knowledge in `.planning/spikes/NNN-*/README.md` + this file on the working branch.
