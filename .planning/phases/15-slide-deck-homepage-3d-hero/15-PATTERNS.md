# Phase 15: WebGL Explorative Homepage - Pattern Map

**Mapped:** 2026-06-19
**Files analyzed:** 14 new/modified files
**Analogs found:** 14 / 14

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/app/globals.css` | config | transform | `src/app/globals.css` (current) | exact — in-place palette swap |
| `src/app/page.tsx` | route | request-response | `src/app/page.tsx` (current) | exact — single import swap |
| `src/components/home/explorative-homepage.tsx` | component | event-driven | `src/components/home-deck/deck-homepage.tsx` | exact — gate logic carry-forward, drop deck/lenis.stop |
| `src/components/home/canvas-loader.tsx` | component | event-driven | `src/components/home-deck/deck-homepage.tsx` lines 19-22 + RESEARCH Pattern 3 | role-match — extracts the dynamic({ssr:false}) responsibility |
| `src/components/home/hero-blob-canvas.tsx` | component | event-driven | `src/components/home-deck/hero-blob-canvas.tsx` | exact — add EffectComposer + Bloom + postprocessing |
| `src/components/home/hero-blob.tsx` | component | event-driven | `src/components/home-deck/hero-blob.tsx` | exact — migrate JS morph loop to GPU vertex shader via CSM |
| `src/components/home/hero-podium.tsx` | component | event-driven | `src/components/home-deck/hero-blob-canvas.tsx` (mesh child pattern) | partial — new primitive, copy mesh/material pattern |
| `src/components/home/fallback-poster.tsx` | component | request-response | `src/components/home-deck/fallback-poster.tsx` | exact — path update only |
| `src/components/home/section-building.tsx` | component | request-response | `src/components/home-deck/slide-index.tsx` | exact — BigList carry-forward |
| `src/components/home/section-writing.tsx` | component | request-response | `src/components/home-deck/slide-hero.tsx` + `src/app/writing/page.tsx` | role-match — static editorial content pattern |
| `src/components/home/section-newsletter.tsx` | component | request-response | `src/components/home-deck/slide-newsletter.tsx` | exact — strip deck-slide class, adapt to scroll layout |
| `src/components/home/section-footer.tsx` | component | request-response | `src/components/home-deck/slide-footer.tsx` | exact — strip deck-slide class, adapt to scroll layout |
| `src/components/layout/conditional-footer.tsx` | component | request-response | `src/components/layout/conditional-footer.tsx` (current) | exact — already suppresses on `/`, no change needed |
| `src/__tests__/home/` (4 test files) | test | request-response | `src/__tests__/home-deck/` (existing tests) | exact — carry-forward mock patterns |

---

## Pattern Assignments

### `src/app/globals.css` (config, transform)

**Analog:** `src/app/globals.css` (current file — in-place replacement)

**Current `@theme inline` block** (lines 3-33) — REPLACE ENTIRELY with Crimson Line tokens:

```css
/* Current — Crimson Poster (REMOVE) */
@theme inline {
  --color-bg:            #d93c1e;
  --color-bg-2:          #c8341a;
  --color-surface:       #cc3719;
  --accent:              #0a0503;
  --color-border:        rgba(10,5,3,0.26);
  --color-border-strong: rgba(10,5,3,0.5);
  --color-text:          #120604;
  --color-text-dim:      rgba(10,5,3,0.74);
  --color-text-muted:    rgba(10,5,3,0.52);
  /* ... type scale and fonts below ... */
}

