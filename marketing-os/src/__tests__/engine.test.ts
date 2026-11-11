import { describe, it, expect } from 'vitest';
import { firstOnOrAfter, nextAfter, latestBefore, occurrencesBetween } from '../lib/recurrence';

describe('recurrence', () => {
  const wk = { type: 'weekly' as const, days: [1, 4] }; // Mon, Thu
  it('weekly next', () => {
    expect(firstOnOrAfter(wk, '2026-11-10', '2026-11-10')).toBe('2026-11-12');
    expect(nextAfter(wk, '2026-11-12', '2026-11-10')).toBe('2026-11-16');
  });
  it('monthly clamps', () => {
    expect(firstOnOrAfter({ type: 'monthly', dayOfMonth: 31 }, '2026-11-10', '2026-11-10')).toBe('2026-11-30');
  });
  it('rollover keeps the latest missed', () => {
    const d = { type: 'daily' as const };
    expect(latestBefore(d, '2026-11-10', '2026-11-05', '2026-11-01')).toBe('2026-11-09');
    expect(occurrencesBetween(d, '2026-11-05', '2026-11-09', '2026-11-01')).toHaveLength(4);
  });
  it('custom every N days', () => {
    expect(nextAfter({ type: 'custom', everyDays: 3 }, '2026-11-10', '2026-11-10')).toBe('2026-11-13');
  });
});
