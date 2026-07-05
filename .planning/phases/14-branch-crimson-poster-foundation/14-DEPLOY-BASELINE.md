# v3 Branch & Deploy Baseline

**Captured:** 2026-06-18
**Phase:** 14 — Branch & Crimson Poster Foundation
**Purpose:** Record the production alias target and v3 branch verification so the Phase 18 alias swap is unambiguous.

---

## Branch Details

| Field | Value |
|-------|-------|
| Branch name | `v3` |
| Created from | `claude/phase-8-resume` (the active editorial codebase branch) |
| `main` ancestor check | **PASSED** — `git merge-base --is-ancestor main v3` exits 0 |

**Verification command:**
```bash
git rev-parse --verify v3 && git merge-base --is-ancestor main v3 && echo "v3 ok, main ancestor"
```

---

## Production Alias Baseline

**Captured:** 2026-06-18 via `npx vercel inspect m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app`

| Field | Value |
|-------|-------|
| Production alias | `montysinger.com` |
| Current prod deployment URL | `https://m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app` |
| Vercel deployment ID | `dpl_hYFx6kswh3iGuNb5iWFxuM9QByyW` |
| Deployment age at capture | 13 days (deployed 2026-06-05) |

**Auto-alias list (all point to the same deployment):**
- `https://montysinger.com`
- `https://m-sizzle-personal-website-msizzles-projects.vercel.app`
- `https://m-sizzle-personal-website-msizzle-msizzles-projects.vercel.app`
- `https://m-sizzle-personal-website.vercel.app`

**Phase 18 swap target:** When v3 reaches parity + QA GO, promote to `montysinger.com` by running:
```bash
vercel deploy --prod  # (no --prebuilt flag)
# then verify:
vercel ls --prod
curl -s https://montysinger.com/ | grep "<unique-string-from-new-deploy>"
# if alias drifts:
vercel alias set <new-deploy-url> montysinger.com
```

---

## Production Deploy Guardrail

> **NEVER use `--prebuilt --prod` on this project.**

From `.planning/memory/vercel-prod-deploy-gotchas.md`:

- `vercel deploy --prebuilt --prod` has caused CSS/JS hash mismatches — deployed HTML referenced chunk filenames that did not exist in the upload, resulting in HTTP 200 HTML with CSS 404, site rendered unstyled.
- After `vercel deploy --prod`, always verify the alias with `vercel ls --prod` AND `curl -s https://montysinger.com/ | grep <unique-string>` before reporting as deployed. The alias can serve the previous deploy for several minutes even after the CLI prints "Aliased."
- If alias drifts: `vercel alias set <deploy-url> montysinger.com`.

**This plan (Phase 14) does NOT perform any production deployment.** Production (`montysinger.com`) remains untouched until Phase 18 QA GO verdict. v3 deploys to its own Vercel preview only.

---

## To Capture Alias Before Phase 18 Swap

If the alias needs to be re-confirmed before the swap, run:
```bash
npx vercel inspect m-sizzle-personal-website-557xchofb-msizzles-projects.vercel.app
# or check current aliases:
npx vercel alias ls | grep montysinger
```
