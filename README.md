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

This repository includes the actual application source exported from the Lovable project, plus the portfolio case study and permission-policy document. Creating this repository does not automatically configure two-way Lovable synchronization.

- `src/routes/index.tsx`: React settlement review screen.
- `src/lib/settlement.ts`: pure permission and decision-outcome logic.
- `src/test/settlement.test.ts`: governance rules and closure checks.
- `docs/case-study.html`: standalone case study matching the portfolio.
- `permission-policy.csv`: action-level permission design.

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

Market context comes from the author's analysis of the SEC's second-half October 2026 Fails-to-Deliver file. This repository does not include the raw file or analysis workbook. Rounded findings in the case study are author-provided, not independently reproduced here.

SEC figures are aggregate outstanding fail balances, not daily new failures. Quantity times the dataset's price field is an estimate, not a loss calculation or evidence of a particular cause. Success metrics are proposed hypotheses, not measured product results.

## Sources

- [AWS DTCC case study](https://aws.amazon.com/solutions/case-studies/dtcc-case-study/)
- [DTCC Defines Its AI Play](https://www.dtcc.com/insights/2025/dtcc-defines-its-ai-play)
- [DTCC's 2026 leadership outlook](https://www.dtcc.com/insights/2026/dtcc-leaders-on-2025-highlights)
- [SEC Fails-to-Deliver Data](https://www.sec.gov/data-research/sec-markets-data/fails-deliver-data)

## Disclaimer

Independent concept inspired by DTCC's public AI journey. Not affiliated with or endorsed by DTCC. Firms and the trade in the demo are fictional. No DTCC logos or branding are used. This is a product-design concept, not production settlement infrastructure or financial advice.
