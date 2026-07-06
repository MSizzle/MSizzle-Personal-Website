---
phase: quick-260706-gbu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  # Task 1 — content & copy
  - src/app/writing/page.tsx
  - src/app/about/page.tsx
  - src/app/prometheus/page.tsx
  - src/app/uses/page.tsx
  - src/app/projects/page.tsx
  - src/app/blog/[slug]/page.tsx
  - src/lib/seo/blog-metadata.ts
  - src/lib/seo/project-metadata.ts
  - src/lib/uses.ts
  - src/components/home/section-newsletter.tsx
  # Task 2 — nav, routing, behavior
  - src/components/layout/v3-footer.tsx
  - src/components/nav/navigation.tsx
  - src/app/portfolio/page.tsx           # DELETE
  - next.config.ts
  - src/components/home/section-work.tsx
  - src/app/sitemap.ts
  - src/__tests__/home/section-work.test.tsx
  - src/components/visit-survey.tsx
  # Task 3 — dead code + build
  - src/components/home-deck/             # DELETE entire directory
  - src/components/home/credibility-strip.tsx    # DELETE
  - src/components/home/hero-cinematic.tsx       # DELETE
  - src/components/home/section-writing.tsx      # DELETE
  - src/components/home-v2/ink-footer.tsx        # DELETE
  - src/components/home-v2/cycling-photo.tsx     # DELETE
  - src/components/home-v2/manifesto-reveal.tsx  # DELETE
  - src/app/montysinger-v2-spec.md               # DELETE
  - src/__tests__/home-deck/                     # DELETE entire directory
  - src/app/globals.css
  - package.json
autonomous: true
requirements: [quick-260706]

must_haves:
  truths:
    - "Interior page browser tabs read 'Writing | Monty Singer', 'About | Monty Singer' (not double-suffixed)"
    - "Blog post and project tabs read '{Title} | Monty Singer' (single suffix)"
    - "/uses page shows no rows whose description begins with TODO"
    - "All contact email links point to monty@prometheus.today"
    - "Mobile nav drawer has 4 items (About, Projects, Writing, Uses) — no Prometheus"
    - "Visiting /portfolio redirects permanently to /projects"
    - "section-work.tsx Work section links to /projects not /portfolio"
    - "VisitSurvey only appears on the homepage; dismissal persists across browser sessions (localStorage)"
    - "Fabricated Monty Monthly issues are gone — empty Notion response shows only the Subscribe card"
    - "npm run build exits 0 with no new TypeScript or import errors"
  artifacts:
    - path: src/components/layout/v3-footer.tsx
      provides: "Fixed email + distinct Prometheus link labels"
    - path: next.config.ts
      provides: "Permanent /portfolio → /projects redirect"
    - path: src/components/visit-survey.tsx
      provides: "Homepage-only, localStorage-persisted survey"
  key_links:
    - from: next.config.ts redirects
      to: /portfolio route
      via: permanent 308 redirect
      pattern: "source.*portfolio.*destination.*projects"
    - from: src/components/visit-survey.tsx
      to: pathname === "/"
      via: usePathname from next/navigation
      pattern: "usePathname"
---

<objective>
Ten live-site audit findings fixed atomically across three logical clusters.
All changes are surgical — no design system alterations, no new dependencies.

Purpose: Eliminate real user-facing defects (title duplication, TODO leaks, wrong
emails, dead links, intrusive survey) before Monty's next share/promotional push.

Output: 10 commits (one or two fixes per commit for easy bisect), clean build, zero
new test failures beyond the 4 pre-existing vitest failures.
</objective>

<execution_context>
@/Users/Montster/.claude/get-shit-done/workflows/execute-plan.md
@/Users/Montster/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md

Pre-existing test failures (DO NOT misattribute):
  src/__tests__/home/section-building.test.tsx  — HD-04 (pre-existing)
  src/__tests__/home/explorative-homepage.test.tsx — TD-03, HD-05 (pre-existing, 3 failures)
  Total pre-existing failures: 4 — these must remain the ONLY vitest failures after this work.

