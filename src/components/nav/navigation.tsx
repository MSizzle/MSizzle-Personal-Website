'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X as CloseIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--border)]/50 bg-[var(--bg)]/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Monty Singer
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors hover:text-foreground',
                    pathname === link.href
                      ? 'border-b-2 border-[var(--accent)] pb-0.5 text-foreground'
                      : 'text-[var(--fg-muted)]'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="flex min-h-[44px] min-w-[44px] items-center justify-center md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-[var(--bg)] md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[48px] items-center border-b border-[var(--border)] py-3 text-base"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
