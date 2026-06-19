# Phase 15: Slide-Deck Homepage & 3D Hero — Research

**Researched:** 2026-06-18
**Domain:** React-Three-Fiber / WebGL, wheel-driven scroll deck, Next.js App Router lazy-loading, Lenis conflict resolution
**Confidence:** HIGH (core stack verified against npm registry and official docs) / MEDIUM (material elevation parameters — tuning is discretionary)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use `@react-three/fiber` + `three` (newest stable). Port prototype's blob using current `outputColorSpace`/`SRGBColorSpace` API (replaces deprecated r128 `outputEncoding`/`sRGBEncoding`). Run per-frame geometry morph in `useFrame`. Satisfies TD-01.
- **D-02:** Do NOT add `@react-three/drei` unless a specific helper earns its bundle weight. Start with fiber + three only.
- **D-03:** Port `initBlob()` as functional reference: IcosahedronGeometry base, sine-sum vertex displacement morph, slow autonomous rotation, key/rim/fill/ambient light rig, MeshStandardMaterial near-black + crimson rim, pixelRatio capped at 2, ACES tone mapping.
- **D-04:** Elevate material and lighting beyond the prototype. Target glossier near-black, stronger/cleaner crimson rim, refined lighting and tone mapping. Keep the blob form and autonomous motion.
- **D-05:** Lusion (lusion.co) is the aspirational quality bar for look only. NO cursor-follow, magnetic, or pointer-driven deformation.
- **D-06:** Port the CHOMP deck controller from `deckInit()` faithfully: one gesture = one slide; fresh-gesture detection (pause >110ms OR direction change OR `adel > wAbs*1.25+2`); 820ms lock over 800ms easeInOutCubic; direction reversals bypass the lock; keyboard (arrows/space/PageUp-Down/Home/End), touch (>28px), progress dots, scrollbar-drag re-sync.
- **D-07:** On every slide change the object replays its entrance: spawn right → fly in from left → settle right (`objEnter`, ~1s `cubic-bezier(.16,1,.3,1)` on the object wrapper).
- **D-08:** No-WebGL / reduced-motion static fallback is a pre-rendered poster image (PNG/WebP) in the object's slot.
- **D-09:** `prefers-reduced-motion` on desktop AND mobile/touch both fall back to native vertical scroll. No wheel controller, no tween, no fly-in, poster shown.
- **D-10:** Homepage slide copy is static, matching the prototype — 5 slides: hero, big-type index, Prometheus, Newsletter, footer-as-slide. Hardcoded JSX using Phase 14 v3 primitives.

### Claude's Discretion
- Lazy-load mechanics for the object so it stays off the LCP path (TD-03 / DQ-03): e.g. `next/dynamic` with `ssr:false`, mounting after first paint / idle / when the canvas slot is ready. Planner chooses the exact trigger.
- File organization (where the deck controller, object component, slide sections, and poster asset live), hook vs. component boundaries, and how WebGL support / reduced-motion / touch are detected.
- Exact elevated material/light parameter values (D-04) — tune to taste against the Lusion bar.
- Whether to reuse any Phase 14 motion/provider plumbing (Lenis/Motion) or keep the deck controller self-contained. Note: Lenis smooth-scroll likely conflicts with the deck's own scroll control on the homepage.

### Deferred Ideas (OUT OF SCOPE)
- Cursor-reactive / pointer-driven 3D interactivity.
- Bespoke per-slide motion on interior pages.
- New /uses, /watching, and all interior Notion pages (Phase 16).
- Real YouTube thumbnails/oEmbed for /watching.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HD-01 | Homepage is a full-page slide deck — one wheel or keyboard gesture advances exactly one slide | CHOMP `deckInit` port pattern; `useRef`+wheel-handler; easeInOutCubic tween on `#scroller` equivalent |
| HD-02 | Fresh-gesture detection ignores trackpad momentum; reversal bypasses cool-down | Exact prototype logic: `now-wT>110 \|\| dir!==wDir \|\| adel>wAbs*1.25+2`; port verbatim as a ref-based hook |
| HD-03 | Background static; keyboard (arrows/space/Home/End), touch-swipe, progress dots | Keyboard handler with input-guard; touch 28px threshold; progress dots via CSS + state ref |
| HD-04 | Slide 2 is brutalist big-type index (Building/Writing/Doing → Works/Writing/Prometheus) | Use `<BigList>` v3 primitive from `src/components/v3/big-list.tsx` |
| HD-05 | Touch / small screens → native vertical scroll (no wheel controller) | `window.matchMedia('(pointer: coarse)')` + viewport width check; CSS `overflow-y: auto` on the scroller wrapper; detect on mount, not on render |
| TD-01 | Morphing near-black glossy 3D object (R3F) with crimson rim, autonomous animation | R3F `@react-three/fiber` 9.6.1 + `three` 0.184.0; `useFrame` geometry morph pattern; light rig |
| TD-02 | Object spawns right, flies in from left on each slide change | `objEnter` pattern: instant right translate → double-rAF trigger → CSS transition settle right |
| TD-03 | Object lazy-loaded (off LCP critical path), degrades to static fallback | `next/dynamic` with `ssr:false` inside a `"use client"` wrapper; WebGL detection; poster PNG fallback |
</phase_requirements>

---

## Summary

Phase 15 is a full homepage replacement: a CHOMP-style wheel-driven slide deck with a morphing 3D hero object. The functional prototype (`site.js` + `index.html`) is complete and working; this phase is a **port**, not a rewrite. The core challenge is translating three distinct vanilla JS systems — the Three.js blob (`initBlob`), the deck controller (`deckInit`/`objEnter`), and the CSS fixed-stage layout — into React/Next.js idioms while (a) keeping WebGL off the LCP path, (b) resolving the Lenis scroll conflict on `/`, and (c) elevating the material to approach Lusion's cinematic quality.

