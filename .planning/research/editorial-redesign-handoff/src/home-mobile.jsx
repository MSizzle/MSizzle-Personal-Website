// Mobile homepage — 390 wide. Same editorial system, single column.

function HomeMobile() {
  const W = 390;
  const PAD = 28;
  return (
    <div style={{
      width: W, background: MS.bg, color: MS.ink, fontFamily: MS.font,
      fontWeight: 400, lineHeight: 1.45,
    }}>
      {/* header */}
      <div style={{
        padding: `22px ${PAD}px 0`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Monty Singer</div>
        <div style={{
          fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
          color: MS.ink, fontWeight: 700,
        }}>Menu +</div>
      </div>

      {/* manifesto */}
      <div style={{ padding: `90px ${PAD}px 60px` }}>
        <h1 style={{
          margin: 0, fontSize: 56, lineHeight: 0.96, fontWeight: 700,
          letterSpacing:'-0.04em', textTransform:'uppercase',
        }}>
          I&nbsp;build<br/>machines<br/>that&nbsp;think<br/>carefully.
        </h1>
        <div style={{
          marginTop: 24, fontSize: 10, letterSpacing:'0.22em',
          textTransform:'uppercase', color: MS.muted,
        }}>
          ── Est. 2026 · D.C.
        </div>
      </div>

      {/* epigraph image */}
      <div style={{ padding: `0 ${PAD}px 60px` }}>
        <div style={{
          width:'100%', height: 380, background:'#1a1a18', overflow:'hidden',
        }}>
          <img src={PHOTOS[0]} alt="" style={{
            width:'100%', height:'100%', objectFit:'cover', display:'block',
          }}/>
        </div>
        <div style={{
          marginTop: 12, fontSize: 10, letterSpacing:'0.18em',
          textTransform:'uppercase', color: MS.muted,
        }}>
          Plate I · A year in motion
        </div>
      </div>

      {/* intro */}
      <div style={{ padding: `0 ${PAD}px 72px` }}>
        <p style={{
          margin: 0, fontSize: 17, lineHeight: 1.55,
        }}>
          I’m Monty — a builder and a writer. I run{' '}
          <U>Prometheus</U>, a small studio designing custom AI pipelines, and
          publish <U>Monty Monthly</U>, a newsletter of long-form{' '}
          <U>essays</U> on philosophy, technology, and a more attentive life.
        </p>
      </div>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* Building */}
      <MobileSection label="Building" num="01">
        <MobileRow title="Prometheus" meta="AI Studio" />
        <MobileRow title="Selected Works" meta="Archive" last />
      </MobileSection>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* Writing */}
      <MobileSection label="Writing" num="02">
        <MobileRow title="The Pursuit of Happier-ness" meta="May 2026" />
        <MobileRow title="Defiant Optimism"            meta="Apr 2026" />
        <MobileRow title="Demystifying Merlin"          meta="Mar 2026" last />
        <MobileAll>All writing →</MobileAll>
      </MobileSection>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* Events */}
      <MobileSection label="Events" num="03">
        <div style={{ padding: '6px 0 22px', borderBottom: `1px solid ${MS.rule}` }}>
          <div style={{
            fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
            color: MS.ink, fontWeight: 700,
          }}>
            Next · Jun 12, 7 PM
          </div>
          <div style={{
            marginTop: 10, fontSize: 28, lineHeight: 1.05, fontWeight: 700,
            letterSpacing:'-0.02em',
          }}>
            AI for Small Biz, Vol. II
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: MS.muted, lineHeight: 1.5 }}>
            A working evening for owner-operators. Bring one stuck workflow;
            we’ll automate it together.
          </div>
          <div style={{
            marginTop: 14, fontSize: 10, letterSpacing:'0.18em',
            textTransform:'uppercase', fontWeight: 700,
            borderBottom:`1px solid ${MS.ink}`, display:'inline-block',
            paddingBottom: 2,
          }}>
            RSVP →
          </div>
        </div>
        <MobileRow title="Booze Alley Jazz" meta="Jul 14" />
        <MobileRow title="Prometheus Office Hours" meta="Jul 22" last />
        <MobileAll>All events →</MobileAll>
      </MobileSection>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* Personal */}
      <MobileSection label="Personal" num="04">
        <MobileRow title="Photo Archive" meta="Gallery" />
        <MobileRow title="Links & Elsewhere" meta="Index" />
        <MobileRow title="About" meta="Long form" last />
      </MobileSection>

      {/* Photographs strip */}
      <div style={{ padding: `0 ${PAD}px 8px` }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'baseline',
          fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
          fontWeight: 700, marginBottom: 14,
        }}>
          <span>Photographs</span>
          <span style={{ color: MS.muted, fontWeight:400 }}>05</span>
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6,
        }}>
          {PHOTOS.slice(1, 5).map((p, i) => (
            <div key={i} style={{
              aspectRatio:'1 / 1', overflow:'hidden', background:'#1a1a18',
            }}>
              <img src={p} alt="" style={{
                width:'100%', height:'100%', objectFit:'cover', display:'block',
              }}/>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, fontSize: 10, letterSpacing:'0.2em',
          textTransform:'uppercase', fontWeight: 700,
          borderBottom:`1px solid ${MS.ink}`, display:'inline-block',
          paddingBottom: 2, marginBottom: 36,
        }}>
          Photo Archive →
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: MS.ink, color: MS.bg, padding: `48px ${PAD}px 32px` }}>
        <div style={{
          fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em',
          lineHeight: 1.15, marginBottom: 40,
        }}>
          A calling card,<br/>not a billboard.
        </div>

        <MobileFooterCol title="Studio" items={['Prometheus','Selected Works','Process Notes']} />
        <MobileFooterCol title="Library" items={['Monty Monthly','Essays','Reading List']} />
        <MobileFooterCol title="Person" items={['About','Photos','Contact']} last />

        <div style={{
          marginTop: 36, paddingTop: 18,
          borderTop:'1px solid rgba(244,242,236,0.18)',
          fontSize: 11, color: '#9A968E', letterSpacing:'0.04em',
        }}>
          © 2026 Monty Singer<br/>mds345@georgetown.edu
        </div>
      </footer>
    </div>
  );
}

