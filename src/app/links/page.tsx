import type { Metadata } from 'next'
import { Mail, ArrowUpRight, Newspaper } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

export const metadata: Metadata = {
  title: 'Links — Monty Singer',
  description: 'Find Monty Singer online — social links, email, and newsletter.',
}

// Brand icons as inline SVGs (lucide-react v4 removed brand icons)
function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

type LinkItem = {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

const LINKS: LinkItem[] = [
  { href: 'mailto:monty@msizzle.com', label: 'Email', icon: Mail },
  { href: 'https://x.com/thefullmonty0', label: 'Twitter / X', icon: TwitterIcon },
  { href: 'https://linkedin.com/in/monty-singer', label: 'LinkedIn', icon: LinkedinIcon },
  { href: 'https://github.com/MSizzle', label: 'GitHub', icon: GithubIcon },
  { href: '/blog', label: 'Subscribe to Newsletter', icon: Newspaper },
]

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-32">
      <ScrollReveal delay={0}>
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">
          Find Me Online
        </h1>
        <p className="mt-4 text-center text-[var(--fg-muted)]">
          All the places you can find me on the internet.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-12 flex flex-col gap-2">
          {LINKS.map((link, index) => {
            const isExternal = link.href.startsWith('http')
            const isLast = index === LINKS.length - 1
            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...(isExternal ? { 'data-umami-event': `links-click-${link.label.toLowerCase().replace(/[\s/]+/g, '-')}` } : {})}
                className={`flex min-h-16 items-center rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 transition-colors duration-150 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5${!isLast ? ' border-b border-[var(--border)]' : ''}`}
              >
                <link.icon size={20} aria-label={link.label} />
                <span className="flex-1 text-center text-base">{link.label}</span>
                <ArrowUpRight size={20} className="text-[var(--fg-muted)]" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </ScrollReveal>
    </div>
  )
}
