---
phase: 15
plan: 05
subsystem: home/hero-blob-canvas scroll-cue + GLB seam + poster + v1 finalization
tags: [scroll-cue, camera-dolly, glb-seam, poster-capture, build-gate, human-verify]
dependency_graph:
  requires:
    - 15-02 (HeroBlob + HeroBlobCanvas internals extended for dolly/scale + GLB seam)
    - 15-03 (explorative-homepage orchestrator + canvas-loader)
    - 15-04 (sections + fallback-poster consuming the poster asset)
  provides:
    - src/components/home/hero-blob-canvas.tsx: scroll-cue driver (addEffect → scrollY) dollies camera z 4.4→5.6 and scales group 1.0→0.65 over first 30% of scroll
    - src/components/home/hero-blob.tsx: modelUrl?: string|null GLB swap-in seam (D-15); null default renders procedural blob
    - public/hero-blob-poster.webp: real 800x800 capture replacing the 1x1 placeholder
  affects:
    - Phase 16+ (GLB workstream plugs into the modelUrl seam; richer poster can swap in)
tech_stack:
  added: []
  patterns:
    - addEffect (R3F) reads window.scrollY into a ref each frame — drives camera/scale without React re-render
    - clamped scroll progress (first 30%) so blob never fully disappears
    - GLB seam via optional prop with null-default → procedural fallback (hooks-safe split: HeroBlobProcedural + HeroBlob wrapper)
    - data-testid="hero-canvas-container" wrapper outside the Canvas for capability-gate assertions
key_files:
  created: []
  modified:
    - src/components/home/hero-blob-canvas.tsx (scroll-cue camera dolly/scale + container testid)
    - src/components/home/hero-blob.tsx (modelUrl GLB swap-in seam; procedural/wrapper split)
    - public/hero-blob-poster.webp (1x1 placeholder → real 800x800 capture)
    - src/components/v3/newsletter-carousel.tsx (checkpoint fix: key by issue.title, was duplicate "#" href)
    - src/components/visit-survey.tsx (checkpoint fix: explicit height:auto style silences Next 16 image warning)
decisions:
  - "D-15 GLB seam: modelUrl prop defaults to null → procedural blob; GLB load deferred to a later workstream. Hooks-safe via HeroBlobProcedural + HeroBlob wrapper split."
  - "Poster kept as the headless-captured frame for v1. Headless/SwiftShader cannot reproduce the GPU bloom + crimson rim, so the blob renders near-black; a richer poster is best sourced from a real-GPU browser screenshot and can be swapped in trivially (deferred, non-blocking)."
  - "Build gate run as local `next build` (exit 0). Vercel preview build left to the user per project deploy-gotchas (avoid --prebuilt --prod on this project)."
checkpoint:
  type: human-verify
  resolved: approved
  notes: "User visually verified the running homepage (palette, desktop hero + scroll dolly, scroll-story sections). Two dev-console issues surfaced during verification and were fixed: NewsletterCarousel duplicate-key error and visit-survey image aspect-ratio warning. Both confirmed cleared on reload."
deviations:
  - "Task 2 poster is visually flat (near-black) because the blob material (0x140805) is near-black and headless WebGL omits the bloom/rim glow. Functional (no 404); polish deferred."
  - "Two checkpoint-driven fixes committed beyond the original 2 tasks (newsletter key, survey image) — surfaced by human visual verification, in scope for the verification gate."
commits:
  - 11b346e feat(15-05): add scroll-cue driver + GLB swap-in seam
  - b9cf84b feat(15-05): capture real hero poster replacing 1x1 placeholder
  - 2bcf2c6 fix(15-05): key NewsletterCarousel by unique issue.title
  - 778ed38 fix(15-05): add explicit height:auto style to visit-survey pixel image
self_check: PASSED
---

## Plan 15-05 — Finalize v1 Homepage (checkpoint plan)

Completed the v1 WebGL explorative homepage: scroll-cue camera animation, GLB
swap-in seam, real poster capture, and the human visual-verification gate.

**Task 1 — Scroll-cue + GLB seam (`11b346e`):** `hero-blob-canvas.tsx` now mounts a
`ScrollCueDriver` inside the Canvas that uses R3F's `addEffect` to read
`window.scrollY` each frame into a ref. Camera `position.z` moves 4.4 → 5.6 and the
blob group scale moves 1.0 → 0.65 across the first 30% of page scroll (clamped so the
blob never disappears). `hero-blob.tsx` gains a `modelUrl?: string | null` prop as the
GLB swap-in seam (D-15) — `null` (default) renders the procedural blob; a future value
loads a GLB. Split into `HeroBlobProcedural` + `HeroBlob` wrapper to keep hooks order
stable.

**Task 2 — Poster capture (`b9cf84b`):** `public/hero-blob-poster.webp` replaced from
the 1×1 placeholder with a real 800×800 headless capture. Deviation: the blob material
is near-black and headless software WebGL omits the GPU bloom/crimson rim, so the poster
reads visually flat. It is functional (FallbackPoster no longer 404s); a richer poster
is best sourced from a real-GPU browser screenshot and can be swapped in trivially.

**Task 3 — Human-verify checkpoint + build gate (resolved: approved):** The user
visually verified the running homepage. Two dev-console issues surfaced and were fixed:

- **`2bcf2c6`** — `NewsletterCarousel` keyed three `href:"#"` placeholder issues by
  `href`, producing duplicate `#` React keys and a console error. Now keyed by the unique
  `issue.title`.
- **`778ed38`** — `visit-survey.tsx` pixel image emitted a Next 16 aspect-ratio warning;
  added an explicit inline `height:auto` style (Next's runtime check inspects the style
  attribute, not the Tailwind class).

Both confirmed cleared on reload. Production `next build` exits 0.

## Self-Check: PASSED
- All non-checkpoint tasks executed and committed atomically
- Human-verify checkpoint resolved (approved) with two fixes applied
- `next build` exit 0; home tests green
- No modifications to STATE.md / ROADMAP.md (orchestrator owns those)
