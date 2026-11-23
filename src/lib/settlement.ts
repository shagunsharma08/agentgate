export type Decision = 'borrow' | 'wait' | 'partial';
export type Permission = 'green' | 'red' | 'amber';
export interface TimelineEvent {
  time: string;
  description: string;
  permission: Permission;
  tag: string;
  detail?: string;
  policyNote?: string;
  milestone?: 'settlement-confirmed' | 'case-closed';
}

export const settlementFacts = { totalShares: 10000, availableShares: 8000, deadlineMinutes: 174, incomingMinutes: 144, alertBeforeDeadlineMinutes: 30 };

export const initialEvents: TimelineEvent[] = [
  { time: '09:02', description: 'Detected failed trade in settlement report', permission: 'green', tag: 'Done alone' },
  { time: '09:03', description: 'Classified fail type: seller short of securities', permission: 'green', tag: 'Done alone' },
  { time: '09:05', description: 'Researched cause: broker awaiting shares from another trade', permission: 'green', tag: 'Done alone' },
  { time: '09:06', description: 'Fix requires borrowing or moving shares', permission: 'red', tag: 'Human only', detail: 'Case escalated to analyst' },
];

export function resolveDecision(decision: Decision) {
  const outcomes: Record<Decision, { events: TimelineEvent[]; closed: boolean; settledShares: number }> = {
    borrow: { closed: true, settledShares: 10000, events: [
      { time: '09:07', description: 'Analyst arranging share borrow', permission: 'red', tag: 'Human only' },
      { time: '10:40', description: 'Borrowed shares received – agent monitoring', permission: 'green', tag: 'Done alone' },
      { time: '10:45', description: 'Settlement confirmed by depository, records reconciled', permission: 'green', tag: 'Done alone', milestone: 'settlement-confirmed' },
      { time: '10:46', description: 'Case closed and documented', permission: 'green', tag: 'Done alone', milestone: 'case-closed', policyNote: 'Closed only after confirmation – per agent policy' },
    ] },
    wait: { closed: false, settledShares: 0, events: [
      { time: '09:07', description: 'Agent monitoring incoming shares', permission: 'green', tag: 'Done alone' },
      { time: '11:30', description: 'Alert will fire if shares not received 30 min before deadline', permission: 'amber', tag: 'Alert scheduled' },
    ] },
    partial: { closed: false, settledShares: 8000, events: [
      { time: '09:07', description: '8,000 shares settled', permission: 'green', tag: 'Done alone' },
      { time: '09:08', description: '2,000 shares still open – agent monitoring', permission: 'green', tag: 'Done alone' },
      { time: '09:08', description: 'Case cannot close until all shares settle', permission: 'red', tag: 'Human only' },
    ] },
  };
  return outcomes[decision];
}