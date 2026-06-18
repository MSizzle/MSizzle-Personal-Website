# Sketch Manifest

## Design Direction
v3 ground-up redesign of montysinger.com. Dark canvas, brutalist-kinetic, maximalist motion —
the site should feel *alive*. Lusion-style cursor reactivity, cinematic scroll, bold oversized
typography, electric accents. This is a presentation-layer rewrite only: the Notion pipeline,
SEO infra, analytics, image proxy, RSS, and Notion-render components all stay. Built on a `v3`
branch, previewed on Vercel, promoted to production via alias swap when it reaches parity + QA.

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
