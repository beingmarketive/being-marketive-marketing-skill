import { db, getSetting, setSetting } from '../db/db';
import { EVENTS } from '../data/calendar';
import type { Channel, MarketingEvent, Project } from '../types';
import { addDays, diffDays, today } from './dates';
import { buildTask } from './engine';

export type EventStatus = 'created' | 'dismissed' | undefined;

export async function eventStatus(id: string): Promise<EventStatus> {
  return getSetting<EventStatus>(`evt:${id}`, undefined);
}

/** Events in the next `days` days that are still waiting for a decision. */
export async function pendingNudges(days = 7): Promise<MarketingEvent[]> {
  const T = today();
  const out: MarketingEvent[] = [];
  for (const e of EVENTS) {
    const d = diffDays(e.date, T);
    if (d < 0 || d > days) continue;
    if (!(await eventStatus(e.id))) out.push(e);
  }
  return out;
}

function mainChannel(p: Project): Channel {
  const order: Channel[] = ['Instagram', 'GBP', 'Reels', 'LinkedIn', 'WhatsApp', 'Blog', 'Email', 'Meta Ads'];
  return order.find((c) => p.channels.includes(c)) ?? p.channels[0] ?? 'Instagram';
}

/** One campaign task per project (sorted relevant industries first). Returns count. */
export async function createEventCampaign(e: MarketingEvent, projects: Project[]): Promise<number> {
  const T = today();
  const prep = addDays(e.date, -2);
  const due = prep < T ? T : prep;
  const tasks = projects.map((p) => {
    const ch = mainChannel(p);
    const relevant = !e.industries || e.industries.includes(p.industryId);
    const subtasks = ['Pick angle + offer (or pure greeting if no fit)', `Design creative for ${ch}`, 'Write caption / copy', 'Schedule post for the event day'];
    if (p.channels.includes('GBP')) subtasks.push('GBP post with offer / holiday hours');
    if (p.channels.includes('WhatsApp')) subtasks.push('WhatsApp broadcast to customers');
    if (p.channels.includes('Meta Ads') && relevant) subtasks.push('Small boosted ad 3 days before');
    return buildTask({
      title: `${e.name} campaign: ${p.name}`,
      projectId: p.id,
      channel: ch,
      due,
      priority: relevant ? 1 : 2,
      estMinutes: relevant ? 60 : 25,
      notes: `Event: ${e.name} on ${e.date}${e.verify ? ' (date verify karo — lunar calendar)' : ''}\nAngle: ${e.angle}`,
      subtasks,
      source: 'calendar'
    });
  });
  await db.tasks.bulkAdd(tasks);
  await setSetting(`evt:${e.id}`, 'created');
  return tasks.length;
}

export async function dismissEvent(id: string): Promise<void> {
  await setSetting(`evt:${id}`, 'dismissed');
}
