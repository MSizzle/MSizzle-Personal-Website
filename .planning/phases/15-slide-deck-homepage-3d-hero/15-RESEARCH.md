# Phase 15: WebGL Explorative Homepage (v1 slice) — Research

**Researched:** 2026-06-19
**Domain:** React-Three-Fiber / WebGL, GPU vertex-shader morph, Lenis scroll sync, Next.js 16 after-LCP mount, static-poster capture, Tailwind v4 palette swap
**Confidence:** HIGH (core stack verified against npm registry + official docs + spike 001 measured results)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Palette = near-black `#0a0a0a` canvas, off-white `#f5f5f0` name, crimson `#e23838` as a sparing accent only (line/rim/hover). NO red-on-red. Theme reference: `themes/crimson-line.css`.
- **D-02:** Real WebGL hero (three + R3F + @react-three/postprocessing): PBR/clearcoat, RoomEnvironment IBL, crimson rim light, bloom (+ optional grain/vignette, trimmed).
- **D-03:** Perf cuts (spike 001, non-negotiable): desktop-only WebGL; canvas `dynamic({ssr:false})` inside a `"use client"` loader (Next 16 requirement); mount canvas AFTER LCP (idle/IntersectionObserver); LCP = SSR'd text/poster, never the canvas; GPU vertex-shader morph (no per-frame JS `computeVertexNormals`); trim/lazy postprocessing.
- **D-04:** Mobile / pointer:coarse / small-screen / reduced-motion / no-WebGL2 → static poster `public/hero-blob-poster.webp` (no canvas). Reuse `FallbackPoster` + WebGL2 detection.
- **D-05 (REC):** v1 = WebGL hero (procedural stand-in) + scroll-cue + section beats + fallback poster.
- **D-06 (REC):** Wandering feel via generous negative space + expansive scroll + live hero.
- **D-07 (REC):** Reuse existing `HeroBlob` morphing blob as procedural stand-in (migrated to GPU vertex-shader).
- **D-08 (REC):** Frame it on a simple podium.
- **D-09 (REC):** Include scroll-cue (object scales / camera dollies on scroll via Lenis).
- **D-10 (REC):** Defer fluid line to v2.
- **D-11 (REC):** Start v2 with SVG-overlay line.
- **D-12 (REC):** Section beats: Building, Writing, Newsletter, Footer.
- **D-13 (REC):** Homepage content static/curated in v1; Notion-wiring is Phase 16.
- **D-14 (REC):** Minimal lightweight header/nav; footer as closing scroll beat.
- **D-15:** Asset workstream parallel and non-blocking.

### Claude's Discretion
- Exact component structure, R3F scene graph, postprocessing pass selection/tuning, scroll-cue easing, and how `useLenisControl` integrates — planner/executor decide within D-01..D-15.

### Deferred Ideas (OUT OF SCOPE)
- Fluid interweaving line (v2).
- "Watching"/YouTube gallery + zoom-through (v3).
- Real voxel-Monty + horse GLB models (swap-in later).
- Cyan/cool hologram tint variant.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TD-01 | Morphing near-black glossy 3D object (R3F) with crimson rim, autonomous animation | GPU vertex-shader morph via `three-custom-shader-material`; PBR/clearcoat + RoomEnvironment IBL; crimson rim light |
| TD-02 | Object lazy-loaded (off LCP critical path), degrades to static fallback | After-LCP idle mount pattern; `dynamic({ssr:false})` in "use client" loader; WebGL2 + pointer:coarse gate |
| TD-03 | Degrades to static fallback when WebGL unavailable or reduced-motion | `FallbackPoster` carry-forward; `useWebGLSupport` hook; `public/hero-blob-poster.webp` produced by Playwright |
| HD-04 | Big-type index ("Building / Writing / Newsletter") linking to sections | `BigList` v3 primitive carry-forward from slide-index; expansive scroll layout |
| HD-05 | Touch and small screens fall back to native vertical scroll (no WebGL) | Existing gate: `(pointer:coarse) OR innerWidth<760`; poster shown; carry-forward from deck-homepage |
</phase_requirements>

---

## Summary

Phase 15 v1 delivers the homepage as an expansive scroll-story: a real-time WebGL hero on desktop, section beats (Building / Writing / Newsletter / Footer), and a static-poster path for mobile and fallback scenarios. The 3D stack (`three@0.184`, `@react-three/fiber@9.6`) is already installed. Two new deps are needed: `@react-three/postprocessing@3.0.4` (bloom) and `three-custom-shader-material@6.4.0` (GPU morph) — both are compatible with the installed versions.

**Primary recommendation:** Migrate `HeroBlob` from per-frame JS `computeVertexNormals` to a GPU vertex-shader displacement via `three-custom-shader-material`, preserving all PBR/clearcoat/IBL/rim behavior. Mount the canvas after LCP using `requestIdleCallback` inside the existing "use client" loader pattern. Capture the poster with Playwright after the live canvas is stable.

The two highest-risk items are: (1) the `globals.css` palette swap from Crimson Poster (`#d93c1e` bg) to Crimson Line (`#0a0a0a` bg) — this touches every existing v3 component and must go in Wave 0; (2) the poster asset `public/hero-blob-poster.webp` which does not exist yet and blocks the FallbackPoster from rendering correctly.

---

## Project Constraints (from CLAUDE.md)

