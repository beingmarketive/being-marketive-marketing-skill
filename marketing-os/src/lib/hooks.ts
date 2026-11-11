import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db } from '../db/db';
import type { Project, Task } from '../types';
import { today } from './dates';

export function useProjects(includeArchived = false): Project[] {
  return (
    useLiveQuery(async () => {
      const all = await db.projects.orderBy('createdAt').toArray();
      return includeArchived ? all : all.filter((p) => !p.archived);
    }, [includeArchived]) ?? []
  );
}

export function useProjectMap(): Record<string, Project> {
  const ps = useProjects(true);
  return Object.fromEntries(ps.map((p) => [p.id, p]));
}

export function useOpenTasks(): Task[] | undefined {
  return useLiveQuery(() => db.tasks.where('status').equals('todo').toArray(), []);
}

export function useDoneOn(date: string): Task[] {
  return (
    useLiveQuery(() => {
      const start = new Date(date + 'T00:00:00').getTime();
      return db.tasks.where('doneAt').between(start, start + 86400000).toArray();
    }, [date]) ?? []
  );
}

/** Re-renders when the calendar day changes (app left open overnight / resumed). */
export function useToday(): string {
  const [t, setT] = useState(today());
  useEffect(() => {
    const check = () => setT(today());
    const iv = window.setInterval(check, 60000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(iv);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return t;
}

export function sortTasks(a: Task, b: Task): number {
  if (a.due !== b.due) return a.due < b.due ? -1 : 1;
  if (a.priority !== b.priority) return a.priority - b.priority;
  const at = a.dueTime ?? '99', bt = b.dueTime ?? '99';
  if (at !== bt) return at < bt ? -1 : 1;
  return a.createdAt - b.createdAt;
}

/** Scores a task for the "Next Up" focus card. */
export function focusScore(t: Task, T: string): number {
  let s = 0;
  if (t.due < T) s += 1000 + Math.min(30, (new Date(T).getTime() - new Date(t.due).getTime()) / 86400000) * 5;
  else if (t.due === T) s += 500;
  s += (4 - t.priority) * 120;
  if (t.dueTime) {
    const [h, m] = t.dueTime.split(':').map(Number);
    const mins = h * 60 + m - (new Date().getHours() * 60 + new Date().getMinutes());
    if (mins <= 60) s += 150;
  }
  if (t.chain) s += 40; // finish what you started
  s -= Math.min(60, t.estMinutes) * 0.5; // quick wins first on ties
  return s;
}
