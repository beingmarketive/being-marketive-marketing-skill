import { db, getSetting, setSetting } from '../db/db';
import { CHAIN_BY_ID } from '../data/chains';
import type { ChainStepTemplate, Priority, Project, Recurrence, Subtask, Task, TaskSource, TaskTemplate } from '../types';
import { addDays, addHoursToNow, today } from './dates';
import { uid } from './id';
import { firstOnOrAfter, latestBefore, nextAfter, occurrencesBetween } from './recurrence';
import { getIndustry } from '../data/industries';

export interface NewTask {
  title: string;
  projectId?: string | null;
  channel?: Task['channel'];
  due?: string;
  dueTime?: string;
  priority?: Priority;
  estMinutes?: number;
  notes?: string;
  subtasks?: (string | Subtask)[];
  recurrence?: Recurrence;
  startsChain?: string;
  playbookId?: string;
  source?: TaskSource;
  chain?: Task['chain'];
}

export function buildTask(input: NewTask): Task {
  const now = Date.now();
  let due = input.due ?? today();
  let seriesId: string | undefined;
  let anchor: string | undefined;
  if (input.recurrence) {
    // a recurring task always starts on a real occurrence
    if (input.recurrence.type !== 'custom') due = firstOnOrAfter(input.recurrence, due, due);
    seriesId = uid('s_');
    anchor = due;
  }
  return {
    id: uid('t_'),
    title: input.title.trim() || 'Untitled task',
    projectId: input.projectId ?? null,
    channel: input.channel ?? null,
    due,
    dueTime: input.dueTime,
    priority: input.priority ?? 2,
    estMinutes: input.estMinutes ?? 20,
    notes: input.notes ?? '',
    subtasks: (input.subtasks ?? []).map((s) => (typeof s === 'string' ? { id: uid('st_'), text: s, done: false } : s)),
    status: 'todo',
    createdAt: now,
    updatedAt: now,
    recurrence: input.recurrence,
    seriesId,
    anchor,
    startsChain: input.startsChain,
    playbookId: input.playbookId,
    source: input.source ?? 'manual',
    chain: input.chain,
    snoozes: 0
  };
}

export async function addTask(input: NewTask): Promise<Task> {
  const t = buildTask(input);
  await db.tasks.add(t);
  return t;
}

export function fromTemplate(tpl: TaskTemplate, projectId: string | null, extra: Partial<NewTask> = {}): NewTask {
  return {
    title: tpl.title,
    projectId,
    channel: tpl.channel,
    estMinutes: tpl.estMinutes,
    priority: tpl.priority,
    playbookId: tpl.playbookId,
    startsChain: tpl.startsChain,
    subtasks: tpl.subtasks,
    notes: tpl.notes,
    ...extra
  };
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  await db.tasks.update(id, { ...patch, updatedAt: Date.now() });
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id);
}

function chainStepTasks(chainId: string, step: number, parent: Task, runId: string, topic: string): Task[] {
  const chain = CHAIN_BY_ID[chainId];
  if (!chain || step >= chain.steps.length) return [];
  return chain.steps[step].map((tpl: ChainStepTemplate) => {
    let due = addDays(today(), tpl.offsetDays ?? 0);
    let dueTime: string | undefined;
    if (tpl.offsetHours) {
      const at = addHoursToNow(tpl.offsetHours);
      due = at.date;
      dueTime = at.time;
    }
    return buildTask({
      ...fromTemplate({ ...tpl, title: tpl.title.replace('{topic}', topic) }, parent.projectId),
      due,
      dueTime,
      source: 'chain',
      chain: { chainId, step, runId, topic }
    });
  });
}