- **CMS:** Notion — untouched in this phase.
- **Hosting:** Vercel free tier — perf budget enforced (PSI mobile gate in Phase 18).
- **Analytics:** Umami at `analytics.montysinger.com` — untouched in this phase.
- **Motion package:** Import from `motion/react` (rebranded from framer-motion).
- **No em dashes in copy.** No location, no Georgetown details. Sole professional identity: Founder of Prometheus.
- **Next.js 16.2.1 (Turbopack), NOT 15.x** — CLAUDE.md root is stale; trust package.json.
- **Tailwind v4** — `@theme inline` in `globals.css`, no `tailwind.config.js`.
- **`dynamic({ssr:false})` must live in a `"use client"` file** — Next 16 hard-fails otherwise.
- **`fetchPriority="high"` must be set explicitly on the LCP `<Image>`** — Next 16 does not auto-emit it.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Palette / design-token swap | Browser / Client | — | `globals.css` `@theme` tokens control all utility classes; palette affects every component |
| LCP text block ("MONTY SINGER" heading) | Frontend Server (SSR) | — | Must be in SSR HTML; cannot be client-only or inside canvas |
| WebGL canvas hero | Browser / Client | — | `dynamic({ssr:false})` deferred; never SSR'd; desktop-only |
| Mobile/fallback poster | Frontend Server (SSR) | — | `FallbackPoster` is a Server Component with `<Image priority>` |
| Scroll-driven camera dolly / scale | Browser / Client | — | Reads Lenis progress in `useFrame`; pure client RAF |
| Postprocessing (Bloom) | Browser / Client | — | `EffectComposer` inside R3F Canvas; never SSR'd |
| Section beats (Building / Writing / Newsletter / Footer) | Frontend Server (SSR) | Browser / Client (Motion reveal) | Server Components for content; optional client-side scroll-reveal |
| Poster capture (`hero-blob-poster.webp`) | Build-time tool (Playwright) | — | One-off capture step; outputs to `public/` |
| After-LCP idle mount gate | Browser / Client | — | `requestIdleCallback` / `IntersectionObserver` in loader component |

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Verified |
|---------|---------|---------|----------|
| three | 0.184.0 | WebGL renderer, geometry, materials | [VERIFIED: npm registry] — `npm view three version` → `0.184.0` |
| @react-three/fiber | 9.6.1 | React renderer for three.js | [VERIFIED: npm registry] — `npm view @react-three/fiber version` → `9.6.1` |
| lenis | 1.3.21 | Smooth scroll, RAF sync | [VERIFIED: npm registry] — in `package.json` |
| motion | 12.38.0 | Page transitions, `useReducedMotion` | [VERIFIED: npm registry] — in `package.json` |
| gsap | 3.14.2 | Ticker drives Lenis RAF; `ScrollTrigger` | [VERIFIED: npm registry] — in `package.json` |

### New Dependencies Required

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @react-three/postprocessing | 3.0.4 | EffectComposer, Bloom (+ optional Noise/Vignette) | Official pmndrs postprocessing wrapper for R3F; peer deps satisfied: `@react-three/fiber ^9`, `three >= 0.156.0`, `react ^19` |
| three-custom-shader-material | 6.4.0 | GPU vertex-shader displacement morph, keeps PBR/clearcoat/IBL | The standard pattern for injecting GLSL into MeshPhysicalMaterial without `onBeforeCompile` string hacking; peer deps: `three >= 0.159`, `react >= 18`, `@react-three/fiber >= 8` |

**Peer-dep compatibility verified:**
- `postprocessing@6.39.1` requires `three >= 0.168.0 < 0.185.0` — three@0.184 satisfies this (0.184 < 0.185). [VERIFIED: npm registry]
- `@react-three/postprocessing@3.0.4` requires `@react-three/fiber ^9.0.0`, `react ^19.0`, `three >= 0.156.0`. [VERIFIED: npm registry]
- `three-custom-shader-material@6.4.0` requires `three >= 0.159`, `react >= 18`, `@react-three/fiber >= 8`. [VERIFIED: npm registry]

**Installation:**
```bash
npm install @react-three/postprocessing three-custom-shader-material
```

**Version verification:**
```
@react-three/postprocessing: 3.0.4 (latest, published 2025-02-20)
postprocessing (bundled dep): 6.39.1
three-custom-shader-material: 6.4.0 (latest, published 2025-10-12)
```

---

## Package Legitimacy Audit

> slopcheck was blocked by auto-mode sandbox. All packages are tagged by manual verification via npm registry + official GitHub repos.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| @react-three/postprocessing | npm | ~5 yrs | Very high (pmndrs org) | github.com/pmndrs/react-postprocessing | Not run — [CITED: npmjs.com/@react-three/postprocessing] | Approved — pmndrs official, long-lived |
| three-custom-shader-material | npm | ~3 yrs | Moderate | github.com/FarazzShaikh/THREE-CustomShaderMaterial | Not run — [CITED: npmjs.com/three-custom-shader-material] | Approved — well-documented, TypeScript, widely referenced in community |

**Packages removed:** none.
**Packages flagged:** none. Both are well-known in the three.js/R3F ecosystem with official GitHub source repos.

*Because slopcheck could not run, treat both packages as `[ASSUMED: npm registry + GitHub]`. Planner should add a `checkpoint:human-verify` before install if desired.*

---

## Architecture Patterns

### System Architecture Diagram

```
Browser Request
      |
      v
page.tsx (Server Component, SSR)
  |-- JSON-LD schema (SSR inline)
  |-- <ExplorativeHomepage /> (Client boundary)
        |
        |-- SSR path (first paint):
        |     LCP: <h1>MONTY SINGER</h1>  [text, ~740ms observed]
        |     FallbackPoster (if mobile/coarse/reduced-motion/no-WebGL2)
        |     Section beats: Building, Writing, Newsletter, Footer
        |
        |-- After LCP / idle:
              CanvasLoader (dynamic, ssr:false)
                |-- requestIdleCallback fires
                |-- gate: desktop && pointer:fine && !reducedMotion && webglOk
                |-- <HeroBlobCanvas /> mounts
                      |-- R3F Canvas
                      |   |-- HeroBlob (GPU shader morph)
                      |   |   |-- CustomShaderMaterial (MeshPhysicalMaterial base)
                      |   |   |-- RoomEnvironment IBL
                      |   |   |-- Crimson rim light
                      |   |-- Podium mesh
                      |   |-- EffectComposer
                      |       |-- Bloom
                      |       |-- [Noise/Vignette: optional, trim if budget tight]
                      |
                      |-- Scroll-cue driver
                            lenis.progress --> useFrame --> camera.position.z / object.scale

Mobile / fallback path:
  globals.css gate: (pointer:coarse) OR innerWidth<760 OR reducedMotion OR !webglOk
       |
       v
  FallbackPoster (SSR <Image priority fetchPriority="high">)
  Section beats in native vertical scroll
```

### Recommended Project Structure

The superseded `src/components/home-deck/` directory will be replaced with a new `src/components/home/` directory. The deck-specific files (deck-controller, slide-*, DeckHomepage) are superseded; the reusable files (hero-blob, hero-blob-canvas, fallback-poster) are migrated.