/* New — Crimson Line (REPLACE WITH) */
@theme inline {
  --color-bg:             #0a0a0a;
  --color-bg-2:           #0d0d0f;
  --color-surface:        #141416;
  --color-border:         rgba(245,245,240,0.10);
  --color-border-strong:  rgba(245,245,240,0.22);
  --color-text:           #f5f5f0;
  --color-text-dim:       #b6b6b0;
  --color-text-muted:     #6f6f6a;
  --accent:               #e23838;
  --accent-hover:         #ff4d4d;
  --accent-deep:          #b51d1d;
  --accent-glow:          rgba(226,56,56,0.40);
  --blob-core:            #161617;
  --blob-rim:             #e23838;
  /* Type scale and fonts: copy unchanged from current file */
}
```

**`:root` sig vars** (lines 69-73) — UPDATE (crimson-line semantics):

```css
/* Current — points to bg (#d93c1e = crimson fill) */
:root {
  --sig:        var(--color-bg, #d93c1e);
  --sig-shadow: 0.055em 0.055em 0 #0a0503;
}

/* New — off-white fill, crimson-deep shadow */
:root {
  --sig:        var(--color-text);         /* off-white fill */
  --sig-shadow: 0.055em 0.055em 0 var(--accent-deep);
}
```

**Deck-specific CSS block** (lines 134-258) — REMOVE the entire `/* Phase 15 — Deck Styles */` block. Replace with new explorative-homepage layout CSS (expansive sections, hero overlay positioning).

**Keep unchanged:** `html`, `body`, `a`, `.sig`, `.sig-out`, `@keyframes scroll`, `.prose` blocks — these are reused by interior pages. Only the `:root` sig vars and `@theme inline` tokens change.

---

### `src/app/page.tsx` (route, request-response)

**Analog:** `src/app/page.tsx` (current)

**Current pattern** (entire file — 24 lines):

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { DeckHomepage } from "@/components/home-deck/deck-homepage";

export const revalidate = false;

export default function Home() {
  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <DeckHomepage />
    </>
  );
}
```

**Change:** Single import swap. Keep `revalidate = false`, `JsonLd`, `buildPersonSchema`. Change only:

```tsx
// FROM:
import { DeckHomepage } from "@/components/home-deck/deck-homepage";
// <DeckHomepage />

// TO:
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";
// <ExplorativeHomepage />
```

No other changes to `page.tsx`.

---

### `src/components/home/explorative-homepage.tsx` (component, event-driven)

**Analog:** `src/components/home-deck/deck-homepage.tsx`

**Imports pattern** (lines 1-13 of analog — adapt):

```tsx
"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
// DROP: useDeckController, objEnter, useLenisControl (no lenis.stop in new layout)
// DROP: SlideHero, SlideIndex, SlidePrometheus, SlideNewsletter, SlideFooter
// ADD: new section components + CanvasLoader
import { CanvasLoader } from "./canvas-loader";
import { FallbackPoster } from "./fallback-poster";
import { SectionBuilding } from "./section-building";
import { SectionWriting } from "./section-writing";
import { SectionNewsletter } from "./section-newsletter";
import { SectionFooter } from "./section-footer";
```

**Gate detection pattern** (lines 46-59 of analog — VERBATIM CARRY-FORWARD):

```tsx
// Mount-time detection — runs once in the browser (never on server)
useEffect(() => {
  // Touch / small-screen detection (HD-05, D-04)
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  setIsTouchOrSmall(coarse || window.innerWidth < 760);

  // WebGL2 detection with software-renderer guard
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    setWebglOk(!!ctx);
  } catch {
    setWebglOk(false);
  }
}, []);
```

**Derived flags** (lines 63-65 of analog — ADAPT, drop showDeck):

```tsx
// No showDeck concept in explorative layout — scroll is always native
const showCanvas = !isTouchOrSmall && !prefersReduced && webglOk;
```

**CRITICAL OMISSION vs analog:** Do NOT carry forward lines 70-76 (lenis.stop/start). The new layout does not stop Lenis — scroll is the primary navigation mechanism.

```tsx
// DO NOT COPY — REMOVED in explorative layout:
// const lenis = useLenisControl();
// useEffect(() => {
//   if (showDeck) { lenis?.stop(); return () => lenis?.start(); }
// }, [showDeck, lenis]);
```

**Layout pattern** — expansive scroll-story instead of fixed-stage deck:

```tsx
return (
  <div className="explorative-homepage min-h-screen bg-bg">
    {/* Hero section — full viewport height, WebGL canvas overlaid */}
    <section className="relative min-h-dvh flex flex-col justify-center px-[8vw]">
      {/* LCP element — SSR'd text, never inside canvas */}
      <h1 className="font-display font-bold uppercase leading-[0.9] sig sr-only">
        Monty Singer
      </h1>
      {/* ... visible name treatment ... */}

      {/* Canvas slot — positioned absolute, fills hero section */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {showCanvas ? <CanvasLoader /> : <FallbackPoster />}
      </div>
    </section>

    {/* Section beats — normal document flow (expansive scroll) */}
    <SectionBuilding />
    <SectionWriting />
    <SectionNewsletter />
    <SectionFooter />
  </div>
);
```

---

### `src/components/home/canvas-loader.tsx` (component, event-driven)

**Analog:** `src/components/home-deck/deck-homepage.tsx` lines 19-22 (the `dynamic()` call)

**Core pattern** — extracts dynamic import into its own "use client" file. Adds requestIdleCallback for after-LCP mount:

```tsx
"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// dynamic() MUST be called in a "use client" file — Next 16 build hard-fails otherwise
const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), { ssr: false });

export function CanvasLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestIdleCallback defers until after LCP + first user interaction window
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    // Safari fallback — 200ms is past LCP paint in virtually all cases
    const id = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;
  return <HeroBlobCanvas />;
}
```

**Key difference from analog:** The analog (`deck-homepage.tsx` lines 19-22) called `dynamic()` at module scope inside the orchestrator. This new file separates after-LCP timing into a dedicated component, keeping `explorative-homepage.tsx` gate-logic clean.

---

### `src/components/home/hero-blob-canvas.tsx` (component, event-driven)

**Analog:** `src/components/home-deck/hero-blob-canvas.tsx` (entire file — 21 lines)

**Current analog pattern** (entire file):

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { HeroBlob } from "./hero-blob";

export default function HeroBlobCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 0, 4.4] as [number, number, number], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroBlob />
      <directionalLight color={0xffffff} intensity={1.9} position={[3, 4, 5]} />
      <directionalLight color={0xff6a3a} intensity={1.7} position={[-4, -2, -4]} />
      <directionalLight color={0xffffff} intensity={0.45} position={[-3, 2, 3]} />
      <ambientLight color={0x1a0a06} intensity={0.5} />
    </Canvas>
  );
}
```

**New pattern additions:**
1. Import `HeroPodium` from `./hero-podium`
2. Import `EffectComposer`, `Bloom` from `@react-three/postprocessing`
3. Add crimson rim light (`color={0xe23838}`) to push luminance above Bloom threshold
4. Add `<HeroPodium />` after `<HeroBlob />`
5. Add `<EffectComposer>` with `<Bloom>` after all mesh children
6. Keep `Canvas` props unchanged (camera position, dpr, alpha)

```tsx
// ADD these imports:
import { HeroPodium } from "./hero-podium";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// REPLACE the directionalLight at position [-4,-2,-4] (the orange-ish rim):
<directionalLight color={0xe23838} intensity={2.2} position={[-4, -2, -4]} />

