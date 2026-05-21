# 06-04 Evidence: Notion Long-tail + Dark-mode + Cross-browser

**Date:** 2026-04-16
**Commit:** e3dc470

## Notion Image Staleness (D-11)

All 3 Notion-proxied images from blog post "pursuit-of-happierness" return HTTP 200 via next/image optimizer. Post was built >2 hours ago. Signed URL refresh pipeline holds.

```
33832e75-4858-80c1-9227-e9629423cede: HTTP/2 200
33832e75-4858-807f-8791-e2c43e5de8bc: HTTP/2 200
33832e75-4858-80e4-a12d-ee6779966112: HTTP/2 200
```

## Dark-mode FOUC (D-01 / Success Criterion 4)

- `suppressHydrationWarning` present on `<html>` tag: **yes**
- ThemeProvider wraps app in layout.tsx: **yes**
- Code-verified: next-themes handles system detection + manual toggle

**Human visual check needed:** Open incognito, system dark → renders dark without flash; system light → renders light. Both Chrome + Safari.

## Cross-browser (D-12 / D-13)

**Human visual checks needed:**
- Safari desktop: Lenis smooth scroll, backdrop-filter on nav, page transitions
- Safari iOS (if simulator available): same checks at mobile viewport
- Firefox desktop: smoke check — pages load, nav works, scroll works
- Chrome mobile emulator: 375px responsive check (DSGN-02)
