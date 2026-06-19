# Phase 15: Slide-Deck Homepage & 3D Hero — Pattern Map

**Mapped:** 2026-06-18
**Files analyzed:** 13 new/modified files
**Analogs found:** 9 / 13 (4 net-new or prototype-only)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/page.tsx` | page (Server Component) | request-response | `src/app/v3-specimen/page.tsx` | role-match |
| `src/components/home-deck/deck-homepage.tsx` | orchestrator client component | event-driven | `src/components/home-v2/manifesto-reveal.tsx` | role-match |
| `src/components/home-deck/deck-controller.ts` | hook (controller) | event-driven | prototype `deckInit()` + `src/components/home-v2/cycling-photo.tsx` | behavior-exact / structure-match |
| `src/components/home-deck/hero-blob-canvas.tsx` | client component (canvas wrapper) | event-driven | NET-NEW — no existing analog | none |
| `src/components/home-deck/hero-blob.tsx` | R3F scene component | event-driven | NET-NEW — prototype `initBlob()` only | none |
| `src/components/home-deck/slide-hero.tsx` | presentational component | request-response | `src/app/v3-specimen/page.tsx` sections + `src/components/v3/page-hero.tsx` | role-match |
| `src/components/home-deck/slide-index.tsx` | presentational component | request-response | `src/app/v3-specimen/page.tsx` + `src/components/v3/big-list.tsx` | exact |
| `src/components/home-deck/slide-prometheus.tsx` | presentational component | request-response | `src/app/page.tsx` Prometheus row | role-match |
| `src/components/home-deck/slide-newsletter.tsx` | presentational component | request-response | `src/components/v3/newsletter-carousel.tsx` | role-match |
| `src/components/home-deck/slide-footer.tsx` | presentational component | request-response | `src/components/home-v2/ink-footer.tsx` | role-match |
| `src/components/home-deck/fallback-poster.tsx` | presentational component | request-response | `src/app/page.tsx` (Image usage) | partial |
| `src/components/providers/lenis-provider.tsx` | provider (augment) | event-driven | self — augmenting existing file | self |
| `next.config.ts` | config | — | self — adding `transpilePackages` | self |
| `src/__tests__/home-deck/*.test.{ts,tsx}` | test | — | `src/__tests__/providers/lenis-provider.test.tsx` + `src/__tests__/animations/scroll-reveal.test.tsx` | role-match |

---

## Pattern Assignments

---

### `src/app/page.tsx` (Server Component, replaced)

**Analog:** `src/app/v3-specimen/page.tsx`

**Imports pattern** (v3-specimen lines 1–16):
```typescript
import type { Metadata } from "next";
import { Rule } from "@/components/v3/rule";
import { BigList } from "@/components/v3/big-list";
import { PageHero } from "@/components/v3/page-hero";
// ... other v3 primitives
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
```

**Server Component shell pattern** (v3-specimen lines 50–52):
```typescript
export default function V3SpecimenPage() {
  return (
    <main className="bg-bg text-text min-h-screen ...">
```

**New homepage shell** — replaces the above with a deck wrapper; the page is now a thin Server Component that renders `<DeckHomepage />` (client boundary) plus JSON-LD. The 5-slide HTML structure should be rendered server-side inside `DeckHomepage` so SSR delivers full slide content for SEO:
```typescript
// src/app/page.tsx
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { DeckHomepage } from "@/components/home-deck/deck-homepage";

export const revalidate = false; // static — no Notion data on homepage

export default function Home() {
  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <DeckHomepage />
    </>
  );
}
```

**Metadata pattern** (current `src/app/page.tsx` line 29, `layout.tsx` lines 31–57): homepage metadata stays in `layout.tsx` (already there). No per-page `export const metadata` needed on the replaced `page.tsx`.

---

### `src/components/home-deck/deck-homepage.tsx` ("use client" orchestrator)

**Analog:** `src/components/home-v2/manifesto-reveal.tsx` (best match for client orchestrator with `useReducedMotion` branch logic + mount-time detection)

**"use client" + imports pattern** (manifesto-reveal.tsx lines 1–6):
```typescript
"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";
```

**Mount-time detection pattern** (cycling-photo.tsx lines 44–51):
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return
  const mq = window.matchMedia('(min-width: 768px)')
  setIsDesktop(mq.matches)
  const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}, [])
```

**Reduced-motion branch guard pattern** (manifesto-reveal.tsx lines 151–158 / reveal.tsx lines 31–33):
```typescript
if (shouldReduceMotion) {
  // Render static fallback — no animation, poster only
  return <NativeScrollLayout />
}
```

**dynamic import with ssr:false** — no existing analog in this codebase; must live in this "use client" file per Next.js 15 constraint. RESEARCH.md Pattern 1 is the reference:
```typescript
import dynamic from "next/dynamic";
const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), {
  ssr: false,
  loading: () => null,
});
```

**Full orchestrator structure** (synthesized from RESEARCH.md Pattern 1 + codebase patterns):
```typescript
"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDeckController } from "./deck-controller";
import { SlideHero } from "./slide-hero";
// ... other slide imports
import Image from "next/image";

const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), {
  ssr: false,
  loading: () => null,
});

export function DeckHomepage() {
  const prefersReduced = useReducedMotion();
  const [isTouchOrSmall, setIsTouchOrSmall] = useState(false);
  const [webglOk, setWebglOk] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const objWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch/small-screen detection — matches prototype @media(max-width:760px)
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchOrSmall(coarse || window.innerWidth < 760);
    // WebGL2 with software-renderer guard (RESEARCH.md Pitfall 6)
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      setWebglOk(!!ctx);
    } catch { setWebglOk(false); }
  }, []);

  const showDeck = !isTouchOrSmall && !prefersReduced;
  const showCanvas = showDeck && webglOk;

  // ... useLenisControl() stop/start + useDeckController wiring
}
```

---

### `src/components/home-deck/deck-controller.ts` (hook, event-driven)

**Analog:** Prototype `deckInit()` (site.js lines 110–167) is the behavior spec. `src/components/home-v2/cycling-photo.tsx` provides the closest React hook structure (useEffect + event listener + cleanup pattern).

**Event listener cleanup pattern** (cycling-photo.tsx lines 44–61):
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return
  const mq = window.matchMedia('(min-width: 768px)')
  // ...
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)  // cleanup
}, [])
```

**Ref-only state pattern** (manifesto-reveal.tsx lines 134–147 for the sessionStorage gate; here used for lock/index/rAF refs — never setState in the controller):
```typescript
// All controller state lives in refs — zero setState — so handlers never cause re-renders
const idxRef    = useRef(0);
const lockRef   = useRef(0);
const rafRef    = useRef(0);
const wTRef     = useRef(0);
const wDirRef   = useRef(0);
const wAbsRef   = useRef(0);
const stepDirRef = useRef(0);
```

**Core logic** — port verbatim from prototype `deckInit()` site.js lines 136–166. The RESEARCH.md Pattern 4 is the complete TypeScript translation; use it as the implementation reference:
```typescript
// Fresh-gesture detection (site.js line 147 — verbatim port):
const fresh = now - wTRef.current > 110
           || dir !== wDirRef.current
           || adel > wAbsRef.current * 1.25 + 2;

// easeInOutCubic (site.js line 139 — verbatim port):
const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// Lock duration: 820ms, tween duration: 800ms (site.js line 142)
lockRef.current = Date.now() + 820;
animateTo(slides[i].offsetTop, 800);
```

**useEffect signature** matching existing provider hooks (lenis-provider.tsx lines 10–47):
```typescript
useEffect(() => {
  const sc = scrollerRef.current;
  if (!sc) return;
  // ... attach listeners
  return () => {
    sc.removeEventListener("wheel", onWheel);
    // ... remove all listeners
    cancelAnimationFrame(rafRef.current);
  };
}, [scrollerRef, step, goTo, getSlides]);
```

---

### `src/components/home-deck/hero-blob-canvas.tsx` (NET-NEW — canvas wrapper)

**Analog:** None in this codebase. R3F has never been used here. This is the first WebGL component.

**Reference:** RESEARCH.md Pattern 3 is the complete implementation reference. Key constraints:
- Must be `"use client"` — Canvas cannot render on server
- Is dynamically imported by `deck-homepage.tsx` with `ssr: false` — this file is never directly imported from a Server Component
- `dpr={[1, 2]}` — pixel ratio cap (D-03)
- R3F v9 Canvas defaults already set `outputColorSpace = SRGBColorSpace` and `ACESFilmicToneMapping` — do NOT set them via `gl` prop (they are already correct)

```typescript
// src/components/home-deck/hero-blob-canvas.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { HeroBlob } from "./hero-blob";

export default function HeroBlobCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 0, 4.4], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroBlob />
      {/* Wire overlay: IcosahedronGeometry detail=2, wireframe, opacity 0.16
          (prototype site.js line 85; wire counter-rotates: y-=0.0018, z+=0.001) */}
      <directionalLight color={0xffffff} intensity={1.9} position={[3, 4, 5]} />
      <directionalLight color={0xff6a3a} intensity={1.7} position={[-4, -2, -4]} />
      <directionalLight color={0xffffff} intensity={0.45} position={[-3, 2, 3]} />
      <ambientLight color={0x1a0a06} intensity={0.5} />
    </Canvas>
  );
}
```

---

### `src/components/home-deck/hero-blob.tsx` (NET-NEW — R3F scene mesh)

**Analog:** None in this codebase. The functional reference is prototype `initBlob()` (site.js lines 72–103). RESEARCH.md Pattern 2 is the complete TypeScript port.

**Critical rules extracted from RESEARCH.md:**
- `useFrame` is the ONLY place to mutate geometry attributes — never `useState`, never `useEffect`
- `pos.needsUpdate = true` then `geo.computeVertexNormals()` on EVERY frame (Pitfall 4)
- `useMemo` for geometry and base positions — allocated once
- IBL setup via `RoomEnvironment + PMREMGenerator` in `useMemo` (fires once on mount)
- Upgrade from prototype's `MeshStandardMaterial` to `MeshPhysicalMaterial` with clearcoat (D-04)

```typescript
// Wire rotation pattern from prototype (site.js line 100):
// blob.rotation.y += 0.0035; blob.rotation.x = Math.sin(t*0.3)*0.22;
// wire.rotation.y -= 0.0018; wire.rotation.z += 0.001;
```

**Elevated material** (starting point, tune against Lusion bar — D-04):
```typescript
<meshPhysicalMaterial
  color={0x140805}
  metalness={0.6}
  roughness={0.18}
  clearcoat={0.9}
  clearcoatRoughness={0.1}
  envMapIntensity={1.2}
