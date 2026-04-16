import Link from 'next/link'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/prometheus', label: 'Prometheus' },
  { href: '/blog', label: 'Writings' },
  { href: '/projects', label: 'Works' },
  { href: '/newsletter', label: 'Monty Monthly' },
  { href: '/events', label: 'Events' },
  { href: '/uses', label: 'Uses' },
]

const SOCIALS = [
  { href: 'https://github.com/MSizzle', label: 'GitHub' },
  { href: 'https://linkedin.com/in/monty-singer', label: 'LinkedIn' },
  { href: 'https://x.com/thefullmonty0', label: 'Twitter / X' },
]

export function Footer() {
  return (
    <footer className="px-6 md:px-24">
      <div className="mx-auto max-w-[66ch] py-16">
        {/* Contact */}
        <div id="contact" className="mb-16 scroll-mt-20">
          <h2 className="text-base font-normal uppercase tracking-widest">
            Contact &#8600;
          </h2>
          <p className="mt-4 leading-relaxed opacity-80">
            Want to talk about AI, building, writing, or a potential Prometheus engagement?
            I&rsquo;d love to hear from you.
          </p>
          <a
            href="mailto:mds345@georgetown.edu"
            data-umami-event="social-click-email"
            className="mt-2 inline-block underline transition-opacity hover:opacity-60"
          >
            mds345@georgetown.edu
          </a>
        </div>

        {/* Links + Socials grid */}
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
          {/* Links */}
          <div>
            <h2 className="text-base font-normal uppercase tracking-widest">
              Links &#8600;
            </h2>
            <ul className="mt-2 space-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-3xl underline transition-opacity hover:opacity-60 sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h2 className="text-base font-normal uppercase tracking-widest">
              Socials &#8600;
            </h2>
            <ul className="mt-2 space-y-2">
              {SOCIALS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-umami-event={`social-click-${link.label.toLowerCase().replace(/[\s/]+/g, '-')}`}
                    className="text-3xl underline transition-opacity hover:opacity-60 sm:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-base opacity-50">
          &copy; {new Date().getFullYear()} Monty Singer
        </p>
      </div>
    </footer>
  )
}
