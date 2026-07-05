# Homepage photos

Drop real photos in this folder, then set the matching `src` in code. Until a
`src` is set, each slot shows a solid placeholder block (nothing breaks).

`next/Image` optimizes these automatically (cover-fit, responsive `sizes`).
Recommended: JP/WebP, roughly the slot aspect ratio, ~2x the display size.

| Slot | Count | Where to set `src` | Aspect |
|------|-------|--------------------|--------|
| Hero portrait carousel | 3 | `hero.tsx` → `<Photo src="/home/portrait-1.jpg" .../>` (crossfades) | 5/6 |
| Building wide shot | 1 | `section-building.tsx` → `<Photo dark .../>` | 16/6.5 |
| Work grid | 4 | `section-work.tsx` → the four `<Photo .../>` | 3/2.2 |
| Things I Love marquee | 4 | `section-loves.tsx` → `items[].src` | 3/4 |
| Monty Monthly covers | 4 | `section-newsletter.tsx` → `ISSUES[].cover` | 16/8 |

Example (marquee): `{ label: "A place I go", src: "/home/loves-1.jpg" }`
Example (issue cover): add `cover: "/home/issue-12.jpg"` to an `ISSUES` entry.

For the hero portraits, pass `priority` on the first slide (above the fold).
