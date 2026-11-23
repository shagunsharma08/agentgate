import { describe, expect, it } from 'vitest';
import { initialEvents, resolveDecision, settlementFacts } from '@/lib/settlement';

describe('Settlement governance rules', () => {
  it('requires human authority for borrowing or moving shares', () => {
    expect(initialEvents.at(-1)?.permission).toBe('red');
    expect(initialEvents.slice(0, 3).every(event => event.permission === 'green')).toBe(true);
    expect(resolveDecision('borrow').events[0]?.permission).toBe('red');
  });
  it('starts with 8,000 of 10,000 shares available', () => {
    expect(settlementFacts.availableShares).toBe(8000);
    expect(settlementFacts.totalShares).toBe(10000);
  });
  it('has a deadline of 2h 54m from the 09:06 escalation and incoming delivery in 2h 24m', () => {
    expect(settlementFacts.deadlineMinutes).toBe(174);
    expect(settlementFacts.incomingMinutes).toBe(144);
  });
  it('keeps a 30-minute buffer between the incoming delivery and the deadline', () => {
    expect(settlementFacts.deadlineMinutes - settlementFacts.incomingMinutes).toBe(30);
    expect(settlementFacts.alertBeforeDeadlineMinutes).toBe(30);
  });
  it('closes the case after borrowed shares settle the full trade', () => {
    const result = resolveDecision('borrow');
    expect(result.closed).toBe(true);
    expect(result.settledShares).toBe(10000);
    expect(result.events).toHaveLength(4);
    expect(result.events.at(-1)?.permission).toBe('green');
  });
  it('uses realistic borrow milestones at 09:07, 10:40, 10:45, and 10:46', () => {
    expect(resolveDecision('borrow').events.map(event => event.time)).toEqual(['09:07', '10:40', '10:45', '10:46']);
    expect(resolveDecision('borrow').events.map(event => event.permission)).toEqual(['red', 'green', 'green', 'green']);
  });
  it('allows borrow case closure only after settlement confirmation', () => {
    const events = resolveDecision('borrow').events;
    const confirmation = events.findIndex(event => event.milestone === 'settlement-confirmed');
    const closure = events.findIndex(event => event.milestone === 'case-closed');
    expect(confirmation).toBe(2);
    expect(closure).toBe(3);
    expect(closure).toBeGreaterThan(confirmation);
  });
  it('keeps the waiting case open with an alert thirty minutes before the deadline', () => {
    expect(resolveDecision('wait').closed).toBe(false);
    expect(resolveDecision('wait').settledShares).toBe(0);
    expect(settlementFacts.alertBeforeDeadlineMinutes).toBe(30);
    expect(resolveDecision('wait').events.at(-1)?.time).toBe('11:30');
  });
  it('cannot close a partial settlement with 2,000 shares still open', () => {
    const result = resolveDecision('partial');
    expect(result.settledShares).toBe(8000);
    expect(settlementFacts.totalShares - result.settledShares).toBe(2000);
    expect(result.closed).toBe(false);
    expect(result.events.at(-1)?.permission).toBe('red');
  });
});