// ADD after HeroBlob + HeroPodium, before </Canvas>:
<EffectComposer>
  <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.6} radius={0.4} />
</EffectComposer>
```

---

### `src/components/home/hero-blob.tsx` (component, event-driven)

**Analog:** `src/components/home-deck/hero-blob.tsx` (entire file — 92 lines)

**Imports pattern** (lines 1-6 of analog — adapt):

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
// ADD:
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
```

**Geometry pattern** (line 14 of analog — ADD computeTangents):

```tsx
// FROM (analog line 14):
const blobGeo = useMemo(() => new THREE.IcosahedronGeometry(1.3, 12), []);

// TO — tangents required by GPU vertex shader:
const blobGeo = useMemo(() => {
  const g = new THREE.IcosahedronGeometry(1.3, 12);
  g.computeTangents(); // required for tangent attribute in vertex shader
  return g;
}, []);
```

**IBL pattern** (lines 26-32 of analog — VERBATIM CARRY-FORWARD):

```tsx
// IBL setup: RoomEnvironment + PMREMGenerator (one-time, no external HDR file)
const { gl, scene } = useThree();
useMemo(() => {
  const pmrem = new THREE.PMREMGenerator(gl);
  const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
  scene.environment = envMap;
  pmrem.dispose();
}, [gl, scene]);
```

