import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
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
  'flex items-baseline justify-between gap-6 border-t border-rule py-7 first:border-t-0 transition-opacity hover:opacity-60'

export default function LinksPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Index · 06</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Links.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              Every way to reach me or follow along — email, the socials, and the
              monthly letter.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/IMG_2129.jpeg"
                alt=""
                fill
                sizes="360px"
                className="object-cover saturate-[0.92]"
              />
            </div>
          </div>
        </div>
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
                <span className="text-list-title text-ink">{link.label}</span>
                <span className="shrink-0 text-meta uppercase text-muted">{link.meta}</span>
              </a>
            )
          }

          return (
            <Link key={link.label} href={link.href} className={ROW_CLASS}>
              <span className="text-list-title text-ink">{link.label}</span>
              <span className="shrink-0 text-meta uppercase text-muted">{link.meta}</span>
            </Link>
          )
        })}
      </section>
    </>
  )
}
