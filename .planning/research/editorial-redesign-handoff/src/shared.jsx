// Shared tokens + tiny primitives used across every artboard.
// One typeface family (Helvetica Neue). Two weights (400, 700).
// Warm-paper monochrome palette.

// Real photographs lifted from montysinger.com — referenced directly so the
// mockup always shows the live set.
const PHOTOS = [
  'https://montysinger.com/MSizzle-website-photos/000092530012.jpeg',
  'https://montysinger.com/MSizzle-website-photos/20230928%20MSB_0114.jpg',
  'https://montysinger.com/MSizzle-website-photos/IMG_0028.jpeg',
  'https://montysinger.com/MSizzle-website-photos/IMG_1075.JPG',
  'https://montysinger.com/MSizzle-website-photos/IMG_2129.jpeg',
  'https://montysinger.com/MSizzle-website-photos/Patricof09.jpg',
];

const MS = {
  bg:        '#F4F2EC',  // warm off-white paper
  ink:       '#0E0E0C',  // near-black, warm
  muted:     '#9A9690',  // metadata, captions
  faint:     '#C7C3BA',  // tertiary
  rule:      '#E5E2D9',  // hairline divider
  ruleStrong:'#1A1A18',  // bold horizontal rule
  font:      '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

// Hairline horizontal rule used as a section separator.
function Rule({ strong=false, style }) {
  return (
    <div style={{
      height: strong ? 1 : 1,
      background: strong ? MS.ruleStrong : MS.rule,
      width: '100%',
      ...style,
    }} />
  );
}

// Small uppercase label used to title every section.
function SectionLabel({ children, num, style }) {
  return (
    <div style={{
      display:'flex', alignItems:'baseline', justifyContent:'space-between',
      fontSize: 11, letterSpacing: '0.18em', textTransform:'uppercase',
      color: MS.ink, fontWeight: 700,
      ...style,
    }}>
      <span>{children}</span>
      {num && <span style={{ color: MS.muted, fontWeight:400 }}>{num}</span>}
    </div>
  );
}

// A single row in a list (writing, events, projects). Editorial spacing.
function ListRow({ title, meta, href, extra, last, big }) {
  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${MS.rule}` }}>
      <a href={href || '#'} style={{
        display:'grid',
        gridTemplateColumns: '1fr auto',
        alignItems:'baseline',
        gap: 24,
        padding: big ? '28px 0' : '20px 0',
        textDecoration:'none', color: MS.ink,
      }}>
        <div>
          <div style={{
            fontSize: big ? 28 : 20, lineHeight: 1.15,
            fontWeight: 400, letterSpacing: '-0.01em',
          }}>
            {title}
          </div>
          {extra && (
            <div style={{ fontSize: 13, color: MS.muted, marginTop: 6, lineHeight: 1.4 }}>
              {extra}
            </div>
          )}
        </div>
        <div style={{
          fontSize: 11, letterSpacing: '0.14em', textTransform:'uppercase',
          color: MS.muted, fontWeight: 400, whiteSpace:'nowrap',
        }}>
          {meta}
        </div>
      </a>
    </div>
  );
}

// "All writing →" style end-of-section link.
function AllLink({ children, href }) {
  return (
    <a href={href || '#'} style={{
      display:'inline-block', marginTop: 24,
      fontSize: 13, letterSpacing: '0.14em', textTransform:'uppercase',
      color: MS.ink, fontWeight: 700, textDecoration:'none',
      borderBottom: `1px solid ${MS.ink}`, paddingBottom: 3,
    }}>
      {children}
    </a>
  );
}

Object.assign(window, { MS, Rule, SectionLabel, ListRow, AllLink, PHOTOS });
