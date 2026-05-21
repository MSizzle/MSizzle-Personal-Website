// Desktop homepage mockup — 1440 wide.
// Editorial spine, oversized manifesto, generous whitespace.
// Only animated thing: manifesto letter-stagger fade on first paint.

const { useEffect, useState } = React;

function HomeDesktop({ manifesto }) {
  // The signature interaction: a single one-time letter-stagger fade.
  // No looping. No hover dependency. Fires once on mount.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  const lines = (manifesto || [
    'I BUILD',
    'MACHINES THAT',
    'THINK CAREFULLY.',
  ]);

  // --- Layout constants ------------------------------------------------
  const PAGE = 1440;
  const COL  = 1120;          // content column
  const PAD  = (PAGE - COL)/2;
  const sectionPad = '120px 0';

  return (
    <div style={{
      width: PAGE, background: MS.bg, color: MS.ink, fontFamily: MS.font,
      fontWeight: 400, lineHeight: 1.45, letterSpacing: '-0.005em',
      paddingBottom: 0,
    }}>

      {/* ───── HEADER ───── */}
      <header style={{
        padding: `36px ${PAD}px 0`,
        display:'flex', alignItems:'baseline', justifyContent:'space-between',
      }}>
        <a href="#" style={{
          fontSize: 15, fontWeight: 700, color: MS.ink, textDecoration:'none',
          letterSpacing:'-0.01em',
        }}>
          Monty Singer
        </a>
        <nav style={{ display:'flex', gap: 32 }}>
          {['Building','Writing','Events','About','Links'].map(l => (
            <a key={l} href="#" style={{
              fontSize: 13, color: MS.ink, textDecoration:'none',
              letterSpacing:'0.02em',
            }}>{l}</a>
          ))}
        </nav>
      </header>

      {/* ───── HERO MANIFESTO ───── */}
      <section style={{
        padding: `180px ${PAD}px 140px`,
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 124, lineHeight: 0.96,
          fontWeight: 700, letterSpacing: '-0.045em',
          textTransform: 'uppercase',
        }}>
          {lines.map((line, li) => (
            <div key={li} style={{
              display:'block', overflow:'hidden',
              whiteSpace:'nowrap',
            }}>
              {[...line].map((ch, ci) => (
                <span key={ci} style={{
                  display:'inline-block',
                  whiteSpace:'pre',
                  transform: revealed ? 'translateY(0)' : 'translateY(110%)',
                  opacity: revealed ? 1 : 0,
                  transition: `transform 700ms cubic-bezier(.2,.7,.2,1) ${(li*line.length + ci) * 18}ms, opacity 500ms ease ${(li*line.length + ci) * 18}ms`,
                }}>{ch}</span>
              ))}
            </div>
          ))}
        </h1>

        <div style={{
          marginTop: 56,
          display:'flex', alignItems:'center', gap: 16,
          fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
          color: MS.muted,
        }}>
          <span style={{ width: 32, height: 1, background: MS.muted }} />
          <span>Est. 2026 · Washington, D.C.</span>
        </div>
      </section>

      {/* ───── EPIGRAPH IMAGE ───── */}
      <section style={{ padding: `0 ${PAD}px 140px` }}>
        <figure style={{ margin: 0 }}>
          <div style={{
            width: '100%', height: 540, overflow:'hidden',
            background: '#1a1a18',
          }}>
            <img
              src={PHOTOS[0]}
              alt=""
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            />
          </div>
          <figcaption style={{
            marginTop: 18, display:'flex', justifyContent:'space-between',
            alignItems:'baseline',
            fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
            color: MS.muted,
          }}>
            <span>Plate I — A year in motion · 2025—26</span>
            <span>Photographed on film</span>
          </figcaption>
        </figure>
      </section>

      {/* ───── LETTER-STYLE INTRO ───── */}
      <section style={{ padding: `0 ${PAD}px 160px` }}>
        <div style={{
          maxWidth: 720,
          fontSize: 22, lineHeight: 1.55, fontWeight: 400,
          letterSpacing: '-0.005em',
        }}>
          I’m Monty — a builder and a writer. I run{' '}
          <IntroLink>Prometheus</IntroLink>, a studio that designs custom AI
          pipelines for businesses that have outgrown off-the-shelf tools.
          Outside the studio I publish{' '}
          <IntroLink>Monty Monthly</IntroLink>, a newsletter of long-form{' '}
          <IntroLink>essays</IntroLink> on philosophy, technology, and the
          texture of an attentive life. Most of what I make is an attempt to
          slow something down enough to see it clearly.
        </div>
      </section>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* ───── BUILDING ───── */}
      <section style={{ padding: `64px ${PAD}px 0` }}>
        <SectionLabel num="01 — Studio">Building</SectionLabel>

        <div style={{ marginTop: 72, maxWidth: 980 }}>
          <BuildingRow
            title="Prometheus"
            tag="Active · AI Studio"
            blurb="A studio designing AI integrations and education. Recent: HIPAA-compliant PDF→deck automation for an orthodontic practice, and a custom research tool for a boutique hospitality firm."
            link="prometheus.today  →"
          />
          <BuildingRow
            last
            title="Selected Works"
            tag="Archive · 8 projects"
            blurb="Gene-Own, MAHealth Scanner, Goaltender, Insider Tracking, CRM Bot, and four more. Mostly bots and tools; occasionally something more involved."
            link="View all works  →"
          />
        </div>

        <div style={{ padding: '120px 0 0' }}><Rule strong /></div>
      </section>

      {/* ───── WRITING ───── */}
      <section style={{ padding: `64px ${PAD}px 0` }}>
        <SectionLabel num="02 — Library">Writing</SectionLabel>

        <div style={{ marginTop: 56, maxWidth: 980 }}>
          <ListRow
            big
            title="The Pursuit of Happier-ness"
            meta="May 2026"
            extra="On chasing a moving target, and learning to like the chase."
          />
          <ListRow
            big
            title="Defiant Optimism"
            meta="Apr 2026"
            extra="An argument for hope as a working stance, not a feeling."
          />
          <ListRow
            big
            last
            title="Demystifying Merlin: Learning to See Your Own Future"
            meta="Mar 2026"
            extra="A field guide to long-term thinking for short attention spans."
          />
          <AllLink>All writing →</AllLink>
        </div>

        <div style={{ padding: '120px 0 0' }}><Rule strong /></div>
      </section>

      {/* ───── EVENTS ───── */}
      <section style={{ padding: `64px ${PAD}px 0` }}>
        <SectionLabel num="03 — Calendar">Events</SectionLabel>

        <div style={{ marginTop: 64, maxWidth: 980 }}>
          {/* Featured upcoming event */}
          <div style={{
            display:'grid', gridTemplateColumns: '180px 1fr auto',
            gap: 40, alignItems:'baseline',
            paddingBottom: 36, borderBottom: `1px solid ${MS.rule}`,
          }}>
            <div style={{
              fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
              color: MS.ink, fontWeight: 700,
            }}>
              Next · Jun 12
              <div style={{ color: MS.muted, fontWeight:400, marginTop: 8 }}>
                7:00 PM EST<br/>Washington, D.C.
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 36, lineHeight: 1.05, fontWeight: 700,
                letterSpacing:'-0.02em',
              }}>
                AI for Small Biz, Vol. II
              </div>
              <div style={{
                marginTop: 14, fontSize: 16, color: MS.muted,
                maxWidth: 540, lineHeight: 1.5,
              }}>
                A working evening for owner-operators. Bring one stuck workflow;
                we’ll automate it together. A practical sequel to “Stealing Fire
                from the Gods.”
              </div>
            </div>
            <div style={{
              fontSize: 11, letterSpacing:'0.16em', textTransform:'uppercase',
              color: MS.ink, fontWeight: 700, whiteSpace:'nowrap',
              borderBottom: `1px solid ${MS.ink}`, paddingBottom: 3,
            }}>
              RSVP →
            </div>
          </div>

          <ListRow
            title="Booze Alley Jazz"
            meta="Jul 14 · D.C."
            extra="The recurring listening night. Drinks, records, no agenda."
          />
          <ListRow
            last
            title="Prometheus Office Hours"
            meta="Jul 22 · Virtual"
            extra="Open hour for founders thinking about AI integrations."
          />

          <AllLink>All events →</AllLink>
        </div>

        <div style={{ padding: '120px 0 0' }}><Rule strong /></div>
      </section>

      {/* ───── PHOTOGRAPHS ───── */}
      <section style={{ padding: `64px ${PAD}px 0` }}>
        <SectionLabel num="04 — Archive">Photographs</SectionLabel>

        <div style={{
          marginTop: 56,
          display:'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 180,
          gap: 12,
          maxWidth: 1120,
        }}>
          {/* Asymmetric editorial grid — one large anchor, smaller plates */}
          <Plate src={PHOTOS[1]} col="span 7" row="span 3" cap="No. 14" />
          <Plate src={PHOTOS[2]} col="span 5" row="span 2" cap="No. 21" />
          <Plate src={PHOTOS[3]} col="span 3" row="span 1" cap="No. 03" />
          <Plate src={PHOTOS[4]} col="span 2" row="span 1" cap="No. 07" />
          <Plate src={PHOTOS[5]} col="span 5" row="span 2" cap="No. 29" />
          <Plate src={PHOTOS[0]} col="span 7" row="span 2" cap="No. 31" />
        </div>

        <AllLink>Photo Archive →</AllLink>

        <div style={{ padding: '120px 0 0' }}><Rule strong /></div>
      </section>

      {/* ───── PERSONAL ───── */}
      <section style={{ padding: `64px ${PAD}px 160px` }}>
        <SectionLabel num="05 — Person">Personal</SectionLabel>

        <div style={{
          marginTop: 56, display:'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
        }}>
          {[
            ['Photo Archive', 'A slow gallery, updated when something is worth keeping.'],
            ['Links & Elsewhere', 'A curated list of accounts, projects, and people worth a click.'],
            ['About', 'Where I’ve been, what I read, the long answer to who I am.'],
          ].map(([t, d]) => (
            <a key={t} href="#" style={{
              display:'block', textDecoration:'none', color: MS.ink,
              borderTop:`1px solid ${MS.ink}`, paddingTop: 18,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing:'-0.01em' }}>
                {t}
              </div>
              <div style={{
                marginTop: 8, fontSize: 14, color: MS.muted, lineHeight: 1.5,
                maxWidth: 280,
              }}>{d}</div>
              <div style={{
                marginTop: 28, fontSize: 11, letterSpacing:'0.16em',
                textTransform:'uppercase', color: MS.ink, fontWeight: 700,
              }}>
                Enter →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{ background: MS.ink, color: MS.bg, padding: `80px ${PAD}px 56px` }}>
        <div style={{
          display:'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 64,
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
              color: '#7A7770',
            }}>
              Monty Singer
            </div>
            <div style={{
              marginTop: 18, fontSize: 28, fontWeight: 700,
              letterSpacing:'-0.02em', lineHeight: 1.1, maxWidth: 320,
            }}>
              A calling card,<br/>not a billboard.
            </div>
          </div>

          <FooterCol title="Studio" items={[
            ['Prometheus', 'prometheus.today'],
            ['Selected Works', '/works'],
            ['Process Notes', '/notes'],
          ]} />
          <FooterCol title="Library" items={[
            ['Monty Monthly', 'substack'],
            ['Essays', '/writing'],
            ['Reading List', '/reading'],
          ]} />
          <FooterCol title="Person" items={[
            ['About', '/about'],
            ['Photo Archive', '/photos'],
            ['Contact', 'mds345@georgetown.edu'],
          ]} />
        </div>

        <div style={{
          marginTop: 96, paddingTop: 28,
          borderTop: '1px solid rgba(244,242,236,0.18)',
          display:'flex', justifyContent:'space-between', alignItems:'baseline',
          fontSize: 12, color: '#9A968E', letterSpacing:'0.04em',
        }}>
          <div>© 2026 Monty Singer · Georgetown, D.C.</div>
          <div style={{ display:'flex', gap: 24 }}>
            <a href="#" style={{ color: MS.bg, textDecoration:'none' }}>Twitter</a>
            <a href="#" style={{ color: MS.bg, textDecoration:'none' }}>GitHub</a>
            <a href="#" style={{ color: MS.bg, textDecoration:'none' }}>LinkedIn</a>
            <a href="#" style={{ color: MS.bg, textDecoration:'none' }}>Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IntroLink({ children }) {
  return (
    <a href="#" style={{
      color: MS.ink, textDecoration:'none',
      borderBottom: `1px solid ${MS.ink}`, paddingBottom: 1,
    }}>{children}</a>
  );
}

function BuildingRow({ title, tag, blurb, link, last }) {
  return (
    <a href="#" style={{
      display:'grid', gridTemplateColumns: '180px 1fr 1fr', gap: 48,
      padding: '36px 0',
      borderBottom: last ? 'none' : `1px solid ${MS.rule}`,
      textDecoration:'none', color: MS.ink, alignItems:'baseline',
    }}>
      <div style={{
        fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
        color: MS.muted, fontWeight: 400,
      }}>{tag}</div>
      <div style={{
        fontSize: 44, fontWeight: 700, letterSpacing:'-0.025em',
        lineHeight: 1, letterSpacing:'-0.03em',
      }}>{title}</div>
      <div>
        <div style={{ fontSize: 15, color: MS.muted, lineHeight: 1.5 }}>
          {blurb}
        </div>
        <div style={{
          marginTop: 20, fontSize: 11, letterSpacing:'0.18em',
          textTransform:'uppercase', color: MS.ink, fontWeight: 700,
        }}>
          {link}
        </div>
      </div>
    </a>
  );
}

function Plate({ src, col, row, cap }) {
  return (
    <a href="#" style={{
      gridColumn: col, gridRow: row,
      position:'relative', overflow:'hidden',
      background:'#1a1a18', display:'block',
      textDecoration:'none', color: MS.bg,
    }}>
      <img src={src} alt="" style={{
        width:'100%', height:'100%', objectFit:'cover', display:'block',
        filter:'saturate(0.92)',
      }}/>
      <div style={{
        position:'absolute', left: 14, bottom: 12,
        fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
        fontWeight: 700,
        color:'rgba(255,255,255,0.92)',
        mixBlendMode:'difference',
      }}>
        {cap}
      </div>
    </a>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{
        fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
        color: '#7A7770', marginBottom: 22,
      }}>
        {title}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {items.map(([l, sub]) => (
          <a key={l} href="#" style={{
            color: MS.bg, textDecoration:'none', fontSize: 17, fontWeight: 400,
          }}>
            {l}
            <div style={{ fontSize: 11, color: '#7A7770', marginTop: 2 }}>{sub}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeDesktop });
