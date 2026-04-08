import Link from 'next/link'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: 'mailto:mds@georgetown.edu', label: 'Email' },
]

const SOCIALS = [
  { href: 'https://github.com/MSizzle', label: 'GitHub' },
  { href: 'https://linkedin.com/in/monty-singer', label: 'LinkedIn' },
  { href: 'https://x.com/thefullmonty0', label: 'Twitter / X' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 md:px-24">
      <div className="mx-auto max-w-[66ch] py-16">
        <div className="grid gap-12 sm:grid-cols-2">
          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest">Links</h4>
            <ul className="mt-4 space-y-2">
              {LINKS.map((link) => {
                const isExternal =
                  link.href.startsWith('http') || link.href.startsWith('mailto')
                const Component = isExternal ? 'a' : Link
                const props = isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {}
                return (
                  <li key={link.label}>
                    <Component
                      href={link.href}
                      {...props}
                      data-umami-event={
                        isExternal
                          ? `social-click-${link.label.toLowerCase().replace(/[\s/]+/g, '-')}`
                          : undefined
                      }
                      className="text-base opacity-50 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </Component>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm uppercase tracking-widest">Socials</h4>
            <ul className="mt-4 space-y-2">
              {SOCIALS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-umami-event={`social-click-${link.label.toLowerCase().replace(/[\s/]+/g, '-')}`}
                    className="text-base opacity-50 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-sm opacity-50">
          &copy; {new Date().getFullYear()} Monty Singer
        </p>
      </div>
    </footer>
  )
}
