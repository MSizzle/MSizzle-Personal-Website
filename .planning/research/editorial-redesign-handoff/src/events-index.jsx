// /events index page mockup — 1440 wide.
// Two regions: Upcoming (chronological, generous) and Past (compact).

function EventsIndex() {
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
              fontSize: 13, color: l==='Events' ? MS.ink : MS.muted,
              textDecoration:'none', fontWeight: l==='Events' ? 700 : 400,
            }}>{l}</a>
          ))}
        </nav>
      </header>

      {/* Title */}
      <section style={{ padding: `160px ${PAD}px 100px` }}>
        <div style={{
          display:'grid', gridTemplateColumns: '1fr 360px', gap: 80,
          alignItems:'end',
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
              color: MS.muted,
            }}>── The Calendar · 03</div>
            <h1 style={{
              margin: '24px 0 0', fontSize: 120, fontWeight: 700,
              letterSpacing:'-0.045em', lineHeight: 0.95, textTransform:'uppercase',
            }}>
              Events.
            </h1>
            <div style={{
              marginTop: 40, maxWidth: 600, fontSize: 18, lineHeight: 1.55,
              color: MS.muted,
            }}>
              Salons, workshops, and small gatherings in D.C. and online. Most
              are intimate by design — twelve seats, sometimes fewer. Reply to
              the email to be added to the list.
            </div>
          </div>
          <div style={{
            width: 360, height: 480, overflow:'hidden', background:'#1a1a18',
          }}>
            <img src={PHOTOS[3]} alt="" style={{
              width:'100%', height:'100%', objectFit:'cover', display:'block',
            }}/>
          </div>
        </div>
      </section>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* UPCOMING */}
      <section style={{ padding: `64px ${PAD}px 100px` }}>
        <SectionLabel num="03 — Upcoming">Upcoming</SectionLabel>

        <div style={{ marginTop: 56 }}>
          <UpcomingRow
            mo="Jun" day="12" yr="2026"
            time="7:00 PM EST · Washington, D.C."
            title="AI for Small Biz, Vol. II"
            blurb="A working evening for owner-operators. Bring one stuck workflow; we’ll automate it together. A practical sequel to “Stealing Fire from the Gods.”"
            seats="14 / 18 seats"
            featured
          />
          <UpcomingRow
            mo="Jul" day="14" yr="2026"
            time="8:00 PM EST · Booze Alley"
            title="Booze Alley Jazz"
            blurb="The recurring listening night. Drinks, records, and a small standing crowd. No agenda, no slides."
            seats="Open door"
          />
          <UpcomingRow
            mo="Jul" day="22" yr="2026"
            time="12:00 PM EST · Virtual"
            title="Prometheus Office Hours"
            blurb="A standing hour for founders thinking about AI integrations. 15-minute slots, first-come, real questions only."
            seats="4 / 4 slots"
            last
          />
        </div>
      </section>

      <div style={{ padding: `0 ${PAD}px` }}><Rule strong /></div>

      {/* PAST */}
      <section style={{ padding: `64px ${PAD}px 140px` }}>
        <SectionLabel num="03 — Past">Past</SectionLabel>

        <div style={{ marginTop: 48, maxWidth: 980 }}>
          {[
            ['May 2026', 'AI for Small Biz: Stealing Fire from the Gods', 'The first one. Owner-operators only.', 'Full'],
            ['Apr 2026', 'Booze Alley Jazz',                              'The April listening night.', 'Open door'],
            ['Mar 2026', 'Prometheus Office Hours',                       'Inaugural founder hour.', 'Full'],
            ['Feb 2026', 'Salon · Practical Philosophy',                  'A reading group on win-win dynamics.', '8 attended'],
            ['Jan 2026', 'Booze Alley Jazz',                              'New Year’s edition.', 'Open door'],
            ['Dec 2025', 'Booze Alley Jazz',                              'The December set. Cold outside, warm inside.', 'Open door'],
            ['Nov 2025', 'Workshop · Pipelines for Hospitality',          'Private session for a boutique hospitality client.', 'Private'],
          ].map(([d, t, b, m], i, arr) => (
            <a key={`${d}-${t}`} href="#" style={{
              display:'grid', gridTemplateColumns: '120px 1fr 1fr 100px',
              gap: 32, padding: '20px 0', alignItems:'baseline',
              borderBottom: i === arr.length-1 ? 'none' : `1px solid ${MS.rule}`,
              textDecoration:'none', color: MS.ink,
            }}>
              <span style={{
                fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
                color: MS.muted,
              }}>{d}</span>
              <span style={{ fontSize: 18, fontWeight: 400, letterSpacing:'-0.005em' }}>
                {t}
              </span>
              <span style={{ fontSize: 13, color: MS.muted, lineHeight: 1.5 }}>
                {b}
              </span>
              <span style={{
                fontSize: 11, letterSpacing:'0.16em', textTransform:'uppercase',
                color: MS.muted, textAlign:'right',
              }}>{m}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function UpcomingRow({ mo, day, yr, time, title, blurb, seats, featured, last }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns: '160px 1fr 200px',
      gap: 56, alignItems:'baseline',
      padding: featured ? '0 0 56px' : '40px 0',
      borderBottom: last ? 'none' : `1px solid ${MS.rule}`,
    }}>
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase',
          color: MS.muted, fontWeight: 400,
        }}>{mo} {yr}</div>
        <div style={{
          marginTop: 8, fontSize: featured ? 84 : 56, fontWeight: 700,
          letterSpacing:'-0.04em', lineHeight: 0.9,
        }}>{day}</div>
      </div>
      <div>
        <div style={{
          fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.muted,
        }}>{time}</div>
        <div style={{
          marginTop: 10, fontSize: featured ? 40 : 28, fontWeight: 700,
          letterSpacing:'-0.025em', lineHeight: 1.05,
        }}>{title}</div>
        <div style={{
          marginTop: 14, fontSize: featured ? 16 : 14, color: MS.muted,
          lineHeight: 1.5, maxWidth: 520,
        }}>{blurb}</div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div style={{
          fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
          color: MS.muted, marginBottom: 12,
        }}>{seats}</div>
        <div style={{
          display:'inline-block', fontSize: 11, letterSpacing:'0.2em',
          textTransform:'uppercase', color: MS.ink, fontWeight: 700,
          borderBottom: `1px solid ${MS.ink}`, paddingBottom: 3,
        }}>
          {featured ? 'Reserve a seat →' : 'RSVP →'}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EventsIndex });
