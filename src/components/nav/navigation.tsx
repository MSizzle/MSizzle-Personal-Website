'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EditorialHeader } from '@/components/home-v2/editorial-header'

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

  // Derive the active EditorialHeader label from pathname (Path 2 — chrome
  // unification). EditorialHeader is now globally rendered here; on routes
  // not in this mapping the prop is undefined so no nav link gets bolded.
  const activeLabel: 'Building' | 'Writing' | 'Events' | 'About' | 'Links' | undefined =
    pathname === '/projects' ? 'Building'
    : pathname === '/writing' || pathname.startsWith('/blog') ? 'Writing'
    : pathname === '/events' ? 'Events'
    : pathname === '/about' ? 'About'
    : pathname === '/links' ? 'Links'
    : undefined

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

      {/* Desktop header — globalized EditorialHeader (self-gates via `hidden md:flex`). */}
      <EditorialHeader active={activeLabel} />

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
