# Phase 4: Animation & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 04-animation-polish
**Areas discussed:** Page transitions, Scroll animations, Project card hover, Reduced motion

---

## Page Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Fade + subtle slide | Current page fades out, new page fades in with slight upward slide (20-30px). Clean and modern. | ✓ |
| Crossfade only | Pure opacity crossfade — minimal and elegant. | |
| Slide with direction | Pages slide left/right based on nav order. More dynamic but more complex. | |

**User's choice:** Fade + subtle slide
**Notes:** Exit: opacity 1->0, y 0->10px (200ms). Enter: opacity 0->1, y 20px->0 (300ms). Total ~400ms, ease-out.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform everywhere | Same fade+slide on all routes. Consistent, simpler. | ✓ |
| Homepage gets special | Homepage entrance more elaborate, other routes standard. | |
| You decide | Claude picks per page. | |

**User's choice:** Uniform everywhere
**Notes:** No per-route variations needed.

---

## Scroll Animations

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle reveals | Elements fade in + slide up as they enter viewport. Light parallax. | |
| Bold & cinematic | Larger movements, more parallax layers, elements scaling/rotating in. | ✓ |
| Minimal | Just opacity fade-in on scroll. No parallax. | |

**User's choice:** Bold & cinematic
**Notes:** Content slides up 60-80px + scale 0.95->1. Staggered children (0.15s delay). Trigger at 30% into viewport. Multiple parallax layers.

---

| Option | Description | Selected |
|--------|-------------|----------|
| All pages | Every page gets scroll-reveal treatment. | ✓ |
| Homepage only | Full GSAP scroll treatment on homepage only. | |
| Homepage + projects | Homepage cinematic, project cards scroll-reveal, rest simple. | |

**User's choice:** All pages
**Notes:** Consistent animated feel site-wide.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Once only | Elements animate first time entering viewport, stay visible. | ✓ |
| Replay on re-enter | Elements animate every time they scroll into view. | |
| You decide | Claude picks per element. | |

**User's choice:** Once only
**Notes:** No replay on scroll-back.

---

## Project Card Hover

| Option | Description | Selected |
|--------|-------------|----------|
| Overlay with CTA | Semi-transparent overlay slides up with "View Project" button and tags. | ✓ |
| Scale + shadow lift | Card scales up slightly (1.03x) with elevated shadow. | |
| Image zoom + tilt | Image zooms while card tilts based on cursor position (3D perspective). | |

**User's choice:** Overlay with CTA
**Notes:** Overlay slides up over image area with CTA button and tags. Title/description remain visible below.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Tap to toggle overlay | First tap shows overlay, second tap or elsewhere dismisses. | ✓ |
| No overlay on mobile | Skip overlay, card taps navigate directly. | |
| Long press reveals | Long press shows overlay, regular tap navigates. | |

**User's choice:** Tap to toggle overlay
**Notes:** Mirrors desktop hover behavior on mobile via tap toggle.

---

## Reduced Motion

| Option | Description | Selected |
|--------|-------------|----------|
| Suppress all motion | No scroll animations, no parallax, no slide, no card animation, no Lenis. Elements just appear. | ✓ |
| Simplified alternatives | Replace complex animations with simple fades. Some visual interest preserved. | |
| You decide | Claude decides per animation. | |

**User's choice:** Suppress all motion
**Notes:** Full suppression — instant opacity swap for transitions, elements visible immediately, Lenis disabled.

## Claude's Discretion

- Exact easing curves and spring configs
- GSAP timeline structure and ScrollTrigger details
- Which decorative elements get parallax
- Stagger timing per page type
- Whether to use react-intersection-observer vs GSAP for simpler reveals

## Deferred Ideas

None — discussion stayed within phase scope.