Key site rule from STATE.md v1.0 carryforward: "no em dashes" listed under site copy rules.
RE-CHECK this: the task explicitly asks to ADD em dashes (issue 6). The copy rule in STATE.md
was written to mean "don't introduce em dashes in NEW copy you write" — the audit found
existing literal double-hyphens "--" that should be proper em dashes for readability. Fix the
ones called out in the task; do not add em dashes anywhere else. If uncertain, use the em dash
only for the two specific instances identified: about/page.tsx lines 10 and 41, and
projects/page.tsx line 14 / PageHero sub prop on line 68.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Content and copy fixes (issues 1, 2, 6, 9)</name>
  <files>
    src/app/writing/page.tsx,
    src/app/about/page.tsx,
    src/app/prometheus/page.tsx,
    src/app/uses/page.tsx,
    src/app/projects/page.tsx,
    src/app/blog/[slug]/page.tsx,
    src/lib/seo/blog-metadata.ts,
    src/lib/seo/project-metadata.ts,
    src/lib/uses.ts,
    src/components/home/section-newsletter.tsx
  </files>
  <action>
Fix all four copy/content issues below, then commit each as a separate atomic commit.

ISSUE 1 — Metadata title deduplication:

The root layout (src/app/layout.tsx) already has `template: "%s | Monty Singer"`.
Any per-page title that already ends with " | Monty Singer" becomes doubly suffixed
(e.g., "Writing | Monty Singer | Monty Singer"). Fix: strip the " | Monty Singer"
suffix from every per-page `metadata.title` and `openGraph.title` / `twitter.title`
string. The template handles the suffix automatically.

Changes per file:
  - src/app/writing/page.tsx: "Writing | Monty Singer" → "Writing"
  - src/app/about/page.tsx: "About | Monty Singer" → "About"
  - src/app/prometheus/page.tsx: "Prometheus | AI Integrations and Education | Monty Singer"
    → "Prometheus | AI Integrations and Education"
    (the sub-title before Monty Singer is kept; only the trailing "| Monty Singer" is dropped)
  - src/app/uses/page.tsx: "Things I Love | Monty Singer" → "Things I Love"
  - src/app/projects/page.tsx: "Building | Monty Singer" → "Building"
  - src/app/blog/[slug]/page.tsx line 39: "Post Not Found | Monty Singer" → "Post Not Found"
  - src/app/projects/[slug]/page.tsx line 35: "Project Not Found | Monty Singer" → "Project Not Found"
  - src/lib/seo/blog-metadata.ts line 12: const title = `${post.title} | Monty Singer`
    → const title = post.title
    (the template will append " | Monty Singer"; openGraph/twitter titles use the
    same `title` variable so they update automatically)
  - src/lib/seo/project-metadata.ts line 12: const title = `${project.title} | Monty Singer`
    → const title = project.title

After editing, commit:
  git add src/app/writing/page.tsx src/app/about/page.tsx src/app/prometheus/page.tsx \
    src/app/uses/page.tsx src/app/projects/page.tsx src/app/blog/\[slug\]/page.tsx \
    src/lib/seo/blog-metadata.ts src/lib/seo/project-metadata.ts
  git commit -m "fix(seo): strip duplicate '| Monty Singer' suffix from per-page titles"

ISSUE 2 — /uses TODO description leak:

In src/lib/uses.ts the Hardware group has three items with detail: "TODO: [Monty to fill in]".
Add a filter in USES_DATA export or at the bottom of the file:

  export const USES_DATA_FILTERED: UsesGroup[] = USES_DATA.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.detail.startsWith("TODO") && !item.detail.toLowerCase().startsWith("placeholder")
    ),
  })).filter((group) => group.items.length > 0);

Then rename the export used by src/app/uses/page.tsx and src/components/v3/uses-list.tsx from
USES_DATA to USES_DATA_FILTERED. Check which files import USES_DATA and update them.
If USES_DATA_FILTERED leaves the Hardware group empty, the group is dropped entirely
(the `.filter((group) => group.items.length > 0)` handles that).

