# Sketch Manifest

## Design Direction
v3 ground-up redesign of montysinger.com. Dark canvas, brutalist-kinetic, maximalist motion —
the site should feel *alive*. Lusion-style cursor reactivity, cinematic scroll, bold oversized
typography, electric accents. This is a presentation-layer rewrite only: the Notion pipeline,
SEO infra, analytics, image proxy, RSS, and Notion-render components all stay. Built on a `v3`
branch, previewed on Vercel, promoted to production via alias swap when it reaches parity + QA.

## CURRENT Homepage Direction (2026-07-04) — sketches 007–011 · SUPERSEDES the dark-kinetic direction above
A restrained, **photo-forward editorial** homepage (not the dark WebGL scroll-story). Driven by
"homepage feels too text-based and plain — add photos." Landed via 007→011, consolidated in
**sketch 010 (★ locked, full-page spec)**:
- **Palette:** near-white paper / near-black ink with **Vermilion** accent `#e5411f` (chosen over
  cobalt for warmth/contrast).
- **Type:** **Hanken Grotesk 800** display (serious sans, not thin/playful). Rejected en route:
  Space Grotesk, Clash/Cabinet (playful), Geist (thin/boring), serif options.
- **Hero:** marker-block — "**Create Order**" in a solid vermilion box hugging the glyphs,
  "from Chaos" in ink; large 44% portrait; black status tag; black link-marquee at the hero base.
- **Structure:** alternating light/dark **bands**, hard corners, high-contrast **rail boxes**,
  large photos with scroll **slide-in + even black drop-shadow**, **Monty Monthly carousel** for
  writing, sticky Subscribe nav, credibility strip, multi-column footer.
- **Motion:** scroll-triggered + ambient only, **no mouse dependence**, reduced-motion honored.
- **Open:** real photography + real logos (placeholders labeled in the mock).

## Reference Points
- Lusion (lusion.co) — primary: dark, fluid/3D, cinematic scroll, cursor-reactive
- Award-style portfolios (Awwwards energy) — inventive layouts, heavy motion
- Founder/maker sites — product-forward, credible

## Constraints
- Keep all existing infrastructure (Notion, SEO, analytics, RSS, image proxy, render components)
- Motion must respect the perf budget already won (LCP / PSI mobile gates, reducedMotion)
- Routes unchanged + add /uses. No location, no Georgetown details, no past jobs. No em dashes in copy.

## Sketches

| # | Name | Design Question | Winner | Tags |
|---|------|----------------|--------|------|
| 001 | dark-kinetic-home | What does the dark, kinetic homepage feel like? | **D · Synthesis** | home, motion, dark, 3d, slides |
| 002 | full-site-model | Does the language hold across the whole site? | _in review_ | full-site, prototype, nav |
| 003 | guided-line-home | Does a self-drawing guided line + near-black/off-white palette feel expansive while fixing red-on-red legibility? | folded into 004 | home, line, scroll, dark, crimson-accent, legibility, palette-revisit |
| 004 | explorative-scroll-story | Does the explorative scroll-story (hologram-on-podium → fluid line → 3D horse → YouTube zoom-through → newsletter) hold as the homepage spine? | **concept ✓** (pending real build) | home, scroll-story, 3d, hologram, fluid-line, youtube, zoom-transition, prototype |
| 005 | webgl-hero-fidelity | What's the real fidelity ceiling — does live WebGL (PBR/IBL/bloom/grain/smooth-scroll) clear the Lusion bar and justify the heavier build? | **★ validated** (fidelity approved) | home, webgl, threejs, pbr, ibl, bloom, postprocessing, lenis, fidelity |
| 006 | flame-personal-brand | Restrained "personal business page" — dark vs light flame palette? | pivoted (led to 007+) | home, personal-brand, editorial, palette |
| 007 | photo-forward-home | How much should photography drive the home, and where do photos land? | **C · woven through** | home, photography, hero, editorial |
| 008 | alive-photo-home | How alive can it feel via bigger photos + non-mouse motion? | **3 · kinetic ambient** | home, photography, motion, scroll, ambient |
| 009 | alive-photo-home-r2 | Color + type switchers, slide-in photos, writing rework | folded into 010 | home, motion, color, type, slide-in |
| 010 | structured-bands-carousel | Can it read structured + professional (bands, hard boxes, serious type, carousel)? | **★ LOCKED — full-page spec** | home, editorial, bands, hard-corners, hanken, vermilion, carousel |
| 011 | hero-accent-treatments | How much should the accent drive the hero, in what form? | **C · marker block** | home, hero, accent, marker-block, vermilion |