/>
```

---

### `src/components/home-deck/slide-hero.tsx` (presentational, Server Component)

**Analog:** `src/components/v3/page-hero.tsx` (hero name + sub-roles layout) + v3-specimen.tsx DS-02 sig/sig-out demonstration (lines 102–118)

**Sig treatment pattern** (v3-specimen.tsx lines 108–118):
```typescript
// Filled sig — crimson fill + drop shadow
<div className="font-display font-bold uppercase text-[clamp(2rem,7vw,5rem)] leading-[0.9] sig">
  Monty Singer
</div>
// Outline sig-out — stroke only, transparent fill (D-10: "filled+outline name")
<div className="font-display font-bold uppercase text-[clamp(2rem,7vw,5rem)] leading-[0.9] sig-out">
  Monty Singer
</div>
```

**Sub-roles pattern** (page-hero.tsx lines 45–50):
```typescript
{sub && (
  <div className="mt-6 max-w-[54ch] text-text-dim text-lg">
    {sub}
  </div>
)}
```

**Button import** (v3-specimen.tsx line 7 + big-list.tsx line 8):
```typescript
import { Button } from "@/components/v3/button";
import { BigList } from "@/components/v3/big-list";
```

---

### `src/components/home-deck/slide-index.tsx` (presentational, Server Component)

**Analog:** `src/components/v3/big-list.tsx` (exact — slide 2 IS a BigList)

**BigList usage pattern** (v3-specimen.tsx lines 207–215):
```typescript
<BigList
  items={[
    { label: "Writing", href: "/writing", tag: "ESSAYS" },
    { label: "Works",   href: "/projects", tag: "WORK" },
    { label: "Prometheus", href: "https://prometheus.today", tag: "COMPANY", outline: true },
  ]}