**Core pattern — REPLACE JS morph loop** (lines 35-72 of analog) with GPU shader:

```tsx
// REMOVE (analog lines 35-72 — the entire per-frame JS morph loop):
// useFrame(() => {
//   tRef.current += 0.006; ...
//   for (let i = 0; i < pos.count; i++) { ... }
//   pos.needsUpdate = true;
//   blobGeo.computeVertexNormals(); // ← this is the expensive call to remove
//   ...
// });

// REPLACE WITH — GPU vertex shader via CSM:
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

    // Tangent-space normal recalculation (no JS computeVertexNormals needed)
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

const mat = useMemo(() => new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader: BLOB_VERT,
  uniforms: { uTime: { value: 0 } },
  // PBR props — same values as analog lines 79-85:
  color: 0x140805,
  metalness: 0.6,
  roughness: 0.18,
  clearcoat: 0.9,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1.2,
}), []);

useFrame(({ clock }) => {
  mat.uniforms.uTime.value = clock.getElapsedTime();
  // Autonomous rotation — cheap, stays in JS (analog lines 62-66 carry-forward):
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.0035;
    meshRef.current.rotation.x = Math.sin(mat.uniforms.uTime.value * 0.3) * 0.22;
  }
});
```

**JSX pattern** (lines 76-91 of analog — SIMPLIFY, drop wireframe mesh):

```tsx
// FROM (analog):
return (
  <>
    <mesh ref={meshRef} geometry={blobGeo}>
      <meshPhysicalMaterial ... />
    </mesh>
    <mesh ref={wireRef} geometry={wireGeo}>
      <meshBasicMaterial wireframe ... />
    </mesh>
  </>
);

// TO — material is now CSM instance passed directly:
return (
  <mesh ref={meshRef} geometry={blobGeo} material={mat} />
);
// Wire overlay is optional — omit for v1 (reduces draw calls)
```

---

### `src/components/home/hero-podium.tsx` (component, event-driven)

**Analog:** `src/components/home-deck/hero-blob-canvas.tsx` (mesh-as-child-of-Canvas pattern)

No direct analog exists for a podium component. Use the same mesh/material JSX pattern from `hero-blob-canvas.tsx`'s light children, following three.js geometry conventions:

```tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * HeroPodium — thin reflective disc beneath the hero blob (D-08).
 * Simple CylinderGeometry. MeshStandardMaterial with faint crimson emissive.
 */
export function HeroPodium() {
  const geo = useMemo(() => new THREE.CylinderGeometry(1.6, 1.6, 0.06, 64), []);

  return (
    <mesh geometry={geo} position={[0, -1.55, 0]}>
      <meshStandardMaterial
        color={0x141414}
        metalness={0.8}
        roughness={0.1}
        emissive={0xe23838}
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}
```

---

### `src/components/home/fallback-poster.tsx` (component, request-response)

**Analog:** `src/components/home-deck/fallback-poster.tsx` (entire file — 34 lines)

**Pattern: VERBATIM COPY** — no logic changes. Only update:
1. File path (from `home-deck/` to `home/`)
2. The `cn` import path (verify `@/utils/cn` still resolves — it will)

