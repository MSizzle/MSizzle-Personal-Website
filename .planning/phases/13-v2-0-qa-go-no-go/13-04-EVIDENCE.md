# 13-04 Evidence: 375px Visual QA

## Gate: QA-V2-04

**Requirement:** Visual QA at 375px mobile viewport confirms editorial layout reads correctly on the homepage and all 3 archive pages with no horizontal overflow

---

## Result: PENDING — Human Inspection Required

| Route | Status | Notes |
|-------|--------|-------|
| `/` (homepage) | ☐ pending | inspect manifesto + 5 vertical sections |
| `/writing` | ☐ pending | inspect title block + year-grouped list |
| `/events` | ☐ pending | inspect giant-numeral upcoming + past list |
| `/photos` | ☐ pending | inspect year-grouped grid + atmosphere photo |

## Inspection Procedure

1. Open Chrome DevTools (Cmd+Opt+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Set viewport to **375 × 667** (iPhone SE / common floor)
4. For each route below, navigate and verify:
   - **No horizontal scrollbar** at the viewport
   - All text legible (no clipping, no overflow into adjacent elements)
   - Editorial layout reads top-to-bottom in a natural reading order
   - Touch targets are tap-accessible (no overlapping interactive zones)

## Target URL Options

| Source | URL pattern | Notes |
|--------|-------------|-------|
| Local | `http://localhost:3000` | After `npm run start`; fastest iteration |
| Vercel preview | `https://m-sizzle-personal-website-h5zzgtecg-msizzles-projects.vercel.app` | Behind deployment protection (401) — needs bypass token or disabled protection |
| Production | `https://montysinger.com` | Live state; check if it reflects v2.0 (look for "BRING FIRE / TO HUMANITY." manifesto on homepage) |

## Per-Route Inspection Checklist

### `/` — Homepage
- [ ] Manifesto "BRING FIRE / TO HUMANITY." reads on one or two lines without horizontal scroll
- [ ] Five labeled sections (Building / Writing / Events / Photographs / Personal) stack vertically
- [ ] Letter intro / signature copy is legible at 375px
- [ ] No element extends beyond the 375px viewport edge
- [ ] Touch targets (links to /writing, /events, /photos, /about) are at least 44×44px
- **Verdict:** PASS / FAIL — notes:

### `/writing`
- [ ] Title block + atmosphere photo render without overflow
- [ ] Year-grouped list (YearBlock primitive) reads vertically
- [ ] Each post row (ListRow) shows title + date legibly
- [ ] Substack footer link present and tappable
- **Verdict:** PASS / FAIL — notes:

### `/events`
- [ ] Title block + giant-numeral upcoming event renders without overflow
- [ ] UpcomingRow / past-events list stack correctly
- [ ] Event date format (e.g., "16" giant numeral + "Sep" smaller) doesn't break
- **Verdict:** PASS / FAIL — notes:

### `/photos`
- [ ] Title block + atmosphere photo (PHOTOS[1]) renders without overflow
- [ ] Year-grouped grid adapts to 375px (likely single-column or 2-up)
- [ ] Photo aspect ratios preserved (no squashing)
- **Verdict:** PASS / FAIL — notes:

## Screenshots

For each route, capture:
- Full-page screenshot at 375px (DevTools → "..." → Capture full size screenshot)
- Save to `.planning/phases/13-v2-0-qa-go-no-go/screenshots/375px-{route}.png`

The screenshots are part of the GO doc evidence chain.

## Verdict Path

- All 4 routes PASS: **QA-V2-04 PASS** — record in 13-GO-NO-GO.md.
- Any route FAIL: capture specific issue (overflow, broken layout, illegible text), decide whether to ship anyway with documented known-issue OR remediate before GO.

---

**Status: PENDING — operator must perform inspection, fill in verdicts above, and capture screenshots.**
