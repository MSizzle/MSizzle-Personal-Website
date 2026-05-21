// Three candidate manifesto lines, presented as a comparison card.
// Each one shown at hero scale so Monty can feel the rhythm.

const MANIFESTO_OPTIONS = [
  {
    angle: 'Practical · what you make',
    lines: ['I BUILD MACHINES', 'THAT THINK CAREFULLY.'],
    note: 'Plain-language, anchors the AI work. Reads as a credo, not a slogan.',
  },
  {
    angle: 'Philosophical · what you believe',
    lines: ['MAKE FEWER THINGS.', 'MAKE THEM MEAN MORE.'],
    note: 'Two-sentence command. Sets the editorial voice for the whole site.',
  },
  {
    angle: 'Declarative · what software is for',
    lines: ['SOFTWARE IS A WAY', 'OF READING THE WORLD.'],
    note: 'Most “writerly.” Bridges Prometheus (build) with Monty Monthly (think).',
  },
];

function ManifestoCard() {
  return (
    <div style={{
      width: 980, padding: '56px 64px', background: MS.bg, color: MS.ink,
      fontFamily: MS.font,
    }}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline',
        marginBottom: 56,
      }}>
        <div style={{
          fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
          fontWeight: 700,
        }}>
          ── Manifesto · Three Candidates
        </div>
        <div style={{
          fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.muted,
        }}>
          Hero · One line, two breaths
        </div>
      </div>

      {MANIFESTO_OPTIONS.map((m, i) => (
        <div key={i} style={{
          padding: '44px 0',
          borderTop: `1px solid ${MS.rule}`,
          borderBottom: i === MANIFESTO_OPTIONS.length-1 ? `1px solid ${MS.rule}` : 'none',
          display:'grid', gridTemplateColumns: '60px 1fr', gap: 32,
          alignItems:'baseline',
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, letterSpacing:'0.02em',
          }}>
            0{i+1}
          </div>
          <div>
            <div style={{
              fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
              color: MS.muted, marginBottom: 18,
            }}>
              {m.angle}
            </div>
            <div style={{
              fontSize: 64, fontWeight: 700, letterSpacing:'-0.04em',
              lineHeight: 0.98, textTransform:'uppercase',
            }}>
              {m.lines.map((l, j) => <div key={j}>{l}</div>)}
            </div>
            <div style={{
              marginTop: 22, fontSize: 14, color: MS.muted, lineHeight: 1.55,
              maxWidth: 560,
            }}>
              {m.note}
            </div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 48, fontSize: 13, color: MS.muted, lineHeight: 1.6,
        maxWidth: 640,
      }}>
        Lock the manifesto first — the rest of the page&apos;s voice (intro
        paragraph, section blurbs, footer line) takes its cue from this single
        sentence. Recommended default for the desktop mockup: <strong style={{ color: MS.ink, fontWeight: 700 }}>01</strong>.
      </div>
    </div>
  );
}

Object.assign(window, { ManifestoCard, MANIFESTO_OPTIONS });