The 3D stack is R3F v9.6.1 + three.js v0.184.0. Both are verified on npm, actively maintained, and peer-dependency-compatible with the project's React 19.2.4. R3F v9 is the correct major for React 19; v8 is for React 18. The prototype used three.js r128 which is ancient (roughly three.js v0.128) — modern three.js has replaced `outputEncoding`/`sRGBEncoding` with `outputColorSpace`/`SRGBColorSpace` since r152, and three.js now ships WebGL2 only (r163+). All four deprecated API calls in the prototype need updating.

The Lenis conflict is the most structurally interesting problem. The current `LenisProvider` in `layout.tsx` wraps the entire app with smooth-scroll. The homepage deck needs to own wheel events on its scroller element completely — Lenis must not intercept those events. The clean solution is to call `lenis.stop()` when the homepage mounts and `lenis.start()` on unmount, using a context-exposed Lenis ref. Because `LenisProvider` keeps `lenisRef.current` internally, a small Lenis context exposing the instance (or a `useLenis` hook) is needed so the homepage can pause/resume it.

The LCP strategy: the homepage Server Component renders the full slide content and a poster `<Image>` in the object slot. A `"use client"` wrapper lazily imports the Canvas component via `next/dynamic({ ssr: false })`. The canvas only mounts after a WebGL-support check succeeds and the client is in "full-motion" mode (not `prefers-reduced-motion`, not touch/small screen). The poster image is always pre-rendered in the HTML; the canvas is slotted over it after mount.

**Primary recommendation:** Port the prototype logic faithfully first (blob + deck controller), get it rendering correctly, then elevate the material from `MeshStandardMaterial` to `MeshPhysicalMaterial` with `clearcoat` + `RoomEnvironment` IBL to push quality toward the Lusion bar. Tackle the Lenis conflict with a context-exposed stop/start pattern before wiring the deck controller.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Slide deck HTML structure (5 slides) | Server Component (page.tsx) | — | Static content; SSR delivers full HTML for SEO + initial paint |
| Object slot (fixed position, poster image) | Server Component (page.tsx) | — | Poster must be in initial HTML for LCP fallback |
| Canvas / R3F mount | Client Component (canvas wrapper) | — | WebGL requires browser; must be `"use client"` + `next/dynamic ssr:false` |
| Deck controller (wheel/key/touch) | Client Component (hook) | — | Needs `addEventListener`; `"use client"` with ref-only state to avoid re-renders |
| Lenis stop/start on homepage | Client Component (effect in page) | LenisProvider (context) | Homepage must pause global Lenis; needs exposed instance |
| Progress dots | Client Component (co-located with deck) | — | Dot state driven by slide index ref |
| objEnter animation | Client Component (CSS transition) | — | Double-rAF pattern; no R3F involvement; pure DOM transition |
| Blob geometry morph | R3F `useFrame` loop | — | Must stay in the render loop; never React state |
| Light rig | R3F scene | — | Declarative JSX inside `<Canvas>` |
| Fallback detection | Client Component (hook/effect) | — | `matchMedia` is browser-only; runs on mount |
| Poster image generation (one-time) | Build-time / developer action | — | Captured screenshot committed as `/public` static asset |

---

## Standard Stack

### Core (new installations this phase)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | 0.184.0 | 3D math, geometry, materials, renderer | The underlying engine; R3F is a React wrapper around it |
| `@react-three/fiber` | 9.6.1 | React renderer for Three.js | Official pmndrs library; v9 is the correct major for React 19 |

**Version verification:** Confirmed via `npm view` on 2026-06-18. `three` last modified 2026-04-16, `@react-three/fiber` last modified 2026-04-28. Both are current stable. [VERIFIED: npm registry]

### Supporting (dev only, conditionally)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-three/test-renderer` | 9.1.0 | R3F scene graph testing without WebGL | For unit tests of the blob component and deck logic; vitest-compatible |

**Note on drei (D-02):** `@react-three/drei` is explicitly excluded unless a specific helper earns its weight. The only candidate is `<Environment preset="...">` which wraps `RoomEnvironment`/`PMREMGenerator` — but the setup is ~8 lines of vanilla three.js in `onCreated`, so drei is not needed.

### Already Installed (no changes)
| Library | Already at | Role in Phase 15 |
|---------|-----------|-----------------|
| `motion` | 12.38.0 | `useReducedMotion` hook — used to detect reduced-motion preference |
| `lenis` | 1.3.23 | Must be paused on `/` homepage route to prevent scroll conflict |
| `gsap` | 3.14.2 | No new role; GSAP ticker drives Lenis — pausing Lenis is sufficient |

**Installation (new packages only):**
```bash
npm install three @react-three/fiber
npm install --save-dev @react-three/test-renderer
```

**next.config.ts addition required:**
```typescript
const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  // ... existing config
};
```
[VERIFIED: r3f.docs.pmnd.rs/getting-started/installation] — Next.js 13.1+ requires `transpilePackages: ['three']` to handle `three/examples/jsm` ESM imports correctly. Without this, builds may fail on certain three.js add-on subpath imports.

---

## Package Legitimacy Audit

> `slopcheck` could not be installed on this machine. All packages below were verified against the official npm registry. Packages are established OSS projects from known organizations.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `three` | npm | 13+ yrs (2012-12-07) | Millions/wk | github.com/mrdoob/three.js | [ASSUMED OK] | Approved — authoritative 3D library |
| `@react-three/fiber` | npm | 5+ yrs (pmndrs) | High | github.com/pmndrs/react-three-fiber | [ASSUMED OK] | Approved — official React renderer for three.js |
| `@react-three/test-renderer` | npm | pmndrs, same org as R3F | Moderate | github.com/pmndrs/react-three-fiber | [ASSUMED OK] | Approved — official test utility from same repo |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

