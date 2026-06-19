# Phase 15: Slide-Deck Homepage & 3D Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-18
**Phase:** 15-slide-deck-homepage-3d-hero
**Areas discussed:** 3D rendering approach, 3D object ambition, Fallback look, Reduced-motion deck behavior, Lusion influence, Slide copy source

---

## 3D rendering approach

| Option | Description | Selected |
|--------|-------------|----------|
| R3F + three | Install @react-three/fiber + three; rebuild blob as declarative R3F, morph in useFrame. Satisfies TD-01. | ✓ |
| R3F + three + drei | Same plus @react-three/drei upfront for helpers; larger bundle. | |
| Port raw three.js | Keep prototype's imperative three.js in a client component, no R3F; deviates from TD-01. | |

**User's choice:** R3F + three (recommended)
**Notes:** Add drei only if a specific helper earns its weight. Prototype `initBlob` is the functional reference; modernize the deprecated r128 color-space API.

---

## 3D object ambition

| Option | Description | Selected |
|--------|-------------|----------|
| Elevate material & lighting | Keep blob silhouette + morph, push material/rim/lighting fidelity. | ✓ |
| Match prototype 1:1 | Replicate the prototype blob exactly. | |
| Elevate form too | New geometry/morph + material; most effort/risk. | |

**User's choice:** Elevate material & lighting (recommended)
**Notes:** Graphics are the #1 milestone priority (carried from Phase 14). Elevate quality, keep the form and autonomous motion.

---

## Fallback look (no-WebGL / reduced-motion)

| Option | Description | Selected |
|--------|-------------|----------|
| Pre-rendered poster image | Still PNG/WebP render of the blob in the object slot; zero runtime cost, closest look. | ✓ |
| CSS/SVG blob shape | Lightweight vector approximation. | |
| Empty / layout holds | No object; layout reserves space. | |

**User's choice:** Pre-rendered poster image (recommended)
**Notes:** Planner decides how the poster is produced and committed as a static asset.

---

## Reduced-motion deck behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Native vertical scroll | Reuse the mobile fallback path: no wheel controller, no tween, no fly-in, poster shown. | ✓ |
| Keep deck, instant jumps | One-gesture-per-slide but instant snaps, no fly-in. | |

**User's choice:** Native vertical scroll (recommended)
**Notes:** So native-scroll fallback fires for BOTH small/touch screens AND prefers-reduced-motion.

---

## Lusion influence vs locked autonomous-motion rule

| Option | Description | Selected |
|--------|-------------|----------|
| Lusion look, autonomous motion | Chase Lusion material/lighting/depth; keep motion autonomous, no cursor-follow. Honors locked rule. | ✓ |
| Add subtle cursor reactivity | Gentle pointer parallax/tilt; reopens locked decision, adds perf/reduced-motion handling. | |
| Full Lusion-style interactivity | Pointer-driven deformation as centerpiece; furthest from locked direction, biggest risk. | |

**User's choice:** Lusion look, autonomous motion (recommended)
**Notes:** User volunteered https://lusion.co/ as a site they love (already the manifest's primary reference). Resolved the tension: chase the look, not the cursor-reactive interactivity.

---

## Slide copy source

| Option | Description | Selected |
|--------|-------------|----------|
| Static, match prototype | Hardcode the 5 slides + copy exactly as prototype; not Notion. | ✓ |
| Static but revise copy | Hardcoded but user revises wording/links first. | |

**User's choice:** Static, match prototype (recommended)
**Notes:** Editorial homepage content; interior pages move to Notion in Phase 16.

---

## Claude's Discretion

- Lazy-load mechanics keeping the object off the LCP path (next/dynamic ssr:false, mount timing).
- File organization, hook/component boundaries, WebGL/reduced-motion/touch detection.
- Exact elevated material/light parameter values.
- Reconciling Lenis smooth-scroll vs the deck's own scroll control on the homepage.

## Deferred Ideas

- Cursor-reactive / full Lusion-style 3D interactivity — rejected for v3 (locked autonomous-motion rule).
- Bespoke per-slide motion on interior pages — out of scope for v3.
- /uses, /watching, and interior Notion pages — Phase 16.
- Real YouTube thumbnails/oEmbed for /watching — future iteration.
</content>
