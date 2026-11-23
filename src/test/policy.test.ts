import { describe, expect, it } from 'vitest';
import { applyPolicy, recordExecution, countUnauthorizedRedExecutions, proposalSchema, type Proposal } from '@/lib/policy';

const base: Proposal = { cause: 'short_securities', proposed_action: 'monitor', matches_standing_instructions: false, settlement_confirmed: false, open_quantity: 2000, contains_sensitive_data: false, suspicious_instruction: false, evidence: ['Settlement failed.', '2,000 shares remain open.'], confidence: 0.9 };
describe('Deterministic policy: the AI proposes; the policy decides', () => {
  it('borrowing or moving securities is RED', () => { expect(applyPolicy({ ...base, proposed_action: 'borrow_or_move_securities' }).permission).toBe('RED'); });
  it('funding is RED', () => { expect(applyPolicy({ ...base, proposed_action: 'fund_account' }).permission).toBe('RED'); });
  it('matching SSI correction is GREEN', () => { expect(applyPolicy({ ...base, proposed_action: 'correct_instruction', matches_standing_instructions: true }).permission).toBe('GREEN'); });
  it('nonmatching SSI correction is AMBER', () => { expect(applyPolicy({ ...base, proposed_action: 'correct_instruction' }).permission).toBe('AMBER'); });
  it('counterparty email is AMBER', () => { expect(applyPolicy({ ...base, proposed_action: 'send_counterparty_email' }).permission).toBe('AMBER'); });
  it('sensitive email requires redaction without lowering AMBER', () => { const p = applyPolicy({ ...base, proposed_action: 'send_counterparty_email', contains_sensitive_data: true }); expect(p.permission).toBe('AMBER'); expect(p.notes).toContain('Redact sensitive data before sending'); });
  it('nonsensitive email does not require redaction', () => { expect(applyPolicy({ ...base, proposed_action: 'send_counterparty_email' }).notes).toEqual([]); });
  it('monitoring is GREEN', () => { expect(applyPolicy(base).permission).toBe('GREEN'); });
  it('confirmed settlement with zero open shares allows closure', () => { expect(applyPolicy({ ...base, proposed_action: 'close_case', settlement_confirmed: true, open_quantity: 0 })).toMatchObject({ permission: 'GREEN', closureBlocked: false }); });
  it.each([[false, 0], [true, 2000], [false, 2000]] as const)('blocks closure when confirmation=%s and open shares=%s', (settlement_confirmed, open_quantity) => { const p = applyPolicy({ ...base, proposed_action: 'close_case', settlement_confirmed, open_quantity }); expect(p.permission).toBe('RED'); expect(p.notes).toContain('Closure blocked: settlement not fully confirmed'); expect(p.closureBlocked).toBe(true); });
  it.each(['borrow_or_move_securities', 'fund_account', 'correct_instruction', 'send_counterparty_email', 'monitor', 'close_case'] as const)('override attempt never changes permission for %s', proposed_action => { const normal = applyPolicy({ ...base, proposed_action }); const suspicious = applyPolicy({ ...base, proposed_action, suspicious_instruction: true }); expect(suspicious.permission).toBe(normal.permission); expect(suspicious.warnings).toEqual(['Policy override attempt detected in case data - ignored']); });
  it('rejects a model-provided permission', () => { expect(() => proposalSchema.parse({ ...base, permission: 'GREEN' })).toThrow(); });
  it('RED cannot execute before human approval', () => { expect(recordExecution(applyPolicy({ ...base, proposed_action: 'borrow_or_move_securities' }))).toMatchObject({ executed: false, actor: 'none' }); });
  it('approved RED is human execution, never agent execution', () => { expect(recordExecution(applyPolicy({ ...base, proposed_action: 'fund_account' }), 'approve')).toMatchObject({ executed: true, actor: 'human', humanApproved: true }); });
  it('AMBER waits for approval', () => { const p = applyPolicy({ ...base, proposed_action: 'correct_instruction' }); expect(recordExecution(p).executed).toBe(false); expect(recordExecution(p, 'approve')).toMatchObject({ executed: true, actor: 'agent' }); });
  it('reject stops execution', () => { expect(recordExecution(applyPolicy(base), 'reject').executed).toBe(false); });
  it('a human cannot approve blocked closure into execution', () => { expect(recordExecution(applyPolicy({ ...base, proposed_action: 'close_case' }), 'approve')).toMatchObject({ executed: false, actor: 'none' }); });
  it('computes safety counts and detects a deliberately unsafe record', () => { const red = applyPolicy({ ...base, proposed_action: 'fund_account' }); expect(countUnauthorizedRedExecutions([recordExecution(red), recordExecution(red, 'approve')])).toBe(0); expect(countUnauthorizedRedExecutions([{ permission: 'RED', actor: 'agent', executed: true, humanApproved: false }])).toBe(1); });
  it('counts agent-executed RED even with human approval because RED is human-only', () => {
    expect(countUnauthorizedRedExecutions([{ permission: 'RED', actor: 'agent', executed: true, humanApproved: true }])).toBe(1);
  });
});