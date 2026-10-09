import { useEffect, useRef } from 'react'
import { profile, featured, more, intro, about, resume, footnote } from './data.js'

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
          <a href="#about">About</a>
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
        <p className="hero-now">{profile.currently}</p>
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

// Words light up one by one as the paragraph scrolls through the viewport.
function useScrollFill(ref) {
  useEffect(() => {
    const el = ref.current
    const words = [...el.querySelectorAll('.w')]
    if (still()) return words.forEach((w) => w.classList.add('on'))
    let raf = 0
    let lit = -1
    const draw = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const start = innerHeight * 0.85
      const end = innerHeight * 0.45 - r.height
      const t = Math.min(Math.max((start - r.top) / (start - end), 0), 1)
      const n = Math.round(t * words.length)
      if (n === lit) return
      lit = n
      words.forEach((w, i) => w.classList.toggle('on', i < n))
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

function Intro() {
  const ref = useRef(null)
  useScrollFill(ref)
  const words = intro.flatMap((s) => s.t.trim().split(/\s+/))
  return (
    <section className="intro dark" aria-label="Introduction">
      <p className="wrap intro-text" ref={ref}>
        {words.map((w, i) => (
          <span key={i} className="w">
            {w}{' '}
          </span>
        ))}
      </p>
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
      {p.meta && <p className="meta">{p.meta}</p>}
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
        {p.roadmap && (
          <div className="roadmap">
            <p className="roadmap-h">
              Where it’s going <span className="badge">In progress</span>
            </p>
            <ul>
              {p.roadmap.map((r) => (
                <li key={r.title}>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
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
              {m.repo && (
                <a className="more" href={m.repo} target="_blank" rel="noreferrer">
                  View on GitHub <span aria-hidden="true">›</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function About() {
  const copy = useRef(null)
  const photo = useRef(null)
  useFade(copy)
  useReveal(photo)
  return (
    <section className="about white" id="about">
      <div className="wrap about-grid">
        <div className="about-photo reveal" ref={photo}>
          <img src={about.photo.src} alt={about.photo.alt} width="900" height="900" loading="lazy" />
        </div>
        <div className="about-copy fade" ref={copy}>
          <p className="about-kicker">About</p>
          <h2>{about.headline}</h2>
          {about.paragraphs.map((t) => (
            <p key={t} className="about-p">
              {t}
            </p>
          ))}
          <div className="about-now">
            <h3>Now</h3>
            <ul>
              {about.now.map((n) => (
                <li key={n.name}>
                  <b>{n.name}.</b> {n.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="about-tools">{about.toolbox.join(' · ')}</p>
          <div className="about-actions">
            <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">
              Get in touch
            </a>
            <a className="more" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
      <Resume />
    </section>
  )
}

function Resume() {
  const ref = useRef(null)
  useFade(ref)
  const { education: ed, experience, leadership } = resume
  return (
    <div className="wrap resume fade" ref={ref}>
      <h2>Experience.</h2>
      <div className="resume-grid">
        <div className="card exp">
          <h3 className="card-h">Work</h3>
          <ol>
            {experience.map((x) => (
              <li key={x.role}>
                <div className="exp-top">
                  <b>{x.role}</b>
                  <span>{x.when}</span>
                </div>
                <p className="exp-org">{x.org}</p>
                <p>{x.text}</p>
                {x.impact && (
                  <ul className="impact">
                    {x.impact.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
                {x.tech && <p className="exp-tech">{x.tech.join(' · ')}</p>}
              </li>
            ))}
          </ol>
        </div>
        <div className="card">
          <h3 className="card-h">Education</h3>
          <p className="ed-school">{ed.school}</p>
          <p>{ed.degree}</p>
          <p className="muted">{ed.when}</p>
          <ul className="chips">
            {ed.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="coursework">{ed.coursework}</p>
        </div>
        <div className="card">
          <h3 className="card-h">Leadership</h3>
          <ul className="lead">
            {leadership.map((l) => (
              <li key={l.role}>
                <b>{l.role}</b>
                <p>{l.org}</p>
                <p className="muted">{l.when}</p>
                {l.text && <p className="lead-text">{l.text}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
        <Intro />
        {featured.map((p, i) => (
          <Project key={p.id} p={p} tone={i % 2 ? 'light' : 'dark'} />
        ))}
        <Also />
        <About />
      </main>
      <Footer />
    </>
  )
}
