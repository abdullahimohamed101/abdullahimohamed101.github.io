const GH = 'https://github.com/abdullahimohamed101'

export const profile = {
  name: 'Abdullahi Mohamed',
  tagline: 'I build infrastructure for AI systems.',
  summary:
    'Backend systems and developer tooling: routing LLM inference across GPU workers, tracing what agents actually do, and moving data in real time.',
  links: [
    { label: 'GitHub', href: GH },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/the-abdullahi-mohamed/' },
  ],
}

// Trace axis: real repo activity windows.
export const traceStart = '2025-10-01'
export const traceEnd = '2026-10-31'

export const projects = [
  {
    id: 'agent-black-box',
    name: 'Agent Black Box',
    kind: 'observability',
    featured: true,
    live: true,
    start: '2026-10-07',
    end: null,
    repo: `${GH}/agent-black-box`,
    lede: 'A flight recorder for AI agents.',
    body:
      'Every model call, tool call, file edit, shell command, retry and failure, with cost and latency attached, streamed live to a dashboard. Built around a versioned telemetry contract rather than any single datastore.',
    metrics: [
      { value: '43.7', unit: 'ms', label: 'p95 batch ingest ack', note: 'target 150 ms' },
      { value: '3.2k', unit: 'ev/s', label: 'sustained ingest', note: 'one client, 2 vCPU' },
      { value: '2.8', unit: 'ms', label: 'p95 run read', note: '2,000-event run' },
    ],
    spans: [
      'Python SDK → FastAPI → PostgreSQL events + outbox → workers',
      'SSE live stream into a Next.js trace viewer',
      'Adapters: OpenAI, Anthropic, LangGraph, MCP + conformance suite',
      'Demo agent fixes a broken OAuth service, fails a test, retries, passes',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'TypeScript', 'Next.js', 'Docker'],
    imageAlt: 'Agent Black Box run view: a coding agent fails a test, retries and passes',
    image:
      'https://raw.githubusercontent.com/abdullahimohamed101/agent-black-box/HEAD/docs/screenshots/phase-6/story.png',
  },
  {
    id: 'serverflow',
    name: 'ServerFlow',
    kind: 'inference',
    featured: true,
    live: true,
    start: '2026-09-06',
    end: null,
    repo: `${GH}/ServerFlow`,
    lede: 'A distributed LLM inference control plane.',
    body:
      'Everything between the client and the inference engine: an OpenAI-compatible gateway, a worker registry with heartbeats and death detection, pluggable schedulers, retries, API-key auth and a reproducible benchmark harness.',
    metrics: [
      { value: '0.5', unit: 'ms', label: 'p95 gateway overhead', note: 'budget 25 ms' },
      { value: '0', unit: '/1000', label: 'client failures', note: 'one worker always failing' },
      { value: '4', unit: '', label: 'scheduling strategies', note: 'rr · random · least-active · least-queue' },
    ],
    spans: [
      'Gateway: /v1/chat/completions with streaming, /v1/models, /metrics',
      'Control plane: register → heartbeat → suspect → lost',
      'Retry on a different worker when a request fails before any output',
      'Benchmark harness: seeded workloads, repeat runs, run-vs-run compare',
    ],
    stack: ['Go', 'vLLM', 'PostgreSQL', 'Prometheus'],
  },
  {
    id: 'internship-aggregator',
    name: 'Internship Aggregator',
    kind: 'pipeline',
    live: false,
    start: '2026-07-12',
    end: '2026-08-03',
    repo: `${GH}/recruiting-help`,
    lede: 'Every US internship posting, in one Discord channel.',
    body:
      'Collects internship, co-op and new-grad roles from GitHub, Discord, Instagram and Slack sources, normalizes and deduplicates them, tags sponsorship status instead of hiding roles, and publishes alerts.',
    spans: [
      'Signed unified ingestion into PostgreSQL',
      'Geography + sponsorship normalization',
      'Discord bot delivery, GitHub poller connector',
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Discord'],
  },
  {
    id: 'risk-dashboard',
    name: 'Real-Time Risk Dashboard',
    kind: 'fintech',
    live: false,
    start: '2025-10-11',
    end: '2025-10-13',
    repo: `${GH}/realtimedashboard`,
    lede: 'Portfolio risk, recomputed as prices move.',
    body:
      'Ingests holdings, computes rolling Sharpe, Beta, VaR and CVaR plus Fama-French three-factor exposures, and pushes updates to the browser over WebSockets.',
    spans: [
      'FastAPI + SQLAlchemy/Alembic, APScheduler jobs',
      'Redis pub/sub → WebSocket fan-out',
      'React + Vite + Recharts front end, CI on GitHub Actions',
    ],
    stack: ['Python', 'FastAPI', 'Redis', 'React', 'PostgreSQL'],
  },
]
