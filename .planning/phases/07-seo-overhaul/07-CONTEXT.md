# Phase 7: SEO Overhaul - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning
**Source:** PRD Express Path (claude-code-prompt.md)

<domain>
## Phase Boundary

Comprehensive SEO overhaul of montysinger.com. Delivers:

1. Global SEO infrastructure (unique titles/descriptions, OG + Twitter tags, JSON-LD Person schema, canonical tags, sitemap verification, robots.txt verification) on every page
2. Homepage rewrite: replace rotating tagline carousel with crawlable prose intro
3. About page rewrite: removes past-jobs/location content; new Prometheus-forward framing
4. Three new pages: `/prometheus` (with FAQ JSON-LD), `/newsletter` (Monty Monthly with Substack RSS carousel), `/uses`
5. Per-page metadata + breadcrumbs on ~15 blog posts and 7 project pages
6. Blog enhancements: visible reading time + publish date on post and index, excerpts on index, "Related Essays" internal-linking block, `/blog/feed.xml` RSS feed with `<link rel="alternate">` in site head
7. BreadcrumbList JSON-LD on every non-homepage page, plus visible breadcrumb UI
8. Navigation update: About, Prometheus, Writings, Works, Monty Monthly, Contact
9. Technical SEO checklist pass: alt text, unique titles/descriptions, heading hierarchy (exactly one H1 per page), 404 styling, image optimization, mobile responsiveness, no orphan pages

Out of scope for this phase:
- Changing essay/blog content (copy is locked; only metadata is edited)
- City/location mentions anywhere on the site
- Past-jobs history (Leerink, GPS, Orbit, solar)
- Georgetown degree/major/class-year specifics

</domain>

<decisions>
## Implementation Decisions

### Copy & Voice (locked)

- **D-01:** No em dashes anywhere in copy. Use commas, periods, or semicolons.
- **D-02:** Tone: confident, concise, warm. Not corporate. Not cringe. "Smart friend who builds things."
- **D-03:** Do not specify a city/location anywhere on the site.
- **D-04:** Do not mention Georgetown degree, major, or class year. Only "Georgetown University" if education is referenced.
- **D-05:** Do not mention past jobs (Leerink, GPS, Orbit, solar). The only professional identity is "Founder of Prometheus."
- **D-06:** Keep all existing essay/blog content exactly as-is. Only metadata is edited.

### Global Metadata (locked)

- **D-07:** Every page gets a unique `<title>` following pattern `[Page Topic] | Monty Singer`.
- **D-08:** Every page gets a unique `<meta name="description">`, 150–160 characters, keyword-rich.
- **D-09:** Every page gets OG tags (og:title, og:description, og:image, og:url, og:type) and Twitter Card tags (twitter:card, twitter:title, twitter:description).
- **D-10:** Every page gets a `<link rel="canonical">` pointing to its own URL.
- **D-11:** Default OG image: reuse existing `public/og-photo.jpg` / `opengraph-image.tsx` if present; flag if not.
- **D-12:** Homepage title: `Monty Singer | Founder of Prometheus, Builder, Writer`. Homepage description: `Monty Singer is the founder of Prometheus, an AI integrations and education company. Builder, writer, and perpetual tinkerer.`

### JSON-LD Structured Data (locked)

