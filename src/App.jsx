import { useEffect, useState } from 'react'
import { profile, projects, specNote, traceStart, traceEnd } from './data.js'

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
    out.push({
      q: out.length % 3 === 0,
      at: pct(d.getTime()),
      label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
      jan: d.getUTCMonth() === 0,
      year: d.getUTCFullYear(),
    })
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
  const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    // Crossfade the swap so it reads as one change, not a flash.
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || still) apply()
    else document.startViewTransition(apply)
  }
  return [dark, toggle]
}

function Header() {
  const [dark, toggleTheme] = useTheme()
  return (
    <header className="bar">
      <span className="bar-name">{profile.name}</span>
      <nav className="bar-links">
        {profile.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
        <button className="theme" onClick={toggleTheme}>
          {dark ? 'Light' : 'Dark'}
        </button>
      </nav>
    </header>
  )
}

function Trace() {
  const ticks = months()
  return (
    <figure className="trace">
      <figcaption>
        Projects by repository activity <span>· {fmt(traceStart)} – now</span>
      </figcaption>
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
    </figure>
  )
}

function Specs({ rows }) {
  return (
    <table className="spec">
      <thead>
        <tr>
          <th scope="col">Parameter</th>
          <th scope="col">Conditions</th>
          <th scope="col" className="num">
            Value
          </th>
          <th scope="col" className="num">
            Target
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.param}>
            <th scope="row">{r.param}</th>
            <td className="cond">{r.cond}</td>
            <td className="num mono val">{r.value}</td>
            <td className="num mono tgt">{r.target}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Project({ p }) {
  return (
    <article className="project" id={p.id}>
      <aside className="project-meta">
        <h2>{p.name}</h2>
        <p className="lede">{p.lede}</p>
        <p className="stack mono">{p.stack.join(' · ')}</p>
        <a className="repo" href={p.repo} target="_blank" rel="noreferrer">
          View source <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <div className="project-main">
        <p className="body">{p.body}</p>
        <Specs rows={p.specs} />
        <ul className="points">
          {p.spans.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {p.image && (
          <figure className="shot">
            <img src={p.image} alt={p.imageAlt} loading="lazy" />
          </figure>
        )}
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
          <p className="spec-note">{specNote}</p>
        </div>
        <section className="also">
          <h2>Also built</h2>
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