```
src/
├── app/
│   └── page.tsx                    # Server Component shell (unchanged pattern)
├── components/
│   ├── home/                       # NEW — v1 WebGL homepage
│   │   ├── explorative-homepage.tsx        # "use client" orchestrator (gate + layout)
│   │   ├── canvas-loader.tsx               # "use client" dynamic({ssr:false}) wrapper
│   │   ├── hero-blob-canvas.tsx            # R3F Canvas + lights (migrated + postprocessing)
│   │   ├── hero-blob.tsx                   # HeroBlob with GPU shader (migrated)
│   │   ├── hero-podium.tsx                 # Simple podium disc mesh
│   │   ├── fallback-poster.tsx             # Migrated from home-deck (unchanged)
│   │   ├── section-building.tsx            # Building beat
│   │   ├── section-writing.tsx             # Writing beat
│   │   ├── section-newsletter.tsx          # Newsletter beat
│   │   └── section-footer.tsx              # Footer beat (or reuse shared InkFooter)
│   └── home-deck/                  # SUPERSEDED — left in place for git history
├── __tests__/
│   └── home/
│       ├── hero-blob.test.tsx              # GPU morph scene graph (carry forward pattern)
│       ├── use-webgl-support.test.ts       # Carry forward, path update only
│       ├── explorative-homepage.test.tsx   # Fallback gate + mount behavior
│       └── fallback-poster.test.tsx        # FallbackPoster renders <Image>
└── app/
    └── globals.css                 # Palette swap (Wave 0 blocker)
```

**Note on `home-deck/`:** Do not delete — git history is valuable. The page.tsx import will switch from `home-deck/deck-homepage` to `home/explorative-homepage`.

---

## Pattern 1: Globals.css Palette Swap (Wave 0 Blocker)

**What:** The current `globals.css` `@theme inline` block uses the old Crimson Poster palette (`--color-bg: #d93c1e`, `--accent: #0a0503`, `--color-text: #120604`). The new Crimson Line palette reverses this.

**New tokens (from `themes/crimson-line.css`):**
```css
/* globals.css — @theme inline replacement */
@theme inline {
  /* Canvas */
  --color-bg:             #0a0a0a;
  --color-bg-2:           #0d0d0f;
  --color-surface:        #141416;
  --color-border:         rgba(245,245,240,0.10);
  --color-border-strong:  rgba(245,245,240,0.22);

  /* Ink — off-white */
  --color-text:           #f5f5f0;
  --color-text-dim:       #b6b6b0;
  --color-text-muted:     #6f6f6a;

  /* Accent — crimson SPARINGLY */
  --accent:               #e23838;
  --accent-hover:         #ff4d4d;
  --accent-deep:          #b51d1d;
  --accent-glow:          rgba(226,56,56,0.40);

  /* Blob */
  --blob-core:            #161617;
  --blob-rim:             #e23838;

  /* Type scale (unchanged) */
  --text-xs: 0.72rem; --text-sm: 0.85rem; --text-base: 1rem; --text-lg: 1.2rem;
  --text-xl: 1.6rem; --text-2xl: 2.2rem; --text-3xl: 3.2rem;
  --text-mega: clamp(3.5rem, 16vw, 16rem);

  /* Fonts (unchanged) */
  --font-display: var(--font-space-grotesk);
  --font-sans:    var(--font-space-grotesk);
  --font-mono:    var(--font-jetbrains-mono);
}

/* Sig vars: name in off-white, hard shadow in crimson-deep for contrast */
:root {
  --sig:        var(--color-text);         /* off-white fill */
  --sig-shadow: 0.055em 0.055em 0 var(--accent-deep);  /* crimson shadow */
}
```

**Pitfall:** The existing `.sig` / `.sig-out` classes are used by other pages (v3-specimen, possibly). After the swap, `.sig` renders off-white text on near-black — which is correct. The `.sig-out` outline uses `--accent` (now crimson) as the stroke — also correct. Existing pages on the v3 branch must be reviewed visually after the swap since they were built for the Crimson Poster palette.

---

## Pattern 2: GPU Vertex-Shader Displacement Morph (HeroBlob Migration)

**What:** Replace the per-frame JS loop in `hero-blob.tsx` (lines 43-59, plus `computeVertexNormals()` on line 60) with a GPU vertex shader. The current JS loop runs on the main thread every frame — on throttled mobile this contributes to the measured 5.4s scripting time.

**Approach:** `three-custom-shader-material` (CSM) — wraps `MeshPhysicalMaterial` with injectable GLSL, preserving clearcoat + IBL + all PBR uniforms. [CITED: github.com/FarazzShaikh/THREE-CustomShaderMaterial]

**Why CSM over `onBeforeCompile`:** `onBeforeCompile` requires string-patching three.js internal shader chunks, which breaks across three.js versions and is fragile. CSM provides stable output variables (`csm_Position`, `csm_Normal`) that work with any base material. [CITED: tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere]

**Geometry requirement:** The icosphere used by `HeroBlob` (`IcosahedronGeometry(1.3, 12)`) must have tangents computed for the normal recalculation pattern to work. Call `geometry.computeTangents()` after creation.

**GLSL pattern for sine-sum displacement with corrected normals:**
```glsl
// vertexShader string passed to CustomShaderMaterial
uniform float uTime;

float sineDisplace(vec3 p) {
  return
    sin(p.x * 2.0 + uTime * 1.6) +
    sin(p.y * 2.3 + uTime * 1.2) +
    sin(p.z * 2.1 + uTime * 1.9);
}

void main() {
  float n   = sineDisplace(position);
  float d   = 1.3 + n * 0.11;
  float len = length(position);

  // Displaced position
  csm_Position = (position / len) * d;

  // Normal recalculation via tangent/bitangent neighbors
  float shift = 0.001;
  vec3 tangentDir  = tangent.xyz;
  vec3 biTangent   = cross(normal, tangentDir);

  vec3 posA = position + tangentDir * shift;
  vec3 posB = position + biTangent  * shift;
  float dA  = 1.3 + sineDisplace(posA) * 0.11;
  float dB  = 1.3 + sineDisplace(posB) * 0.11;
  posA = (posA / length(posA)) * dA;
  posB = (posB / length(posB)) * dB;

  vec3 toA = normalize(posA - csm_Position);
  vec3 toB = normalize(posB - csm_Position);
  csm_Normal = normalize(cross(toA, toB));
}
```