```tsx
// Carry forward verbatim from src/components/home-deck/fallback-poster.tsx
// Key patterns to preserve (do NOT remove):
import Image from "next/image";
// ...
<Image
  src="/hero-blob-poster.webp"
  alt="3D hero object — morphing blob with crimson rim"
  fill
  priority
  fetchPriority="high"   // ← CRITICAL: Next 16 does not auto-emit without this
  loading="eager"
  sizes="(max-width: 760px) 100vw, 45vw"  // update sizes for full-width mobile
  className="object-contain"
/>
```

---

### `src/components/home/section-building.tsx` (component, request-response)

**Analog:** `src/components/home-deck/slide-index.tsx` (entire file — 28 lines)

**Pattern — carry-forward BigList, strip deck-slide classes:**

```tsx
import { BigList } from "@/components/v3/big-list";
import { SectionLabel } from "@/components/v3/section-label";

// FROM analog (lines 11-27):
// <section className="deck-slide deck-slide--index flex flex-col justify-center min-h-dvh px-[8vw]">
//   <SectionLabel numeral="02">What I'm</SectionLabel>
//   <BigList items={[...]} />
// </section>

// TO — strip "deck-slide" class, use expansive scroll layout:
export function SectionBuilding() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="01">What I&apos;m</SectionLabel>
      <BigList
        items={[
          { label: "Building", href: "/projects", tag: "WORKS" },
          { label: "Writing",  href: "/writing",  tag: "ESSAYS" },
          {
            label: "Doing",
            href: "https://prometheus.today",
            tag: "PROMETHEUS",
            outline: true,
          },
        ]}
      />
    </section>
  );
}
```

---

### `src/components/home/section-writing.tsx` (component, request-response)

**Analog:** `src/components/home-deck/slide-hero.tsx` (static editorial content pattern) + `src/app/writing/page.tsx` (content shape)

**Pattern — static editorial content, no Notion fetch (D-13):**

```tsx
// Server Component — no "use client"
import Link from "next/link";
import { SectionLabel } from "@/components/v3/section-label";
import { Button } from "@/components/v3/button";

// Static essay data (D-13: Notion-wiring is Phase 16)
const FEATURED_ESSAYS = [
  { title: "Essay title 1", href: "/writing/slug-1", date: "Jun 2026" },
  { title: "Essay title 2", href: "/writing/slug-2", date: "May 2026" },
  { title: "Essay title 3", href: "/writing/slug-3", date: "Apr 2026" },
];

export function SectionWriting() {
  return (
    <section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
      <SectionLabel numeral="02">Writing</SectionLabel>
      {/* Essay list */}
      {FEATURED_ESSAYS.map((essay) => (
        <Link key={essay.href} href={essay.href}
          className="flex justify-between border-t border-border py-[1.4vh] text-text hover:text-accent transition-colors duration-150">
          <span className="font-display font-bold text-xl">{essay.title}</span>
          <span className="font-mono text-xs text-text-muted self-center">{essay.date}</span>
        </Link>
      ))}
      <div className="mt-8 border-t border-border pt-6">
        <Button href="/writing">All essays →</Button>
      </div>
    </section>
  );
}
```

---

### `src/components/home/section-newsletter.tsx` (component, request-response)

**Analog:** `src/components/home-deck/slide-newsletter.tsx` (entire file — 57 lines)

**Pattern — strip "deck-slide" class, preserve all content and v3 primitives:**

```tsx
// FROM analog line 12:
// <section className="deck-slide deck-slide--newsletter flex flex-col justify-center min-h-dvh px-[8vw]">

// TO:
<section className="min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]">
```

All content (SectionLabel, heading, paragraph, NewsletterCarousel, Button) carries forward verbatim from the analog.

---

### `src/components/home/section-footer.tsx` (component, request-response)

**Analog:** `src/components/home-deck/slide-footer.tsx` (entire file — 146 lines)

**Pattern — strip "deck-slide deck-slide--footer deck-foot" classes, preserve all link content:**

