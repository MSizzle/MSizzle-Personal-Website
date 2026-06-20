import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/v3/page-hero'
import { RuleStrong } from '@/components/editorial/rule-strong'

export const metadata: Metadata = {
  title: 'Links | Monty Singer',
  description:
    'Ways to follow Monty Singer online: email, X, LinkedIn, GitHub, and Monty Monthly newsletter on Substack.',
  alternates: { canonical: '/links' },
  openGraph: {
    title: 'Links | Monty Singer',
    description:
      'Ways to follow Monty Singer online: email, X, LinkedIn, GitHub, and Monty Monthly newsletter on Substack.',
    url: '/links',
    type: 'website',
  },
}

const LINKS = [
  { label: 'Email', href: 'mailto:monty@prometheus.today', meta: 'monty@prometheus.today' },
  { label: 'Twitter / X', href: 'https://x.com/thefullmonty0', meta: '@thefullmonty0' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/monty-singer', meta: 'in/monty-singer' },
  { label: 'GitHub', href: 'https://github.com/MSizzle', meta: '@MSizzle' },
  { label: 'Newsletter', href: '/newsletter', meta: 'Monty Monthly' },
]

const ROW_CLASS =
  'flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] py-7 first:border-t-0 transition-opacity hover:opacity-60'

export default function LinksPage() {
  return (
    <>
      <section className="px-6 md:px-40">
        <PageHero
          title="Links"
          crumb="Home / Links"
          sub="Things worth reading and watching."
        />
      </section>

      <RuleStrong />

      <section className="px-6 pb-24 md:px-40 md:pb-32">
        {LINKS.map((link) => {
          const isHttp = link.href.startsWith('http')
          const isMailto = link.href.startsWith('mailto')
          const opensNewTab = isHttp || isMailto

          if (isHttp || isMailto) {
            return (
              <a
                key={link.label}
                href={link.href}
                target={opensNewTab ? '_blank' : undefined}
                rel={opensNewTab ? 'noopener noreferrer' : undefined}
                {...(isHttp
                  ? {
                      'data-umami-event': `links-click-${link.label
                        .toLowerCase()
                        .replace(/[\s/]+/g, '-')}`,
                    }
                  : {})}
                className={ROW_CLASS}
              >
                <span className="text-list-title text-[var(--color-text)]">{link.label}</span>
                <span className="shrink-0 text-meta uppercase text-[var(--color-text-muted)]">{link.meta}</span>
              </a>
            )
          }

          return (
            <Link key={link.label} href={link.href} className={ROW_CLASS}>
              <span className="text-list-title text-[var(--color-text)]">{link.label}</span>
              <span className="shrink-0 text-meta uppercase text-[var(--color-text-muted)]">{link.meta}</span>
            </Link>
          )
        })}
      </section>
    </>
  )
}
