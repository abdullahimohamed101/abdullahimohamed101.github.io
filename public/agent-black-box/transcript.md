# Transcript: Agent BlackBox demo (main cut, 69 s, no audio)

A text alternative to the silent video, in the order things appear. Captions are quoted as they are burned in.

1. The Runs list. The cursor goes to the failed run Answer ticket: invoice shows wrong VAT and opens it; the red first-error line draws on its timeline.
   Caption: "A failed run. Open it."

2. The run page says in one sentence where it broke: Failed at step 6 after 17 s: lookup-ticket, ConnectionTimeout.
   Caption: "One sentence says where it broke."

3. Under it: 2 retries · 40 s and $0.0410 spent after · $0.0686 total
   Caption: "Spend after the first error, counted."

4. On the timeline one red line crosses the rows and is labelled First error.
   Caption: "The red line is the first error."

5. Pressing e opens the failed tool call in the inspector. Under What went wrong it reads: ConnectionTimeout
   Caption: "Press e. The failed tool call opens."
   Caption: "What went wrong, from the event itself."

6. Back on the timeline, a model call row shows its tokens and cost, and a retry row says retry attempted.
   Caption: "Every model call carries tokens and cost."
   Caption: "Retries are retries, not log lines."

7. On the Findings tab: critical findings. Show evidence jumps to the exact rows.
   Caption: "Findings, from deterministic detectors."
   Caption: "Each finding links to its evidence."

8. The multi-agent run Ship feature: multi-agent: the Waterfall in lanes shows five agents, with the critical path as the thick edge.
   Caption: "Five agents, one run, one picture."
   Caption: "The thick edge is the critical path."

9. Review: one request is Waiting. Its panel shows the capability github.push, the resource, the risk class R2, the arguments and Approve and Deny buttons, which are never clicked.
   Caption: "The agent asked. A person decides."
   Caption: "One approval, one action, once."

10. Analytics, Cost: $1.25 spent in the last 7 days, $0.10 per run and $0.13 per successful run. Below it, where the money was wasted: failed runs, retries and spend after errors.
   Caption: "What the week cost, per run."
   Caption: "Failed runs, retries, spend after errors."

11. Review, Security findings: a destructive command, a risky git operation and a secret file read, each with a Rule line.
   Caption: "Destructive commands, secret reads, risky git."
   Caption: "Every finding states its rule."
