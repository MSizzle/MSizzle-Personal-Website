import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
  sub?: string;
};

type Props = {
  title: string;
  links: FooterLink[];
};

export function FooterCol({ title, links }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-label uppercase text-footer-mute">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-footer-fg hover:text-footer-fg/70">
              {link.label}
            </Link>
            {link.sub && (
              <div className="mt-0.5 text-caption text-footer-mute">{link.sub}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