**React/R3F integration pattern:**
```tsx
// Source: [CITED: github.com/FarazzShaikh/THREE-CustomShaderMaterial]
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

const mat = useMemo(() => new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader: BLOB_VERT,
  uniforms: { uTime: { value: 0 } },
  // PBR props pass through to MeshPhysicalMaterial:
  color: 0x140805,
  metalness: 0.6,
  roughness: 0.18,
  clearcoat: 0.9,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1.2,
}), []);

useFrame(({ clock }) => {
  mat.uniforms.uTime.value = clock.getElapsedTime();
  // autonomous rotation still in JS (cheap — just quaternion update)
  meshRef.current.rotation.y += 0.0035;
  meshRef.current.rotation.x = Math.sin(mat.uniforms.uTime.value * 0.3) * 0.22;
});
```

**What to keep in JS (cheap):** autonomous rotation (`mesh.rotation.y +=`). What to move to GPU (expensive when on mobile): vertex position + normal recalculation.

**Pitfall — indexed geometry required:** `IcosahedronGeometry` produces indexed geometry by default. If you call `geometry.toNonIndexed()` for any reason, you must also call `geometry.computeTangents()` again. The tangent attribute is required by the shader; missing it causes a black mesh.

**Pitfall — RoomEnvironment setup stays in `useMemo`:** The current `HeroBlob` sets `scene.environment` inside `useMemo`. This is correct — it runs once per mount. Do not move to `useFrame`.

---

## Pattern 3: After-LCP Canvas Mount (Next 16 + "use client" loader)

**What:** The canvas must mount AFTER the LCP text element has painted, not at hydration. Spike 001 confirmed text `<h1>` LCP at ~740ms; the ~885KB three chunk must not compete with this.

**Confirmed pattern from spike 001:**

```
page.tsx (Server Component)
  └── <CanvasLoader /> (imported — this crosses the client boundary)

// canvas-loader.tsx
"use client";
import dynamic from 'next/dynamic';

// dynamic() MUST be called in a "use client" file — Next 16 build hard-fails otherwise
const HeroBlobCanvas = dynamic(() => import('./hero-blob-canvas'), { ssr: false });

export function CanvasLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestIdleCallback defers until after LCP and first user interaction window
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => setMounted(true), { timeout: 3000 })
      : setTimeout(() => setMounted(true), 200); // Safari fallback

    return () => {
      typeof cancelIdleCallback !== 'undefined'
        ? cancelIdleCallback(id as number)
        : clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    };
  }, []);

  if (!mounted) return null;
  return <HeroBlobCanvas />;
}
```

**Why `requestIdleCallback` over IntersectionObserver here:** The hero canvas is in the viewport from the first scroll position. IntersectionObserver would fire immediately. `requestIdleCallback` defers until the browser's main thread is idle (after LCP paint + parse/execute), which is what we need. Provide a `{ timeout: 3000 }` fallback so it doesn't wait forever on busy devices.

**Safari caveat:** `requestIdleCallback` is not available on Safari (as of Safari 15.4). The `setTimeout(() => setMounted(true), 200)` fallback is sufficient — 200ms is past the point where the text LCP element has painted in virtually all cases.

**Where the gate lives:** The `explorative-homepage.tsx` orchestrator (not `canvas-loader.tsx`) owns the gate logic: `!isTouchOrSmall && !prefersReduced && webglOk`. The canvas-loader should only concern itself with the after-LCP timing. This keeps concerns separated:

```
explorative-homepage.tsx ("use client"):
  detects: isTouchOrSmall, prefersReduced, webglOk (on mount, in useEffect)
  renders: if (showCanvas) → <CanvasLoader />
           else → <FallbackPoster />
```

**Carry-forward:** The gate detection code from `deck-homepage.tsx` (lines 46-59) is verbatim correct. Reuse it in `explorative-homepage.tsx`.

---

## Pattern 4: Lenis Scroll Progress in R3F useFrame

**What:** Drive camera dolly and object scale from Lenis scroll progress inside R3F's `useFrame`.

**Lenis 1.x scroll progress API:** [CITED: github.com/darkroomengineering/lenis]
- `lenis.progress` — normalized 0-1 scroll completion
- `lenis.scroll` — pixel scroll position
- `lenis.on('scroll', (e) => { /* e is the lenis instance */ })` — event callback

**Problem:** R3F's `useFrame` runs in R3F's own RAF loop. Lenis runs in GSAP's ticker (confirmed in `lenis-provider.tsx` lines 26-37 — `gsap.ticker.add(tickerFn)`). They are already synced: GSAP ticker drives Lenis, GSAP ticker and R3F's RAF both run at display refresh rate. No additional sync needed.

**Pattern — read Lenis progress inside useFrame via ref:**
```tsx
// In HeroBlobCanvas or a scroll-cue child component
import { addEffect } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

// Option A (simpler) — read from a shared ref updated by lenis.on('scroll')
function ScrollCue() {
  const scrollProgress = useRef(0);
  const lenis = useLenisControl(); // existing context

  useEffect(() => {
    if (!lenis) return;
    // lenis.on is available on the lenis instance
    // useLenisControl returns { stop, start } — we need the raw lenis instance
    // → LenisProvider needs a small extension to expose lenis.progress
  }, [lenis]);

  useFrame(({ camera }) => {
    const p = scrollProgress.current;
    // camera dolly: pull back slightly as user scrolls
    camera.position.z = 4.4 + p * 1.2;
    // object scale down as scroll progresses (scroll-cue per D-09)
    if (blobRef.current) {
      blobRef.current.scale.setScalar(1.0 - p * 0.35);
    }
  });
}
```

**LenisProvider extension needed:** The existing `LenisProvider` exposes `{ stop, start }` but not the raw `lenis.progress`. Two options:
1. Extend `LenisControlContext` to include a `progress` getter ref (cleanest)
2. Use `addEffect` from `@react-three/fiber` to hook directly into R3F's loop and read `window.scrollY / (document.body.scrollHeight - window.innerHeight)` as a direct progress approximation (zero-dependency)

**Recommended:** Option 2 (addEffect) avoids touching the provider. Raw `scrollY / maxScroll` is accurate enough for the scroll-cue scale/dolly — Lenis's smoothed value is for CSS rendering; the underlying DOM scroll position is what we want for the 3D driver.

```tsx
// In hero-blob-canvas.tsx or a dedicated ScrollCueDriver component
import { addEffect } from '@react-three/fiber';

useEffect(() => {
  const cleanup = addEffect(() => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgressRef.current = maxScroll > 0
      ? Math.min(window.scrollY / maxScroll, 1)
      : 0;
  });
  return cleanup;
}, []);
```