function U({ children }) {
  return (
    <a href="#" style={{
      color: MS.ink, textDecoration:'none',
      borderBottom:`1px solid ${MS.ink}`, paddingBottom: 1,
    }}>{children}</a>
  );
}
function MobileSection({ label, num, children }) {
  return (
    <section style={{ padding: `36px 28px 36px` }}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline',
        fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
        fontWeight: 700, marginBottom: 18,
      }}>
        <span>{label}</span>
        <span style={{ color: MS.muted, fontWeight:400 }}>{num}</span>
      </div>
      {children}
    </section>
  );
}
function MobileRow({ title, meta, last }) {
  return (
    <a href="#" style={{
      display:'flex', justifyContent:'space-between', alignItems:'baseline',
      gap: 16, padding: '16px 0',
      borderBottom: last ? 'none' : `1px solid ${MS.rule}`,
      textDecoration:'none', color: MS.ink,
    }}>
      <span style={{ fontSize: 16, fontWeight: 400, letterSpacing:'-0.005em' }}>
        {title}
      </span>
      <span style={{
        fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase',
        color: MS.muted,
      }}>{meta}</span>
    </a>
  );
}
function MobileAll({ children }) {
  return (
    <div style={{
      marginTop: 18, fontSize: 10, letterSpacing:'0.2em',
      textTransform:'uppercase', fontWeight: 700,
      borderBottom:`1px solid ${MS.ink}`, display:'inline-block',
      paddingBottom: 2,
    }}>{children}</div>
  );
}
function MobileFooterCol({ title, items, last }) {
  return (
    <div style={{
      paddingBottom: 22, marginBottom: 22,
      borderBottom: last ? 'none' : '1px solid rgba(244,242,236,0.18)',
    }}>
      <div style={{
        fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase',
        color: '#7A7770', marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
        {items.map(l => (
          <a key={l} href="#" style={{
            color: MS.bg, textDecoration:'none', fontSize: 15,
          }}>{l}</a>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeMobile });
