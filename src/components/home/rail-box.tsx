/* ── RailBox ──
   Auto-inverting index+label rail box (D-05).
   Background: var(--color-text) / color: var(--color-bg) so it flips
   against whatever .band variant (.band / .band-dark) it sits in.
   Hard corners (D-04) — no border-radius.
   Server Component — no "use client". */

type Props = {
  num: string;
  label: string;
};

export function RailBox({ num, label }: Props) {
  return (
    <div className="rail">
      <div className="rail-box">
        <div className="num">{num}</div>
        <div className="lbl">{label}</div>
      </div>
    </div>
  );
}
