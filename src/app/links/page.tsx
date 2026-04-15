import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

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
  { href: 'mailto:mds345@georgetown.edu', label: 'Email' },
  { href: 'https://x.com/thefullmonty0', label: 'Twitter / X' },
  { href: 'https://linkedin.com/in/monty-singer', label: 'LinkedIn' },
  { href: 'https://github.com/MSizzle', label: 'GitHub' },
  { href: '/blog', label: 'Newsletter' },
]

export default function LinksPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Links' }]} />
      <div className="mx-auto max-w-[66ch] px-6 pb-24 pt-8 md:px-0">
        <ScrollReveal delay={0}>
          <h1 className="text-sm font-normal uppercase tracking-widest">
            Links
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <ul className="mt-8 space-y-4">
            {LINKS.map((link) => {
              const isHttp = link.href.startsWith('http')
              const isMailto = link.href.startsWith('mailto')
              const opensNewTab = isHttp || isMailto
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={opensNewTab ? '_blank' : undefined}
                    rel={opensNewTab ? 'noopener noreferrer' : undefined}
                    {...(isHttp ? { 'data-umami-event': `links-click-${link.label.toLowerCase().replace(/[\s/]+/g, '-')}` } : {})}
                    className="text-3xl underline transition-opacity hover:opacity-60 sm:text-lg"
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </ScrollReveal>
      </div>
    </>
  )
}