/>
```

**Section label above the list** (v3-specimen.tsx line 69):
```typescript
<SectionLabel numeral="02">What I'm</SectionLabel>
```

---

### `src/components/home-deck/slide-prometheus.tsx` (presentational, Server Component)

**Analog:** `src/app/page.tsx` Prometheus row (lines 116–131)

**3-column editorial grid pattern** (page.tsx lines 118–130):
```typescript
<div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
  <div className="text-meta uppercase text-muted">Active · AI Startup</div>
  <div className="text-feature text-ink">Prometheus</div>
  <div className="text-body text-ink">
    <p>Recent work: ...</p>
    <div className="mt-4">
      <AllLink href="https://prometheus.today">prometheus.today →</AllLink>
    </div>
  </div>
</div>
```

**v3 variant** — use v3 token classes (`text-text`, `text-text-muted`, `border-border`) not v2 classes (`text-ink`, `text-muted`). Crimson Poster tokens are in globals.css.

---

### `src/components/home-deck/slide-newsletter.tsx` (presentational, Server Component)

**Analog:** `src/components/v3/newsletter-carousel.tsx` (carousel with issue cards)

**Newsletter carousel usage** (v3-specimen.tsx lines 296–305):
```typescript
<NewsletterCarousel
  issues={[
    { title: "Vol. 4 — The Quiet Builders", date: "May 2026", href: "#" },
    // ...
  ]}
