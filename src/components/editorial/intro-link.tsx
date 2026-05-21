import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
};

export function IntroLink({ children, href }: Props) {
  return (
    <Link href={href} className="border-b border-ink">
      {children}
    </Link>
  );
}
