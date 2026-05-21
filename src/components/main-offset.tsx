'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * D-42a: gate the v1.0 fixed-nav `pt-16` offset off the v2.0 homepage.
 *
 * The v1.0 Navigation is `position: fixed; height: 64px;` and sub-pages compensate
 * with `<main className="pt-16">`. The v2.0 editorial homepage renders its own
 * inline header (`pt-9` = 36px), so on `/` the main element must NOT apply pt-16.
 *
 * Keeps `src/app/layout.tsx` a server component (preserves the `metadata` export).
 */
export function MainOffset({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  return <main className={isHome ? '' : 'pt-16'}>{children}</main>
}