/** Mark done + run recurring and chain engines. Returns the tasks that were created. */
export async function completeTask(id: string): Promise<Task[]> {
  return db.transaction('rw', db.tasks, db.history, db.days, async () => {
    const t = await db.tasks.get(id);
    if (!t || t.status === 'done') return [];
    const T = today();
    const spawned: Task[] = [];
    let historyId: string | undefined;

    // 1. Recurring: log + create exactly one next instance
    if (t.recurrence && t.seriesId) {
      historyId = uid('h_');
      await db.history.add({
        id: historyId,
        seriesId: t.seriesId,
        projectId: t.projectId,
        title: t.title,
        due: t.due,
        status: t.due >= T ? 'ontime' : 'late',
        at: Date.now()
      });
      const anchor = t.anchor ?? t.due;
      const nextDue = t.due < T ? firstOnOrAfter(t.recurrence, T, anchor) : nextAfter(t.recurrence, t.due, anchor);
      const openSibling = await db.tasks.where('seriesId').equals(t.seriesId).filter((x) => x.status === 'todo' && x.id !== t.id).first();
      if (!openSibling) {
        const now = Date.now();
        spawned.push({
          ...t,
          id: uid('t_'),
          due: nextDue,
          dueTime: undefined,
          status: 'todo',
          doneAt: undefined,
          createdAt: now,
          updatedAt: now,
          subtasks: t.subtasks.map((s) => ({ ...s, done: false })),
          snoozes: 0,
          spawned: undefined,
          historyId: undefined,
          topic: undefined,
          source: 'recurring'
        });
      }
    }

    // 2. Chains
    if (t.chain) {
      const openInStep = await db.tasks
        .where('chain.runId')
        .equals(t.chain.runId)
        .filter((x) => x.status === 'todo' && x.id !== t.id && x.chain?.step === t.chain!.step)
        .count();
      if (openInStep === 0) spawned.push(...chainStepTasks(t.chain.chainId, t.chain.step + 1, t, t.chain.runId, t.chain.topic));
    } else if (t.startsChain) {
      const topic = (t.topic || t.title).trim();
      spawned.push(...chainStepTasks(t.startsChain, 0, t, uid('r_'), topic));
    }

    if (spawned.length) await db.tasks.bulkAdd(spawned);
    await db.tasks.update(id, { status: 'done', doneAt: Date.now(), updatedAt: Date.now(), spawned: spawned.map((s) => s.id), historyId });
    const day = await db.days.get(T);
    await db.days.put({ date: T, done: (day?.done ?? 0) + 1 });
    return spawned;
  });
}

export async function undoComplete(id: string): Promise<void> {
  await db.transaction('rw', db.tasks, db.history, db.days, async () => {
    const t = await db.tasks.get(id);
    if (!t || t.status !== 'done') return;
    if (t.spawned?.length) await db.tasks.bulkDelete(t.spawned);
    if (t.historyId) await db.history.delete(t.historyId);
    const T = today();
    const day = await db.days.get(T);
    if (day) await db.days.put({ date: T, done: Math.max(0, day.done - 1) });
    await db.tasks.update(id, { status: 'todo', doneAt: undefined, spawned: undefined, historyId: undefined, updatedAt: Date.now() });
  });
}

export async function snoozeTask(id: string, days = 1): Promise<void> {
  const t = await db.tasks.get(id);
  if (!t) return;
  await db.tasks.update(id, { due: addDays(today(), days), dueTime: undefined, snoozes: (t.snoozes ?? 0) + 1, updatedAt: Date.now() });
}

/**
 * Recurring rollover: an open recurring instance that is overdue is moved to its
 * LATEST missed occurrence (so only one overdue instance ever exists). Skipped
 * occurrences are logged as "missed" for the health score.
 */
export async function rolloverRecurring(): Promise<number> {
  const T = today();
  let moved = 0;
  await db.transaction('rw', db.tasks, db.history, async () => {
    const overdue = await db.tasks.where('[status+due]').between(['todo', ''], ['todo', T], true, false).toArray();
    const seenSeries = new Set<string>();
    for (const t of overdue.sort((a, b) => (a.due < b.due ? 1 : -1))) {
      if (!t.recurrence || !t.seriesId) continue;
      if (seenSeries.has(t.seriesId)) {
        // duplicate open instance for this series — remove the older one
        await db.tasks.delete(t.id);
        continue;
      }
      seenSeries.add(t.seriesId);
      const anchor = t.anchor ?? t.due;
      const latest = latestBefore(t.recurrence, T, t.due, anchor);
      if (latest && latest > t.due) {
        const missed = occurrencesBetween(t.recurrence, t.due, latest, anchor, 30);
        await db.history.bulkAdd(
          missed.map((d) => ({ id: uid('h_'), seriesId: t.seriesId!, projectId: t.projectId, title: t.title, due: d, status: 'missed' as const, at: Date.now() }))
        );
        await db.tasks.update(t.id, { due: latest, subtasks: t.subtasks.map((s) => ({ ...s, done: false })), updatedAt: Date.now() });
        moved++;
      }
    }
  });
  return moved;
}

export async function applyIndustryPack(project: Project, onlyChannels?: string[]): Promise<number> {
  const pack = getIndustry(project.industryId);
  if (!pack) return 0;
  const T = today();
  const tasks = pack.recurring
    .filter((r) => !onlyChannels || onlyChannels.includes(r.channel))
    .map((r) => buildTask({ ...fromTemplate(r, project.id), recurrence: r.recurrence, due: T, source: 'pack' }));
  await db.tasks.bulkAdd(tasks);
  return tasks.length;
}

export async function getStreak(): Promise<number> {
  const days = await db.days.toArray();
  const map = new Map(days.map((d) => [d.date, d.done]));
  let d = today();
  if (!map.get(d)) d = addDays(d, -1);
  let streak = 0;
  while ((map.get(d) ?? 0) > 0) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}

export async function ensureDailyMaintenance(): Promise<void> {
  const T = today();
  const last = await getSetting<string>('lastRollover', '');
  if (last === T) return;
  await rolloverRecurring();
  await setSetting('lastRollover', T);
}
