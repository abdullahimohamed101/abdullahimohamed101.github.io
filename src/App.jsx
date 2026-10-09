import { useEffect, useRef } from 'react'
import { profile, featured, more, footnote } from './data.js'

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll-linked reveal: progress follows scroll position, so it reverses on the way up.
function useReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (still()) return
    let raf = 0
    const draw = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = innerHeight
      const t = Math.min(Math.max((vh - r.top) / (vh * 0.6), 0), 1)
      const p = 1 - (1 - t) ** 3
      el.style.transform = `translate3d(0, ${60 * (1 - p)}px, 0) scale(${0.9 + 0.1 * p})`
      el.style.opacity = 0.4 + 0.6 * p
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [ref])
}

// Section copy fades up once.
function useFade(ref) {
  useEffect(() => {
    const el = ref.current
    if (still()) return el.classList.add('in')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="nav-name" href="#top">
          {profile.name}
        </a>
        <nav className="nav-links" aria-label="Site">
          <a href="#agent-black-box">Work</a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero dark" id="top">
      <div className="hero-copy">
        <img className="hero-photo" src={profile.photo.src} alt={profile.photo.alt} width="132" height="132" />
        <h1>{profile.name}.</h1>
        <p className="hero-sub">{profile.tagline}</p>
        <div className="actions">
          <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">
            Get in touch
          </a>
          <a className="more" href="#agent-black-box">
            See the work <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Copy({ p }) {
  const ref = useRef(null)
  useFade(ref)
  return (
    <div className="copy fade" ref={ref}>
      <h2>{p.name}</h2>
      <p className="tagline">{p.tagline}</p>
      <p className="lede">{p.body}</p>
    </div>
  )
}

function Window({ title, children, className }) {
  return (
    <div className={`window ${className || ''}`}>
      <div className="chrome" aria-hidden="true">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="chrome-title">{title}</span>
      </div>
      {children}
    </div>
  )
}

function Shot({ image, name }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div className="reveal" ref={ref}>
      <Window title={name}>
        <img src={image.src} alt={image.alt} width="1400" height="875" />
      </Window>
    </div>
  )
}

function Terminal({ lines, name }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div className="reveal" ref={ref}>
      <Window title={`${name} — zsh`} className="terminal">
        <pre tabIndex="0">
          {lines.map((l, i) =>
            'cmd' in l ? (
              <div key={i} className="cmd">
                <span className="prompt" aria-hidden="true">
                  ${' '}
                </span>
                {l.cmd}
              </div>
            ) : (
              <div key={i} className="out">
                {l.out || ' '}
              </div>
            ),
          )}
        </pre>
      </Window>
    </div>
  )
}

function Stats({ stats }) {
  return (
    <ul className="stats">
      {stats.map((s) => (
        <li key={s.label}>
          <b>
            {s.value}
            {s.unit && <small>{s.unit}</small>}
          </b>
          <span>{s.label}</span>
          {s.note && <em>{s.note}</em>}
        </li>
      ))}
    </ul>
  )
}

function Project({ p, tone }) {
  return (
    <section className={`project ${tone}`} id={p.id}>
      <div className="wrap">
        <Copy p={p} />
        {p.image ? <Shot image={p.image} name={p.name} /> : <Terminal lines={p.terminal} name={p.name} />}
        <Stats stats={p.stats} />
        <ul className="features">
          {p.features.map((f) => (
            <li key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
        <p className="cta">
          <a className="more" href={p.repo} target="_blank" rel="noreferrer">
            View on GitHub <span aria-hidden="true">›</span>
          </a>
        </p>
      </div>
    </section>
  )
}

function Also() {
  const ref = useRef(null)
  useFade(ref)
  return (
    <section className="also dark">
      <div className="wrap">
        <h2 className="fade" ref={ref}>
          Also built.
        </h2>
        <ul className="tiles">
          {more.map((m) => (
            <li key={m.id} className="tile">
              <h3>{m.name}</h3>
              <p>{m.text}</p>
              <p className="stack">{m.stack}</p>
              <a className="more" href={m.repo} target="_blank" rel="noreferrer">
                View on GitHub <span aria-hidden="true">›</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot light">
      <div className="wrap">
        <p className="footnote">{footnote}</p>
        <div className="foot-row">
          <span>{profile.name}</span>
          <nav className="foot-links" aria-label="Profiles">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {featured.map((p, i) => (
          <Project key={p.id} p={p} tone={i % 2 ? 'light' : 'dark'} />
        ))}
        <Also />
      </main>
      <Footer />
    </>
  )
}
