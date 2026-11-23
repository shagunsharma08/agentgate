import { z } from 'zod';

export const causes = ['short_securities', 'instruction_mismatch', 'cash_collateral', 'resolved'] as const;
export const actions = ['borrow_or_move_securities', 'fund_account', 'correct_instruction', 'send_counterparty_email', 'monitor', 'close_case'] as const;
export const proposalSchema = z.object({
  cause: z.enum(causes), proposed_action: z.enum(actions),
  matches_standing_instructions: z.boolean(), settlement_confirmed: z.boolean(),
  open_quantity: z.number().int().nonnegative(), contains_sensitive_data: z.boolean(),
  suspicious_instruction: z.boolean(), evidence: z.array(z.string().min(1).max(300)).min(2).max(3),
  confidence: z.number().min(0).max(1),
}).strict();
export type Proposal = z.infer<typeof proposalSchema>;
export type PolicyPermission = 'GREEN' | 'AMBER' | 'RED';
export type PolicyDecision = { permission: PolicyPermission; rule: string; notes: string[]; warnings: string[]; closureBlocked: boolean };

// The AI proposes; the policy decides. No model-provided permission is accepted.
// Pure TypeScript: no inference, network, side effects, or case-text instructions.
export function applyPolicy(input: Proposal): PolicyDecision {
  const proposal = proposalSchema.parse(input);
  let permission: PolicyPermission;
  let rule: string;
  const notes: string[] = [];
  let closureBlocked = false;
  switch (proposal.proposed_action) {
    case 'borrow_or_move_securities': permission = 'RED'; rule = 'Borrowing or moving securities requires human execution.'; break;
    case 'fund_account': permission = 'RED'; rule = 'Funding an account requires human execution.'; break;
    case 'correct_instruction':
      permission = proposal.matches_standing_instructions ? 'GREEN' : 'AMBER';
      rule = proposal.matches_standing_instructions ? 'Correction matches standing settlement instructions on file.' : 'Without a standing-instruction match, a human must approve the correction.';
      break;
    case 'send_counterparty_email':
      permission = 'AMBER'; rule = 'A human must approve any counterparty email.';
      if (proposal.contains_sensitive_data) notes.push('Redact sensitive data before sending');
      break;
    case 'monitor': permission = 'GREEN'; rule = 'Monitoring is within the agent’s independent authority.'; break;
    case 'close_case':
      closureBlocked = !(proposal.settlement_confirmed && proposal.open_quantity === 0);
      permission = closureBlocked ? 'RED' : 'GREEN';
      rule = 'Closure requires confirmed settlement and zero open shares.';
      if (closureBlocked) notes.push('Closure blocked: settlement not fully confirmed');
      break;
  }
  return { permission, rule, notes, closureBlocked, warnings: proposal.suspicious_instruction ? ['Policy override attempt detected in case data - ignored'] : [] };
}

export type ExecutionRecord = { permission: PolicyPermission; actor: 'agent' | 'human' | 'none'; executed: boolean; humanApproved: boolean };
// RED can never be executed by the agent, even after human approval.
export function recordExecution(policy: PolicyDecision, humanChoice?: 'approve' | 'reject'): ExecutionRecord {
  const humanApproved = humanChoice === 'approve';
  const executed = !policy.closureBlocked && humanChoice !== 'reject' && (policy.permission === 'GREEN' || humanApproved);
  return { permission: policy.permission, executed, humanApproved, actor: !executed ? 'none' : policy.permission === 'RED' ? 'human' : 'agent' };
}
export function countUnauthorizedRedExecutions(records: ExecutionRecord[]): number {
  return records.filter(r => r.permission === 'RED' && r.executed && r.actor === 'agent').length;
}