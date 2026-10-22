import { useRef, useState } from 'react'
import { useFade, useSheet } from '../hooks.js'
import { profile } from '../data.js'
import { GH, LINKEDIN, summary, transcript, shots, features, pipeline, stats, stack } from './content.js'

const BASE = import.meta.env.BASE_URL
const asset = (name) => `${BASE}agent-black-box/${name}`

// A section; light ones arrive as the same rounded "sheet" the portfolio uses.
function Section({ id, tone, label, children }) {
  const ref = useRef(null)
  useSheet(ref, tone === 'light')
  return (
    <section
      className={`abb-sec ${tone}${tone === 'light' ? ' sheet' : ''}`}
      id={id}
      aria-labelledby={`${id}-h`}
      data-label={label}
      ref={ref}
    >
      <div className="wrap">{children}</div>
    </section>
  )
}

function Head({ id, kicker, title, lede }) {
  const ref = useRef(null)
  useFade(ref)
  return (
    <header className="abb-head fade" ref={ref}>
      <p className="kicker">{kicker}</p>
      <h2 id={`${id}-h`}>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </header>
  )
}

function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="nav-name" href={BASE}>
          <span aria-hidden="true">‹&nbsp;</span>Portfolio
        </a>
        <nav className="nav-links" aria-label="On this page">
          <a href="#demo">Demo</a>
          <a href="#screens">Screenshots</a>
          <a href="#run-it">Run it</a>
          <a href={GH} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero abb-hero dark" aria-labelledby="top-h">
      <div className="hero-copy">
        <p className="hero-now">Case study</p>
        <h1 id="top-h">Agent Black Box</h1>
        <p className="hero-sub">See everything your agent did.</p>
        <p className="abb-summary">{summary}</p>
        <div className="actions">
          <a className="pill" href="#demo">
            Watch the demo
          </a>
          <a className="more" href={GH} target="_blank" rel="noreferrer">
            View on GitHub <span aria-hidden="true">›</span>
          </a>
          <a className="more" href={LINKEDIN} target="_blank" rel="noreferrer">
            Get in touch <span aria-hidden="true">›</span>
          </a>
        </div>
        <picture className="abb-preview">
          <source media="(prefers-reduced-motion: reduce)" srcSet={asset('teaser-poster.jpg')} />
          <img
            src={asset('teaser.gif')}
            alt="A looping 19-second screen recording: the Runs list, a failed run opened, its one-sentence summary, and the first error marked on the timeline"
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <Section id="demo" tone="light">
      <Head
        id="demo"
        kicker="The demo"
        title="From a failed run to the step that broke it."
        lede="A 73-second film of the dashboard, recorded against the built-in demo data. It has no sound; the captions are in the picture and also available as a caption track."
      />
      <div className="abb-video">
        <video
          controls
          preload="metadata"
          playsInline
          muted
          width="1920"
          height="1080"
          poster={asset('poster.jpg')}
          aria-label="Agent Black Box demo film, 73 seconds, no sound"
        >
          <source src={asset('demo-1080p.mp4')} type="video/mp4" />
          <track kind="captions" src={asset('demo.vtt')} srcLang="en" label="English" />
          Your browser cannot play this video. Read the text version below or <a href={asset('demo-1080p.mp4')}>download the film</a>.
        </video>
      </div>
      <details className="abb-details">
        <summary>Text version of the demo film</summary>
        <ol>
          {transcript.map(([t, d]) => (
            <li key={t}>
              <b>{t}.</b> {d}
            </li>
          ))}
        </ol>
        <p className="abb-small">
          Also available as <a href={asset('transcript.md')}>a plain-text file</a>.
        </p>
      </details>
      <div className="abb-video abb-teaser">
        <h3>The short version</h3>
        <p className="abb-small">19 seconds, no sound: open the failed run, read the sentence, jump to the first error.</p>
        <video
          controls
          preload="metadata"
          playsInline
          muted
          loop
          width="1920"
          height="1080"
          poster={asset('teaser-poster.jpg')}
          aria-label="Agent Black Box short demo, 19 seconds, no sound"
        >
          <source src={asset('teaser-1080p.mp4')} type="video/mp4" />
          <track kind="captions" src={asset('teaser.vtt')} srcLang="en" label="English" />
        </video>
      </div>
    </Section>
  )
}

function Problem() {
  return (
    <Section id="problem" tone="dark">
      <Head
        id="problem"
        kicker="The problem"
        title="When an agent fails, what did it actually do?"
        lede="An agent makes dozens of decisions, calls tools, retries and spends money. When it goes wrong, most teams have a pile of log lines and a guess."
      />
      <div className="abb-two">
        <article className="tile">
          <h3>Logs are not events</h3>
          <p>A log line is free text. You cannot ask it which model call ran, how many tokens it used, whether it was a retry, or what came after the first error.</p>
        </article>
        <article className="tile">
          <h3>Typed, immutable events</h3>
          <p>
            Agent Black Box records every model call, tool call, retry and approval as a typed event. Accepted events are never edited, so a run can be replayed and the
            numbers on screen can be traced back to them.
          </p>
        </article>
      </div>
    </Section>
  )
}