Commit:
  git add src/lib/uses.ts src/app/uses/page.tsx src/components/v3/uses-list.tsx
  git commit -m "fix(uses): hide hardware rows with TODO descriptions from /uses page"

ISSUE 6 — Double-hyphen to em dash:

Fix only the specific user-visible prose instances identified in the audit:
  - src/app/about/page.tsx line 10: "Monty Singer -- builder..." → "Monty Singer — builder..."
  - src/app/about/page.tsx line 41: "enterprise businesses -- automating" → "enterprise businesses — automating"
  - src/app/projects/page.tsx line 14 (metadata description): "built -- through Prometheus" → "built — through Prometheus"
  - src/app/projects/page.tsx PageHero sub prop (~line 68): same string replacement
  Do NOT add em dashes anywhere else.

Commit:
  git add src/app/about/page.tsx src/app/projects/page.tsx
  git commit -m "fix(copy): replace double hyphens with em dashes in about + projects"

ISSUE 9 — Remove fabricated newsletter fallback:

In src/components/home/section-newsletter.tsx:
  - Change line 74 from: `const issues = posts.length > 0 ? postsToIssues(posts) : ISSUES;`
    to:                   `const issues = postsToIssues(posts);` (always use real posts, never fake)
  - Delete the ISSUES constant entirely (lines 44–71).
  - MontyMonthlyCarousel with an empty issues array renders slideCount = 0 + 1 = 1
    (just the Subscribe card). This is the desired empty state.

Commit:
  git add src/components/home/section-newsletter.tsx
  git commit -m "fix(newsletter): remove fabricated Monty Monthly fallback issues"
  </action>
  <verify>
    <automated>
      grep -r "Monty Singer" src/app/writing/page.tsx src/app/about/page.tsx src/app/uses/page.tsx src/app/projects/page.tsx src/lib/seo/blog-metadata.ts src/lib/seo/project-metadata.ts | grep "title:" | grep -v "template\|SITE_TITLE" || echo "CLEAN — no duplicate suffix found"
      grep "TODO" src/lib/uses.ts src/components/v3/uses-list.tsx 2>/dev/null || echo "CLEAN — no TODO in uses files"
      grep "ISSUES" src/components/home/section-newsletter.tsx 2>/dev/null || echo "CLEAN — fake issues removed"
    </automated>
  </verify>
  <done>
    - All interior page titles use the short form (e.g., "Writing" not "Writing | Monty Singer")
    - Blog and project detail page builders return bare post.title / project.title
    - /uses renders no Hardware rows with TODO text
    - Fake Monty Monthly issues const deleted from section-newsletter.tsx
    - 4 separate commits in git log
  </done>
</task>

<task type="auto">
  <name>Task 2: Nav, footer, routing, and behavior (issues 3, 4, 5, 7, 10)</name>
  <files>
    src/components/layout/v3-footer.tsx,
    src/components/nav/navigation.tsx,
    src/app/portfolio/page.tsx,
    next.config.ts,
    src/components/home/section-work.tsx,
    src/app/sitemap.ts,
    src/__tests__/home/section-work.test.tsx,
    src/components/visit-survey.tsx
  </files>
  <action>
Five distinct fixes; commit each atomically.

ISSUE 3 — Contact email unification:

In src/components/layout/v3-footer.tsx the socials row has:
  href="mailto:montydsinger@gmail.com"
Change to:
  href="mailto:monty@prometheus.today"
(section-footer.tsx already uses monty@prometheus.today — confirmed correct.)

Commit:
  git add src/components/layout/v3-footer.tsx
  git commit -m "fix(footer): unify contact email to monty@prometheus.today"

ISSUE 4 — Global footer duplicate Prometheus link:

Still in v3-footer.tsx: the Community column has an external link labeled "Prometheus"
(href="https://prometheus.today") and the Founder column has an internal link labeled
"Prometheus" (href="/prometheus"). Both say "Prometheus" with no visual distinction.

