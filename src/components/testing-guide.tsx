import { ExternalLink, ListChecks } from 'lucide-react';

const GOVERNANCE_TESTS_URL = 'https://github.com/shagunsharma08/agentgate/blob/main/src/test/settlement.test.ts';

const checks = [
  {
    action: 'Reset, then choose Partial settlement',
    expected: '8,000 shares settle, 2,000 remain open, and the case must not close.',
  },
  {
    action: 'Reset, then choose Borrow shares',
    expected: 'The timeline must show Settlement confirmed before Case closed and documented.',
  },
  {
    action: 'Reset and inspect the initial timeline',
    expected: 'The agent pauses at the red authority boundary; no red-level execution occurs until a human chooses an action.',
  },
];

export function TestingGuide() {
  return (
    <section className="testing-guide" aria-labelledby="testing-guide-heading">
      <div className="testing-guide-head">
        <span className="testing-guide-icon" aria-hidden="true">
          <ListChecks size={14} />
        </span>
        <h2 id="testing-guide-heading" className="section-heading">How to test this</h2>
      </div>
      <p className="testing-guide-lead">This scripted demo tests governance logic, not live AI performance.</p>
      <ol className="testing-guide-list" role="list">
        {checks.map(check => (
          <li key={check.action}>
            <span className="testing-guide-action">{check.action}</span>
            <span className="testing-guide-expected">Expected: {check.expected}</span>
          </li>
        ))}
      </ol>
      <p className="testing-guide-note">The initial red entry describes a blocked action, not an action the agent performed.</p>
      <div className="testing-guide-footer">
        <a className="testing-guide-link" href={GOVERNANCE_TESTS_URL} target="_blank" rel="noreferrer">
          View automated governance tests
          <ExternalLink size={11} aria-hidden="true" />
        </a>
        <span className="testing-guide-run">
          <code>npm test</code> runs these checks.
        </span>
      </div>
    </section>
  );
}