*slopcheck was unavailable at research time. All packages above are from long-established organizations (mrdoob/three.js, pmndrs/poimandres collective) with public GitHub repositories. Registry existence confirmed via `npm view`. Because slopcheck could not run, the planner should add a `checkpoint:human-verify` gate before the install task if following strict protocol — though the risk is extremely low given these packages' provenance.*

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request → Next.js Server Component (app/page.tsx)
  │
  ├── Server renders: full 5-slide HTML structure
  │     ├── Static atmosphere div (fixed, z-index:0)
  │     ├── #objstage / .objwrap (fixed, z-index:1) ← poster <Image> here
  │     ├── #scroller (fixed, z-index:2, overflow-y:auto)
  │     │   ├── .deck-slide × 5 (height:100%)
  │     │   └── .deck-dots (fixed, right side)
  │     └── JsonLd / metadata
  │
  ├── Client hydration:
  │   ├── DeckController hook (wheel/key/touch — ref-only, no React state)
  │   │   └── Reads/writes: idxRef, lockRef, wTRef, wDirRef, wAbsRef
  │   │       ├── On slide change → animateTo(scroller, offsetTop, 800ms ease)
  │   │       └── On slide change → trigger objEnter (CSS transition, not R3F)
  │   │
  │   └── useLenisStop() effect (pauses global Lenis on mount, restores on unmount)
  │
  └── Lazy client mount (after hydration, WebGL check, not-touch, not-reduced-motion):
        next/dynamic({ ssr: false }) → HeroBlobCanvas
          │
          └── <Canvas dpr={[1,2]} gl={{ outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}>
                ├── HeroBlob mesh
                │   ├── IcosahedronGeometry (detail=12, base positions stored in ref)
                │   ├── useFrame: sine-sum vertex morph → pos.needsUpdate=true → computeVertexNormals()
                │   ├── blob.rotation.y += 0.0035 per frame; blob.rotation.x = sin(t*0.3)*0.22
                │   └── MeshPhysicalMaterial (near-black, clearcoat, envMap from RoomEnvironment)
                ├── WireOverlay mesh (IcosahedronGeometry detail=2, wireframe, opacity 0.16)
                ├── DirectionalLight key (white, 1.9, pos 3,4,5)
                ├── DirectionalLight rim (crimson #ff6a3a, 1.7, pos -4,-2,-4)
                ├── DirectionalLight fill (white, 0.45, pos -3,2,3)
                └── AmbientLight (0x1a0a06, 0.5)
```

### Recommended Project Structure
```
src/
├── app/
│   └── page.tsx                   ← Replaced: deck homepage (Server Component, static)
├── components/
│   ├── v3/                        ← Phase 14 primitives (BigList, Button, etc.)
│   ├── home-deck/
│   │   ├── deck-controller.ts     ← "use client" hook: wheel/key/touch, ref-only
│   │   ├── deck-homepage.tsx      ← "use client" orchestrator: Lenis pause, deck mount
│   │   ├── hero-blob-canvas.tsx   ← "use client" R3F Canvas component
│   │   ├── hero-blob.tsx          ← R3F scene contents (mesh, lights)
│   │   ├── slide-*.tsx            ← 5 slide section components (can be Server Components)
│   │   └── fallback-poster.tsx    ← <Image> poster slot (used when WebGL off)
│   └── providers/
│       └── lenis-provider.tsx     ← Augment to expose stop()/start() via context
└── public/
    └── hero-blob-poster.webp      ← One-time render; committed static asset
```

### Pattern 1: R3F Canvas Setup in Next.js App Router

The `Canvas` must live in a `"use client"` component. The page Server Component dynamically imports it with `ssr: false`. Per official Next.js docs, `dynamic(..., { ssr: false })` is only supported from Client Components in Next.js 15+.

```typescript
// src/components/home-deck/deck-homepage.tsx  ← "use client"
"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Lazy-load the Canvas entirely — three.js never touches the SSR bundle
const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), {
  ssr: false,
  loading: () => null,  // poster image already in the slot; no extra spinner
});

export function DeckHomepage() {
  const prefersReduced = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    // Touch/small-screen detection (HD-05, D-09)
    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;
    setIsTouchDevice(touch);

    // WebGL2 detection (TD-03)
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("webgl2");
      setWebglSupported(!!ctx);
    } catch {}
  }, []);

  const showDeck = !isTouchDevice && !prefersReduced;
  const showCanvas = showDeck && webglSupported;

  // Lenis stop/start on homepage (Lenis conflict resolution)
  useLenisStop(showDeck);

  return (
    <>
      <div id="objstage">
        <div className="objwrap" ref={objWrapRef}>
          {showCanvas ? (
            <HeroBlobCanvas />
          ) : (
            <FallbackPoster /> // poster <Image> — always SSR'd, Canvas replaces it
          )}
        </div>
      </div>
      {showDeck ? <DeckScroller objWrapRef={objWrapRef} /> : <NativeScrollSections />}
    </>
  );
}
```
[CITED: nextjs.org/docs/app/guides/lazy-loading]

### Pattern 2: R3F Blob — useFrame Geometry Morph

The position-buffer morph pattern from `initBlob` ports directly to R3F. The key constraint is `useFrame` is the ONLY safe place to mutate geometry attributes — never `setState`, never `useEffect`.

```typescript
// src/components/home-deck/hero-blob.tsx
"use client";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.3, 12), []);
  const basePositions = useMemo(() => geo.attributes.position.array.slice(), [geo]);
  const { gl, scene } = useThree();

  // One-time: set up IBL from RoomEnvironment (no external HDR file needed)
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.environment = envMap;
    pmrem.dispose();
  }, [gl, scene]);

  useFrame(() => {
    tRef.current += 0.006;
    const t = tRef.current;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const base = basePositions;

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const bx = base[ix], by = base[ix + 1], bz = base[ix + 2];
      const l = Math.hypot(bx, by, bz) || 1;
      const n =
        Math.sin(bx * 2 + t * 1.6) +
        Math.sin(by * 2.3 + t * 1.2) +
        Math.sin(bz * 2.1 + t * 1.9);
      const d = 1.3 + n * 0.11;
      (pos.array as Float32Array)[ix]     = (bx / l) * d;
      (pos.array as Float32Array)[ix + 1] = (by / l) * d;
      (pos.array as Float32Array)[ix + 2] = (bz / l) * d;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0035;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.22;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshPhysicalMaterial
        color={0x140805}
        metalness={0.6}
        roughness={0.18}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}
```
[CITED: r3f.docs.pmnd.rs/api/hooks — useFrame never uses setState]
[CITED: threejs.org/docs — MeshPhysicalMaterial clearcoat properties]

### Pattern 3: R3F Canvas Configuration

R3F v9's `<Canvas>` sets `outputColorSpace = SRGBColorSpace` and `toneMapping = ACESFilmicToneMapping` **by default**. The prototype's explicit settings (`renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping`) are already the R3F defaults — no `gl` prop override needed for color space. Use `dpr={[1, 2]}` for the pixel-ratio cap (equivalent to `Math.min(devicePixelRatio, 2)`).

```typescript
// src/components/home-deck/hero-blob-canvas.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { HeroBlob } from "./hero-blob";

export default function HeroBlobCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}              // pixelRatio cap at 2 (D-03)
      camera={{ fov: 42, position: [0, 0, 4.4], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroBlob />
      <WireFrame />
      {/* Light rig (D-03) */}
      <directionalLight color={0xffffff} intensity={1.9} position={[3, 4, 5]} />
      <directionalLight color={0xff6a3a} intensity={1.7} position={[-4, -2, -4]} />
      <directionalLight color={0xffffff} intensity={0.45} position={[-3, 2, 3]} />
      <ambientLight color={0x1a0a06} intensity={0.5} />
    </Canvas>
  );
}
```
[CITED: r3f.docs.pmnd.rs/api/canvas — default outputColorSpace and toneMapping]

### Pattern 4: CHOMP Deck Controller as a React Hook

All state lives in refs — zero `setState` — so the wheel/touch handler never triggers React re-renders. The `animateTo` function drives a custom rAF tween on the scroller's `scrollTop`. The easing function and lock logic port verbatim.

```typescript
// src/components/home-deck/deck-controller.ts
"use client";
import { useEffect, useRef, useCallback } from "react";

