const GH = 'https://github.com/abdullahimohamed101'

export const profile = {
  name: 'Abdullahi Mohamed',
  tagline: 'I build infrastructure for AI.',
  github: GH,
  linkedin: 'https://www.linkedin.com/in/the-abdullahi-mohamed/',
}

export const footnote =
  'Benchmarks measured on one laptop (Apple M5 Pro); regression baselines from the repos, not capacity claims.'

export const featured = [
  {
    id: 'agent-black-box',
    name: 'Agent Black Box',
    tagline: 'See everything your agent did.',
    body:
      'A flight recorder for AI agents. Every model call, tool call, file edit, shell command, retry and failure, with cost and latency attached, streamed live.',
    repo: `${GH}/agent-black-box`,
    stats: [
      { value: '43.7', unit: 'ms', label: 'p95 batch ingest ack', note: 'target 150 ms' },
      { value: '3,249', unit: 'events/s', label: 'sustained ingest' },
      { value: '2.8', unit: 'ms', label: 'p95 run read', note: '2,000-event run' },
    ],
    features: [
      { title: 'Pipeline', text: 'Python SDK → FastAPI → PostgreSQL → workers, on a versioned telemetry contract.' },
      { title: 'Live', text: 'An SSE stream into a Next.js trace viewer, as events arrive.' },
      { title: 'Adapters', text: 'OpenAI, Anthropic, LangGraph and MCP, with a conformance suite.' },
      { title: 'Demo agent', text: 'Fixes a broken OAuth service, fails a test, retries and passes.' },
    ],
    image: { src: '/agent-black-box.png', alt: 'Agent Black Box run view: a coding agent fails a test, retries and passes' },
  },
  {
    id: 'serverflow',
    name: 'ServerFlow',
    tagline: 'Route every token.',
    body:
      'A distributed LLM inference control plane. An OpenAI-compatible gateway, a worker registry with heartbeats and death detection, pluggable schedulers, retries on another worker, API-key auth and a reproducible benchmark harness.',
    repo: `${GH}/ServerFlow`,
    stats: [
      { value: '0.5', unit: 'ms', label: 'p95 gateway overhead', note: 'budget 25 ms' },
      { value: '0', label: 'client-visible failures', note: '1,000 requests, one of four workers always failing' },
      { value: '4', label: 'scheduling strategies', note: 'round-robin, random, least-active, least-queue' },
    ],
    features: [
      { title: 'Gateway', text: '/v1/chat/completions with streaming, /v1/models and /metrics.' },
      { title: 'Registry', text: 'Register → heartbeat → suspect → lost. A dead backend is noticed at once.' },
      { title: 'Retries', text: 'A request that fails before any output is retried on a different worker.' },
      { title: 'Even split', text: 'Round-robin sent 750 requests 188, 188, 187, 187 across four workers.' },
    ],
    // Commands from the README; output quoted from docs/benchmarks/phase-7-sample/compare_run_001_run_004.txt.
    terminal: [
      { cmd: 'make bench BENCH_ARGS="--scheduler round-robin --workers 3 --worker-profile heterogeneous --concurrency 12 --duration 20s --warmup 3s --workload mixed --seed 1 --repeat 3"' },
      { cmd: 'make bench BENCH_ARGS="--scheduler least-active ...same flags..."' },
      { cmd: 'make bench-compare A=run_001 B=run_004' },
      { out: 'Comparing run_001 (A) with run_004 (B): medians of 3 and 3 repeats, with the min-max range of each in brackets.' },
      { out: '' },
      { out: 'METRIC         A                    B                    DELTA        CHANGE    SPREAD' },
      { out: 'throughput     21.75 [21.75-22]     25.25 [25.1-25.3]    +3.5 req/s   +16.09%   ranges do not overlap' },
      { out: 'latency p50    267.2 [260.4-280.4]  235.3 [222-248.7]    -31.82 ms    -11.91%   ranges do not overlap' },
      { out: 'latency p95    2141 [1971-2246]     1520 [1508-1698]     -620.4 ms    -28.98%   ranges do not overlap' },
      { out: 'TTFT p95       60.41 [60.38-60.52]  60.39 [60.38-60.42]  -0.01767 ms  -0.03%    ranges overlap' },
      { out: 'error rate     0 [0-0]              0 [0-0]              +0 %         +0.00 pp  n/a' },
      { out: '' },
      { out: 'Metadata that differs (expected for this comparison):' },
      { out: '  scheduler: round-robin -> least-active' },
    ],
  },
]

export const more = [
  {
    id: 'internship-aggregator',
    name: 'Internship Aggregator',
    text: 'Every US internship posting, normalized, deduplicated and delivered to one Discord channel.',
    stack: 'TypeScript · Node.js · PostgreSQL · Discord',
    repo: `${GH}/recruiting-help`,
  },
  {
    id: 'risk-dashboard',
    name: 'Real-Time Risk Dashboard',
    text: 'Rolling Sharpe, Beta, VaR, CVaR and Fama-French exposures, pushed to the browser over WebSockets.',
    stack: 'Python · FastAPI · Redis · React · PostgreSQL',
    repo: `${GH}/realtimedashboard`,
  },
]