function Gallery() {
  const [theme, setTheme] = useState('dark')
  return (
    <Section id="screens" tone="light">
      <Head
        id="screens"
        kicker="Walkthrough"
        title="Six screens, in the order you would use them."
        lede="Everything here is the built-in demo data: scripted agents with made-up prices. These screenshots show no real customer runs."
      />
      <div className="abb-toggle" role="group" aria-label="Screenshot theme">
        {['dark', 'light'].map((t) => (
          <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)}>
            {t === 'dark' ? 'Dark' : 'Light'}
          </button>
        ))}
      </div>
      <ol className="abb-shots">
        {shots.map((s, i) => {
          const src = asset(`${s.id}-${theme}.png`)
          return (
            <li key={s.id} className="abb-shot">
              <figure>
                <div className="window">
                  <div className="chrome" aria-hidden="true">
                    <span className="dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="chrome-title">Agent Black Box (demo data)</span>
                  </div>
                  <img src={src} alt={s.alt} width="1440" height="900" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                </div>
                <figcaption>
                  <span className="abb-step">
                    {i + 1} of {shots.length}
                  </span>
                  <b>{s.title}</b>
                  <span className="abb-what">
                    <em>What you are looking at:</em> {s.what}
                  </span>
                  <a className="more" href={src} target="_blank" rel="noreferrer">
                    Open full size <span className="sr">(new tab)</span>
                    <span aria-hidden="true">›</span>
                  </a>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

function Features() {
  return (
    <Section id="features" tone="dark">
      <Head id="features" kicker="What it does" title="Record, replay, explain, and hold." />
      <ul className="abb-features">
        {features.map(([t, d]) => (
          <li key={t}>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Architecture() {
  return (
    <Section id="how" tone="light">
      <Head
        id="how"
        kicker="How it fits together"
        title="One path from the agent to the dashboard."
        lede="Events flow left to right, or top to bottom on a phone. Each step has one job."
      />
      <ol className="abb-flow" aria-label="Architecture, in order">
        {pipeline.map(([n, d]) => (
          <li key={n}>
            <b>{n}</b>
            <span>{d}</span>
          </li>
        ))}
      </ol>
      <p className="abb-note">
        Ingestion is at-least-once and idempotent on (workspace, event id), and arrival order is never trusted, so a retried or reordered upload cannot double-count or
        corrupt a run.
      </p>
    </Section>
  )
}

function Trust() {
  return (
    <Section id="trust" tone="dark">
      <Head
        id="trust"
        kicker="Trust and engineering"
        title="Built in reviewed phases, with the evidence kept."
        lede="Every phase was reviewed adversarially, including a security pass, and closed with CI results. The decisions behind the design are written down. Open source under Apache-2.0."
      />
      <ul className="abb-stats">
        {stats.map((s) => (
          <li key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
      <p className="abb-note">Figures were measured on 2026-10-22 from the repository. Line counts include generated code and test code.</p>
    </Section>
  )
}

function RunIt() {
  return (
    <Section id="run-it" tone="light">
      <Head
        id="run-it"
        kicker="Run it yourself"
        title="Self-hosted, with no account and no model key."
        lede="You need Docker with Compose, uv and Git. The demo runs scripted agents, so it works offline."
      />
      <div className="window terminal abb-term">
        <div className="chrome" aria-hidden="true">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="chrome-title">agent-black-box — zsh</span>
        </div>
        <pre tabIndex="0" aria-label="Commands to run the demo">
          <span className="cmd">
            <span className="prompt" aria-hidden="true">$ </span>git clone https://github.com/abdullahimohamed101/agent-black-box.git{'\n'}
            <span className="prompt" aria-hidden="true">$ </span>cd agent-black-box && cp .env.example .env{'\n'}
            <span className="prompt" aria-hidden="true">$ </span>make up{'    '}
            <span className="out"># PostgreSQL, migrations, API, worker, web{'\n'}</span>
            <span className="prompt" aria-hidden="true">$ </span>make seed{'  '}
            <span className="out"># a local workspace, a demo project and a development key{'\n'}</span>
            <span className="prompt" aria-hidden="true">$ </span>make demo{'  '}
            <span className="out"># records twelve scripted runs and prints their links</span>
          </span>
        </pre>
      </div>
      <p className="abb-note">
        Then open <code>http://localhost:3000</code>. The first build takes several minutes.
      </p>
      <div className="abb-two">
        <article className="tile">
          <h3>Self-hosted</h3>
          <p>It runs on your machine or your server. There is no live public demo and no hosted service, and it is not published to PyPI or npm.</p>
        </article>
        <article className="tile">
          <h3>A private hosting recipe</h3>
          <p>
            The repository includes a guide for one small server: Docker Compose, Caddy for automatic HTTPS, encrypted backups with a restore drill, and monitoring. The
            parts that need a real server and domain have not been run on one yet.
          </p>
        </article>
      </div>
      <p className="cta">
        <a className="more" href={GH} target="_blank" rel="noreferrer">
          View on GitHub <span aria-hidden="true">›</span>
        </a>
      </p>
    </Section>
  )
}

function Stack() {
  return (
    <Section id="stack" tone="dark">
      <Head id="stack" kicker="Tech stack" title="What it is made of." />
      <ul className="abb-chips">
        {stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="actions sec-actions">
        <a className="pill" href={LINKEDIN} target="_blank" rel="noreferrer">
          Get in touch
        </a>
        <a className="more" href={BASE}>
          Back to portfolio <span aria-hidden="true">›</span>
        </a>
      </div>
    </Section>
  )
}

function Footer() {
  const sheet = useRef(null)
  useSheet(sheet)
  return (
    <footer className="foot light sheet" ref={sheet}>
      <div className="wrap">
        <p className="footnote">Screenshots and films show built-in demo data, not real runs. Figures measured 2026-10-22 from the repository.</p>
        <div className="foot-row">
          <span>{profile.name}</span>
          <nav className="foot-links" aria-label="Profiles">
            <a href={BASE}>Portfolio</a>
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

export default function CaseStudy() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex="-1">
        <Hero />
        <Demo />
        <Problem />
        <Gallery />
        <Features />
        <Architecture />
        <Trust />
        <RunIt />
        <Stack />
      </main>
      <Footer />
    </>
  )
}