export function useDeckController({
  scrollerRef,
  slideCount,
  onSlideChange,
}: {
  scrollerRef: React.RefObject<HTMLElement | null>;
  slideCount: number;
  onSlideChange: (idx: number) => void;
}) {
  const idxRef   = useRef(0);
  const lockRef  = useRef(0);
  const rafRef   = useRef(0);
  const wTRef    = useRef(0);
  const wDirRef  = useRef(0);
  const wAbsRef  = useRef(0);
  const stepDirRef = useRef(0);

  const ease = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  const getSlides = useCallback(() => {
    return scrollerRef.current
      ? Array.from(scrollerRef.current.querySelectorAll<HTMLElement>(".deck-slide"))
      : [];
  }, [scrollerRef]);

  const animateTo = useCallback((top: number, dur: number) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    cancelAnimationFrame(rafRef.current);
    const from = sc.scrollTop;
    const dist = top - from;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = dur ? Math.min((now - t0) / dur, 1) : 1;
      sc.scrollTop = from + dist * ease(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [scrollerRef]);

  const goTo = useCallback((i: number) => {
    const slides = getSlides();
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === idxRef.current) return;
    idxRef.current = i;
    lockRef.current = Date.now() + 820;
    onSlideChange(i);
    animateTo(slides[i].offsetTop, 800);
  }, [getSlides, animateTo, onSlideChange]);

  const step = useCallback((dir: number) => {
    const locked = Date.now() < lockRef.current;
    if (locked && dir === stepDirRef.current) return;
    stepDirRef.current = dir;
    goTo(idxRef.current + dir);
  }, [goTo]);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const adel = Math.abs(e.deltaY);
      if (adel < 4) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const now = Date.now();
      const fresh = now - wTRef.current > 110 || dir !== wDirRef.current || adel > wAbsRef.current * 1.25 + 2;
      wTRef.current = now; wDirRef.current = dir; wAbsRef.current = adel;
      if (!fresh) return;
      step(dir);
    };

    let tY: number | null = null;
    const onTouchStart = (e: TouchEvent) => { tY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => { e.preventDefault(); };
    const onTouchEnd   = (e: TouchEvent) => {
      if (tY == null) return;
      const end = e.changedTouches[0]?.clientY ?? tY;
      const dy = tY - end;
      if (Math.abs(dy) > 28) step(dy > 0 ? 1 : -1);
      tY = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName ?? "";
      if (/^(input|textarea|select)$/i.test(tag)) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); step(1); }
      else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); step(-1); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End")  { e.preventDefault(); goTo(getSlides().length - 1); }
    };

    let st: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (Date.now() < lockRef.current) return;
      clearTimeout(st);
      st = setTimeout(() => {
        const slides = getSlides();
        const mid = sc.scrollTop + sc.clientHeight / 2;
        let near = 0, best = Infinity;
        slides.forEach((el, i) => {
          const d = Math.abs(el.offsetTop + el.offsetHeight / 2 - mid);
          if (d < best) { best = d; near = i; }
        });
        if (near !== idxRef.current) { idxRef.current = near; onSlideChange(near); }
      }, 90);
    };

    sc.addEventListener("wheel", onWheel, { passive: false });
    sc.addEventListener("touchstart", onTouchStart, { passive: true });
    sc.addEventListener("touchmove", onTouchMove, { passive: false });
    sc.addEventListener("touchend", onTouchEnd, { passive: true });
    sc.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", () => {
      const slides = getSlides();
      if (slides[idxRef.current]) sc.scrollTop = slides[idxRef.current].offsetTop;
    });

    return () => {
      sc.removeEventListener("wheel", onWheel);
      sc.removeEventListener("touchstart", onTouchStart);
      sc.removeEventListener("touchmove", onTouchMove);
      sc.removeEventListener("touchend", onTouchEnd);
      sc.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollerRef, step, goTo, getSlides]);

  return { idxRef };
}
```
[CITED: .planning/sketches/002-full-site-model/assets/site.js — deckInit verbatim logic]

### Pattern 5: objEnter Entrance

The entrance is pure CSS transition — no R3F, no Motion library. The double-rAF trick ensures the browser flushes the initial transform before applying the transition.

```typescript
// called on every slide change; objWrapRef points at .objwrap
function objEnter(objWrapRef: React.RefObject<HTMLElement | null>) {
  const el = objWrapRef.current;
  if (!el) return;
  const vw = window.innerWidth / 100;
  el.style.transition = "none";
  el.style.transform = `translateX(${(20 * vw).toFixed(1)}px)`;
  el.style.opacity = "0";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.transition =
      "transform 1s cubic-bezier(.16,1,.3,1), opacity .55s ease";
    el.style.transform = `translateX(${(38 * vw).toFixed(1)}px)`;
    el.style.opacity = "1";
  }));
}
```
[CITED: .planning/sketches/002-full-site-model/assets/site.js — objEnter verbatim]

### Pattern 6: Lenis Conflict Resolution

The `LenisProvider` in `layout.tsx` wraps the entire app. When the homepage deck is active, Lenis must not intercept wheel events on the `#scroller` element. Three approaches are viable:

**Recommended: Expose Lenis instance via React context, call `stop()`/`start()` in the homepage.**

```typescript
// Augment lenis-provider.tsx to expose the instance:
const LenisContext = createContext<{ stop: () => void; start: () => void } | null>(null);
export function useLenisControl() { return useContext(LenisContext); }
```

Then in `deck-homepage.tsx`:
```typescript
const lenis = useLenisControl();
useEffect(() => {
  if (showDeck) { lenis?.stop(); return () => lenis?.start(); }
}, [showDeck, lenis]);
```

**Alternative: `data-lenis-prevent-wheel` on the `#scroller` div.** Lenis respects this attribute to not smooth-scroll wheel events on the annotated element. Simpler — no context needed. However, this only prevents Lenis from intercepting those specific wheel events; it does not pause the Lenis RAF loop globally, which is cleaner when the deck owns the entire viewport.

**Recommendation:** Use `lenis.stop()` context approach — cleaner isolation. The `data-lenis-prevent-wheel` attribute is a good lightweight fallback if context refactor is deferred.
[CITED: github.com/darkroomengineering/lenis — data-lenis-prevent-wheel attribute; stop()/start() instance methods]

### Pattern 7: Three.js API Migration (r128 → current)

The prototype uses four deprecated APIs. Every one has a direct replacement:

| Prototype (r128) | Current (r152+) | Notes |
|------------------|-----------------|-------|
| `renderer.outputEncoding = THREE.sRGBEncoding` | **Removed — R3F default sets this** | R3F Canvas already sets `outputColorSpace = SRGBColorSpace` by default |
| `THREE.sRGBEncoding` constant | `THREE.SRGBColorSpace` | Import from `'three'` |
| `renderer.toneMapping = THREE.ACESFilmicToneMapping` | **R3F default — no change needed** | R3F Canvas sets this by default |
| WebGL 1 renderer | **Dropped in r163** | `three@0.184.0` uses WebGL2 exclusively; `canvas.getContext('webgl2')` for detection |

[CITED: github.com/mrdoob/three.js/wiki/Migration-Guide]

### Material Elevation: MeshStandardMaterial → MeshPhysicalMaterial

The prototype uses `MeshStandardMaterial`. To approach Lusion quality, upgrade to `MeshPhysicalMaterial` with clearcoat and a procedural IBL environment. This adds per-pixel cost but all clearcoat features are off-by-default so only enabled knobs add cost.

**Starting point for elevated parameters (tune to taste against Lusion bar):**
```typescript
<meshPhysicalMaterial
  color={0x140805}        // near-black base (same as prototype)
  metalness={0.6}         // higher than prototype's 0.5 — more reflective
  roughness={0.18}        // lower than prototype's 0.26 — glossier
  clearcoat={0.9}         // car-paint shine layer
  clearcoatRoughness={0.1}// nearly mirror-smooth clearcoat
  envMapIntensity={1.2}   // IBL contribution from RoomEnvironment
/>
```

The `RoomEnvironment` + `PMREMGenerator` pattern generates IBL from a procedural room scene — no external HDR file to download, no extra network request:
```typescript
const pmrem = new THREE.PMREMGenerator(gl);
const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
scene.environment = envMap;
pmrem.dispose();
```
[CITED: threejs.org/docs/pages/MeshPhysicalMaterial.html; threejs.org/docs/pages/RoomEnvironment.html]

### Anti-Patterns to Avoid

- **setState inside useFrame:** R3F docs are explicit — never call setState in the render loop. All blob morph state stays in refs.
- **Importing `dynamic(..., { ssr: false })` from a Server Component:** Next.js 15+ throws a build error. The `dynamic` call with `ssr: false` must live in a `"use client"` file.
- **Omitting `transpilePackages: ['three']` in next.config:** `three/examples/jsm` subpath imports (like `RoomEnvironment`) will fail to resolve in Next.js without this.
- **Letting Lenis run while the deck is active:** Lenis smooths wheel delta — this corrupts the deck's raw `e.deltaY` fresh-gesture detection. Lenis must be stopped before the wheel listener is attached.
- **Using `three.js r128` deprecated constants:** `THREE.sRGBEncoding`, `THREE.LinearEncoding` are removed in r163. Using `three@0.184.0` without updating these causes runtime errors.
- **Calling `computeVertexNormals()` infrequently:** The morph changes vertex positions every frame — normals must be recomputed every frame too, or lighting will be wrong during motion.
- **Canvas mounted at SSR time:** Even with `"use client"`, if the Canvas is not wrapped in `next/dynamic({ ssr: false })`, Next.js will attempt to render it on the server where WebGL doesn't exist.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| React renderer for Three.js | Custom imperative three.js in useEffect | `@react-three/fiber` | R3F handles resize, RAF cleanup, context loss, HMR, concurrent-safe rendering |
| Geometry morph + normal recalc | Custom diff/patch system | `pos.needsUpdate=true; geo.computeVertexNormals()` in useFrame | Three.js built-in; proven pattern for CPU-side morphs |
| Procedural IBL | External HDR file / bake | `RoomEnvironment + PMREMGenerator` | Ships in three.js core; zero network cost; adequate quality for this use case |
| Prefers-reduced-motion detection | Custom window.matchMedia hook | `useReducedMotion()` from `motion/react` | Already installed; correct SSR handling; synced with MotionConfig provider |
| Page-level smooth scroll | Custom scroll lerp | Lenis (already installed) — just `stop()` on homepage | Already integrated with GSAP ticker |
| Pixel ratio cap | `Math.min(devicePixelRatio, 2)` manual | `dpr={[1, 2]}` on `<Canvas>` | R3F handles it declaratively; auto-updates on display change |