- **D-13:** Homepage includes Person schema JSON-LD with exact shape from PRD:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Monty Singer",
    "url": "https://montysinger.com",
    "jobTitle": "Founder",
    "worksFor": { "@type": "Organization", "name": "Prometheus", "url": "https://prometheus.today" },
    "sameAs": [
      "https://linkedin.com/in/monty-singer",
      "https://github.com/MSizzle",
      "https://x.com/thefullmonty0"
    ],
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "Georgetown University" }
  }
  ```
- **D-14:** `/prometheus` includes FAQPage JSON-LD with exactly these four Q&As (text from PRD §11): "What does Prometheus do?", "Who is Prometheus for?", "What kind of AI solutions does Prometheus build?", "Who founded Prometheus?" (answer: "Prometheus was founded by Monty Singer in 2026.")
- **D-15:** Every page except the homepage includes BreadcrumbList JSON-LD and a visible breadcrumb UI.
- **D-16:** Breadcrumb structure:
  - Blog post: Home > Writings > [Post Title]
  - Project page: Home > Works > [Project Name]
  - About: Home > About
  - Prometheus: Home > Prometheus
  - Newsletter: Home > Monty Monthly
  - Events: Home > Events

### Sitemap & Robots (locked)

- **D-17:** `/sitemap.xml` exists (Next.js App Router native `app/sitemap.ts`) and includes homepage, about, blog index, each blog post, projects index, each project, events, `/prometheus`, `/newsletter`, `/uses`.
- **D-18:** `robots.txt` exists, allows all crawling, references the sitemap.

### Homepage (locked)

- **D-19:** Replace the rotating tagline carousel with a real, crawlable 2–3 sentence intro paragraph including the keywords Monty Singer, founder, Prometheus, AI, builder, writer. Example copy provided in PRD §2.
- **D-20:** Keep the existing photo carousel, CTA buttons, Writings list, Works list, and Events section unchanged.

### About Page (locked)

- **D-21:** Full rewrite. Sections: Intro paragraph (founder of Prometheus; builds AI tools; writes essays and Monty Monthly); Prometheus section (company description + link to prometheus.today); Writing section (blog + Monty Monthly links); Education (one line: "Georgetown University"). No career history. No "outside of work" filler. No NYC/location.

### /prometheus Page (locked, NEW)

- **D-22:** Create `/prometheus` with:
  - Headline: "Prometheus"
  - Subhead: "AI Integrations and Education"
  - Description paragraph (text from PRD §4)
  - What We Do list (4 bullet-style items in prose: custom AI automation pipelines; AI tool implementation and integration; AI education and training for teams; workflow optimization with AI)
  - Two anonymized case studies (exact text from PRD §4: orthodontic practice PDF→PowerPoint pipeline; boutique hospitality research tool + website)
  - CTA linking to prometheus.today + contact link
  - FAQPage JSON-LD per D-14
  - SEO title: "Prometheus | AI Integrations and Education | Monty Singer"
  - SEO description: "Prometheus is an AI integrations and education company founded by Monty Singer. Custom automation, AI implementation, and training for businesses."
- **D-23:** Add `/prometheus` link to the main site navigation.

### /newsletter Page (locked, NEW)

- **D-24:** Create `/newsletter` with:
  - Headline: "Monty Monthly"
  - Description paragraph (text from PRD §5)
  - Link out to https://montymonthly.substack.com
  - Recent-issues carousel (horizontal scroll, snap points, styled to match the existing homepage photo carousel)
- **D-25:** Carousel data source: Substack RSS at `https://montymonthly.substack.com/feed`. Fetch server-side (Next.js server component or route handler — **not** client-side) at build time or via ISR with `revalidate: 86400` (daily). Extract title, link, pubDate, and first `<img>`/`<enclosure>` for thumbnail.
- **D-26:** Display 6–10 most recent issues. Each card links out to the Substack post URL. Cards use consistent aspect ratio (16:9 or 3:2) with title + date below. Include left/right scroll arrows on desktop.
- **D-27:** RSS fetch fallback: if fetch fails, render a simple "Subscribe to Monty Monthly" CTA with the Substack link. Do not break the build.
- **D-28:** SEO title: "Monty Monthly | Newsletter by Monty Singer". Description: "Monty Monthly is a newsletter by Monty Singer covering AI, entrepreneurship, philosophy, and building in public. Subscribe on Substack."
- **D-29:** Add `/newsletter` link to site navigation or footer.

### /uses Page (locked, NEW)

- **D-30:** Create `/uses` with headline "What I Use" and these sections:
  - AI and Development: Claude, Claude Code, LangGraph, Ollama, Python, Next.js, React, Node.js, DigitalOcean, Vercel, GitHub
  - Productivity: Obsidian (second brain/journaling), Substack (newsletter), Notion or similar for project management
  - Communication: Telegram, Slack, etc.
  - Hardware: placeholder for Monty to fill in later