/>
```

**Import pattern** (newsletter-carousel.tsx lines 1–2):
```typescript
import Link from "next/link";
// Server Component — no "use client"
```

---

### `src/components/home-deck/slide-footer.tsx` (presentational, Server Component)

**Analog:** `src/components/home-v2/ink-footer.tsx`

**Footer content + links pattern** (ink-footer.tsx lines 10–95): copy the `<footer>` structure. As a deck slide this becomes slide 5 content inside a `.deck-slide` wrapper. The global `<InkFooter />` in `layout.tsx` must be suppressed on the `/` route to avoid double-footer.

**Footer suppression approach** — use `usePathname()` in layout or a route group. The `template.tsx` shows the pathname pattern:
```typescript
// src/app/template.tsx line 7:
const pathname = usePathname();
// If needed: pathname === "/" && suppress InkFooter
```

---

### `src/components/home-deck/fallback-poster.tsx` (presentational, Server Component)

**Analog:** `src/app/page.tsx` static image with `priority` + `fetchPriority` (lines 76–85)

**LCP-safe Image pattern** (page.tsx lines 77–86):
```typescript
<Image
  src="/hero-blob-poster.webp"
  alt="3D hero object — Monty Singer"
  fill
  priority
  fetchPriority="high"
  loading="eager"
  sizes="(max-width: 760px) 0vw, 50vw"
  className="object-contain"
/>
```

Note: `fetchPriority="high"` must be set explicitly. Per MEMORY.md: "Next.js 16 Image priority does not auto-emit fetchPriority" — this is a known quirk; always set both `priority` and `fetchPriority="high"` explicitly for LCP images.

---

### `src/components/providers/lenis-provider.tsx` (augment existing)

**Self-analog:** `src/components/providers/lenis-provider.tsx` (lines 1–50 — full file is the base)

**Current state** (lines 1–50): `lenisRef` is already kept as a ref — it just isn't exposed via context.

**Augmentation pattern** (RESEARCH.md Pattern 6 + motion-provider.tsx lines 11–18 for context shape):
```typescript
// Add above LenisProvider:
import { createContext, useContext } from "react";

const LenisControlContext = createContext<{
  stop: () => void;
  start: () => void;
} | null>(null);

export function useLenisControl() {
  return useContext(LenisControlContext);
}