**Key insight:** The THREE.js API for CPU-side vertex morphing (`needsUpdate + computeVertexNormals`) has been stable for years and is specifically designed for this use case. R3F's `useFrame` is the correct integration point — no custom RAF management needed.

---

## Common Pitfalls

### Pitfall 1: Lenis Intercepts Raw `deltaY` Before the Deck Handler
**What goes wrong:** Fresh-gesture detection compares raw `e.deltaY` between events. Lenis pre-processes wheel events and modifies their effective delta, making the `adel > wAbs*1.25+2` re-acceleration check unreliable — the deck may stutter or skip slides.
**Why it happens:** Lenis's `smoothWheel: true` option intercepts native wheel events at the document level.
**How to avoid:** Call `lenis.stop()` before attaching the wheel listener. The wheel events then arrive raw from the browser. Call `lenis.start()` on homepage unmount.
**Warning signs:** Deck skips multiple slides on a single flick; momentum feels doubled.

### Pitfall 2: `dynamic({ ssr: false })` in a Server Component Throws a Build Error
**What goes wrong:** `Error: ssr: false is not allowed with next/dynamic in Server Components.`
**Why it happens:** In Next.js 15+, `ssr: false` is a client-only feature. The App Router throws at build time, not runtime.
**How to avoid:** The `dynamic(...)` call must be inside a `"use client"` file. The pattern is: `page.tsx` (Server Component) renders `<DeckHomepage />` which is a Client Component that internally calls `dynamic(...)`.
**Warning signs:** Build fails with the exact error above; OR canvas briefly renders on server and hydration mismatch errors appear.

### Pitfall 3: Omitting `transpilePackages: ['three']` Breaks `three/examples/jsm` Imports
**What goes wrong:** `Cannot find module 'three/examples/jsm/environments/RoomEnvironment.js'` or ESM/CJS mismatch errors at build time.
**Why it happens:** Next.js needs to transpile three.js subpath ESM imports. Without `transpilePackages`, the bundler may not resolve them.
**How to avoid:** Add `transpilePackages: ['three']` to `next.config.ts`. No additional packages needed.
**Warning signs:** Build succeeds in dev (Turbopack handles ESM natively) but `vercel build` fails.

### Pitfall 4: Missing `computeVertexNormals()` Per Frame → Broken Lighting During Morph
**What goes wrong:** The blob looks correct when static but lighting artifacts appear during the morph — facets look flat or over-brightened.
**Why it happens:** Moving vertex positions invalidates the stored normals. Three.js does not auto-recompute them.
**How to avoid:** Call `geo.computeVertexNormals()` every frame inside `useFrame`, after setting `pos.needsUpdate = true`.
**Warning signs:** Lighting looks correct at startup but glitches once the animation starts.

### Pitfall 5: R3F Canvas Causes a Re-render on Every Frame Via State
**What goes wrong:** Performance degrades severely — React reconciles the tree at 60fps instead of only when slide state changes.
**Why it happens:** Calling `setState` or any reactive update inside `useFrame`.
**How to avoid:** Keep all per-frame data in `useRef`. Only call `onSlideChange` (which may `setState`) when a slide actually changes — not on every frame.
**Warning signs:** React DevTools profiler shows the parent component re-rendering at 60fps.

### Pitfall 6: WebGL2 Context Detection Returns `true` But GPU Is Software-Fallback
**What goes wrong:** WebGL2 "works" but renders at 2 FPS because the GPU is on the blacklist and Chrome falls back to SwiftShader.
**Why it happens:** `canvas.getContext('webgl2')` returns a context even for software-rendered WebGL.
**How to avoid:** Pass `failIfMajorPerformanceCaveat: true` to `getContext`:
```typescript
const ctx = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
```
This returns `null` for software renderers, safely falling back to the poster image.
**Warning signs:** Mobile or old devices show the canvas but it's choppy or blank.

### Pitfall 7: `objEnter` Runs Before Canvas Is Mounted (No Visible Object)
**What goes wrong:** The first `objEnter` fires on deck mount but the Canvas hasn't rendered yet — the objwrap fades in showing the poster, then the canvas pops in.
**Why it happens:** `next/dynamic` lazy-load has a delay before the Canvas renders its first frame.
**How to avoid:** The poster image in the `objwrap` slot should always be present as the visual background. The canvas overlays it via `position: absolute`. The entrance transition plays on `.objwrap` regardless — if canvas hasn't rendered, the poster shows during the fly-in, which is acceptable.
**Warning signs:** Flash of blank space in the object slot during first entrance.

---

## Code Examples

### WebGL Detection Hook
```typescript
// src/components/home-deck/use-webgl-support.ts
"use client";
import { useState, useEffect } from "react";

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      // failIfMajorPerformanceCaveat blocks software renderers
      const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      setSupported(!!ctx);
    } catch { setSupported(false); }
  }, []);
  return supported;
}
```
[CITED: developer.mozilla.org/docs/Web/API/WebGL_API/By_example/Detect_WebGL]