- **D-31:** Each entry: tool name + one-line description of how it's used.
- **D-32:** SEO title: "Uses | Tools and Stack | Monty Singer". Description: "The tools, software, and tech stack Monty Singer uses for AI development, writing, and building Prometheus."
- **D-33:** Link `/uses` from the footer.

### Project Pages (locked)

- **D-34:** Add 2–3 sentence description to each of the 7 projects using exact text from PRD §6:
  - MAHealth Scanner: consumer product health-evaluation scanner
  - Goaltender: goal-tracking app
  - Insider Trader: SEC Form 4 visualizer
  - CRM Bot: automated CRM assistant
  - Weather Bot: Telegram daily weather bot
  - AI Fashion Bot: AI outfit recommender
  - Two Phones: dual-phone conversation bot
- **D-35:** Add "Built with" line when the tech stack can be determined from the project page/codebase; omit if not determinable (do NOT guess).
- **D-36:** Each project page gets a unique SEO title and description following the pattern from D-07/D-08.

### Blog Post Metadata (locked)

- **D-37:** For each of the 15 blog posts, add/fix:
  - `<title>`: `[Essay Title] | Monty Singer`
  - `<meta name="description">`: 150–160 char summary generated from the first paragraph of each post (accurate, not padded)
  - OG tags (og:title, og:description, og:url)
  - Canonical URL
- **D-38:** Essay body content MUST NOT change. Only metadata is edited.

### Blog Index + Post Enhancements (locked)

- **D-39:** Every blog post page shows visible reading time (e.g., "4 min read") and publish date near the top, below the title. Reading time = ceil(word_count / 250).
- **D-40:** Blog index page shows reading time + date next to each post title AND adds a 1–2 sentence excerpt below each title (first ~150 chars of post body, or custom excerpt if one exists in Notion schema).
- **D-41:** Every blog post gets a "Related Essays" section at the bottom with 2–3 related posts. Use the manual topic groupings from PRD §10:
  - Philosophy/life: Choosing Faith, Practical Philosophy, Defiant Optimism, Pursuit of Happierness, Capable of Change, Demystifying Merlin, Earning Magic, Staring Into the Void
  - Technology/AI: AI is Nibbling the World, Algorithmic Content, Standing on Sediment
  - Relationships/personal: Perfect Partner, Discipline and Dog Names
  - Career/ambition: Hideous Odds of Getting Rich, Art of Living Fast and Slow
  Each related link shows the title and excerpt.
- **D-42:** Generate blog RSS feed at `/blog/feed.xml` (or `/rss.xml`) with title, link, pubDate, description (excerpt), and author for each post.
- **D-43:** Add `<link rel="alternate" type="application/rss+xml">` tag in site head pointing to the blog RSS feed.

### Navigation (locked)

- **D-44:** Site navigation includes (in this order): About, Prometheus, Writings (blog), Works (projects), Monty Monthly (newsletter), Contact.
- **D-45:** `/uses` lives in footer, not primary nav.

### Technical SEO Checklist (locked)

- **D-46:** All images have descriptive alt text (keyword-relevant where natural).
- **D-47:** No duplicate title tags or meta descriptions across pages.
- **D-48:** Every page has exactly one `<h1>` with H2s and H3s used logically beneath it.
- **D-49:** 404 page exists and is styled.
- **D-50:** All internal links use relative paths or consistent absolute URLs.
- **D-51:** Images use Next.js `<Image>` component for automatic optimization.
- **D-52:** Verify no orphan pages — every page is linked from at least one other page.

### Claude's Discretion

