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
      className="inline-block border-b border-ink pb-1 text-label uppercase text-ink"
    >
      {children}
    </Link>
  );
}