**Pitfall:** Do NOT call `lenis.stop()` on the homepage in the new explorative layout. The old `deck-homepage.tsx` stopped Lenis because the deck controller owned wheel events directly. In the new scroll-story layout, Lenis IS the scroll controller — stopping it would break the entire page.

---

## Pattern 5: EffectComposer + Bloom (Postprocessing)

**What:** Add Bloom to the R3F canvas. Optional Noise + Vignette — trim if bundle/perf budget tightens.

**Import pattern:** [CITED: react-postprocessing.docs.pmnd.rs]
```tsx
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Inside R3F Canvas JSX:
<EffectComposer>
  <Bloom
    luminanceThreshold={0.85}
    luminanceSmoothing={0.9}
    intensity={0.6}
    radius={0.4}
  />
  {/* Trim these first if postprocessing is too heavy: */}
  <Noise opacity={0.04} premultiply />
  <Vignette eskil={false} offset={0.1} darkness={0.6} />
</EffectComposer>
```

**Bloom luminance note:** Bloom is selective by default. Materials with `toneMapped: false` and emissive values above `luminanceThreshold` will glow. The crimson rim light should be the primary bloom source — set rim light color to `#e23838` with intensity high enough to push luminance above threshold.

**Perf trim order** (from spike 001 guidance):
1. Start with Bloom only.
2. Add Noise only if FPS stays above 55fps on mid-tier device.
3. Add Vignette (cheapest) last.
4. If Bloom alone is too expensive, reduce `intensity` rather than removing.

**Lazy-loading postprocessing:** The entire `@react-three/postprocessing` is deferred with the canvas (inside `dynamic({ssr:false})`). The `~335 kB gzip` deferred chunk already includes postprocessing. No additional lazy-load step needed.

---

## Pattern 6: Poster Capture Workflow

**What:** Produce `public/hero-blob-poster.webp` — a static frame of the HeroBlob hero for mobile/fallback. This file currently does not exist, causing `FallbackPoster` to 404.

**Three capture approaches:**

**A. Playwright screenshot (recommended for this project):**
```bash
# Run after the dev server is running with the v1 WebGL hero
npx playwright screenshot http://localhost:3000 public/hero-blob-poster.png --viewport-size=800,800
# Convert to WebP
npx sharp-cli -i public/hero-blob-poster.png -o public/hero-blob-poster.webp --format webp --quality 85
```
Playwright is already installed (`v1.61.0`). This captures the full page-rendered output including post-processing.

**B. `gl.readPixels` via R3F `gl` object (programmatic, no browser launch):**
```tsx
// Add a one-time capture button in dev mode
const { gl } = useThree();

function captureFrame() {
  // Render one frame, then read
  gl.render(scene, camera);
  const canvas = gl.domElement;
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a'); a.href = url; a.download = 'hero-blob-poster.webp'; a.click();
  }, 'image/webp', 0.85);
}
```
This requires `preserveDrawingBuffer: true` on the Canvas `gl` prop (adds GPU memory cost — only enable in dev/capture mode).

**C. `canvas.toDataURL` (simplest):**
Same as B but returns a base64 string instead of a Blob — less efficient for large images.

**Recommended workflow:**
1. Build the v1 hero, run `next dev`.
2. Navigate to homepage, let the WebGL canvas settle (~2s).
3. Run Playwright `screenshot` command targeting the canvas element (`--selector "#hero-canvas-container"`).
4. Save to `public/hero-blob-poster.webp`.
5. Verify `FallbackPoster` renders it at the correct aspect ratio.

**FallbackPoster carry-forward:** `src/components/home-deck/fallback-poster.tsx` is correct as-is. The `fetchPriority="high"` + `priority` + `loading="eager"` combo is exactly right for Next 16's LCP quirk (confirmed in MEMORY.md). It needs only a path update when migrated to `src/components/home/`.

---

## Pattern 7: Section Beats Layout (HD-04, D-12)

**What:** Four content sections below the hero: Building, Writing, Newsletter, Footer. These are Server Components (no client JS needed). The "big-type index" for Building reuses the existing `<BigList>` primitive.

**Layout principle (sketch 004 / D-06):** Expansive negative space + generous vertical scroll spacing. Use `min-h-screen` or tall fixed-height sections. The "wandering" feel comes from spacing, not animation.

**Building section — HD-04:**
```tsx
// Reuse BigList v3 primitive from src/components/v3/big-list.tsx
// (same pattern as slide-index.tsx)
<BigList items={[
  { label: "Building", href: "/projects", tag: "WORKS" },
  { label: "Writing",  href: "/writing",  tag: "ESSAYS" },
  { label: "Newsletter", href: "/newsletter", tag: "SUBSCRIBE" },
]} />
```

**Palette note:** After the `globals.css` palette swap, BigList rows will invert to white text on near-black. The existing `list-row.tsx` component uses `--color-text` and `--accent` tokens — verify it reads correctly on dark background. May need hover style adjustment (border-bottom accent in crimson vs black).

**Header/nav (D-14):** The existing `<Navigation>` component (in `layout.tsx`) is shared across all pages. On the homepage, it renders fixed at top with `bg-[var(--bg)]`. After the palette swap, it will show near-black background — correct. The `ConditionalFooter` from `layout.tsx` may need to be suppressed on the homepage if the homepage has its own footer-beat section. The existing pattern is `ConditionalFooter` — verify whether it auto-suppresses on `/` already.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GPU vertex shader injection into MeshPhysicalMaterial | Custom `onBeforeCompile` string patching | `three-custom-shader-material` | String-patching breaks across three.js versions; CSM provides stable `csm_Position`/`csm_Normal` output variables that survive updates |
| Normal recalculation for displaced geometry | JS `computeVertexNormals()` per frame | GLSL tangent/bitangent neighbor method in vertex shader | JS version runs on main thread every frame; GPU version runs in parallel on all vertices simultaneously |
| Smooth scroll | Custom RAF scroll interpolation | Lenis (already installed, already driving GSAP ticker) | Lenis handles momentum, cancellation, accessibility, RAF sync |
| Postprocessing passes | Custom WebGL framebuffer + ping-pong | `@react-three/postprocessing` EffectComposer | Handles render order, depth texture, multi-pass composition correctly with R3F's render loop |
| Poster capture | Build-time three.js headless render | Playwright screenshot of live dev server | Captures actual postprocessing output (Bloom, tone-mapping) which headless three.js cannot reproduce |

---

## Runtime State Inventory