## Locked Decisions (from 001)
- **Direction:** dark canvas, brutalist uppercase grotesk type, autonomous (non-cursor-reactive) motion.
- **Hero:** oversized name (filled + outline-stroke), type left / autonomous 3D object right (real build → Three.js/R3F).
- **Structure:** homepage as full-screen scroll-snap slides; second slide is a brutalist clickable Index (hover-invert rows).
- **Motion rule:** things move on their own (drifting orbs, breathing name, running marquee). No cursor-follow, no magnetic, hover = color only.
- **Palette:** LOCKED → "Crimson Poster" — crimson-orange field (`#d93c1e`). Display type is the SAME
  crimson, lifted off the background by a hard BLACK shadow (`0.055em` offset). Black is the accent
  (borders, labels, supporting ink near-black). 3D object is a near-black glossy blob with a crimson
  rim light. No gradients. Supersedes the earlier orange-on-black "Prometheus" palette.
- **YouTube favorites:** a "Watching" page/section listing favorite videos (added per user request).

## Validated Direction (2026-06-18) — SUPERSEDES the "Locked Decisions (from 001)" below
User reviewed sketches 003–005 and approved a new homepage direction. This replaces the slide-deck + Crimson Poster decisions:
- **Structure:** NOT a discrete slide deck. An **expansive, explorative scroll-story** you wander down (sketch 004 concept ✓): rotating pixel/voxel avatar on a podium (hero) → scroll-cue scales the hero → a **fluid interweaving line** → a rotating **3D horse** beat → a **"Watching"/YouTube** gallery that climaxes in a **zoom-through** (a video fills the screen, you scroll *into* it, the next section emerges) → newsletter/footer.
- **Palette:** `themes/crimson-line.css` — near-black canvas `#0a0a0a`, off-white display type `#f5f5f0`, crimson `#e23838` DEMOTED to a sparing accent (line / rim light / hover). Fixes the red-on-red legibility failure. Supersedes "Crimson Poster."
- **Fidelity bar:** real WebGL (sketch 005 ★). three.js: PBR + clearcoat + **RoomEnvironment IBL**, crimson rim light, **UnrealBloom + film grain + vignette**, **Lenis** smooth scroll. Target reference: **Lusion**.
- **Open dependencies before/within the real build:** (1) **perf spike** — verify Vercel free-tier + mobile LCP/PSI budget with R3F + postprocessing + Lenis, plus a reduced-motion/low-power fallback; (2) **asset workstream** — source/generate voxel-Monty + horse GLB models (the long pole).
- **Phase 15 impact:** the committed slide-deck homepage (deck-controller, slides, CHOMP nav) is **superseded as the homepage**; the Three.js HeroBlob + render/lighting learnings and the section *content* remain reusable. Phase 15 should not be closed as the slide deck — it gets re-planned (or marked superseded + a new WebGL homepage phase created).

## Pending Revisits (2026-06-18)
After Phase 15 built the locked direction (Crimson Poster slide deck), user feedback flagged two problems and opened sketch 003:
- **Structure:** discrete CHOMP slide deck → wants expansive, "wandering" feel via a **guided drawing line** (self-drawing SVG thread connecting sections). Reuse the 3D blob + section content; swap the navigation model.
- **Palette:** "Crimson Poster" (crimson field + crimson type) → **red-on-red is illegible.** New direction in `themes/crimson-line.css`: near-black canvas, off-white name, crimson DEMOTED to a sparing accent (line / dots / hover), never the name.
If sketch 003 wins, the LOCKED palette + slide-deck structure decisions above must be superseded.
- **Scope expansion (sketch 004):** user wants a more ambitious *explorative* homepage — rotating pixel-avatar hologram on a podium (hero), scroll-cue that scales the hero, the line going *fluid/interweaving*, a rotating 3D horse beat, and a "Watching"/YouTube gallery that ends with a video zooming to fill the screen and the next section emerging from inside it. Implies real 3D (Three.js/GLTF models for avatar + horse) and scroll-pinned transitions — heavier than the Phase 15 build. Asset sourcing (pixel-avatar, horse model) is an open dependency.
