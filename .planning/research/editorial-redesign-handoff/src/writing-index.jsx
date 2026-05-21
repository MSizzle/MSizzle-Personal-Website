// /writing index page mockup — 1440 wide.
// Editorial archive layout: year groupings, generous line-height.

function WritingIndex() {
  const PAGE = 1440;
  const COL  = 1120;
  const PAD  = (PAGE - COL)/2;

  return (
    <div style={{
      width: PAGE, background: MS.bg, color: MS.ink, fontFamily: MS.font,
      fontWeight: 400,
    }}>
      {/* Header */}
      <header style={{
        padding: `36px ${PAD}px 0`,
        display:'flex', alignItems:'baseline', justifyContent:'space-between',
      }}>
        <a href="#" style={{ fontSize: 15, fontWeight: 700, color: MS.ink, textDecoration:'none' }}>
          Monty Singer
        </a>
        <nav style={{ display:'flex', gap: 32 }}>
          {['Building','Writing','Events','About','Links'].map(l => (
            <a key={l} href="#" style={{
              fontSize: 13, color: l==='Writing' ? MS.ink : MS.muted,
              textDecoration:'none', fontWeight: l==='Writing' ? 700 : 400,
            }}>{l}</a>
          ))}
        </nav>
      </header>

      {/* Title block */}
      <section style={{ padding: `160px ${PAD}px 100px`, position:'relative' }}>
        <div style={{
          display:'grid', gridTemplateColumns: '1fr 360px', gap: 80,
          alignItems:'end',
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
              color: MS.muted,
            }}>
              ── The Library · 02
            </div>
            <h1 style={{
              margin: '24px 0 0', fontSize: 120, fontWeight: 700,
              letterSpacing:'-0.045em', lineHeight: 0.95, textTransform:'uppercase',
            }}>
              Writing.
            </h1>
            <div style={{
              marginTop: 40, maxWidth: 560, fontSize: 18, lineHeight: 1.55,
              color: MS.muted,
            }}>
              Long-form essays on philosophy, technology, and the texture of an
              attentive life. Published monthly, sometimes more, never less.
              Subscribe at <U>Monty Monthly</U>.
            </div>
          </div>
          <div style={{
            width: 360, height: 480, overflow:'hidden', background:'#1a1a18',
          }}>
            <img src={PHOTOS[5]} alt="" style={{
              width:'100%', height:'100%', objectFit:'cover', display:'block',
            }}/>
          </div>
        </div>
      </section>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* 2026 */}
      <YearBlock year="2026" pad={PAD}>
        <ListRow big title="The Pursuit of Happier-ness" meta="May 2026 · 14 min"
          extra="On chasing a moving target, and learning to like the chase." />
        <ListRow big title="Defiant Optimism" meta="Apr 2026 · 9 min"
          extra="An argument for hope as a working stance, not a feeling." />
        <ListRow big title="Demystifying Merlin: Learning to See Your Own Future" meta="Mar 2026 · 12 min"
          extra="A field guide to long-term thinking for short attention spans." />
        <ListRow big title="Are We Capable of Change?" meta="Feb 2026 · 10 min"
          extra="On the difference between a habit and an identity." />
        <ListRow big last title="Choosing Faith" meta="Jan 2026 · 11 min"
          extra="An annual letter on showing up before you know why." />
      </YearBlock>

      <div style={{ padding: `0 ${PAD}px` }}><Rule /></div>

      {/* 2025 */}
      <YearBlock year="2025" pad={PAD}>
        <ListRow big title="Practical Philosophy: How to Play Win-Win and Avoid Lose-Lose" meta="Dec 2025 · 16 min"
          extra="Game theory for the dinner table." />
        <ListRow big title="Standing on Sediment: Timing the Typewriter" meta="Sep 2025 · 13 min" />
        <ListRow big title="Earning Magic" meta="Jul 2025 · 8 min" />
        <ListRow big last title="AI is Nibbling the World" meta="Apr 2025 · 11 min" />
      </YearBlock>

      <div style={{ padding: `0 ${PAD}px` }}><Rule /></div>

      {/* 2024 */}
      <YearBlock year="2024" pad={PAD}>
        <ListRow big title="Algorithmic Content" meta="Nov 2024 · 9 min" />
        <ListRow big title="Discipline, Determination, and Dog Names" meta="Aug 2024 · 7 min" />
        <ListRow big last title="Staring Into the Void" meta="May 2024 · 14 min" />
      </YearBlock>

      {/* footer minimal */}
      <footer style={{
        background: MS.ink, color: MS.bg, padding: `64px ${PAD}px 48px`,
        marginTop: 80,
      }}>
        <div style={{
          fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
          color:'#7A7770',
        }}>
          ── End of archive
        </div>
        <div style={{
          marginTop: 24, fontSize: 32, fontWeight: 700, letterSpacing:'-0.02em',
          lineHeight: 1.1, maxWidth: 640,
        }}>
          Receive new essays the morning they’re published.
        </div>
        <div style={{
          marginTop: 40, display:'flex', gap: 16, alignItems:'center',
          maxWidth: 480,
        }}>
          <div style={{
            flex:1, padding: '14px 16px',
            border:'1px solid rgba(244,242,236,0.3)', borderRadius: 2,
            fontSize: 14, color:'#9A968E',
          }}>
            your@email.com
          </div>
          <div style={{
            padding: '14px 22px', background: MS.bg, color: MS.ink,
            fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase',
            fontWeight: 700, borderRadius: 2,
          }}>
            Subscribe →
          </div>
        </div>
        <div style={{
          marginTop: 64, fontSize: 11, color:'#9A968E', letterSpacing:'0.04em',
        }}>
          © 2026 Monty Singer · montymonthly.substack.com
        </div>
      </footer>
    </div>
  );
}

function YearBlock({ year, children, pad }) {
  return (
    <section style={{ padding: `80px ${pad}px 60px` }}>
      <div style={{
        display:'grid', gridTemplateColumns: '180px 1fr', gap: 80,
      }}>
        <div style={{
          fontSize: 14, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.ink, fontWeight: 700, position:'sticky', top: 40,
        }}>
          {year}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

Object.assign(window, { WritingIndex });
