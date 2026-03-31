# MSizzle Personal Website

## What This Is

A custom-built personal website for Monty Singer, replacing a Notion Super site. It's a full personal platform — portfolio, blog, about/resume, and social links — with rich visitor analytics and a design that goes hard on animations, unique layouts, and interactivity. Content is managed in Notion and pulled automatically.

## Core Value

A personal site that feels alive and memorable — not another template blog — while giving Monty real data about who's visiting and what resonates.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Portfolio/projects showcase with interactive presentation
- [ ] Blog/writing section with content pulled from Notion
- [ ] About/resume page with bio, experience, skills
- [ ] Links/social hub (email, Twitter/X, LinkedIn, newsletter)
- [ ] Notion as CMS — write in Notion, site updates automatically
- [ ] Visitor analytics: real-time visitors, traffic sources, page popularity, geo & devices
- [ ] Smooth page transitions and scroll-triggered animations
- [ ] Unique, non-template layouts that feel unexpected
- [ ] Interactive elements — things to click, explore, play with
- [ ] Light/dark mode support
- [ ] Custom domain integration
- [ ] Mobile responsive design
- [ ] Fast load times (static generation)

### Out of Scope

- Paid hosting — using Vercel free tier
- Paid analytics — using self-hosted Umami or similar (free)
- E-commerce or payments — this is a personal site, not a store
- User accounts/authentication — public-facing only
- CMS migration — staying with Notion, not switching to a new CMS

## Context

- Current site: montysinger.super.site (Notion Super)
- Current structure: Home, Projects, Passions, Principles/Beliefs, Highlights
- Current design: Inter font, light/dark mode, clean/professional with emoji-labeled sections
- Pain points with Super: limited analytics, limited design customization, cost
- Monty is based in NYC, Georgetown University background, investing experience
- Building technical skills with AI and Claude Code — this is also a learning project
- Has a custom domain already

## Constraints

- **CMS**: Must use Notion — Monty's existing content workflow stays the same
- **Hosting**: Vercel free tier — zero hosting cost
- **Analytics**: Self-hosted or free solution — no recurring analytics fees
- **Tech Level**: Monty is learning with AI assistance — stack should be well-documented and AI-friendly
- **Design**: Must feel "cool" — animations, unique layouts, interactivity are requirements, not nice-to-haves

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Replace Super with custom site | Analytics + design freedom + cost savings | — Pending |
| Keep Notion as CMS | Existing content workflow, no migration needed | — Pending |
| Vercel free tier hosting | Zero cost, excellent DX, great for Next.js | — Pending |
| Self-hosted analytics (e.g., Umami) | Full analytics (real-time, sources, geo) at zero cost | — Pending |
| Fresh start design | Not a recreation — rethink structure and visual identity | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after initialization*
