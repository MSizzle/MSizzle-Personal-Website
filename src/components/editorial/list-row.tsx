import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  title: ReactNode;
  href: string;
  extra?: ReactNode;
  meta?: ReactNode;
  big?: boolean;
};

export function ListRow({ title, href, extra, meta, big = false }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-baseline justify-between gap-6 border-t border-[var(--color-border)] py-5 first:border-t-0",
        big && "py-7"
      )}
    >
      <div className="flex-1">
        <div className={cn("text-[var(--color-text)]", big ? "text-list-title" : "text-list-title-home")}>
          {title}
        </div>
        {extra && (
          <div className="mt-1 text-caption text-[var(--color-text-muted)]">{extra}</div>
        )}
      </div>
      {meta && (
        <div className="shrink-0 text-meta uppercase text-[var(--color-text-muted)]">{meta}</div>
      )}
    </Link>
  );
}