- Exact technical implementation of global metadata: pick between Next.js `generateMetadata()` per-route vs a central metadata helper. Prefer per-route `generateMetadata` so dynamic routes (blog, projects) can inject per-post data.
- Component architecture for breadcrumbs, related essays, reading-time utilities, and RSS parsers.
- File locations (likely `src/components/seo/`, `src/lib/seo/`, `src/lib/rss/`).
- Whether to centralize JSON-LD generation in a helper or inline per page.
- RSS parser choice for Substack feed (`rss-parser`, `fast-xml-parser`, native parsing, etc.).
- Exact typography/spacing for breadcrumbs and related-essays UI within existing design system.
- Whether "Contact" in nav is a new page or an anchor to an existing section — confirm during planning by scanning the codebase.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary PRD
- `claude-code-prompt.md` — The full SEO overhaul PRD this CONTEXT.md derives from. Sections 1–13 contain exact copy, page structures, and JSON-LD payloads.

### Project guidelines
- `CLAUDE.md` — Project-level tech stack, constraints, and "What NOT to Use" list. SEO work must respect: Next.js App Router, Tailwind v4, Motion (motion/react), Notion as CMS, Vercel free tier, Umami analytics already live.
- `/Users/Montster/.claude/CLAUDE.md` — Global rules including Prometheus watermark requirement (bottom-right on every page) and Obsidian wikilink convention for memory/notes.

### Existing site surfaces (canonical for decisions — read before editing)
- `src/app/layout.tsx` — Root layout, current head/metadata, provider hierarchy, existing watermark location.
- `src/app/page.tsx` — Homepage (rotating tagline carousel lives here).
- `src/app/about/page.tsx` — About page (currently has content to rewrite).
- `src/app/blog/page.tsx` — Blog index.
- `src/app/blog/[slug]/page.tsx` — Blog post detail.
- `src/app/projects/page.tsx` — Projects index.
- `src/app/projects/[slug]/page.tsx` — Project detail.
- `src/app/events/page.tsx` — Events page.
- `src/app/links/page.tsx` — Links page.
- `src/app/sitemap.ts` — Existing sitemap generator. Must be extended to include /prometheus, /newsletter, /uses.
- `src/app/robots.ts` — Existing robots.txt generator.
- `src/app/opengraph-image.tsx` — Existing dynamic OG image for homepage.
- `src/components/` — Existing component patterns and conventions.
- `src/lib/` — Existing utilities (Notion client, reading time, etc.).

### External references cited in the PRD
- `https://montymonthly.substack.com/feed` — Substack RSS for newsletter carousel (D-25).
- `https://prometheus.today` — External link target for `/prometheus` CTA and About page.
- `https://linkedin.com/in/monty-singer`, `https://github.com/MSizzle`, `https://x.com/thefullmonty0` — `sameAs` URLs for Person schema (D-13).

</canonical_refs>

<specifics>
## Specific Ideas

- **Exact Person schema JSON** — see D-13. Must match verbatim.
- **Exact FAQPage Q&As** — see D-14. Four questions, answers quoted verbatim from PRD §11.
- **Exact homepage intro example** — PRD §2 provides the template; adjust only for voice, preserving keywords.
- **Exact case study copy** for `/prometheus` — see PRD §4.
- **Exact Monty Monthly description copy** — see PRD §5.
- **Related Essays topical groupings** — see D-41. Fifteen essays pre-grouped.
- **Breadcrumb label strings** — "Home", "Writings" (not "Blog"), "Works" (not "Projects"), matching PRD §12 example and D-16.
- **Blog RSS feed path** — `/blog/feed.xml` preferred over `/rss.xml` (PRD §10 lists both; first is canonical choice).

</specifics>

<deferred>
## Deferred Ideas

- **Hardware section on /uses** — PRD §13 explicitly leaves hardware as a placeholder for Monty to fill in. Ship the page with a stub and a note.
- **`Built with` line on project pages where stack cannot be determined** — PRD §6 explicitly says to omit rather than guess.
- **Tagging/categorization system for blog** — PRD §10 explicitly uses manual groupings for Related Essays because no tagging system exists; do not build one as part of this phase.
- **Post-launch validation** (Google Search Console verification, keyword ranking checks, Lighthouse score targets) — belongs in Phase 6 (Pre-Launch QA), not here.

</deferred>

---

*Phase: 07-seo-overhaul*
*Context gathered: 2026-04-15 via PRD Express Path (source: claude-code-prompt.md)*
