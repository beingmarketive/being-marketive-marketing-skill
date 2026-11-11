import { db } from '../db/db';
import { addDays, today } from './dates';

export interface Health {
  score: number;
  total: number;
  ontime: number;
  late: number;
  missed: number;
}

/**
 * Project health = on-time % of recurring task occurrences due in the last 14 days.
 * "ontime" = completed on/before due date; "late" = completed after; "missed" = skipped by rollover.
 * Open overdue recurring instances also count as not-on-time.
 */
export async function healthScores(days = 14): Promise<Record<string, Health>> {
  const T = today();
  const from = addDays(T, -days);
  const rows = await db.history.where('due').between(from, T, true, false).toArray();
  const overdue = await db.tasks.where('[status+due]').between(['todo', from], ['todo', T], true, false).filter((t) => !!t.seriesId).toArray();
  const out: Record<string, Health> = {};
  const bump = (pid: string | null, k: 'ontime' | 'late' | 'missed') => {
    const key = pid ?? '_personal';
    const h = (out[key] ??= { score: 0, total: 0, ontime: 0, late: 0, missed: 0 });
    h[k]++;
    h.total++;
  };
  for (const r of rows) bump(r.projectId, r.status);
  for (const t of overdue) bump(t.projectId, 'missed');
  for (const h of Object.values(out)) h.score = h.total ? Math.round((h.ontime / h.total) * 100) : 100;
  return out;
}