> This is a migration/replacement phase — existing homepage code is being replaced. The inventory is focused on what v3 branch state exists.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None relevant — homepage is static, no user data | None |
| Live service config | Umami at `analytics.montysinger.com` — already tracking `/` | None — untouched |
| OS-registered state | None | None |
| Secrets/env vars | `NOTION_TOKEN`, `NEXT_PUBLIC_UMAMI_*` in Vercel env — unchanged | None |
| Build artifacts / installed packages | `src/components/home-deck/` directory — superseded but NOT deleted (git history) | Update `page.tsx` import from `home-deck/deck-homepage` to `home/explorative-homepage`; leave home-deck files in place |
| globals.css palette | `--color-bg: #d93c1e` (Crimson Poster) — must change to `#0a0a0a` | Wave 0 blocker: update entire `@theme inline` block + `:root` sig vars before building new components |
| `public/hero-blob-poster.webp` | File does not exist | Must be captured during/after v1 hero is implemented (Playwright workflow, see Pattern 6) |

---

## Common Pitfalls

### Pitfall 1: `dynamic({ssr:false})` in a Server Component
**What goes wrong:** Next.js 16 hard-fails the build with `"ssr: false" is not allowed with next/dynamic in Server Components`.
**Why it happens:** App Router Server Components do not participate in client-side code-splitting; `dynamic()` is a client-side mechanism.
**How to avoid:** `dynamic()` must be called in a `"use client"` file (`canvas-loader.tsx`), which is imported by the server page. `page.tsx` → `explorative-homepage.tsx` (`"use client"`) → `canvas-loader.tsx` (`"use client"`, owns `dynamic()`).
**Warning signs:** Build-time error, not a runtime error. You'll see it immediately on `next build`.

### Pitfall 2: LCP regression from canvas
**What goes wrong:** The canvas mounts at hydration and the three.js chunk competes with LCP text parsing. Mobile PSI drops from ~97 to ~41.
**Why it happens:** The ~885 kB raw three chunk takes ~5.4s to parse+execute on throttled mid-tier mobile.
**How to avoid:** `requestIdleCallback` + `dynamic({ssr:false})` ensures the chunk is never fetched until after LCP paint. Confirm with `npx lighthouse` after each significant canvas change.
**Warning signs:** LCP element changes from `<h1>` to `<canvas>` in Lighthouse report, or LCP time exceeds 2.5s.

### Pitfall 3: Missing tangent attribute in GPU morph shader
**What goes wrong:** Black mesh or incorrect normals after migrating to CSM vertex shader.
**Why it happens:** The normal recalculation method requires the `tangent` attribute on the geometry. `IcosahedronGeometry` does not compute tangents by default.
**How to avoid:** After creating the geometry, call `geometry.computeTangents()`. If you switch to non-indexed geometry (e.g., for flat shading), call it again.
**Warning signs:** All-black mesh in the canvas, or normals pointing in wrong directions causing the IBL to look wrong (flat/matte despite high metalness/clearcoat).

### Pitfall 4: Lenis stopped on the homepage
**What goes wrong:** Smooth scroll stops working entirely after the canvas mounts; page appears to scroll normally but Lenis-driven inertia is absent.
**Why it happens:** The old `deck-homepage.tsx` called `lenis.stop()` to prevent Lenis from interfering with the deck controller's direct wheel handling. If this code is carried forward to the new explorative layout, Lenis never starts.
**How to avoid:** The new homepage does NOT stop Lenis. Remove all `lenis.stop()` / `lenis.start()` calls from the explorative homepage. Let Lenis run normally.
**Warning signs:** Scroll feels native (jerky on trackpad) instead of smooth; the section beats scroll without inertia.

### Pitfall 5: Globals.css palette swap breaks existing v3 components
**What goes wrong:** After swapping `--color-bg` from `#d93c1e` to `#0a0a0a`, existing components that assumed a red background render incorrectly (invisible text, wrong borders, unexpected contrast).
**Why it happens:** The Crimson Poster palette had black as the accent and near-black as text. The Crimson Line palette inverts this — now `--accent` is crimson and `--color-text` is off-white. Components that used `text-text` or `border-accent` relied on the old semantics.
**How to avoid:** After the palette swap, do a visual review pass of every page on the v3 branch in the browser. Key classes to audit: `text-text`, `text-text-muted`, `border-accent`, `bg-surface`, `.sig`, `.sig-out`.
**Warning signs:** The specimen page (`/v3-specimen`) is the easiest visual smoke test — if it looks wrong, the token semantics need adjustment.

### Pitfall 6: postprocessing@6.39.1 upper-bound on three.js
**What goes wrong:** After updating three.js past 0.184, postprocessing breaks (renders black or throws).
**Why it happens:** `postprocessing@6.39.1` has peer dep `three >= 0.168.0 < 0.185.0`. three@0.185 would exceed the upper bound.
**How to avoid:** Pin `@react-three/postprocessing` carefully when updating three. The current three@0.184 is within the safe range.
**Warning signs:** Runtime errors mentioning WebGL framebuffer or render target incompatibilities.

### Pitfall 7: FallbackPoster 404 until poster is captured
**What goes wrong:** On mobile or in fallback scenarios, the hero area shows a broken image.
**Why it happens:** `public/hero-blob-poster.webp` does not exist until Playwright captures it during the build.
**How to avoid:** The capture step must happen in the same plan wave as the hero implementation — not deferred. Until the file exists, replace with a solid color placeholder (`public/hero-blob-poster.webp` → a 2x2px dark WebP) so the `<Image>` doesn't error.
**Warning signs:** 404 in browser dev tools for `/hero-blob-poster.webp`; broken image in FallbackPoster on any narrow-viewport device.

---

## Code Examples

### GPU Morph — Full HeroBlob migration skeleton

```tsx
// Source: [CITED: tympanus.net/codrops/2024/07/09 + github.com/FarazzShaikh/THREE-CustomShaderMaterial]
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const BLOB_VERT = /* glsl */`
  uniform float uTime;

  float sineDisplace(vec3 p) {
    return sin(p.x * 2.0 + uTime * 1.6)
         + sin(p.y * 2.3 + uTime * 1.2)
         + sin(p.z * 2.1 + uTime * 1.9);
  }

  void main() {
    float n   = sineDisplace(position);
    float d   = 1.3 + n * 0.11;
    float len = length(position);

    csm_Position = (position / len) * d;

    // Tangent-space normal recalculation
    float shift = 0.001;
    vec3 biTangent = cross(normal, tangent.xyz);
    vec3 posA = position + tangent.xyz * shift;
    vec3 posB = position + biTangent * shift;
    float dA = 1.3 + sineDisplace(posA) * 0.11;
    float dB = 1.3 + sineDisplace(posB) * 0.11;
    posA = (posA / length(posA)) * dA;
    posB = (posB / length(posB)) * dB;
    vec3 toA = normalize(posA - csm_Position);
    vec3 toB = normalize(posB - csm_Position);
    csm_Normal = normalize(cross(toA, toB));
  }
