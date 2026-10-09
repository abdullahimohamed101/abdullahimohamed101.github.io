const GH = 'https://github.com/abdullahimohamed101'

export const profile = {
  name: 'Abdullahi Mohamed',
  tagline: 'I build distributed systems and infrastructure for AI.',
  photo: { src: '/abdullahi.jpg', alt: 'Portrait of Abdullahi Mohamed' },
  github: GH,
  linkedin: 'https://www.linkedin.com/in/the-abdullahi-mohamed/',
}

export const about = {
  headline: 'Systems you can measure.',
  paragraphs: [
    'I’m Abdullahi, a computer science and engineering student at Ohio State. I build distributed systems and the infrastructure underneath AI: inference gateways, telemetry pipelines, and the tools that show what is actually happening inside them.',
    'I work in phases, write down the decisions, and benchmark before I claim anything. Every number on this page comes from a test in the repo, with the conditions it was measured under.',
    'When I needed help with my own job search, I built that too: a pipeline that pulls internship postings from four sources into one Discord channel.',
  ],
  now: [
    { name: 'Agent Black Box', text: 'Heading toward evaluations, approvals and multi-agent tracing.' },
    { name: 'ServerFlow', text: 'Real vLLM workers next, once a GPU is in the loop.' },
  ],
  toolbox: ['Go', 'Python', 'TypeScript', 'Java', 'C', 'SQL', 'PostgreSQL', 'Redis', 'FastAPI', 'React', 'Next.js', 'Docker'],
  photo: { src: '/abdullahi-portrait.jpg', alt: 'Abdullahi Mohamed, arms crossed, in front of an orange backdrop' },
}

// From the resume. Phone number and citizenship intentionally left off the public site.
export const resume = {
  education: {
    school: 'The Ohio State University',
    degree: 'B.S. Computer Science and Engineering',
    when: 'Expected May 2027',
    details: ['GPA 3.6', 'Dean’s List', 'STEP Program'],
  },
  experience: [
    {
      role: 'Machine Learning Research Assistant',
      org: 'Ohio State, Department of Biomedical Informatics',
      when: 'Jan – Mar 2025',
      text: 'Predictive models on electronic health record data to flag early signs of chronic conditions. Feature engineering in Pandas and NumPy, classifiers in scikit-learn, AUC-ROC up 18%, plus bias evaluation across demographic groups.',
    },
    {
      role: 'Technology Intern',
      org: 'Advantage HealthCare',
      when: 'Aug – Dec 2024',
      text: 'Ran IT infrastructure and networks under HIPAA, built automated backup and disaster recovery, and integrated EHR software across platforms.',
    },
    {
      role: 'Software Development Intern',
      org: 'Bulsho Trust Research',
      when: 'Jun – Aug 2024',
      text: 'Wrote unit and integration test suites for research software and worked with researchers to track down and fix critical bugs.',
    },
  ],
  leadership: [
    { role: 'Career Prep Fellow', org: 'Management Leadership for Tomorrow', when: '2025 – present' },
    { role: 'IT Chair', org: 'Somali Students’ Association', when: '2024 – present' },
  ],
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
