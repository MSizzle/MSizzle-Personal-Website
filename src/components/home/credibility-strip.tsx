/* ── CredibilityStrip ──
   "As seen in" placeholder logo strip (D-11).
   Keep-or-cut deferred to real-asset swap.
   Hard corners (D-04) — no border-radius on marks.
   Server Component — no "use client". */

export function CredibilityStrip() {
  return (
    <div className="proof">
      <div className="lbl">Building and writing at the edge of AI · as seen in</div>
      <div className="marks">
        <div className="m">Logo</div>
        <div className="m">Logo</div>
        <div className="m">Logo</div>
        <div className="m">Logo</div>
        <div className="m">Logo</div>
      </div>
    </div>
  );
}
