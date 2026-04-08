import Link from 'next/link'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Writings' },
  { href: '/projects', label: 'Works' },
]

const SOCIALS = [
  { href: 'https://github.com/MSizzle', label: 'GitHub' },
  { href: 'https://linkedin.com/in/monty-singer', label: 'LinkedIn' },
  { href: 'https://x.com/thefullmonty0', label: 'Twitter / X' },
]

export function Footer() {
  return (
    <footer id="contact" className="border-t border-[var(--border)] px-6 md:px-24">
      <div className="mx-auto max-w-[66ch] py-16">
        {/* Contact section */}
        <div className="mb-16">
          <h4 className="text-sm uppercase tracking-widest">Contact</h4>
          <p className="mt-4 text-base leading-relaxed opacity-80">
            Want to chat about investing, building, or anything else?
            I&rsquo;d love to hear from you.
          </p>
          <a
            href="mailto:mds345@georgetown.edu"
            className="mt-3 inline-block border-b border-current pb-0.5 text-base transition-opacity hover:opacity-60"
          >
            mds345@georgetown.edu
          </a>
        </div>

        <div className="grid gap-12 sm:grid-cols-2">
          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest">Links</h4>
            <ul className="mt-4 space-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base opacity-50 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
