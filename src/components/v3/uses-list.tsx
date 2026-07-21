import { Fragment } from "react";

type UsesItem = {
  term: string;
  detail: string;
};

type UsesGroup = {
  heading: string;
  items: UsesItem[];
};

type Props = {
  groups: UsesGroup[];
};

/**
 * Grouped dt/dd uses list with responsive grid collapse — brutalist Crimson Poster style (DS-04).
 * Ported from site.css lines 125-131.
 *
 * Server component — no "use client".
 *
 * Grid: 200px / 1fr two-column layout, collapses to single column below 600px.
 */
export function UsesList({ groups }: Props) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <div key={group.heading}>
          <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-text-dim mb-[18px]">
            {group.heading}
          </h3>
          <dl className="grid grid-cols-[200px_1fr] gap-x-6 gap-y-[14px] max-[600px]:grid-cols-1">
            {group.items.map((item) => (
              <Fragment key={item.term}>
                <dt className="font-display font-medium">{item.term}</dt>
                <dd className="text-text-dim text-sm max-[600px]:mb-[10px]">{item.detail}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
