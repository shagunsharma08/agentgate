# AgentGate

**The Agent That Knows When to Stop**

An independent product concept for governing AI agents in post-trade settlement. Built by Shagun Sharma with Lovable, Perplexity, and Google Sheets, November 2026.

- [Live prototype](https://agent-gate-demo.lovable.app/)
- [Portfolio case study](https://shagunsharma08.github.io/agentgate_casestudy.html)
- [Portfolio](https://shagunsharma08.github.io/)

## The concept

AgentGate lets an agent detect, classify, and research a failed trade, then pauses at a policy-defined authority limit. The operations analyst sees three decision facts and chooses Borrow, Wait, or Partial settlement. The agent follows a different governed path for each choice. A case cannot close while settlement remains unresolved.

**Human authority. Agent accountability.**

The fictional scenario concerns Northbridge Capital buying 10,000 GOOGL shares from Halden Securities. At escalation, the settlement deadline is 2h 54m away, incoming shares are expected in 2h 24m, and 8,000 of 10,000 shares are available. These are fixed demo scenarios, not real trade execution or live AI inference.

## Source and structure

### Live AI extension

The **Guided demo** remains scripted. **Case library** sends fictional case descriptions to a server-only AI gateway for structured proposals. A separate TypeScript policy assigns permissions: **the AI proposes; the policy decides**. **Evaluate** runs eight synthetic cases against known answers, with results calculated from that run rather than hard-coded scores.

Model-extracted facts and proposed actions can be wrong, so deterministic permission rules alone do not establish safety. All execution is simulated; no trades, transfers, or emails are sent. Production use would require independent evidence validation and practitioner review. Do not submit confidential client or trade data.

Live inference requires the managed Lovable Cloud gateway configuration; local tests do not require an AI credential. Keep private environment configuration out of Git.

This repository includes the actual application source exported from the Lovable project, plus the portfolio case study, analysis extract, and permission-policy document.

- `src/routes/index.tsx`: React settlement review screen.
- `src/lib/settlement.ts`: pure permission and decision-outcome logic.
- `src/test/settlement.test.ts`: governance rules and closure checks.
- `src/lib/policy.ts`: validated proposal contract, deterministic permissions, and simulated execution gates.
- `src/lib/agent.functions.ts`: server-only AI proposal endpoint.
- `src/lib/cases.ts`: eight fictional benchmark cases and expected answers.
- `src/test/policy.test.ts`: policy and execution-boundary regression tests.
- `docs/case-study.html`: standalone case study matching the portfolio.
- `permission-policy.csv`: action-level permission design.
- `data/ftd-2026-10-30-top10.csv`: the October 30 top-10 analysis extract, including quantities, prices, and recomputed dollar estimates.
- `scripts/extract-ftd-top10.py`: reproduces the ranking from an SEC pipe-delimited file or saved analysis-sheet CSV.

## Development

```sh
git clone https://github.com/shagunsharma08/agentgate.git
cd agentgate
npm install
npm run dev
```

```sh
npm test
npm run build
```

The exported project uses TanStack Start, TypeScript, React, Tailwind CSS, and Lucide icons. The original Lovable `bun.lock` is included.

## Evidence and limits

Market context comes from my analysis of the SEC's second-half October 2026 Fails-to-Deliver file. The [October 30 top-10 analysis extract is included](data/ftd-2026-10-30-top10.csv). Each estimate is recomputed as reported fail quantity multiplied by the dataset price, using decimal arithmetic rather than the sheet's rounded display values.

The extract was reproduced from the saved analysis sheet. Original imported CUSIP values are preserved in `cusip_as_imported`; damaged identifiers are flagged rather than silently repaired. Import this column as text. A nine-character value is not a completed CUSIP validation.

To reproduce the extract from a downloaded SEC text file or saved CSV:

```sh
python scripts/extract-ftd-top10.py path/to/cnsfails202610b.txt
```

SEC figures are aggregate outstanding fail balances, not daily new failures. Quantity times the dataset's price field is an estimate, not a loss calculation or evidence of a particular cause. Success metrics are proposed hypotheses, not measured product results.

## How to test the governance logic

The Guided demo tests scripted governance logic, not live AI performance. Reset between checks:

1. Choose **Partial settlement**: 8,000 shares settle, 2,000 stay open, and the case does not close.
2. Choose **Borrow shares**: the timeline records settlement confirmation before case closure.
3. Inspect the initial timeline: the agent pauses at the red authority boundary. The initial red entry describes a blocked action, not a completed execution. Red-level execution follows a human decision.

The [automated governance tests](src/test/settlement.test.ts) cover the permission boundary, timing buffer, and closure rules. Run `npm test` locally.

## Sources

- [AWS DTCC case study](https://aws.amazon.com/solutions/case-studies/dtcc-case-study/)
- [DTCC Defines Its AI Play](https://www.dtcc.com/insights/2025/dtcc-defines-its-ai-play)
- [DTCC's 2026 leadership outlook](https://www.dtcc.com/insights/2026/dtcc-leaders-on-2025-highlights)
- [SEC Fails-to-Deliver Data](https://www.sec.gov/data-research/sec-markets-data/fails-deliver-data)

## Disclaimer

Independent concept inspired by DTCC's public AI journey. Not affiliated with or endorsed by DTCC. Firms and the trade in the demo are fictional. No DTCC logos or branding are used. This is a product-design concept, not production settlement infrastructure or financial advice.