```tsx
// FROM analog line 18:
// <section className="deck-slide deck-slide--footer deck-foot flex flex-col justify-end h-auto min-h-full pt-[12vh] px-[8vw] pb-14">

// TO — remove deck-* classes:
<section className="flex flex-col justify-end min-h-[40vh] px-[8vw] pb-14 pt-[12vh]">
```

All nav columns (Site, More, Elsewhere, Contact), copyright/colophon, and the "Let's be friends." heading carry forward verbatim from lines 20-143 of the analog. Token classes (`text-text`, `text-text-muted`, `border-border`, `hover:text-accent`) work identically after the palette swap.

---

### `src/components/layout/conditional-footer.tsx` (component, request-response)

**Analog:** Itself (no change)

Already suppresses on `pathname === "/"` (lines 16-17). The homepage's `SectionFooter` beat is the footer for `/`. No modification needed.

```tsx
// Current file — VERIFIED correct as-is:
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;  // ← already suppresses on homepage
  return <InkFooter />;
}
```

---

### `src/__tests__/home/hero-blob.test.tsx` (test, request-response)

**Analog:** `src/__tests__/home-deck/hero-blob.test.tsx` (entire file — 32 lines)

**Pattern — carry-forward mock pattern, update import path and add CSM mock:**

```tsx
import { describe, it, expect, vi } from "vitest";
import { create } from "@react-three/test-renderer";

// Carry-forward mocks from analog (lines 5-24):
vi.mock("three/examples/jsm/environments/RoomEnvironment.js", () => ({
  RoomEnvironment: class { constructor() {} },
}));
vi.mock("three", async () => {
  const actual = await vi.importActual<typeof import("three")>("three");
  return {
    ...actual,
    PMREMGenerator: class {
      constructor(_renderer: unknown) {}
      fromScene(_scene: unknown) { return { texture: {} }; }
      dispose() {}
    },
  };
});

// ADD — mock for three-custom-shader-material:
vi.mock("three-custom-shader-material/vanilla", () => ({
  default: class CustomShaderMaterial {
    constructor(opts: unknown) { Object.assign(this, opts); }
    uniforms = { uTime: { value: 0 } };
  },
}));

describe("HeroBlob R3F scene (TD-01)", () => {
  it("renders scene graph without crash (GPU morph, no WebGL required)", async () => {
    const { HeroBlob } = await import("@/components/home/hero-blob"); // ← updated path
    const renderer = await create(<HeroBlob />);
    expect(renderer.scene.children.length).toBeGreaterThan(0);
  });
});
```

---

### `src/__tests__/home/canvas-loader.test.tsx` (test, event-driven)

**Analog:** `src/__tests__/home-deck/hero-blob.test.tsx` (mock pattern) + Vitest fake timers

**Pattern — fake timers for requestIdleCallback/setTimeout, check before/after mount:**

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";

// Mock the dynamic import target
vi.mock("../../../src/components/home/hero-blob-canvas", () => ({
  default: () => <div data-testid="canvas" />,
}));
vi.mock("next/dynamic", () => ({
  default: (_fn: unknown) => {
    const { default: Comp } = vi.importActual("../../../src/components/home/hero-blob-canvas");
    return Comp;
  },
}));

