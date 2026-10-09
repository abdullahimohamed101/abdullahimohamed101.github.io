import { useEffect, useState } from 'react'
import { profile, projects, traceStart, traceEnd } from './data.js'

const DAY = 86400000
const t0 = new Date(traceStart).getTime()
const t1 = new Date(traceEnd).getTime()
const now = Math.min(Date.now(), t1)

const pct = (t) => ((t - t0) / (t1 - t0)) * 100
const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

function spanOf(p) {
  const s = new Date(p.start).getTime()
  const e = p.end ? new Date(p.end).getTime() : now
  return { left: pct(s), width: Math.max(pct(e) - pct(s), 0.6), days: Math.max(1, Math.round((e - s) / DAY)) }
}

function months() {
  const out = []
  const d = new Date(t0)
  while (d.getTime() <= t1) {
    out.push({ q: out.length % 3 === 0, at: pct(d.getTime()), label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), jan: d.getUTCMonth() === 0, year: d.getUTCFullYear() })
    d.setUTCMonth(d.getUTCMonth() + 1)
  }
  return out
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme')
    } catch {
      return null
    }
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme) root.dataset.theme = theme
    else delete root.dataset.theme
    try {
      theme ? localStorage.setItem('theme', theme) : localStorage.removeItem('theme')
    } catch {
      /* storage unavailable */
    }
  }, [theme])
  const toggle = () => {
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(dark ? 'light' : 'dark')
  }
  return toggle
}

function Header() {
  const toggleTheme = useTheme()
  return (
    <header className="bar">
      <div className="bar-id">
        <span className="bar-name">{profile.name}</span>
      </div>
      <nav className="bar-links">
        {profile.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
        <button className="theme" onClick={toggleTheme} aria-label="Toggle color theme">
          <span aria-hidden="true">◐</span>
        </button>
      </nav>
    </header>
  )
}

function Trace() {
  const ticks = months()
  return (
    <section className="trace" aria-label="Project timeline">
      <div className="trace-body">
        <div className="axis mono" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i} className={`tick${t.jan ? ' jan' : ''}${t.q ? ' q' : ''}`} style={{ left: `${t.at}%` }}>
              {t.label}
              {t.jan && <span className="yr"> ’{String(t.year).slice(2)}</span>}
            </span>
          ))}
          <span className="now" style={{ left: `${pct(now)}%` }} />
        </div>
        {[...projects].reverse().map((p, i) => {
          const s = spanOf(p)
          return (
            <a key={p.id} className="row" href={`#${p.id}`} style={{ '--i': i }}>
              <span className="row-label">{p.name}</span>
              <span className="row-track">
                <span
                  className={p.live ? 'span live' : 'span'}
                  style={{ left: `${s.left}%`, width: `${s.width}%` }}
                />
                <span
                  className="mono row-dur"
                  style={
                    s.left + s.width > 80
                      ? { right: `calc(${100 - s.left}% + 8px)` }
                      : { left: `calc(${s.left + s.width}% + 8px)` }
                  }
                >
                  {s.days}d{p.live ? ' · live' : ''}
                </span>
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function Project({ p }) {
  return (
    <article className="project" id={p.id}>
      <aside className="project-meta">
        <h2>{p.name}</h2>
        <p className="lede">{p.lede}</p>
        <a className="repo" href={p.repo} target="_blank" rel="noreferrer">
          View source <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <div className="project-main">
        <p className="body">{p.body}</p>

        <div className={`metrics m${p.metrics.length}`}>
          {p.metrics.map((m) => (
            <div className="metric" key={m.label}>
              <div className="metric-v mono">
                {m.value}
                {m.unit && <small>{m.unit}</small>}
              </div>
              <div className="metric-l">{m.label}</div>
              {m.note && <div className="metric-n mono">{m.note}</div>}
            </div>
          ))}
        </div>

        <ul className="spans mono">
          {p.spans.map((line, i) => (
            <li key={i}>
              {line}
            </li>
          ))}
        </ul>

        {p.image && (
          <figure className="shot">
            <img src={p.image} alt={p.imageAlt} loading="lazy" />
          </figure>
        )}

        <p className="stack mono">{p.stack.join(' · ')}</p>
      </div>
    </article>
  )
}

function Minor({ p }) {
  return (
    <li className="minor" id={p.id}>
      <h3>
        <a href={p.repo} target="_blank" rel="noreferrer">
          {p.name} <span aria-hidden="true">↗</span>
        </a>
      </h3>
      <p>{p.body}</p>
      <p className="stack mono">
        {fmt(p.start)} · {p.stack.join(' · ')}
      </p>
    </li>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <h1>{profile.tagline}</h1>
          <p className="summary">{profile.summary}</p>
        </section>
        <Trace />
        <div className="projects">
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <Project key={p.id} p={p} />
            ))}
        </div>
        <section className="also">
          <h2 className="also-h">Also built</h2>
          <ul>
            {projects
              .filter((p) => !p.featured)
              .map((p) => (
                <Minor key={p.id} p={p} />
              ))}
          </ul>
        </section>
      </main>
      <footer className="foot">
        <span>{profile.name}</span>
        <span className="foot-links">
          {profile.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </span>
      </footer>
    </>
  )
}