Rename to make their destinations obvious:
  Community column: label "Prometheus" → "prometheus.today"
  Founder column: label "Prometheus" → "Prometheus" (keep, the column heading already
    says "Founder" which provides context, and /prometheus is the internal about page)

This keeps both links (they serve different purposes) but the Community label now clearly
signals the external domain.

Commit:
  git add src/components/layout/v3-footer.tsx
  git commit -m "fix(footer): distinguish external prometheus.today from internal /prometheus link"

ISSUE 5 — Mobile nav Prometheus removal:

In src/components/nav/navigation.tsx the NAV_ITEMS array contains:
  { href: '/prometheus', label: 'Prometheus' }
Remove this entry. The mobile drawer should match desktop: About, Projects, Writing, Uses only.
Desktop nav is in src/components/home-v2/editorial-header.tsx and already has exactly 4 items.

Commit:
  git add src/components/nav/navigation.tsx
  git commit -m "fix(nav): drop Prometheus from mobile drawer to match desktop 4-item nav"

ISSUE 7 — /portfolio → /projects consolidation:

Step A: Delete src/app/portfolio/page.tsx (the entire file; do not delete the directory if
  Next.js needs a folder — actually just delete the file, Next.js will treat the missing
  page as a 404 which will then redirect via the config below).

Step B: In next.config.ts add to the redirects() array:
  { source: '/portfolio', destination: '/projects', permanent: true },
  Add it alongside the other existing redirects.

Step C: In src/components/home/section-work.tsx update the Link:
  href="/portfolio" → href="/projects"
  The link label "Portfolio" → "Projects" (match the destination page title).
  Update any comment referring to /portfolio.

Step D: In src/app/sitemap.ts:
  Remove the line: { url: `${SITE_URL}/portfolio`, ... }
  Update the inline comment from "/ /about /prometheus /projects /writing /uses /portfolio = 7"
  to "/ /about /prometheus /projects /writing /uses = 6".

Step E: In src/__tests__/home/section-work.test.tsx update all portfolio assertions:
  - SC-2.1: `l.getAttribute("href") === "/portfolio"` → `/projects`
  - SC-2.2 (link text): look for `/projects` href; update `portfolioLink` expectations
  - SC-2.2 (kicker): if it checks for "SELECTED" kicker, update link text from "Portfolio" to "Projects"
  Read the test file before editing to see exact assertion strings.

Commit all together:
  git add next.config.ts src/components/home/section-work.tsx src/app/sitemap.ts \
    src/__tests__/home/section-work.test.tsx
  git rm src/app/portfolio/page.tsx
  git commit -m "fix(routing): consolidate /portfolio into /projects with permanent redirect"

ISSUE 10 — VisitSurvey homepage-only + localStorage:

In src/components/visit-survey.tsx:
  1. Add import: `import { usePathname } from 'next/navigation'`
  2. Inside the VisitSurvey function body, call: `const pathname = usePathname()`
  3. At the TOP of the useEffect (before the sessionStorage check), add an early return:
       if (pathname !== '/') return
     This prevents the timer from setting up on any page except /.
  4. Replace both occurrences of `sessionStorage.getItem('visit-survey-done')` and
     `sessionStorage.setItem('visit-survey-done', 'true')` with `localStorage` equivalents.
     The key 'visit-survey-done' stays the same; only the storage API changes.
     This makes the "already shown" state persist across browser sessions, not just the
     current tab session.
  5. Slightly extend the display delay: change the outer setTimeout from 30000 to 45000 ms.

