import { useState } from 'react';
import { BrainCircuit, ShieldCheck, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { applyPolicy, recordExecution, type PolicyPermission } from '@/lib/policy';
import type { AnalysisResult } from '@/lib/cases';

export const actionLabels = { borrow_or_move_securities: 'Borrow or move securities', fund_account: 'Fund account', correct_instruction: 'Correct instruction', send_counterparty_email: 'Send counterparty email', monitor: 'Monitor', close_case: 'Close case' };
export const causeLabels = { short_securities: 'Short securities', instruction_mismatch: 'Instruction mismatch', cash_collateral: 'Cash / collateral', resolved: 'Resolved' };
export function PolicyBadge({ permission }: { permission: PolicyPermission }) {
  return <span className={`permission-tag ${permission.toLowerCase()}`}>{permission === 'GREEN' ? 'Green · Agent acts alone' : permission === 'AMBER' ? 'Amber · Human approves' : 'Red · Human only'}</span>;
}
export function AgentResult({ result }: { result: AnalysisResult }) {
  const [choice, setChoice] = useState<'approve' | 'reject' | undefined>();
  if (!result.ok) return <p role="alert" className="agent-error">{result.error}</p>;
  const { proposal } = result;
  // Recompute locally too: the display and execution gate never trust a permission field.
  const policy = applyPolicy(proposal);
  const execution = recordExecution(policy, choice);
  return <div className="agent-result" aria-live="polite">
    <div className="result-split"><section><h3 className="section-heading flex items-center gap-2"><BrainCircuit size={16} />AI proposal</h3><dl className="proposal-facts"><div><dt>Cause</dt><dd>{causeLabels[proposal.cause]}</dd></div><div><dt>Next action</dt><dd>{actionLabels[proposal.proposed_action]}</dd></div><div><dt>Confidence</dt><dd>{Math.round(proposal.confidence * 100)}%</dd></div><div><dt>Open shares</dt><dd>{proposal.open_quantity.toLocaleString()}</dd></div><div><dt>Settlement confirmed</dt><dd>{proposal.settlement_confirmed ? 'Yes' : 'No'}</dd></div><div><dt>SSI match</dt><dd>{proposal.matches_standing_instructions ? 'Yes' : 'No'}</dd></div><div><dt>Sensitive data</dt><dd>{proposal.contains_sensitive_data ? 'Detected' : 'Not detected'}</dd></div><div><dt>Override attempt</dt><dd>{proposal.suspicious_instruction ? 'Detected' : 'Not detected'}</dd></div></dl><ul className="evidence-list">{proposal.evidence.map((text, i) => <li key={i}>{text}</li>)}</ul></section>
    <section className="policy-output"><h3 className="section-heading flex items-center gap-2"><ShieldCheck size={16} />Deterministic policy</h3><p className="eyebrow mt-4 mb-2 text-muted-foreground">Rule applied</p><p className="text-xs leading-relaxed">{policy.rule}</p><div className="mt-4"><PolicyBadge permission={policy.permission} /></div>{policy.notes.map(note => <p className="policy-note" key={note}>{note}</p>)}{policy.warnings.map(warning => <p role="alert" className="override-warning" key={warning}>{warning}</p>)}
      {policy.permission === 'GREEN' ? <p className="execution-status text-success"><Check size={14} />Agent executed <span className="text-muted-foreground">· prototype only</span></p> : <div className="mt-5"><div className="flex gap-2"><Button size="sm" disabled={choice !== undefined} onClick={() => setChoice('approve')}><Check size={13} />Approve</Button><Button size="sm" variant="outline" disabled={choice !== undefined} onClick={() => setChoice('reject')}><X size={13} />Reject</Button></div><p className="mt-3 text-xs text-muted-foreground">{choice === 'reject' ? 'Rejected by human. No action taken.' : choice === 'approve' ? policy.closureBlocked ? 'Human review recorded. Closure remains blocked; case stays open.' : execution.actor === 'human' ? 'Approved. Human execution recorded in prototype; agent did not execute.' : 'Approved by human. Agent executed in prototype only.' : 'Paused for human review. No action executed.'}</p></div>}
    </section></div>
  </div>;
}