import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  numeral?: string;
};

export function SectionLabel({ children, numeral }: Props) {
  return (
    <div className="flex items-baseline justify-between text-label uppercase text-ink">
      <span>{children}</span>
      {numeral && <span className="text-muted">{numeral}</span>}
    </div>
  );
}