// Wrap existing return <>{children}</> with:
return (
  <LenisControlContext.Provider value={{
    stop:  () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }}>
    {children}
  </LenisControlContext.Provider>
);
```

**GSAP ticker integration** (lenis-provider.tsx lines 30–36): do NOT change the ticker wiring. `stop()`/`start()` pause/resume the Lenis RAF loop while leaving the GSAP ticker itself running — this is intentional.

---

### `next.config.ts` (augment)

**Self-analog:** current `next.config.ts` (full file read above)

**Addition required** (RESEARCH.md Standard Stack, Pitfall 3):
```typescript
const nextConfig: NextConfig = {
  transpilePackages: ['three'],   // ADD — required for three/examples/jsm ESM imports
  turbopack: {                    // existing
    resolveAlias: { ... }
  },
  // ... rest unchanged
};
```

Place `transpilePackages` as the first key. Without this, `three/examples/jsm/environments/RoomEnvironment.js` fails to resolve in production builds (not in dev — Turbopack handles ESM natively, so Pitfall 3 is silent in dev).

---

### `src/__tests__/home-deck/*.test.{ts,tsx}` (6 test files)

**Analog:** `src/__tests__/providers/lenis-provider.test.tsx` (best match — vi.mock pattern for browser APIs + async dynamic import pattern)

**Test file structure** (lenis-provider.test.tsx lines 1–38):
```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock browser-only dependencies at top of file
vi.mock("lenis", () => { /* ... */ });
vi.mock("gsap", () => ({ /* ... */ }));
vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
}));

describe("ComponentName (REQ-ID)", () => {
  it("description of behavior", async () => {
    const { ComponentName } = await import("@/components/...");  // dynamic to pick up mocks
    render(<ComponentName>...</ComponentName>);
    expect(screen.getByText("...")).toBeDefined();
  });
});
```

**matchMedia mock pattern** (needed for `useDeckMode`/`useWebGLSupport` tests — standard vitest/jsdom pattern):
```typescript
vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})));
```

**DOM element mock for WebGL detection** (use-webgl-support.test.ts):
```typescript
vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
  if (tag === "canvas") {
    return { getContext: vi.fn().mockReturnValue({}) } as unknown as HTMLElement;
  }
  return document.createElement(tag);
});
```

**R3F test renderer** (hero-blob.test.tsx — covers TD-01):
```typescript
// @react-three/test-renderer renders scene graph without WebGL
import { create } from "@react-three/test-renderer";
import { HeroBlob } from "@/components/home-deck/hero-blob";
it("renders HeroBlob without crash", async () => {
  const renderer = await create(<HeroBlob />);
  expect(renderer.scene.children.length).toBeGreaterThan(0);
});
```

**Scroll-reveal test analog** (scroll-reveal.test.tsx lines 1–28): same `vi.mock("motion/react", ...)` pattern applies to any component that calls `useReducedMotion`.

---

## Shared Patterns

### "use client" Declaration
**Apply to:** `deck-homepage.tsx`, `deck-controller.ts`, `hero-blob-canvas.tsx`, `hero-blob.tsx`, `lenis-provider.tsx` (already), `marquee.tsx` (already)
**Pattern:** First line of file, before all imports.
```typescript
"use client";
```

### Reduced-Motion Gate
**Source:** `src/components/v3/reveal.tsx` lines 26–33 and `src/components/home-v2/manifesto-reveal.tsx` lines 151–158
**Apply to:** `deck-homepage.tsx` (gates deck mode vs native scroll), all slide components that contain animation
```typescript
const shouldReduceMotion = useReducedMotion();
if (shouldReduceMotion) {
  return <StaticFallback />;  // no animation, fully visible content
}
```

### useReducedMotion Import
**Source:** `src/components/v3/reveal.tsx` line 4, `src/components/home-v2/manifesto-reveal.tsx` line 4, `src/components/providers/lenis-provider.tsx` line 4
**Pattern:** Import from `motion/react` (NOT `framer-motion`):
```typescript
import { useReducedMotion } from "motion/react";
```

### Tailwind v4 Token Classes
**Source:** `src/components/v3/big-list.tsx`, `src/components/v3/button.tsx`, `src/app/v3-specimen/page.tsx`
**Apply to:** All new slide components. Use v3 token names, not v2 names:
- `text-text` not `text-ink`
- `text-text-muted` not `text-muted`
- `bg-bg` not `bg-background`
- `border-border` not `border-ink/20`
- `text-text-dim` for secondary body text
- `font-display` for display typography (Space Grotesk variable)
- `font-mono` for metadata/labels (JetBrains Mono variable)

### cn() Utility
**Source:** `src/components/v3/big-list.tsx` line 10, `src/components/v3/button.tsx` line 11
**Apply to:** All components with conditional className logic
```typescript
import { cn } from "@/utils/cn";
```

### Path Alias
**Source:** Every file in `src/components/` — consistent `@/` alias
```typescript
import { Something } from "@/components/v3/something";
import { useThing } from "@/lib/thing";
```

### LCP Image Pattern
**Source:** `src/app/page.tsx` lines 77–86 (+ MEMORY.md note about fetchPriority quirk)
**Apply to:** `fallback-poster.tsx` — the poster Image must set both `priority` AND `fetchPriority="high"` explicitly. Next.js 16 does NOT auto-emit `fetchpriority="high"` from `priority` alone.

---

## No Analog Found (Net-New)

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/components/home-deck/hero-blob-canvas.tsx` | client component | event-driven | First WebGL/R3F usage in this codebase; no canvas component exists |
| `src/components/home-deck/hero-blob.tsx` | R3F mesh component | event-driven | No R3F, no three.js anywhere in src/; prototype `initBlob()` is the only functional reference |