### Touch / Small Screen Detection
```typescript
// Inside a useEffect (browser-only):
const isTouchOrSmall =
  window.matchMedia("(pointer: coarse)").matches ||
  window.innerWidth < 760;
```
[ASSUMED — standard pattern; 760px matches prototype's `@media(max-width:760px)` breakpoint for hiding dots]

### Lenis Stop Context (minimal augment to lenis-provider.tsx)
```typescript
// Add to lenis-provider.tsx
const LenisControlContext = createContext<{
  stop: () => void;
  start: () => void;
} | null>(null);

export function useLenisControl() {
  return useContext(LenisControlContext);
}

// Inside LenisProvider, expose via context after lenis is created:
<LenisControlContext.Provider value={{
  stop: () => lenisRef.current?.stop(),
  start: () => lenisRef.current?.start(),
}}>
  {children}
</LenisControlContext.Provider>
```
[CITED: github.com/darkroomengineering/lenis — stop()/start() instance methods]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `renderer.outputEncoding = THREE.sRGBEncoding` | Handled by R3F Canvas defaults (`outputColorSpace = SRGBColorSpace`) | three.js r152 (2023) | Remove 2 prototype lines; R3F sets this automatically |
| WebGL 1 (`canvas.getContext('webgl')`) | WebGL2 only (`canvas.getContext('webgl2')`) | three.js r163 (2023) | Detection code must check `webgl2`, not `webgl` |
| `MeshStandardMaterial` (prototype baseline) | `MeshPhysicalMaterial` with clearcoat + IBL for hero quality | Always available; use case elevation | Improved look; slightly higher per-pixel cost — acceptable for a single hero object |
| `@react-three/fiber@8` | `@react-three/fiber@9` (React 19 pairing) | R3F v9 release (2024) | Must use v9 with this project's React 19.2.4 |
| `@studio-freight/react-lenis` | `lenis` package with `lenis/react` import | Studio Freight → Darkroom Engineering rebrand (2024) | Already using the correct package |
| `next/dynamic` from Server Component with `ssr: false` | Must be in `"use client"` file | Next.js 15 (2024) | Build-time error if misplaced; pattern requires a Client Component wrapper |

**Deprecated/outdated:**
- `THREE.sRGBEncoding`: removed in r163; use `THREE.SRGBColorSpace`
- `THREE.LinearEncoding`: removed in r163; use `THREE.LinearSRGBColorSpace`
- `renderer.outputEncoding`: removed in r163; use `renderer.outputColorSpace`
- `texture.encoding`: removed; use `texture.colorSpace`
- WebGL 1 support in three.js: fully removed in r163

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Touch/small-screen detection breakpoint of 760px matches the CSS `@media(max-width:760px)` used to hide deck-dots in the prototype | Pitfalls / Pattern 1 | Deck may activate on small screens that should use native scroll — easily corrected by adjusting the breakpoint |
| A2 | The LenisProvider's `lenisRef.current` is accessible enough to expose via a thin context wrapper without breaking the GSAP-ticker integration | Pattern 6 | If Lenis is refactored, stop/start interface may not exist — use `data-lenis-prevent-wheel` as fallback |
| A3 | `RoomEnvironment` from `three/examples/jsm/environments/RoomEnvironment.js` resolves correctly once `transpilePackages: ['three']` is added | Pattern 2 / Pitfall 3 | If the subpath import still fails, use a manual PMREM setup with a DataTexture instead |
| A4 | MeshPhysicalMaterial clearcoat at `clearcoat: 0.9, clearcoatRoughness: 0.1` will push the visual quality noticeably toward Lusion's material look — exact values need live tuning | Material Elevation section | Parameters are starting points; visual result may require iteration |
| A5 | `failIfMajorPerformanceCaveat: true` in WebGL detection will correctly block software renderers on all target browsers (Chrome 100+, Safari 15.4+) | Pattern: WebGL Detection | Safari behavior with `failIfMajorPerformanceCaveat` may differ — test on mobile Safari specifically |

---

## Open Questions

1. **How to produce the poster image (D-08)?**
   - What we know: It's a still render of the elevated blob in the object slot. D-08 says "one-time render/screenshot committed as a static asset."
   - What's unclear: The planner chooses the method. Options: (a) run the dev server, open the homepage, screenshot the canvas with browser DevTools, export as WebP; (b) write a one-off Node script using `puppeteer` to headlessly render the canvas and capture it; (c) use the existing vanilla prototype (`site.js`) in a browser, screenshot at the elevated material settings.
   - Recommendation: Option (a) — simplest, requires no new tooling. Developer opens dev server after blob is implemented, takes a DevTools screenshot of the canvas element at max quality, saves as `/public/hero-blob-poster.webp`. The poster becomes a one-time manually-committed asset.

2. **Lenis context refactor scope?**
   - What we know: `LenisProvider` does not currently expose a context. Adding context requires augmenting the existing provider.
   - What's unclear: Whether modifying `LenisProvider` for homepage use is in scope or if `data-lenis-prevent-wheel` on the scroller `div` is simpler/sufficient.
   - Recommendation: Use `data-lenis-prevent-wheel` on the `#scroller` div first. If the raw `deltaY` fresh-gesture detection still misbehaves due to Lenis interference, upgrade to the full `stop()`/`start()` context approach.

3. **Footer as last slide — layout edge case?**
   - What we know: Prototype has `deck-foot` class on slide 5: `height: auto; min-height: 100%; justify-content: flex-end; padding-top: 12vh`. The current `layout.tsx` renders `<InkFooter />` globally.
   - What's unclear: Whether the homepage should suppress the global `<InkFooter />` when the footer is the last slide.
   - Recommendation: The homepage replaces the footer by including it as slide 5 content. The global `<InkFooter />` should be hidden on `/` — either conditionally suppress it in `layout.tsx` via pathname check, or make the homepage a route group that excludes the footer.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev | ✓ | v26.0.0 | — |
| npm | Package install | ✓ | 11.12.1 | — |
| Vercel preview | Phase 14 baseline | ✓ | (cloud) | — |
| Browser WebGL2 | HeroBlobCanvas | Checked at runtime | — | Poster image fallback (D-08) |
| `three@0.184.0` | TD-01 | Not yet installed | 0.184.0 available | — |
| `@react-three/fiber@9.6.1` | TD-01 | Not yet installed | 9.6.1 available | — |
| `@react-three/test-renderer@9.1.0` | Tests | Not yet installed | 9.1.0 available | — |
| `ffmpeg` | (not needed this phase) | ✓ | available | — |

**Missing dependencies with no fallback:**
- `three` and `@react-three/fiber` — must be installed before any 3D work begins. Wave 0 install task.

**Missing dependencies with fallback:**
- Browser WebGL2 — runtime detection falls back to poster image (D-08/D-09).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npx vitest run src/__tests__/home-deck/` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HD-01 | One wheel gesture advances one slide | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ Wave 0 |
| HD-02 | Fresh-gesture detection filters momentum; reversal bypasses lock | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ Wave 0 |
| HD-03 | Keyboard (ArrowDown/Up/Home/End) advances slides | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ Wave 0 |
| HD-04 | Slide 2 BigList renders with 3 links | unit | `npx vitest run src/__tests__/home-deck/slides.test.tsx` | ❌ Wave 0 |
| HD-05 | Touch device detection returns true on `pointer: coarse` | unit | `npx vitest run src/__tests__/home-deck/use-deck-mode.test.ts` | ❌ Wave 0 |
| TD-01 | HeroBlob component renders without crash (R3F test renderer) | unit | `npx vitest run src/__tests__/home-deck/hero-blob.test.tsx` | ❌ Wave 0 |
| TD-02 | objEnter sets correct initial and final transform values | unit | `npx vitest run src/__tests__/home-deck/obj-enter.test.ts` | ❌ Wave 0 |
| TD-03 | WebGL support detection correctly identifies context availability | unit | `npx vitest run src/__tests__/home-deck/use-webgl-support.test.ts` | ❌ Wave 0 |

**Testing notes:**
- The deck controller is pure logic (refs + DOM manipulation) — test it with jsdom and fake DOM elements. No R3F needed for controller tests.
- For `HeroBlob` unit tests, use `@react-three/test-renderer@9.1.0` — it renders the scene graph without WebGL context. Vitest's jsdom environment does not provide WebGL; the test-renderer bypasses this.
- HD-05 / touch detection: mock `window.matchMedia` in setup — the existing test setup (`src/__tests__/setup.ts`) already imports `@testing-library/jest-dom/vitest`.
- TD-03 (WebGL detection): mock `document.createElement` to return a canvas with a spy on `getContext`.

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/home-deck/`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/home-deck/deck-controller.test.ts` — covers HD-01, HD-02, HD-03
- [ ] `src/__tests__/home-deck/slides.test.tsx` — covers HD-04
- [ ] `src/__tests__/home-deck/use-deck-mode.test.ts` — covers HD-05
- [ ] `src/__tests__/home-deck/hero-blob.test.tsx` — covers TD-01 (requires `@react-three/test-renderer` installed)
- [ ] `src/__tests__/home-deck/obj-enter.test.ts` — covers TD-02
- [ ] `src/__tests__/home-deck/use-webgl-support.test.ts` — covers TD-03

---

## Security Domain

> No ASVS categories apply to this phase. The homepage is purely a presentation layer with no authentication, session management, form inputs, or server-side data mutation. The only data flow is: static JSX → browser render → R3F WebGL canvas. No user input is sent to any server.

| ASVS Category | Applies | Notes |
|---------------|---------|-------|
| V2 Authentication | No | No auth in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Public homepage |
| V5 Input Validation | No | No user input processed server-side |
| V6 Cryptography | No | No crypto operations |

**XSS note:** Slide content is hardcoded JSX (D-10) — no dynamic user content, no `dangerouslySetInnerHTML`. No additional ASVS controls needed.

---

## Sources

### Primary (HIGH confidence)
- [r3f.docs.pmnd.rs/api/canvas](https://r3f.docs.pmnd.rs/api/canvas) — Canvas props, defaults (outputColorSpace, ACESFilmicToneMapping, dpr), gl prop
- [r3f.docs.pmnd.rs/api/hooks](https://r3f.docs.pmnd.rs/api/hooks) — useFrame signature, no-setState rule, delta param
- [r3f.docs.pmnd.rs/getting-started/installation](https://r3f.docs.pmnd.rs/getting-started/installation) — transpilePackages requirement, version pairing
- [nextjs.org/docs/app/guides/lazy-loading](https://nextjs.org/docs/app/guides/lazy-loading) — `ssr: false` must be in Client Component; dynamic import patterns
- [threejs.org/docs/pages/MeshPhysicalMaterial.html](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) — clearcoat, clearcoatRoughness, envMap optional but recommended
- [threejs.org/docs/pages/RoomEnvironment.html](https://threejs.org/docs/pages/RoomEnvironment.html) — procedural IBL source
- [github.com/mrdoob/three.js/wiki/Migration-Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) — r128→r152+ API changes (outputEncoding→outputColorSpace, sRGBEncoding→SRGBColorSpace)
- [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — stop()/start()/destroy() methods; data-lenis-prevent-wheel attribute
- npm registry: `three@0.184.0`, `@react-three/fiber@9.6.1`, `@react-three/test-renderer@9.1.0` — versions, peer dependencies, publication dates [VERIFIED: npm registry]
- `.planning/sketches/002-full-site-model/assets/site.js` — canonical source for initBlob() and deckInit()/objEnter()

### Secondary (MEDIUM confidence)
- [github.com/pmndrs/react-three-fiber/blob/master/docs/getting-started/installation.mdx](https://github.com/pmndrs/react-three-fiber/blob/master/docs/getting-started/installation.mdx) — Next.js transpilePackages confirmed
- [developer.mozilla.org/docs/Web/API/WebGL_API/By_example/Detect_WebGL](https://developer.mozilla.org/docs/Web/API/WebGL_API/By_example/Detect_WebGL) — WebGL detection pattern; failIfMajorPerformanceCaveat

### Tertiary (LOW confidence — informational only)
- Various community threads on Lenis + Next.js route conflicts — confirmed stop()/start() is the correct approach; data-lenis-prevent-wheel as simpler alternative

---

## Metadata

**Confidence breakdown:**
- Standard stack (R3F, three.js, Next.js lazy-load): HIGH — verified against official docs and npm registry
- Architecture (deck controller port, Lenis conflict, LCP strategy): HIGH — based on official docs + analysis of actual prototype code
- Material elevation parameters (clearcoat values): MEDIUM — starting points only; require live visual tuning
- Testing patterns (R3F test renderer with vitest): MEDIUM — R3F test renderer peer deps confirmed; vitest/jsdom WebGL mocking pattern is standard

**Research date:** 2026-06-18
**Valid until:** 2026-07-18 (stable libraries; R3F and three.js release frequently but API surface used here is stable)