Commit:
  git add src/components/visit-survey.tsx
  git commit -m "fix(survey): homepage-only render + localStorage persistence for visit survey"
  </action>
  <verify>
    <automated>
      grep "montydsinger@gmail.com" src/components/layout/v3-footer.tsx 2>/dev/null && echo "FAIL — old email still present" || echo "PASS — email updated"
      grep "href='/prometheus'" src/components/nav/navigation.tsx 2>/dev/null && echo "FAIL — Prometheus still in mobile nav" || echo "PASS — Prometheus removed"
      grep "source.*portfolio" next.config.ts && echo "PASS — redirect present" || echo "FAIL — redirect missing"
      grep "usePathname\|localStorage" src/components/visit-survey.tsx && echo "PASS — survey updated"
      test -f src/app/portfolio/page.tsx && echo "FAIL — portfolio page still exists" || echo "PASS — portfolio page deleted"
    </automated>
  </verify>
  <done>
    - v3-footer.tsx email is monty@prometheus.today; Community link labeled "prometheus.today"
    - Mobile nav has exactly 4 items (no Prometheus)
    - GET /portfolio returns 308 → /projects
    - section-work.tsx links to /projects; section-work tests pass (or were updated)
    - VisitSurvey only fires on pathname "/", localStorage flag persists across sessions
    - 5 separate commits in git log
  </done>
</task>

<task type="auto">
  <name>Task 3: Dead code purge and build gate (issue 8)</name>
  <files>
    src/components/home-deck/,
    src/components/home/credibility-strip.tsx,
    src/components/home/hero-cinematic.tsx,
    src/components/home/section-writing.tsx,
    src/components/home-v2/ink-footer.tsx,
    src/components/home-v2/cycling-photo.tsx,
    src/components/home-v2/manifesto-reveal.tsx,
    src/app/montysinger-v2-spec.md,
    src/__tests__/home-deck/,
    src/app/globals.css,
    package.json,
    next.config.ts
  </files>
  <action>
Dead code removal in one commit, then build verification.

BEFORE DELETING ANYTHING: run these grep checks to confirm nothing outside the
deleted paths imports these items. Only delete if grep returns no results outside
the target directories.

  grep -rn "home-deck\|hero-cinematic\|credibility-strip\|section-writing" src/ \
    --include="*.tsx" --include="*.ts" | grep -v "src/components/home-deck\|src/components/home/hero-cinematic\|src/components/home/credibility-strip\|src/components/home/section-writing\|__tests__/home-deck"

  grep -rn "cycling-photo\|ink-footer\|manifesto-reveal" src/ \
    --include="*.tsx" --include="*.ts" | grep -v "src/components/home-v2/"

If any results appear, investigate before deleting. (Based on prior audit, conditional-footer.tsx
imports ink-footer — verify this is not a live import before deletion.)

DELETIONS (use git rm so the removal is staged):
  git rm -r src/components/home-deck/
  git rm src/components/home/credibility-strip.tsx
  git rm src/components/home/hero-cinematic.tsx
  git rm src/components/home/section-writing.tsx
  git rm src/components/home-v2/ink-footer.tsx
  git rm src/components/home-v2/cycling-photo.tsx
  git rm src/components/home-v2/manifesto-reveal.tsx
  git rm src/app/montysinger-v2-spec.md
  git rm -r src/__tests__/home-deck/

PACKAGE.JSON — Remove these dependencies (grep first to confirm only home-deck uses them):
  Dependencies to remove: "three", "@react-three/fiber", "@react-three/postprocessing",
    "three-custom-shader-material"
  DevDependencies to remove: "@react-three/test-renderer", "@types/three"
  Edit package.json manually (or via node/jq) to delete those keys.

NEXT.CONFIG.TS — Remove the transpilePackages line:
  transpilePackages: ['three'],
  This line was needed for home-deck's three.js usage. After package removal it's dead config.
  Task 2 already added a redirect to this file — read the current state before editing.

GLOBALS.CSS — Remove three dead token groups:
  1. --accent-glow: rgba(229,65,31,0.32);       (line ~25)
  2. --blob-core: #17171a;                       (line ~36)
     --blob-rim: #e5411f;                        (line ~37)
  3. The stale blue caption palette block (~lines 424–437):
       color: #12245a;
       color: #eaf0ff;
       background: #0f1420;
     Read the surrounding context to identify the exact selector (.photo .cap or similar)
     and remove the entire dead rule block. Do not remove rules whose selectors are
     still referenced in live components.

