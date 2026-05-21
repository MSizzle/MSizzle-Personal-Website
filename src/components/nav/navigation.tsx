'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

// Desktop nav (v1.0 sub-pages only — v2.0 routes use EditorialHeader)
const DESKTOP_LINKS = [
  { href: '/about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

// Mobile drawer — unified link set across all routes per Phase 13 mobile-nav fix.
// Home is reachable via the "Monty Singer" brand link in the mobile bar (no
// redundant Home entry in the drawer).
const MOBILE_LINKS = [
  { href: '/projects', label: 'Building' },
  { href: '/writing',  label: 'Writing'  },
  { href: '/events',   label: 'Events'   },
  { href: '/about',    label: 'About'    },
  { href: '/links',    label: 'Links'    },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // v2.0 routes own their desktop chrome via EditorialHeader. On mobile, this
  // component is the only nav across all routes (EditorialHeader is desktop-only
  // after Phase 13 mobile-nav fix).
  const isV2Route = ['/', '/writing', '/events', '/photos'].includes(pathname)

  return (
    <>
      {/* Mobile header — always render across all routes; "Monty Singer" brand link + hamburger */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[var(--bg)] md:hidden">
        <nav className="flex h-16 items-center justify-between px-6">
          <Link
            href="/"
            className="text-base font-normal uppercase tracking-widest"
            onClick={() => setOpen(false)}
          >
            Monty Singer
          </Link>
          <button
            className="flex min-h-[44px] min-w-[44px] items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Desktop header — only on v1.0 sub-pages; v2.0 routes render EditorialHeader instead */}
      {!isV2Route && (
        <header className="fixed inset-x-0 top-0 z-50 hidden bg-[var(--bg)] md:block">
          <nav className="mx-auto flex h-16 max-w-[66ch] items-center justify-between px-6 md:px-0">
            <Link href="/" className="text-base font-normal uppercase tracking-widest">
              Monty Singer
            </Link>
            <ul className="flex items-center gap-8">
              {DESKTOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm uppercase tracking-wide transition-opacity hover:opacity-80',
                      pathname === link.href ? 'opacity-100' : 'opacity-75'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
      )}

      {/* Mobile drawer — opens on hamburger tap; content-height with tap-outside-to-close backdrop */}
      {open && (
        <>
          {/* Backdrop — dims page below drawer; tap anywhere here closes the drawer */}
          <div
            className="fixed inset-0 top-16 z-30 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer — sits above backdrop */}
          <div className="fixed left-0 right-0 top-16 z-40 border-b border-[var(--border)] bg-[var(--bg)] shadow-lg md:hidden">
            <nav className="flex flex-col px-6 py-4">
              {MOBILE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-[48px] items-center border-b border-[var(--border)] py-3 text-base uppercase tracking-wide last:border-b-0"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
