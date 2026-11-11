import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db/db';
import { addTask, completeTask, rolloverRecurring, undoComplete, snoozeTask } from '../lib/engine';
import { setFakeToday } from '../lib/dates';

const open = () => db.tasks.where('status').equals('todo').toArray();

beforeEach(async () => {
  await db.tasks.clear();
  await db.history.clear();
  await db.days.clear();
  setFakeToday('2026-11-10');
});

describe('recurring engine', () => {
  it('completing creates the next one', async () => {
    const t = await addTask({ title: 'Daily blog', recurrence: { type: 'daily' } });
    await completeTask(t.id);
    const o = await open();
    expect(o).toHaveLength(1);
    expect(o[0].due).toBe('2026-11-11');
    expect(o[0].seriesId).toBe(t.seriesId);
  });
  it('missed days roll into ONE overdue instance, completing it spawns today', async () => {
    const t = await addTask({ title: 'Daily blog', recurrence: { type: 'daily' }, due: '2026-11-05' });
    await rolloverRecurring();
    let o = await open();
    expect(o).toHaveLength(1);
    expect(o[0].due).toBe('2026-11-09');
    const missed = await db.history.where('status').equals('missed').count();
    expect(missed).toBe(4);
    await completeTask(t.id);
    o = await open();
    expect(o).toHaveLength(1);
    expect(o[0].due).toBe('2026-11-10');
    expect((await db.history.where('status').equals('late').count())).toBe(1);
  });
  it('undo removes the spawned instance', async () => {
    const t = await addTask({ title: 'x', recurrence: { type: 'daily' } });
    await completeTask(t.id);
    await undoComplete(t.id);
    const o = await open();
    expect(o).toHaveLength(1);
    expect(o[0].id).toBe(t.id);
  });
  it('snooze moves to tomorrow', async () => {
    const t = await addTask({ title: 'x', due: '2026-11-08' });
    await snoozeTask(t.id);
    expect((await db.tasks.get(t.id))!.due).toBe('2026-11-11');
  });
});

describe('chains', () => {
  it('blog → publish → index → 3 repurpose tasks', async () => {
    const t = await addTask({ title: 'Write blog', startsChain: 'blog-pipeline', projectId: 'p1' });
    await db.tasks.update(t.id, { topic: 'GBP guide' });
    const s1 = await completeTask(t.id);
    expect(s1).toHaveLength(1);
    expect(s1[0].title).toBe('Publish + add internal links: GBP guide');
    expect(s1[0].projectId).toBe('p1');
    const s2 = await completeTask(s1[0].id);
    expect(s2[0].title).toContain('Request indexing');
    const s3 = await completeTask(s2[0].id);
    expect(s3.map((x) => x.channel).sort()).toEqual(['Instagram', 'LinkedIn', 'Reels']);
    const s4 = await completeTask(s3[0].id);
    expect(s4).toHaveLength(0);
  });
  it('recurring task that starts a chain does both', async () => {
    const t = await addTask({ title: 'Reel', startsChain: 'reel-followup', recurrence: { type: 'weekly', days: [2, 5] } });
    const spawned = await completeTask(t.id);
    expect(spawned).toHaveLength(2);
    expect(spawned.some((s) => s.due === '2026-11-13')).toBe(true);
    expect(spawned.some((s) => s.chain?.chainId === 'reel-followup')).toBe(true);
  });
});
