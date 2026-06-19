---
sketch: 005
name: webgl-hero-fidelity
question: "What's the real fidelity ceiling for the hero? Does live WebGL (PBR + IBL + crimson rim + bloom/grain + smooth scroll) clear the Lusion bar and justify the heavier build?"
winner: "validated — real-WebGL fidelity approved by user 2026-06-18"
tags: [home, webgl, threejs, pbr, ibl, bloom, postprocessing, lenis, fidelity, prototype]
---

# Sketch 005: WebGL Hero — Real Fidelity

## Design Question
Sketches 003/004 proved the *concept* but the CSS/emoji execution looked low-fidelity. This is a **real-rendering** pass: actual three.js in the browser to show the true ceiling and de-risk the Lusion-grade direction before committing to the build.

## How to View
```
open .planning/sketches/005-webgl-hero-fidelity/index.html
```
**Use Chrome** and be online — it loads three.js + Lenis from a CDN (import map). Scroll to feel the smooth scroll + the object scaling (scroll-cue). Toolbar (bottom-right): live bloom + morph sliders, theme swap.

## What's actually rendering (no fakes here)
- **three.js r160** mesh: high-poly icosphere with a **GLSL simplex-noise vertex displacement** (real morphing, normals recomputed in-shader so lighting stays correct).
- **MeshPhysicalMaterial**: clearcoat + crimson sheen + metalness/roughness.
- **RoomEnvironment IBL** via PMREMGenerator — the glossy real reflections.
- **Crimson rim light** behind-right (the on-brand glow) + key/fill.
- **Post-processing**: UnrealBloom → film grain + vignette → ACES tone-mapping (OutputPass).
- **Lenis** smooth scroll driving camera dolly + object scale/drift.
- A crimson glow ring + reflective disc as the "podium."

## What's still a stand-in
- The object is a **procedural blob**, not voxel-Monty or the horse. The whole lighting + post pipeline is built to receive a real **GLTF/GLB** model later (drop-in).

## What to Look For
- Does this clear the **Lusion bar**, or at least get close enough to be worth the heavier build?
- Material/reflection quality, the crimson rim + bloom (tune with the slider), grain amount.
- Smooth-scroll feel + the scroll-cue scale.
- This is the **honest cost preview**: real WebGL + post + smooth scroll on every homepage visit.

## Open Questions / Next
- Confirm the **fidelity is worth it** → then `/gsd-sketch --wrap-up` to lock decisions, and re-plan phase 15 as a WebGL build (R3F + @react-three/postprocessing in the real stack).
- **Assets** remain the long pole: source/generate voxel-Monty + horse GLB.
- **Perf budget:** must verify LCP / PSI-mobile on Vercel and ship a reduced-motion + low-power fallback (static frame / poster). A spike should measure this before the full build.
- Palette stays near-black / off-white / crimson-accent (`themes/crimson-line.css`) — still superseding the LOCKED "Crimson Poster" (see MANIFEST "Pending Revisits").
