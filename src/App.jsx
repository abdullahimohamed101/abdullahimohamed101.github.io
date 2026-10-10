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
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
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
          <a className="pill" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
          <a className="pill ghost" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé
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
  const head = useRef(null)
  const photo = useRef(null)
  useFade(head)
  useReveal(photo)
  const [lead, ...rest] = about.paragraphs
  return (
    <section className="about white" id="about">
      <div className="wrap">
        <header className="sec-head fade" ref={head}>
          <p className="kicker">About</p>
          <h2 className="giant">{about.headline}</h2>
        </header>
        <div className="bento">
          <figure className="b-photo reveal" ref={photo}>
            <img src={about.photo.src} alt={about.photo.alt} width="900" height="900" loading="lazy" />
          </figure>
          <div className="b-tile b-bio">
            <p className="b-lead">{lead}</p>
            {rest.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <div className="b-tile b-now">
            <p className="b-k">Now</p>
            <ul>
              {about.now.map((n) => (
                <li key={n.name}>
                  <b>{n.name}</b>
                  <span>{n.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="b-tile b-fun">
            <p className="b-k">Off the clock</p>
            <h3>{about.offClock.title}</h3>
            <p>{about.offClock.text}</p>
          </div>
          <div className="b-tile b-tools">
            <p className="b-k">Toolbox</p>
            <ul>
              {about.toolbox.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="actions sec-actions">
          <a className="pill" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="pill ghost" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
          <a className="more" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const head = useRef(null)
  useFade(head)
  const { education: ed, experience, leadership } = resume
  const lead = leadership[0]
  return (
    <section className="exp-sec dark" id="experience">
      <div className="wrap">
        <header className="sec-head fade" ref={head}>
          <p className="kicker">Experience</p>
          <h2 className="giant">Where I’ve built.</h2>
        </header>
        <div className="roles">
          {experience.map((x) => (
            <article className="role" key={x.role}>
              <div className="role-top">
                <div>
                  <h3 className="role-co">{x.co}</h3>
                  <p className="role-title">{x.role}</p>
                </div>
                <p className="role-when">{x.when}</p>
              </div>
              <ul className="role-stats">
                {x.impact.map((m) => (
                  <li key={m.l}>
                    <b>{m.v}</b>
                    <span>{m.l}</span>
                  </li>
                ))}
              </ul>
              <p className="role-text">{x.text}</p>
              <p className="role-tech">{x.tech.join(' · ')}</p>
            </article>
          ))}
        </div>
        <div className="duo">
          <article className="role">
            <p className="b-k">Education</p>
            <h3 className="duo-h">Ohio State.</h3>
            <p className="role-title">{ed.degree}</p>
            <div className="gpa">
              <b>{ed.details[0].replace('GPA ', '')}</b>
              <span>
                GPA
                <br />
                {ed.when.replace('Expected ', 'Class of ').replace('May ', '')}
              </span>
            </div>
            <p className="role-tech">{ed.coursework}</p>
          </article>
          <article className="role">
            <p className="b-k">Leadership</p>
            <h3 className="duo-h">Founder.</h3>
            <p className="role-title">
              {lead.role}, {lead.org}
            </p>
            <p className="role-when solo">{lead.when}</p>
            <p className="role-text">{lead.text}</p>
          </article>
        </div>
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
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
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
        <Experience />
      </main>
      <Footer />
    </>
  )
}
