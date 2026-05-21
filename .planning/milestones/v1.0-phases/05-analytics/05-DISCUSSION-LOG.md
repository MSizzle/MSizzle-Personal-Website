# Phase 5: Analytics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 05-analytics
**Areas discussed:** Umami deployment, Tracking scope, Script integration, Geo map (ANLY-06)

---

## Umami Deployment

### Database Choice

| Option | Description | Selected |
|--------|-------------|----------|
| Neon Postgres | Free tier never hard-pauses, scales to zero, wakes in <1s. 0.5GB storage. | ✓ |
| Supabase Postgres | Free tier auto-pauses after 7 days of inactivity. | |
| Vercel Postgres | Vercel-native but uses main project's free-tier allocation. | |

**User's choice:** Neon Postgres (Recommended)
**Notes:** None — clear choice based on always-on requirement.

### Dashboard URL

| Option | Description | Selected |
|--------|-------------|----------|
| Default Vercel URL | No DNS config needed, access via *.vercel.app. | |
| Custom subdomain | analytics.msizzle.com — requires one CNAME DNS record. | ✓ |
| You decide | Claude picks simplest approach. | |

**User's choice:** Custom subdomain (Recommended)
**Notes:** None.

### Setup Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Fork Umami repo | Fork to GitHub, deploy from fork. Full control over updates. | ✓ |
| Deploy button | One-click Vercel deploy. Fastest but less control. | |

**User's choice:** Fork Umami repo (Recommended)
**Notes:** None.

---

## Tracking Scope

### Custom Events

| Option | Description | Selected |
|--------|-------------|----------|
| Outbound clicks only | Track external link clicks on project links, social links, CTAs. | ✓ |
| Outbound + scroll depth | Also track scroll depth on blog posts and homepage. | |
| Full engagement tracking | Outbound, scroll depth, newsletter CTA, theme toggle, tag filter. | |
| You decide | Claude picks the right balance. | |

**User's choice:** Outbound clicks only (Recommended)
**Notes:** None — focused approach, avoid over-instrumenting.

### UTM Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Umami built-in | Automatic UTM param capture, no custom code. | ✓ |
| Custom UTM dashboard view | Build custom report for UTM campaign performance. | |

**User's choice:** Umami built-in (Recommended)
**Notes:** None.

---

## Script Integration

### Environment Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Production only | Skip tracking in dev/preview, use env var check. | ✓ |
| All environments | Track everywhere including dev. | |
| Prod + preview, not dev | Track on Vercel preview deploys too. | |

**User's choice:** Production only (Recommended)
**Notes:** None — keep analytics data clean.

### Click Tracking Implementation

| Option | Description | Selected |
|--------|-------------|----------|
| Umami data attributes | Add data-umami-event to outbound links. Declarative, no JS. | ✓ |
| Custom track() calls | Use umami.track() in onClick handlers. More flexible. | |
| You decide | Claude picks simplest approach. | |

**User's choice:** Umami data attributes (Recommended)
**Notes:** None.

---

## Geo Map (ANLY-06)

### Map Location

| Option | Description | Selected |
|--------|-------------|----------|
| Umami dashboard only | Use built-in v3 world map. Private, no custom code. | ✓ |
| Public page on main site | Custom map component on /analytics page. | |
| Both | Dashboard for private + simplified public map. | |

**User's choice:** Umami dashboard only (Recommended)
**Notes:** None — keeps implementation simple, satisfies ANLY-06.

---

## Claude's Discretion

- Exact Umami version, script tag config, Neon region, dashboard widget customization
- Which specific link elements get data-umami-event attributes

## Deferred Ideas

None — discussion stayed within phase scope.