`;

export function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef  = useRef<CustomShaderMaterial>(null!);

  // Geometry with tangents for normal recalculation
  const blobGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.3, 12);
    g.computeTangents(); // required for tangent attribute in vertex shader
    return g;
  }, []);

  // IBL (unchanged from original)
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.environment = envMap;
    pmrem.dispose();
  }, [gl, scene]);

  // CSM material — keeps all PBR props, injects vertex shader
  const mat = useMemo(() => new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: BLOB_VERT,
    uniforms: { uTime: { value: 0 } },
    color: 0x140805,
    metalness: 0.6,
    roughness: 0.18,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
  }), []);

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
    meshRef.current.rotation.y += 0.0035;
    meshRef.current.rotation.x = Math.sin(mat.uniforms.uTime.value * 0.3) * 0.22;
  });

  return (
    <mesh ref={meshRef} geometry={blobGeo} material={mat} />
  );
}
```

### EffectComposer + Bloom

```tsx
// Source: [CITED: react-postprocessing.docs.pmnd.rs/effects/bloom]
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Inside Canvas JSX, after all mesh children:
<EffectComposer>
  <Bloom
    luminanceThreshold={0.85}
    luminanceSmoothing={0.9}
    intensity={0.6}
    radius={0.4}
  />
</EffectComposer>
```

### After-LCP mount pattern

```tsx
// Source: [VERIFIED: spike/webgl-perf branch implementation, confirmed in spike 001 CONVENTIONS.md]
"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), { ssr: false });

export function CanvasLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    // Safari fallback
    const id = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;
  return <HeroBlobCanvas />;
}
```

### Scroll progress in useFrame (DOM scroll, no Lenis dependency)

```tsx
// Source: [ASSUMED] — addEffect pattern documented in R3F ecosystem discussions
import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function useScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    return addEffect(() => {
      const max = document.body.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    });
  }, []);
  return progress;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Per-frame JS `computeVertexNormals()` | GPU vertex shader via CSM `csm_Normal` | 2022+ (CSM v1+) | Removes main-thread computation per frame; normals are correct with PBR lighting |
| `onBeforeCompile` string patching | `three-custom-shader-material` output variables | 2021+ | Survives three.js version updates; no fragile string replacement |
| `outputEncoding = sRGBEncoding` | `outputColorSpace = SRGBColorSpace` | three.js r152 (2022) | Already handled in current codebase (spike confirmed) |
| framer-motion import | `motion/react` import | 2024 rebranding | Already handled — `package.json` has `motion@12.38.0` |

**Deprecated/outdated:**
- `computeVertexNormals()` in `useFrame`: correct but now redundant — move to GPU.
- The old deck controller (`useDeckController`, `objEnter`) — superseded by explorative layout; do not carry forward.
- `lenis.stop()` / `lenis.start()` on the homepage — only needed for the deck controller; remove in v1.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `addEffect` from `@react-three/fiber` runs before each frame and is suitable for reading `window.scrollY` for scroll-cue purposes | Pattern 4, Code Examples | If `addEffect` runs after frame, scroll progress will lag by 1 frame — acceptable for a scroll-cue scale animation |
| A2 | `three-custom-shader-material` JSX usage (`<CustomShaderMaterial>`) is available as both an R3F declarative element and a vanilla class; vanilla (`three-custom-shader-material/vanilla`) is the correct import for non-declarative usage inside `useMemo` | Pattern 2 | If only the declarative form is available, the `useMemo` pattern breaks — switch to `<CustomShaderMaterial>` JSX child of the mesh |
| A3 | The `IcosahedronGeometry(1.3, 12)` from three.js produces indexed geometry (default) | Pattern 2 | If non-indexed, `computeTangents()` will fail silently — verify by checking `geometry.index !== null` |
| A4 | Playwright `screenshot` captures the rendered WebGL canvas correctly on macOS (depends on GPU access in the test environment) | Pattern 6 | If Playwright cannot capture WebGL, fall back to `canvas.toDataURL` approach from within the browser via a dev-mode button |
| A5 | `postprocessing@6.39.1` upper bound `< 0.185.0` means three@0.184 is the LAST compatible three.js version without upgrading postprocessing | Standard Stack | If three.js 0.185 is needed before postprocessing updates, a peer-dep conflict error will occur at install time |

---

## Open Questions

1. **ConditionalFooter on homepage:** Does `ConditionalFooter` already suppress on `/`? If the homepage has its own footer-beat section (D-12), two footers would render.
   - What we know: `ConditionalFooter` is rendered in `layout.tsx` for all routes.
   - What's unclear: Whether it has a homepage exclusion.
   - Recommendation: Check `src/components/layout/conditional-footer.tsx`; if no exclusion exists, add `pathname === '/'` suppression so the footer-beat section is the only footer on the homepage.

2. **Podium mesh spec:** D-08 says "simple podium now." No concrete design is specified.
   - What we know: Sketch 005 shows a "crimson glow ring + reflective disc."
   - What's unclear: Exact geometry (cylinder? flat disc? multi-element?), size relative to the blob.
   - Recommendation: Planner/executor discretion — start with a thin `CylinderGeometry` disc with a `MeshStandardMaterial` (metalness 0.8, roughness 0.1) and a faint crimson emissive, visible under the blob.

3. **Writing section data in v1:** D-13 says content is static/curated in v1. Should the Writing section show hardcoded essay titles, or be empty with a "See all" CTA?
   - What we know: Notion-wiring is Phase 16.
   - Recommendation: Show 2-3 hardcoded essay titles/links matching current writing page content; not a blocker.

4. **Exact scroll-cue easing:** How far should the camera dolly and object scale change over scroll?
   - Recommendation: Planner/executor discretion. Sketch 005 shows the object "scales down + drifts" — suggest `scale: 1.0 → 0.65` and `camera.z: 4.4 → 5.6` over the first 30% of page scroll.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev server | Yes | v26.0.0 | — |
| npm | Package install | Yes | 11.12.1 | — |
| next (dev server) | Dev + build | Yes | 16.2.1 (node_modules) | — |
| Playwright | Poster capture | Yes | 1.61.0 | canvas.toDataURL in-browser capture |
| Vercel CLI | Preview deploy | Yes | 54.2.0 | — |
| `public/hero-blob-poster.webp` | FallbackPoster | No | — | Placeholder 2x2 dark WebP until captured |
| `@react-three/postprocessing` | Bloom / EffectComposer | Not installed | 3.0.4 on npm | Skip Bloom (Bloom only; remove EffectComposer) |
| `three-custom-shader-material` | GPU morph | Not installed | 6.4.0 on npm | Fall back to JS morph (no computeVertexNormals) if install fails |

**Missing dependencies with no fallback:**
- `public/hero-blob-poster.webp` — blocks FallbackPoster; Wave 0 should add a 1x1 dark placeholder to unblock development, capture real poster in a later wave.

**Missing dependencies with fallback:**
- `@react-three/postprocessing` — Bloom is desirable but not required for v1 functionality. If install fails (peer dep conflict), build the hero without postprocessing first.
- `three-custom-shader-material` — If install blocked, fall back to JS morph with `computeVertexNormals()` temporarily; mark as Wave 0 debt.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + @react-three/test-renderer 9.1.0 + @testing-library/react 16.3 |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run --reporter=verbose src/__tests__/home/` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TD-01 | HeroBlob GPU morph renders scene graph without crash | unit (R3F test renderer) | `npx vitest run src/__tests__/home/hero-blob.test.tsx` | No — Wave 0 |
| TD-02 | CanvasLoader shows null before idle, canvas after | unit (JSDOM + vitest fake timers) | `npx vitest run src/__tests__/home/canvas-loader.test.tsx` | No — Wave 0 |
| TD-03 | WebGL2=null → FallbackPoster renders, no canvas | unit (existing pattern carry-forward) | `npx vitest run src/__tests__/home/explorative-homepage.test.tsx` | No — Wave 0 |
| TD-03 | reducedMotion=true → FallbackPoster, no canvas | unit (mocked `useReducedMotion`) | same file as above | No — Wave 0 |
| HD-04 | BigList index renders Building/Writing/Newsletter links | unit | `npx vitest run src/__tests__/home/section-building.test.tsx` | No — Wave 0 |
| HD-05 | pointer:coarse → FallbackPoster, no canvas | unit (mock `window.matchMedia`) | `npx vitest run src/__tests__/home/explorative-homepage.test.tsx` | No — Wave 0 |

