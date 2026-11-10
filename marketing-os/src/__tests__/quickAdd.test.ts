import { describe, it, expect, beforeAll } from 'vitest';
import { parseQuickAdd } from '../lib/quickAdd';
import { setFakeToday } from '../lib/dates';
import { SEED_PROJECTS } from '../data/projects';

const projects = SEED_PROJECTS.map((p) => ({ id: p.id, name: p.name, aliases: p.aliases, channels: p.channels }));
// 2026-11-10 is a Tuesday
beforeAll(() => setFakeToday('2026-11-10'));

describe('parseQuickAdd', () => {
  it('Trendy Prints GBP post kal', () => {
    const r = parseQuickAdd('Trendy Prints GBP post kal', projects);
    expect(r.projectId).toBe('trendy-prints');
    expect(r.channel).toBe('GBP');
    expect(r.due).toBe('2026-11-11');
    expect(r.title).toBe('GBP post');
  });
  it('aaj / parso', () => {
    expect(parseQuickAdd('cloudforz linkedin post aaj', projects).due).toBe('2026-11-10');
    expect(parseQuickAdd('rn world reel parso', projects)).toMatchObject({ due: '2026-11-12', projectId: 'rn-world', channel: 'Reels' });
  });
  it('weekday names (hindi + english)', () => {
    expect(parseQuickAdd('marketomate carousel somvar', projects).due).toBe('2026-11-16');
    expect(parseQuickAdd('14mittech blog friday', projects).due).toBe('2026-11-13');
    expect(parseQuickAdd('call client guruvar ko', projects).due).toBe('2026-11-12');
  });
  it('recurrence', () => {
    expect(parseQuickAdd('being marketive blog likhna har roz', projects).recurrence).toEqual({ type: 'daily' });
    expect(parseQuickAdd('tp review reply har somvar', projects).recurrence).toEqual({ type: 'weekly', days: [1] });
    expect(parseQuickAdd('rn world ads check har hafte', projects).recurrence).toEqual({ type: 'weekly', days: [2] });
    expect(parseQuickAdd('monthly report har mahine 1 dec', projects).recurrence).toEqual({ type: 'monthly', dayOfMonth: 1 });
    expect(parseQuickAdd('backup har 3 din', projects).recurrence).toEqual({ type: 'custom', everyDays: 3 });
  });
  it('dates, time, priority, estimate', () => {
    const r = parseQuickAdd('cloudforz demo page fix 15 nov 5pm urgent 30m', projects);
    expect(r).toMatchObject({ due: '2026-11-15', dueTime: '17:00', priority: 1, estMinutes: 30, projectId: 'cloudforz' });
    expect(r.title).toBe('Demo page fix');
    expect(parseQuickAdd('post 2 photos', projects).title).toBe('Post 2 photos');
  });
  it('detects chain', () => {
    expect(parseQuickAdd('BM blog likhna: GBP guide', projects).startsChain).toBe('blog-pipeline');
  });
  it('single-channel project default', () => {
    expect(parseQuickAdd('trendy prints photos upload', projects).channel).toBe('GBP');
  });
});