describe("CanvasLoader (TD-02)", () => {
  it("renders null before idle fires", () => {
    vi.useFakeTimers();
    const { container } = render(<CanvasLoader />);
    expect(container.firstChild).toBeNull();
    vi.useRealTimers();
  });

  it("renders HeroBlobCanvas after setTimeout fires (Safari path)", async () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<CanvasLoader />);
    await act(() => vi.advanceTimersByTime(300));
    expect(getByTestId("canvas")).toBeTruthy();
    vi.useRealTimers();
  });
});
```

---

### `src/__tests__/home/explorative-homepage.test.tsx` (test, event-driven)

**Analog:** `src/__tests__/home-deck/slides.test.tsx` (render + screen assertion pattern)

**Pattern — mock matchMedia, mock WebGL, assert FallbackPoster vs CanvasLoader:**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("motion/react", () => ({ useReducedMotion: () => false }));
vi.mock("@/components/home/canvas-loader", () => ({
  CanvasLoader: () => <div data-testid="canvas-loader" />,
}));
vi.mock("@/components/home/fallback-poster", () => ({
  FallbackPoster: () => <div data-testid="fallback-poster" />,
}));

describe("ExplorativeHomepage gate (TD-03 + HD-05)", () => {
  it("shows fallback poster on pointer:coarse (touch device)", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((q) => ({
      matches: q === "(pointer: coarse)",
      // ... MediaQueryList stub
    } as MediaQueryList));
    const { ExplorativeHomepage } = await import("@/components/home/explorative-homepage");
    render(<ExplorativeHomepage />);
    expect(screen.getByTestId("fallback-poster")).toBeTruthy();
  });

  it("shows fallback when WebGL2 unavailable", async () => {
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") return { getContext: () => null } as unknown as HTMLElement;
      return document.createElement(tag);
    });
    // ... assert fallback-poster
  });
});
```

---

### `src/__tests__/home/section-building.test.tsx` (test, request-response)

**Analog:** `src/__tests__/home-deck/slides.test.tsx` (entire file — 21 lines, verbatim pattern)

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("SectionBuilding (HD-04)", () => {
  it("renders BigList with Building/Writing/Doing links", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(<SectionBuilding />);
    expect(screen.getByText(/Building/i)).toBeDefined();
    expect(screen.getByText(/Writing/i)).toBeDefined();
    expect(screen.getByText(/Doing/i)).toBeDefined();
  });
});
```

---

## Shared Patterns

### Gate Detection (WebGL2 + touch/small/reduced-motion)
**Source:** `src/components/home-deck/deck-homepage.tsx` lines 46-65
**Apply to:** `explorative-homepage.tsx`

```tsx
// Verbatim from deck-homepage.tsx lines 46-65 — proven pattern
const prefersReduced = useReducedMotion();
const [isTouchOrSmall, setIsTouchOrSmall] = useState(false);
const [webglOk, setWebglOk] = useState(false);

useEffect(() => {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  setIsTouchOrSmall(coarse || window.innerWidth < 760);
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    setWebglOk(!!ctx);
  } catch {
    setWebglOk(false);
  }
}, []);

const showCanvas = !isTouchOrSmall && !prefersReduced && webglOk;
```

### LCP Image with fetchPriority
**Source:** `src/components/home-deck/fallback-poster.tsx` lines 22-31
**Apply to:** `fallback-poster.tsx`, and any `<Image>` that is the LCP element on mobile

```tsx
// From MEMORY.md — Next 16 does not auto-emit fetchPriority
<Image
  priority
  fetchPriority="high"
  loading="eager"
  // ...
/>
```

### "use client" + dynamic({ssr:false}) placement
**Source:** `src/components/home-deck/deck-homepage.tsx` lines 1-22
**Apply to:** `canvas-loader.tsx`

Rule: `dynamic()` must be called in a file that has `"use client"` at the top. The call cannot be in a Server Component. Violation = Next 16 build hard-fail.

### IBL Setup (RoomEnvironment)
**Source:** `src/components/home-deck/hero-blob.tsx` lines 26-32
**Apply to:** `hero-blob.tsx` (migrated)

```tsx
const { gl, scene } = useThree();
useMemo(() => {
  const pmrem = new THREE.PMREMGenerator(gl);
  const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
  scene.environment = envMap;
  pmrem.dispose();
}, [gl, scene]);
```

### Section layout class pattern
**Source:** `src/components/home-deck/slide-index.tsx`, `slide-newsletter.tsx`, `slide-footer.tsx`
**Apply to:** All four `section-*.tsx` components

Strip `deck-slide deck-slide--*` classes. Use `min-h-dvh flex flex-col justify-center px-[8vw] py-[15vh]` as the base. Footer section uses `min-h-[40vh] justify-end`.

### Token classes (v3 palette-aware)
**Source:** `src/components/home-deck/slide-footer.tsx` lines 37-99
**Apply to:** All section components

After the palette swap, these classes render correctly on dark background:
- `text-text` — off-white `#f5f5f0`
- `text-text-muted` — muted `#6f6f6a`
- `border-border` — `rgba(245,245,240,0.10)`
- `hover:text-accent` — crimson `#e23838`
- `.sig` — off-white fill, crimson-deep shadow
- `.sig-out` — crimson stroke, transparent fill