**Existing tests to update (path changes only):**
- `src/__tests__/home-deck/use-webgl-support.test.ts` — logic unchanged; update import path when hook is migrated.
- `src/__tests__/home-deck/hero-blob.test.tsx` — update import path after migration to `home/`.

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/home/`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + visual Vercel preview review before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/home/hero-blob.test.tsx` — covers TD-01 (GPU morph scene graph, carry-forward pattern from home-deck version)
- [ ] `src/__tests__/home/canvas-loader.test.tsx` — covers TD-02 (after-LCP mount timing)
- [ ] `src/__tests__/home/explorative-homepage.test.tsx` — covers TD-03 + HD-05 (fallback gate conditions)
- [ ] `src/__tests__/home/section-building.test.tsx` — covers HD-04 (BigList index renders correctly)
- [ ] Placeholder `public/hero-blob-poster.webp` (1x1 dark WebP) so FallbackPoster doesn't 404 during test runs

---

## Security Domain

> Phase is presentation-layer only. No auth, no user data, no API routes, no secrets exposed. Security domain is minimal.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | No | No user inputs in this phase |
| V6 Cryptography | No | — |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| WebGL context fingerprinting | Information Disclosure | `failIfMajorPerformanceCaveat: true` already prevents software renderer fingerprinting |
| Malicious GLB injection (future v-swap) | Tampering | GLB models served from `public/` only (static, no user upload); not applicable to v1 procedural blob |

---

## Sources

### Primary (HIGH confidence)
- `spike/webgl-perf` branch + `.planning/spikes/001-webgl-homepage-perf/README.md` — measured bundle sizes, LCP times, FPS, fallback test results. All numerical claims in this document come from these measurements.
- `.planning/spikes/CONVENTIONS.md` — hard rules established from spike; Next 16 dynamic ssr:false pattern, GPU morph requirement.
- `src/components/home-deck/` source files — exact carry-forward code; read directly.
- `package.json` — installed versions verified directly.
- npm registry (`npm view`) — version and peer dependency verification for `@react-three/postprocessing`, `postprocessing`, `three-custom-shader-material`.

### Secondary (MEDIUM confidence)
- [tympanus.net/codrops — Animated Displaced Sphere with Custom Three.js Material](https://tympanus.net/codrops/2024/07/09/creating-an-animated-displaced-sphere-with-a-custom-three-js-material/) — CSM tangent-based normal recalculation pattern. Published July 2024, consistent with CSM API.
- [github.com/FarazzShaikh/THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) — Official CSM repo; API, output variables, React usage pattern.
- [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — Lenis progress API (`lenis.progress`, `lenis.scroll`, `lenis.on('scroll')`).
- [react-postprocessing.docs.pmnd.rs/effects/bloom](https://react-postprocessing.docs.pmnd.rs/effects/bloom) — EffectComposer + Bloom JSX pattern.

### Tertiary (LOW confidence)
- WebSearch results for `addEffect` pattern from R3F for scroll-cue without Lenis dependency — community-sourced, single source. Marked [ASSUMED] in Assumptions Log.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm-verified versions; peer deps checked; spike 001 confirmed build succeeds.
- Architecture patterns: HIGH — all core patterns (GPU morph, after-LCP mount, fallback gate) derived from spike 001 measured code.
- Pitfalls: HIGH — all pitfalls are either spike-measured (build hard-fail, LCP regression) or directly observed in source code audit (lenis.stop, missing tangent attribute).
- Scroll-cue integration: MEDIUM — `addEffect` pattern from community, not verified in Context7 or official R3F docs.

**Research date:** 2026-06-19
**Valid until:** 2026-07-19 (30 days) — stable stack; only risk is `postprocessing` releasing `>= 0.185.0` support which would update the peer dep ceiling.
