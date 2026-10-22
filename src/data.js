const GH = 'https://github.com/abdullahimohamed101'

export const profile = {
  name: 'Abdullahi Mohamed',
  tagline: 'I build distributed systems and infrastructure for AI.',
  photo: { src: '/abdullahi.jpg', alt: 'Portrait of Abdullahi Mohamed' },
  currently: 'Former SWE Intern at Intuit · Ohio State CS',
  github: GH,
  linkedin: 'https://www.linkedin.com/in/the-abdullahi-mohamed/',
}

export const intro = [
  { t: 'I’m Abdullahi, a CS student at Ohio State. I take photos when I travel and build distributed systems and AI infrastructure when I don’t. Both come down to the same thing: seeing what really happened, and why.' },
]

export const about = {
  headline: 'Systems you can measure.',
  paragraphs: [
    'I like the layer most people never see: the routers, queues, pipelines and telemetry that decide whether a system is fast, reliable and debuggable.',
    'I work in phases, write down the decisions, and benchmark before I claim anything. Every number in the project sections above comes from a test in the repo, with the conditions it was measured under.',
    'Outside of class I founded the Ohio State chapter of Minorities in Technology, where we run weekly technical workshops.',
  ],
  now: [
    { name: 'Agent Black Box', text: 'Heading toward evaluations, approvals and multi-agent tracing.' },
    { name: 'ServerFlow', text: 'Real vLLM workers next, once a GPU is in the loop.' },
  ],
  offClock: {
    title: 'Photography & travel.',
    text: 'Away from the keyboard I’m usually behind a camera or planning the next trip. It’s how I reset.',
  },
  toolbox: ['Go', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes', 'Docker', 'AWS', 'Azure', 'PyTorch', 'vLLM', 'CUDA', 'LangGraph'],
  photo: { src: '/abdullahi-portrait.jpg', alt: 'Abdullahi Mohamed, arms crossed, in front of an orange backdrop' },
}

// From the resume. Phone, email, citizenship and graduation date intentionally left off the public site.
export const resume = {
  education: {
    school: 'The Ohio State University',
    degree: 'B.S. Computer Science, Minor in Applied Mathematics',
    details: ['GPA 3.8'],
    coursework: 'Distributed Systems · Operating Systems · Database Systems · Computer Networking · Computer Architecture · Data Structures and Algorithms · Applied Machine Learning',
  },
  experience: [
    {
      role: 'Software Engineer Intern',
      org: 'Intuit · Mountain View, CA',
      co: 'Intuit',
      when: 'May – Aug 2026',
      text: 'Built an agentic AI platform that triages production incidents: automated diagnostics and routing across production microservices, a RAG pipeline over internal service runbooks, and a self-service portal for onboarding new services.',
      impact: [
        { v: '90%', l: 'less manual incident triage' },
        { v: '25+', l: 'production microservices covered' },
        { v: '200+', l: 'engineering hours saved weekly' },
        { v: '50+', l: 'service runbooks indexed for RAG' },
      ],
      tech: ['LangGraph', 'FastAPI', 'Kubernetes', 'RAG', 'PagerDuty', 'Splunk'],
    },
    {
      role: 'Software Engineer Research Assistant',
      org: 'The Ohio State University',
      co: 'Ohio State',
      when: 'Aug 2025 – Apr 2026',
      text: 'A concurrent pipeline for medical imaging data, a benchmarking framework for 3D CNNs and Vision Transformers on vertebral fracture prediction, and containerized distributed training on lab GPU clusters.',
      impact: [
        { v: '120K+', l: 'DICOM imaging slices processed' },
        { v: '+15%', l: 'accuracy over published baselines' },
        { v: '40%', l: 'faster model training' },
      ],
      tech: ['Python', 'PyTorch', 'Docker', 'GPU clusters'],
    },
  ],
  leadership: [
    {
      role: 'Chapter Founder & President',
      org: 'Minorities in Technology at Ohio State',
      when: 'Aug 2025 – present',
      text: 'Weekly technical workshops and recruiting partnerships with Microsoft, Google and LinkedIn.',
    },
  ],
}

export const footnote =
  'Benchmarks measured on one laptop (Apple M5 Pro); regression baselines from the repos, not capacity claims.'

export const featured = [
  {
    id: 'agent-black-box',
    name: 'Agent Black Box',
    tagline: 'See everything your agent did.',
    meta: 'Python · FastAPI · PostgreSQL · Next.js · TypeScript',
    body:
      'A flight recorder for AI agents. Every model call, tool call, file edit, shell command, retry and failure, with cost and latency attached, streamed live.',
    repo: `${GH}/agent-black-box`,
    caseStudy: '/agent-black-box/',
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
    // Next phases from docs/IMPLEMENTATION_PLAN.md (9-14); not built yet, so labelled as such.
    roadmap: [
      { title: 'Multi-agent tracing', text: 'Distributed traces across cooperating agents, shown as one waterfall.' },
      { title: 'Evaluations and replay', text: 'Reliability insights, experiments, run-to-run comparison and visual replay.' },
      { title: 'Policy and approvals', text: 'A policy engine with human approval gates, plus redaction for sensitive data.' },
    ],
    image: { src: '/agent-black-box.jpg', alt: 'Agent Black Box run view: a coding agent fails a test, retries and passes' },
  },
  {
    id: 'serverflow',
    name: 'ServerFlow',
    tagline: 'Route every token.',
    meta: 'Go · PostgreSQL · vLLM · Docker',
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
    // End-goal architecture from the README's phase plan; not built yet, so labelled as such.
    roadmap: [
      { title: 'Kubernetes', text: 'Autoscaled vLLM GPU workers, placed by model availability.' },
      { title: 'Redis + Kafka', text: 'Shared state for zero-downtime failover and a real-time event and latency stream.' },
      { title: 'Workload-aware scheduling', text: 'Routing on live KV-cache load and queue depth, with fair sharing across tenants.' },
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
    id: 'motionman',
    name: 'MotionMan',
    text: 'A multi-threaded C++ object-tracking engine on RT-DETR and ByteTrack: 40+ FPS across 25+ streams, with FP16 TensorRT engines cutting inference latency 45%.',
    stack: 'C++ · CUDA · TensorRT · OpenCV',
  },
  {
    id: 'buckeyeplanner',
    name: 'BuckeyePlanner',
    text: 'A Spring Boot degree-audit engine for Ohio State students that validates prerequisites across 200+ programs with graph traversal.',
    stack: 'Java · Spring Boot · PostgreSQL · Docker · AWS EKS',
  },
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
