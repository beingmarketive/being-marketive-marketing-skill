import type { Recurrence } from '../types';
import { addDays, daysInMonth, diffDays, fromISO, weekday, WEEKDAY_SHORT } from './dates';

/** Does `rec` (anchored at `anchor`, the series' first due date) occur on `date`? */
export function occursOn(rec: Recurrence, date: string, anchor: string): boolean {
  switch (rec.type) {
    case 'daily':
      return true;
    case 'weekly':
      return rec.days.length === 0 ? weekday(date) === weekday(anchor) : rec.days.includes(weekday(date));
    case 'monthly': {
      const d = fromISO(date);
      const dim = daysInMonth(d.getFullYear(), d.getMonth());
      return d.getDate() === Math.min(rec.dayOfMonth, dim);
    }
    case 'custom': {
      const n = Math.max(1, rec.everyDays);
      const diff = diffDays(date, anchor);
      return ((diff % n) + n) % n === 0;
    }
  }
}

/** First occurrence on or after `from`. */
export function firstOnOrAfter(rec: Recurrence, from: string, anchor: string): string {
  let d = from;
  for (let i = 0; i < 400; i++) {
    if (occursOn(rec, d, anchor)) return d;
    d = addDays(d, 1);
  }
  return from;
}

/** First occurrence strictly after `after`. */
export function nextAfter(rec: Recurrence, after: string, anchor: string): string {
  return firstOnOrAfter(rec, addDays(after, 1), anchor);
}

/** All occurrences in [from, to) — capped to keep things cheap. */
export function occurrencesBetween(rec: Recurrence, from: string, to: string, anchor: string, cap = 60): string[] {
  const out: string[] = [];
  let d = from;
  while (d < to && out.length < cap) {
    if (occursOn(rec, d, anchor)) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

/** Latest occurrence strictly before `before` and >= `floor`, or null. */
export function latestBefore(rec: Recurrence, before: string, floor: string, anchor: string): string | null {
  let d = addDays(before, -1);
  for (let i = 0; i < 400 && d >= floor; i++) {
    if (occursOn(rec, d, anchor)) return d;
    d = addDays(d, -1);
  }
  return null;
}

export function describeRecurrence(rec?: Recurrence): string {
  if (!rec) return 'Once';
  switch (rec.type) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      if (rec.days.length === 7) return 'Daily';
      if (rec.days.length === 5 && [1, 2, 3, 4, 5].every((d) => rec.days.includes(d))) return 'Mon–Fri';
      return 'Weekly · ' + [...rec.days].sort().map((d) => WEEKDAY_SHORT[d]).join(', ');
    case 'monthly':
      return `Monthly · day ${rec.dayOfMonth}`;
    case 'custom':
      return `Every ${rec.everyDays} days`;
  }
}
