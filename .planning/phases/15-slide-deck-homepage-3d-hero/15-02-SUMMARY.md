---
phase: 15
plan: 02
subsystem: home/hero-blob
tags: [webgl, r3f, gpu-morph, postprocessing, three-custom-shader-material, bloom, podium]
dependency_graph:
  requires:
    - 15-01 (palette tokens, stub components, test scaffolds)
  provides:
    - GPU vertex-shader displaced PBR blob (src/components/home/hero-blob.tsx)
    - R3F Canvas with postprocessing + crimson bloom (src/components/home/hero-blob-canvas.tsx)
    - Thin reflective podium disc (src/components/home/hero-podium.tsx)
    - @react-three/postprocessing@3.0.4 installed
    - three-custom-shader-material@6.4.0 installed
  affects:
    - Plans 15-03 (canvas-loader imports hero-blob-canvas as dynamic target)
    - Plans 15-04 (FallbackPoster mobile path remains unaffected)
tech_stack:
  added:
    - "@react-three/postprocessing@3.0.4 — EffectComposer + Bloom for R3F canvas"
    - "three-custom-shader-material@6.4.0 — GPU vertex shader injection into MeshPhysicalMaterial"
  patterns:
    - "CSM vanilla import: useMemo(() => new CustomShaderMaterial({ baseMaterial: THREE.MeshPhysicalMaterial, vertexShader, uniforms, ...pbrProps })) "
    - "geometry.computeTangents() immediately after IcosahedronGeometry — mandatory for tangent attribute in vertex shader"
    - "csm_Position and csm_Normal GLSL output variables for GPU displacement and normal recalculation"
    - "EffectComposer + Bloom inside R3F Canvas JSX after mesh children"
    - "Crimson rim directionalLight at intensity 2.2 to push luminance above Bloom threshold 0.85"
key_files:
  created:
    - src/components/home/hero-blob.tsx
    - src/components/home/hero-podium.tsx
    - src/components/home/hero-blob-canvas.tsx
  modified:
    - src/__tests__/home/hero-blob.test.tsx (stub removed, real R3F scene graph assertion added)
    - package.json (two new deps)
    - package-lock.json
decisions:
  - "CSM vanilla import used (not JSX declarative form) inside useMemo — keeps IBL setup pattern identical to analog"
  - "matRef created alongside mat useMemo for test introspection surface (optional, matches test scaffold)"
  - "computeVertexNormals mention kept only as a comment clarifying what was removed — not present as executable code"
  - "hero-blob-canvas.tsx is a default export (not named) so dynamic(() => import('./hero-blob-canvas')) works in Plan 15-03"
metrics:
  duration: "12m"
  completed: "2026-06-19T13:29:30Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 3
---

# Phase 15 Plan 02: GPU HeroBlob + Canvas + Podium + Bloom Summary

**One-liner:** GPU vertex-shader morph via CustomShaderMaterial (csm_Position + csm_Normal, no JS computeVertexNormals), R3F Canvas with crimson rim light + EffectComposer/Bloom, and a thin reflective CylinderGeometry podium disc.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 0 | Install npm packages (APPROVED checkpoint) | 958a715 | package.json, package-lock.json |
| 1 | GPU vertex-shader HeroBlob via CustomShaderMaterial | 958a715 | src/components/home/hero-blob.tsx, src/__tests__/home/hero-blob.test.tsx |
| 2 | Create hero-podium.tsx + hero-blob-canvas.tsx with Bloom | a5b5339 | src/components/home/hero-podium.tsx, src/components/home/hero-blob-canvas.tsx |

## Decisions Made

1. **CSM vanilla form:** `CustomShaderMaterial` imported from `three-custom-shader-material/vanilla` and instantiated in `useMemo()` rather than using the R3F declarative JSX form. This keeps the IBL (`useMemo` for PMREMGenerator) and material creation patterns consistent, and avoids potential R3F JSX form ES-module interop issues in Vitest.

2. **matRef alongside mat:** Added `matRef = useRef()` assigned inside the mat `useMemo` for test introspection. The PATTERNS.md and test scaffold mentioned this as optional but matched; including it costs nothing and enables future test assertions on material uniforms.

3. **Default export for hero-blob-canvas.tsx:** The plan specifies this as a default export so `dynamic(() => import('./hero-blob-canvas'))` in Plan 15-03's `canvas-loader.tsx` works without destructuring. Confirmed pattern matches the analog (`home-deck/hero-blob-canvas.tsx` is also default export).

4. **Bloom only, no Noise/Vignette:** Per spike 001 perf trim order — start with Bloom only. Noise and Vignette are added only if FPS stays above 55fps on mid-tier device (deferred to Plan 15-05 or post-phase tuning).

## Deviations from Plan

None. Plan executed exactly as written. The `computeVertexNormals` string appears once in the file as a comment ("no JS computeVertexNormals needed"), not as executable code. This is clarifying commentary, not a deviation.

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Dep install | grep in package.json | PASS — both packages at pinned versions |
| computeTangents | grep -c in hero-blob.tsx | PASS — count=1 |
| No JS morph (code only) | grep non-comment lines | PASS — count=0 |
| EffectComposer wired | grep -c in hero-blob-canvas.tsx | PASS — count=3 (import + JSX open + close) |
| Rim intensity 2.2 | grep in hero-blob-canvas.tsx | PASS — directionalLight color={0xe23838} intensity={2.2} |
| TD-01 test | npx vitest run hero-blob.test.tsx | PASS — 1 passed, exit 0 |
| TypeScript | npx tsc --noEmit | PASS — exit 0, no errors |

## Known Stubs

None introduced in this plan. The `hero-blob.tsx` stub from Plan 15-01 has been replaced with the real GPU morph implementation.

The following stubs from Plan 15-01 remain (owned by later plans):
- `src/components/home/canvas-loader.tsx` — Plan 15-03
- `src/components/home/explorative-homepage.tsx` — Plan 15-03
- `src/components/home/section-building.tsx` — Plan 15-03
- `src/components/home/fallback-poster.tsx` — Plan 15-04

## Threat Surface Scan

No new network endpoints, auth paths, or user-input surfaces introduced.

| Flag | File | Description |
|------|------|-------------|
| threat_flag: third-party-package | package.json | @react-three/postprocessing@3.0.4 and three-custom-shader-material@6.4.0 added to dependency tree — mitigated by human-verify checkpoint (Task 0, APPROVED) |

The GLSL shader string is a static hardcoded constant (`BLOB_VERT`). No user input reaches the vertex shader. T-15-07 (Tampering via GLSL injection) remains: Accept.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/components/home/hero-blob.tsx | FOUND |
| src/components/home/hero-podium.tsx | FOUND |
| src/components/home/hero-blob-canvas.tsx | FOUND |
| src/__tests__/home/hero-blob.test.tsx updated | FOUND |
| Commit 958a715 (deps + hero-blob) | FOUND |
| Commit a5b5339 (hero-podium + hero-blob-canvas) | FOUND |
| hero-blob.tsx contains computeTangents | PASS |
| hero-blob.tsx contains csm_Position | PASS |
| hero-blob.tsx contains csm_Normal | PASS |
| hero-blob.tsx does NOT contain needsUpdate | PASS |
| hero-blob-canvas.tsx contains EffectComposer | PASS |
| hero-blob-canvas.tsx contains intensity={2.2} | PASS |
| hero-podium.tsx contains CylinderGeometry | PASS |
| hero-podium.tsx position [0,-1.55,0] | PASS |
| TypeScript clean | PASS |
| TD-01 test passing | PASS |
