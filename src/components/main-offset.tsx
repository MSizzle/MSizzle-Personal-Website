'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * D-42a + D-26: gate the v1.0 fixed-nav `pt-16` offset off all v2.0 routes.
 *
 * The v1.0 Navigation is `position: fixed; height: 64px;` and sub-pages compensate
 * with `<main className="pt-16">`. The v2.0 editorial routes (/, /writing, /events,
 * /photos) render their own inline editorial header (`pt-9` = 36px), so on those
 * routes the main element must NOT apply pt-16.
 *
 * Phase 11 (D-26) extends Phase 10's D-42 single-route gate to all 4 v2.0 routes
 * ahead of Plans 11-04 (/events) + 11-05 (/photos) shipping.
 *
 * Keeps `src/app/layout.tsx` a server component (preserves the `metadata` export).
 */
export function MainOffset({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isV2Route = ['/', '/writing', '/events', '/photos'].includes(pathname)
  return <main className={isV2Route ? '' : 'pt-16'}>{children}</main>
}
