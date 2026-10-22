// Copy and facts for the case study page. Figures were measured on 2026-10-22 from the repository.
export const GH = 'https://github.com/abdullahimohamed101/agent-black-box'
export const LINKEDIN = 'https://www.linkedin.com/in/the-abdullahi-mohamed/'

export const summary =
  'Agent Black Box is a flight recorder for AI agents. It records every model call, tool call, file edit, shell command, retry and approval as a typed event, keeps those events unchanged, and shows you the exact step where a run went wrong. You run it yourself with Docker Compose and PostgreSQL.'

export const transcript = [
  ['The Runs list', 'The cursor opens a failed run, “Answer ticket: invoice shows wrong VAT”. A red line draws on its timeline.'],
  ['One sentence on where it broke', 'The run page says: “Failed at step 6 after 17 s: lookup-ticket, ConnectionTimeout.” Under it: 2 retries, 40 s and $0.0410 spent after the first error, $0.0686 in total.'],
  ['The first error', 'On the timeline one red line crosses the rows and is labelled “First error”. Pressing e opens the failed tool call in the inspector, where “What went wrong” reads ConnectionTimeout.'],
  ['Model calls and retries', 'Each model call row shows its tokens and cost. A retry shows as a retry row, not as a log line.'],
  ['Findings', 'The Findings tab lists critical findings from deterministic detectors. “Show evidence” jumps to the exact rows each one came from.'],
  ['Many agents, one run', 'In “Ship feature: multi-agent” the Waterfall shows five agents in lanes. The thick edge is the critical path.'],
  ['A person decides', 'In Review, one request is Waiting: capability github.push, risk class R2, its arguments, and Approve and Deny buttons. Neither is clicked.'],
  ['What it cost', 'Analytics, Cost: $1.25 spent over seven days, $0.10 per run and $0.13 per successful run, with the money wasted on failed runs, retries and spend after errors.'],
  ['Security findings', 'In Review, Security findings: a destructive command, a risky git operation and a secret file read, each with the rule that flagged it.'],
]

export const shots = [
  {
    id: 'failed-run-story',
    title: 'A failed run, in one sentence',
    what: 'A run page for a support agent that failed: the headline says where it broke, the timeline marks the first error, and the inspector shows the failed tool call.',
    alt: 'Run page titled “Answer ticket: invoice shows wrong VAT”. The headline reads “Failed at step 6 after 17 s: lookup-ticket, ConnectionTimeout.” The timeline marks the first error and the inspector shows the failed tool call.',
  },
  {
    id: 'waterfall-multi-agent',
    title: 'Five agents, one picture',
    what: 'The Waterfall tab of a multi-agent run: one lane per agent, the critical path as the thick edge, and the point where one agent hit an error.',
    alt: 'Waterfall for the run “Ship feature: multi-agent” with lanes for planner, coder, researcher, tester and reviewer, the critical path marked and a red line at the first error in the researcher lane.',
  },
  {
    id: 'runs-list',
    title: 'Every run, with what needs attention',
    what: 'The Runs list: twelve demo runs over seven days with status, agent, duration, cost and findings, so failed runs and a pending approval stand out.',
    alt: 'Runs list showing twelve runs with status, agent, duration, cost and findings. Three runs failed, one is awaiting approval, and filters sit on the left.',
  },
  {
    id: 'cost-analytics',
    title: 'What the week cost',
    what: 'Analytics, Cost: total spend, how much of it was wasted on failed runs and retries, and spend broken down by day, agent and model.',
    alt: 'Analytics Cost tab: “$1.25 spent in the last 7 days, $0.10 per run and $0.13 per successful run”, a wasted-spend breakdown, a daily spend chart and spend by agent and by model.',
  },
  {
    id: 'findings',
    title: 'Findings with their evidence',
    what: 'The Findings tab for the failed run: two critical findings and one warning from the detectors, each with a Show evidence button that jumps to the events behind it.',
    alt: 'Findings tab for the failed support run listing two critical findings and one warning, each with a Show evidence button.',
  },
  {
    id: 'policy-approval',
    title: 'Approval before a risky action',
    what: 'The Review page: a coding agent asked to run github.push on origin main, which a policy holds until an admin approves or denies it.',
    alt: 'Review page with one waiting request for github.push on origin main, risk class R2, its arguments, an optional comment box and Approve and Deny buttons.',
  },
]

export const features = [
  ['Live trace streaming', 'Events appear in the dashboard as the agent produces them.'],
  ['Run replay', 'Step through a finished run in order and see what the agent saw.'],
  ['Multi-agent waterfall', 'One lane per agent, with the critical path and any span that never reported an end.'],
  ['Cost and latency analytics', 'Spend per run, agent and model, and how much went to failures and retries.'],
  ['Automatic findings', 'Deterministic detectors for failure chains, retry storms, loops, repeated requests, context growth and cost spikes.'],
  ['Evaluations and experiments', 'Compare two runs step by step and see where they diverged.'],
  ['Policy and approvals', 'Hold a risky action, such as a force-push, until a person approves that one action, once.'],
  ['Redaction', 'Sensitive payloads are redacted before export, and capturing them is opt-in.'],
  ['Invitation-only sign-in', 'People get in by invitation; there is no open sign-up.'],
  ['Workspace isolation', 'Every query carries a workspace, so one team never reads another’s runs.'],
  ['OpenTelemetry mapping', 'OpenTelemetry data is translated at the edge into the project’s own event types.'],
  ['Adapters', 'OpenAI, Anthropic, LangGraph and MCP.'],
  ['A Python SDK that stays out of the way', 'No runtime dependencies, bounded buffers and bounded retries, and a failure in the recorder cannot crash the agent it watches.'],
]

export const pipeline = [
  ['Python SDK', 'Records events inside the agent. No runtime dependencies.'],
  ['FastAPI ingestion', 'Validates events and accepts each one exactly once, even if it is sent twice.'],
  ['PostgreSQL', 'Stores the immutable events. Summaries and costs are rebuilt from them.'],
  ['Workers', 'Compute findings, analytics and evaluations in the background.'],
  ['Next.js dashboard', 'Live traces, replay, waterfall, analytics and approvals.'],
]

export const stats = [
  { value: '~260,000', label: 'lines of code' },
  { value: '4,357', label: 'API tests, plus SDK, web and end-to-end suites' },
  { value: '1,098', label: 'commits' },
  { value: '73', label: 'merged pull requests' },
  { value: '71', label: 'architecture decision records' },
]

export const stack = [
  'Python',
  'FastAPI',
  'SQLAlchemy',
  'PostgreSQL',
  'TypeScript',
  'Next.js',
  'React',
  'OpenTelemetry',
  'Prometheus',
  'Docker',
  'Caddy',
  'GitHub Actions',
  'Playwright',
  'pytest',
]
