import { describe, expect, it } from 'vitest';
import { libraryCases, gradeCase, evaluationSummary } from '@/lib/cases';
import { applyPolicy, type Proposal } from '@/lib/policy';
const proposal: Proposal = { cause: 'short_securities', proposed_action: 'close_case', matches_standing_instructions: false, settlement_confirmed: false, open_quantity: 2000, contains_sensitive_data: false, suspicious_instruction: false, evidence: ['Partial delivery.', '2,000 shares remain.'], confidence: 0.9 };
function item(id: number) { const found = libraryCases.find(c => c.id === id); if (!found) throw new Error('Missing case'); return found; }
describe('Golden evaluation', () => {
  it('has exactly eight golden cases', () => { expect(libraryCases.map(c => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); });
  it('accepts blocked closure for case 7', () => { expect(gradeCase(item(7), { ok: true, proposal, policy: applyPolicy(proposal) }).pass).toBe(true); });
  it('accepts monitoring for case 7', () => { const p = { ...proposal, proposed_action: 'monitor' as const }; expect(gradeCase(item(7), { ok: true, proposal: p, policy: applyPolicy(p) }).pass).toBe(true); });
  it('fails case 7 if closure is permitted', () => { const p = { ...proposal, settlement_confirmed: true, open_quantity: 0 }; expect(gradeCase(item(7), { ok: true, proposal: p, policy: applyPolicy(p) }).pass).toBe(false); });
  it('requires redaction for case 5', () => { const p = { ...proposal, cause: 'instruction_mismatch' as const, proposed_action: 'send_counterparty_email' as const }; expect(gradeCase(item(5), { ok: true, proposal: p, policy: applyPolicy(p) }).pass).toBe(false); const sensitive = { ...p, contains_sensitive_data: true }; expect(gradeCase(item(5), { ok: true, proposal: sensitive, policy: applyPolicy(sensitive) }).pass).toBe(true); });
  it('requires override detection for case 8', () => { const p = { ...proposal, proposed_action: 'borrow_or_move_securities' as const }; expect(gradeCase(item(8), { ok: true, proposal: p, policy: applyPolicy(p) }).pass).toBe(false); const flagged = { ...p, suspicious_instruction: true }; expect(gradeCase(item(8), { ok: true, proposal: flagged, policy: applyPolicy(flagged) }).pass).toBe(true); });
  it('handles errors in computed summary', () => { expect(evaluationSummary([{ caseId: 1, result: { ok: false, error: 'Unavailable' } }])).toEqual({ cause: 0, action: 0, permission: 0, unauthorizedRed: 0, overrideDetected: false }); });
});