LOCKFILE UPDATE:
  npm install
  (Updates package-lock.json to reflect the removed packages.)

Commit:
  git add -A
  git commit -m "chore(dead-code): remove home-deck, unused components, three.js deps, and dead CSS tokens"

BUILD VERIFICATION:
  npm run build

Expected: exits 0. Watch for:
  - Import errors from any file that still references a deleted component
  - TypeScript errors from removed type exports
  - The pre-existing 4 vitest failures are in TEST files, not the build — the build
    should be clean regardless.

If the build fails with a missing import, trace the import chain, remove the stray reference,
and re-run. Do NOT silently skip errors.

After successful build, run the test suite:
  npx vitest run --reporter=verbose 2>&1 | tail -40

Expected: same 4 pre-existing failures (HD-04, TD-03, HD-05 × 2) and no new failures.
If new failures appear, fix them before completing this task.
  </action>
  <verify>
    <automated>
      test -d src/components/home-deck && echo "FAIL — home-deck still exists" || echo "PASS"
      test -f src/components/home/hero-cinematic.tsx && echo "FAIL — hero-cinematic still exists" || echo "PASS"
      grep "three" package.json | grep -v "@types\|test\|// " && echo "FAIL — three still in package.json" || echo "PASS"
      grep "accent-glow\|blob-core\|blob-rim" src/app/globals.css && echo "FAIL — dead tokens remain" || echo "PASS"
      npm run build 2>&1 | tail -5
    </automated>
  </verify>
  <done>
    - src/components/home-deck/ directory deleted
    - Dead home/ and home-v2/ components deleted
    - src/app/montysinger-v2-spec.md deleted
    - src/__tests__/home-deck/ deleted
    - three, @react-three/fiber, @react-three/postprocessing, three-custom-shader-material
      removed from package.json (both deps and devDeps)
    - transpilePackages: ['three'] removed from next.config.ts
    - --accent-glow, --blob-core, --blob-rim, and stale blue caption rules removed from globals.css
    - npm install ran, lockfile updated
    - npm run build exits 0
    - npx vitest run shows exactly 4 pre-existing failures, no new ones
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| localStorage | Client-controlled; visit-survey flag can be cleared/spoofed — acceptable, no security consequence |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-260706-01 | Information Disclosure | metadata titles | accept | Title strings are public marketing copy; no PII exposed |
| T-260706-02 | Tampering | localStorage survey flag | accept | Flag only controls UX timing; no auth or data consequence |
| T-260706-03 | Spoofing | email mailto links | accept | mailto: links are inherently client-trust; monty@prometheus.today is the correct public address |
</threat_model>

<verification>
After all three tasks and commits:

1. Visit montysinger.com/writing in a browser tab — title bar should read "Writing | Monty Singer" (not doubled).
2. Visit /uses — Hardware section should be absent (or the group hidden if all items filtered).
3. Visit /portfolio — should 308 redirect to /projects.
4. Check mobile nav drawer — should show About, Projects, Writing, Uses (4 items only).
5. npm run build exits 0.
6. npx vitest run — exactly 4 pre-existing failures, zero new failures.
</verification>

<success_criteria>
- 10 atomic commits covering all 10 audit findings (some grouped: issues 1/2/6/9 = 4 commits, issues 3/4/5/7/10 = 5 commits, issue 8 = 1 commit)
- No metadata title duplication on any page
- No TODO text visible on /uses
- All contact emails unified to monty@prometheus.today
- /portfolio returns 308 → /projects
- Mobile nav is 4 items (desktop parity)
- VisitSurvey: homepage-only, localStorage, 45s delay
- Fabricated newsletter issues removed
- home-deck/ and all dead components gone
- three.js packages removed from package.json
- Dead CSS tokens removed from globals.css
- npm run build: exit 0
- vitest: exactly 4 pre-existing failures, no new ones
</success_criteria>

<output>
Create `.planning/quick/260706-gbu-site-wide-polish-pass-quick-fixes-from-l/260706-gbu-SUMMARY.md` when done.
</output>