For these two files, RESEARCH.md Patterns 2 and 3 are the implementation references. The prototype `initBlob()` (site.js lines 72–103) is the behavioral spec; RESEARCH.md translates it to R3F idioms.

---

## Key Structural Observations

### Lenis Provider Lacks Context Exposure
`src/components/providers/lenis-provider.tsx` currently keeps `lenisRef` private (line 7). The `stop()`/`start()` methods exist on the Lenis instance but are not exposed. The augmentation adds a thin React context wrapping the existing `<>{children}</>` return — it does not change the GSAP ticker integration on lines 30–36.

### InkFooter Rendered Globally
`src/app/layout.tsx` line 75 renders `<InkFooter />` inside `<MotionProvider>` for every route. The homepage deck's slide-5 footer-as-slide creates a conflict: two footers on `/`. The planner must decide between:
1. **Pathname check in layout**: `usePathname()` in a client boundary wrapper around `<InkFooter />` that conditionally suppresses it when `pathname === "/"`
2. **Route group exclusion**: Create `(with-footer)/` route group that wraps all non-homepage routes — homepage stays outside it

Pattern to copy for option 1 — `src/app/template.tsx` lines 7–8:
```typescript
const pathname = usePathname(); // from "next/navigation"
// pathname === "/" → suppress InkFooter
```

### MainOffset Wrapper
`src/app/layout.tsx` line 74 wraps children in `<MainOffset>` which adds `pt-16 md:pt-0`. The deck homepage's fixed-position `#scroller` layout will need to account for this or set the scroller to `top: 0 / height: 100dvh` independently of the MainOffset padding.

### v3 Primitives are Mixed Server/Client
- **Server Components** (no "use client"): `big-list.tsx`, `page-hero.tsx`, `newsletter-carousel.tsx`, `rule.tsx`, `rule-strong.tsx`, `section-label.tsx`, `button.tsx`, `card.tsx`, `list-row.tsx`
- **Client Components** ("use client"): `marquee.tsx`, `reveal.tsx`

Slide components that only use Server Component primitives can themselves remain Server Components. Slide components that use `<Reveal>` or `<Marquee>` need to be client or wrap those in a client boundary.

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/`, `src/__tests__/`, `.planning/sketches/002-full-site-model/assets/`
**Files scanned:** 24 source files + 2 prototype files
**Pattern extraction date:** 2026-06-18
