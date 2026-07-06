---
phase: 19
slug: project-cards-covers-redesign
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-06
---

# Phase 19 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Notion content -> rendered JSX | Card/TitleCard and the three index surfaces render titles, kickers, deks from Monty's Notion workspace (semi-trusted authoring surface) | Text strings (titles, tags, descriptions) |
| Cover image URL -> client img | CardCover loads /api/notion-cover proxy URLs; error events drive client state | Image bytes, error events |
| /writing render -> Notion API | getBlocks called once per published post at ISR revalidation | Block content for reading-time calc |
| URL slug param -> OG route | Arbitrary slugs reach getPostBySlug / getProjectBySlug | Untrusted URL path segment |
| jsdelivr CDN -> committed font asset | One-time asset download during execution (no runtime fetch) | WOFF binaries |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-19-01 | Injection (XSS) | TitleCard/Card rendering Notion strings | mitigate | JSX text interpolation only; verified zero dangerouslySetInnerHTML across title-card.tsx, card.tsx, card-cover.tsx | closed |
| T-19-02 | DoS | CardCover onError handler | accept | onError sets a one-way useState boolean and swaps to fallback; no retry loop (verified card-cover.tsx:37) | closed |
| T-19-03 | Injection (XSS) | section-work / writing / projects rendering Notion strings | mitigate | JSX text interpolation only; verified zero dangerouslySetInnerHTML across section-work.tsx, writing/page.tsx, projects/page.tsx | closed |
| T-19-04 | DoS | Per-post getBlocks fan-out on /writing | mitigate | Per-post `.catch(() => undefined)` (writing/page.tsx:88); ISR revalidate=1800 caps fan-out to one per 30 min; failure degrades to omitting reading time | closed |
| T-19-05 | Injection | Slug param in blog/projects OG routes | mitigate | Slug passed only to existing Notion SDK filter query; satori text nodes (no HTML interpretation); unknown slugs fall back via try/catch (verified in both slug OG routes) | closed |
| T-19-06 | Tampering (supply chain) | Downloaded WOFF font binaries | mitigate | Fetched once from official @fontsource path on jsdelivr, size- and filetype-checked, committed as static assets; verified: both files are WOFF (17500b / 27496b), no runtime fetch, no npm install | closed |
| T-19-07 | DoS | Per-request OG render on slug routes | accept | Same request surface as prior routes; Vercel function limits + Notion try/catch bound cost; edge->node runtime change does not widen exposure | closed |
| T-19-SC | Tampering (supply chain) | npm installs | accept | No packages installed in any Phase 19 plan; verified package.json untouched by all 19-xx commits | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-19-01 | T-19-02 | One-way error swap cannot amplify network traffic; worst case is a single failed image request per card | plan 19-01 threat model (executed as specified) | 2026-07-06 |
| R-19-02 | T-19-07 | OG render cost unchanged from pre-phase routes; platform limits bound it | plan 19-03 threat model (executed as specified) | 2026-07-06 |
| R-19-03 | T-19-SC | No new dependencies introduced anywhere in the phase | plans 19-01/19-02 threat models (verified against git history) | 2026-07-06 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-06 | 8 | 8 | 0 | /gsd-secure-phase orchestrator (code-verified: grep + file + git checks) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-06
