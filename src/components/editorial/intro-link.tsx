import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
  /**
   * When true, renders a plain `<a>` with `target="_blank"` + `rel="noopener noreferrer"`
   * for outbound links. Defaults to false / undefined — internal behavior unchanged
   * (renders a `next/link` for client-side navigation).
   *
   * Explicit boolean only; no auto-detection from href (avoids surprise behavior
   * for any future internal absolute URL).
   */
  external?: boolean;
};

export function IntroLink({ children, href, external }: Props) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-b border-ink"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="border-b border-ink">
      {children}
    </Link>
  );
}