### Test mock pattern for R3F + WebGL
**Source:** `src/__tests__/home-deck/hero-blob.test.tsx` lines 1-24 + `use-webgl-support.test.ts`
**Apply to:** All `src/__tests__/home/*.test.tsx` files

```tsx
// Standard R3F mocks (copy verbatim):
vi.mock("three/examples/jsm/environments/RoomEnvironment.js", () => ({
  RoomEnvironment: class { constructor() {} },
}));
vi.mock("three", async () => {
  const actual = await vi.importActual<typeof import("three")>("three");
  return { ...actual, PMREMGenerator: class { ... } };
});

// Standard matchMedia mock (copy for gate tests):
vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as MediaQueryList));
```

### Lenis provider access
**Source:** `src/components/providers/lenis-provider.tsx` lines 6-7
**Apply to:** `explorative-homepage.tsx` (but NOT for stop/start — for progress reading)

The existing `LenisControlContext` exposes `{ stop, start }` only. For scroll progress in `useFrame`, use the `addEffect` + `window.scrollY / maxScroll` pattern (RESEARCH Pattern 4, Option 2) — do NOT extend the provider context.

---

## No Analog Found

All files have close analogs in the codebase. The only new primitives with no direct analog are:

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `src/components/home/hero-podium.tsx` | component | event-driven | No other podium/disc mesh components exist; use standard three.js CylinderGeometry pattern |
| GLSL shader string in `hero-blob.tsx` | — | — | No existing GLSL in the codebase; pattern sourced from RESEARCH.md Pattern 2 + Code Examples |
| `public/hero-blob-poster.webp` (placeholder) | asset | — | Static asset; use Playwright or in-browser canvas.toDataURL capture workflow (RESEARCH Pattern 6) |

---

## Key Decisions Encoded in Patterns

1. `lenis.stop()` is REMOVED from the new homepage — the explorative layout uses Lenis as the primary scroll controller. The analog (`deck-homepage.tsx` lines 70-76) had this because the deck controller owned wheel events. Do not copy those lines.

2. `ConditionalFooter` already suppresses on `/` — confirmed in `src/components/layout/conditional-footer.tsx` line 17. No change needed; `SectionFooter` will be the homepage's only footer.

3. The `dynamic({ssr:false})` call moves from the orchestrator (`deck-homepage.tsx` line 19) into the dedicated `canvas-loader.tsx`. This isolates the after-LCP timing concern from the gate detection concern.

4. Palette swap is Wave 0 — it must land before any new components are built, because every component with `text-text`, `bg-bg`, `border-border`, `.sig`, or `.sig-out` will render with wrong contrast until the tokens flip.

5. `fetchPriority="high"` is mandatory on `<FallbackPoster>` — confirmed in MEMORY.md and `fallback-poster.tsx` line 27. Next 16 does not auto-emit the browser resource hint from `priority` alone.

---

## Metadata

**Analog search scope:** `src/components/home-deck/`, `src/components/v3/`, `src/components/providers/`, `src/components/layout/`, `src/app/`, `src/__tests__/home-deck/`
**Files scanned:** 22
**Pattern extraction date:** 2026-06-19
