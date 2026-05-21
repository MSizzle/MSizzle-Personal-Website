// Type + color spec sheet. Editorial datasheet style.

function SpecCard() {
  return (
    <div style={{
      width: 980, padding: '56px 64px', background: MS.bg, color: MS.ink,
      fontFamily: MS.font,
    }}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline',
        marginBottom: 48,
      }}>
        <div style={{
          fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
          fontWeight: 700,
        }}>
          ── Specimen · System
        </div>
        <div style={{
          fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.muted,
        }}>
          One family · Two weights · Four tones
        </div>
      </div>

      {/* Type specimen */}
      <div style={{ borderTop: `1px solid ${MS.rule}`, paddingTop: 36 }}>
        <div style={{
          fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
          color: MS.muted, marginBottom: 18,
        }}>
          01 — Typeface
        </div>
        <div style={{
          fontSize: 128, fontWeight: 700, letterSpacing:'-0.045em',
          lineHeight: 0.9,
        }}>
          Aa Gg
        </div>
        <div style={{
          marginTop: 12, fontSize: 24, fontWeight: 400, letterSpacing:'-0.01em',
        }}>
          Helvetica Neue
        </div>
        <div style={{
          marginTop: 28, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 48,
          maxWidth: 800,
        }}>
          <div>
            <div style={{
              fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
              color: MS.muted, marginBottom: 10,
            }}>Why</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: MS.ink }}>
              A neutral editorial workhorse. Carries oversized display type
              without showmanship, and reads quietly at 13–18px for body. One
              family means nothing competes with the manifesto.
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
              color: MS.muted, marginBottom: 10,
            }}>Weights</div>
            <div style={{ fontSize: 22, fontWeight: 400 }}>Regular · 400</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Bold · 700</div>
            <div style={{
              fontSize: 12, color: MS.muted, marginTop: 8, lineHeight: 1.5,
            }}>
              Two weights only. No italics, no condensed. If a moment needs
              emphasis it gets the bold; if it doesn&apos;t, it stays regular.
            </div>
          </div>
        </div>
      </div>

      {/* Type scale */}
      <div style={{ marginTop: 56, borderTop:`1px solid ${MS.rule}`, paddingTop: 36 }}>
        <div style={{
          fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
          color: MS.muted, marginBottom: 22,
        }}>
          02 — Scale
        </div>
        <ScaleRow size={136} weight={700} label="Display · Hero manifesto"   text="I BUILD MACHINES" />
        <ScaleRow size={64}  weight={700} label="H1 · Page titles"           text="Writing." />
        <ScaleRow size={28}  weight={700} label="H2 · Featured / events"     text="AI for Small Biz, Vol. II" />
        <ScaleRow size={20}  weight={400} label="List · Essay rows"          text="The Pursuit of Happier-ness" />
        <ScaleRow size={17}  weight={400} label="Body · Letter intro"        text="I’m Monty — a builder and a writer." />
        <ScaleRow size={13}  weight={400} label="UI · Nav, metadata"         text="Building · Writing · Events" />
        <ScaleRow last size={11} weight={700} caps label="Label · Section heads" text="── Studio · 01" />
      </div>

      {/* Color */}
      <div style={{ marginTop: 56, borderTop:`1px solid ${MS.rule}`, paddingTop: 36 }}>
        <div style={{
          fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
          color: MS.muted, marginBottom: 22,
        }}>
          03 — Palette
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 18,
        }}>
          <Swatch hex="#F4F2EC" name="Paper"  role="Background · warm off-white"  border />
          <Swatch hex="#0E0E0C" name="Ink"    role="Text · near-black, warm tint" dark />
          <Swatch hex="#9A9690" name="Muted"  role="Metadata · captions" />
          <Swatch hex="#E5E2D9" name="Rule"   role="Hairline dividers" border />
        </div>
        <div style={{
          marginTop: 22, fontSize: 12, color: MS.muted, lineHeight: 1.55,
          maxWidth: 720,
        }}>
          Pure monochrome by intent — no accent. Footer inverts to Ink with
          Paper text. Any visual rhythm comes from typography and whitespace,
          never from a colored chip or pill.
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginTop: 56, borderTop:`1px solid ${MS.rule}`, paddingTop: 36 }}>
        <div style={{
          fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
          color: MS.muted, marginBottom: 22,
        }}>
          04 — Motion budget
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap: 48, maxWidth: 800,
          fontSize: 14, lineHeight: 1.55,
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>One signature</div>
            <div style={{ color: MS.muted }}>
              A single letter-stagger reveal on the manifesto, on first paint.
              Fires once. ~18ms between letters. No looping.
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Everything else</div>
            <div style={{ color: MS.muted }}>
              200ms fade on page-load. Hover: 120ms underline thickness shift on
              links. Smooth scroll via Lenis. Zero carousels, zero auto-scrollers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScaleRow({ size, weight, label, text, caps, last }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'200px 1fr', gap: 32,
      alignItems:'baseline',
      padding: '18px 0',
      borderBottom: last ? 'none' : `1px solid ${MS.rule}`,
    }}>
      <div>
        <div style={{
          fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.muted,
        }}>{label}</div>
        <div style={{ fontSize: 11, color: MS.faint, marginTop: 4 }}>
          {size}px · {weight}
        </div>
      </div>
      <div style={{
        fontSize: size > 80 ? 80 : size,    // cap display preview
        fontWeight: weight, letterSpacing: size > 40 ? '-0.03em' : '-0.005em',
        textTransform: caps ? 'uppercase' : 'none',
        lineHeight: 1, color: MS.ink, whiteSpace:'nowrap', overflow:'hidden',
        textOverflow:'ellipsis',
      }}>
        {text}
      </div>
    </div>
  );
}

function Swatch({ hex, name, role, dark, border }) {
  return (
    <div>
      <div style={{
        background: hex, height: 120, borderRadius: 2,
        border: border ? `1px solid ${MS.rule}` : 'none',
      }}/>
      <div style={{
        marginTop: 12, display:'flex', justifyContent:'space-between',
        alignItems:'baseline',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
        <div style={{
          fontSize: 11, color: MS.muted, fontFamily: 'ui-monospace, Menlo, monospace',
        }}>
          {hex}
        </div>
      </div>
      <div style={{
        marginTop: 4, fontSize: 12, color: MS.muted, lineHeight: 1.4,
      }}>{role}</div>
    </div>
  );
}

Object.assign(window, { SpecCard });
