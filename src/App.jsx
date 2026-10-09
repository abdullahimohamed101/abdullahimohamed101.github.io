import { useEffect, useRef, useState } from 'react'
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

// Scrub cursor: tracks the pointer 1:1, rubber-bands past the track edges, and on
// release returns to "now" on a critically damped spring that inherits the
// pointer's velocity. Any new pointer input interrupts the spring mid-flight.
const RESPONSE = 0.4 // seconds, Apple's default for repositioning
const OMEGA = (2 * Math.PI) / RESPONSE
const BAND = 8 // max rubber-band overshoot, % of track

const rubber = (x) => {
  const band = (d) => (1 - 1 / ((d * 0.55) / BAND + 1)) * BAND
  if (x < 0) return -band(-x)
  if (x > 100) return 100 + band(x - 100)
  return x
}

function monthKey(x) {
  const d = new Date(t0 + (Math.min(Math.max(x, 0), 100) / 100) * (t1 - t0))
  return d.getUTCFullYear() * 12 + d.getUTCMonth()
}

function useScrub(bodyRef, railRef, lineRef, rest) {
  const [month, setMonth] = useState(null)
  useEffect(() => {
    const body = bodyRef.current
    const rail = railRef.current
    const line = lineRef.current
    const still = matchMedia('(prefers-reduced-motion: reduce)')
    const st = { x: rest, v: 0, raf: 0, last: 0, active: false, touch: null, samples: [], swallowClick: false }

    const draw = () => {
      line.style.transform = `translateX(${(st.x / 100) * rail.clientWidth}px)`
      line.dataset.align = st.x > 88 ? 'end' : st.x < 12 ? 'start' : 'mid'
    }
    const toX = (clientX) => {
      const r = rail.getBoundingClientRect()
      return ((clientX - r.left) / r.width) * 100
    }
    const velocity = () => {
      const s = st.samples
      if (s.length < 2) return 0
      const dt = (s[s.length - 1].t - s[0].t) / 1000
      return dt > 0 ? (s[s.length - 1].x - s[0].x) / dt : 0
    }

    const step = (ts) => {
      const dt = Math.min((ts - st.last) / 1000, 1 / 30)
      st.last = ts
      st.v += (-OMEGA * OMEGA * (st.x - rest) - 2 * OMEGA * st.v) * dt
      st.x += st.v * dt
      if (Math.abs(st.v) < 0.05 && Math.abs(st.x - rest) < 0.05) {
        st.x = rest
        st.v = 0
        st.raf = 0
        draw()
        return
      }
      draw()
      st.raf = requestAnimationFrame(step)
    }

    const grab = (x) => {
      cancelAnimationFrame(st.raf)
      st.raf = 0
      st.x = x
      const t = performance.now()
      st.samples.push({ x, t })
      while (st.samples.length > 2 && t - st.samples[0].t > 80) st.samples.shift()
      if (!st.active) {
        st.active = true
        body.classList.add('scrubbing')
      }
      draw()
      setMonth(monthKey(x))
    }

    const release = () => {
      if (!st.active) return
      st.active = false
      body.classList.remove('scrubbing')
      setMonth(null)
      st.v = velocity()
      st.samples = []
      if (still.matches) {
        st.x = rest
        st.v = 0
        draw()
        return
      }
      st.last = performance.now()
      st.raf = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'touch') {
        const x = toX(e.clientX)
        if (x >= 0 && x <= 100) grab(x)
        else release()
        return
      }
      const t = st.touch
      if (!t || t.id !== e.pointerId) return
      if (!t.started) {
        const dx = Math.abs(e.clientX - t.x0)
        const dy = Math.abs(e.clientY - t.y0)
        if (dx > 10 && dx > dy) {
          t.started = true
          body.setPointerCapture(e.pointerId)
        } else if (dy > 10) {
          st.touch = null // vertical: let the page scroll
          return
        } else return
      }
      grab(rubber(toX(e.clientX)))
    }
    const onDown = (e) => {
      st.swallowClick = false
      if (e.pointerType === 'touch') st.touch = { id: e.pointerId, x0: e.clientX, y0: e.clientY, started: false }
    }
    const onUp = (e) => {
      if (e.pointerType !== 'touch') return
      if (st.touch?.started) {
        st.swallowClick = true
        release()
      }
      st.touch = null
    }
    const onClick = (e) => {
      if (!st.swallowClick) return
      st.swallowClick = false
      e.preventDefault()
      e.stopPropagation()
    }

    draw()
    body.addEventListener('pointermove', onMove)
    body.addEventListener('pointerdown', onDown)
    body.addEventListener('pointerup', onUp)
    body.addEventListener('pointercancel', onUp)
    body.addEventListener('pointerleave', release)
    body.addEventListener('click', onClick, true)
    addEventListener('resize', draw)
    return () => {
      cancelAnimationFrame(st.raf)
      body.removeEventListener('pointermove', onMove)
      body.removeEventListener('pointerdown', onDown)
      body.removeEventListener('pointerup', onUp)
      body.removeEventListener('pointercancel', onUp)
      body.removeEventListener('pointerleave', release)
      body.removeEventListener('click', onClick, true)
      removeEventListener('resize', draw)
    }
  }, [bodyRef, railRef, lineRef, rest])
  return month
}

function Trace() {
  const ticks = months()
  const bodyRef = useRef(null)
  const railRef = useRef(null)
  const lineRef = useRef(null)
  const month = useScrub(bodyRef, railRef, lineRef, pct(now))
  const monthStart = month === null ? 0 : Date.UTC(Math.floor(month / 12), month % 12, 1)
  const monthEnd = month === null ? 0 : Date.UTC(Math.floor(month / 12), (month % 12) + 1, 1)

  return (
    <figure className="trace">
      <figcaption>
        Projects by repository activity <span>· {fmt(traceStart)} – now</span>
      </figcaption>
      <div className="trace-body" ref={bodyRef}>
        <div className="axis mono" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i} className={`tick${t.jan ? ' jan' : ''}${t.q ? ' q' : ''}`} style={{ left: `${t.at}%` }}>
              {t.label}
              {t.jan && <span className="yr"> ’{String(t.year).slice(2)}</span>}
            </span>
          ))}
        </div>
        {[...projects].reverse().map((p, i) => {
          const s = spanOf(p)
          const ps = new Date(p.start).getTime()
          const pe = p.end ? new Date(p.end).getTime() : now
          const on = month !== null && ps < monthEnd && pe >= monthStart
          return (
            <a key={p.id} className={on ? 'row on' : 'row'} href={`#${p.id}`} style={{ '--i': i }}>
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
        <div className="rail" ref={railRef} aria-hidden="true">
          <div className="cursor" ref={lineRef}>
            <span className="cursor-stem" />
            <span className="cursor-chip mono">
              {month !== null &&
                new Date(monthStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}
            </span>
          </div>
        </div>
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
