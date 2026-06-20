import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
};

export function AllLink({ children, href }: Props) {
  return (
    <Link
      href={href}
      className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
    >
      {children}
    </Link>
  );
}
