import { db } from '../db/db';
import { CHANNEL_META } from '../data/channels';
import { CHANNELS, type BrandIdea, type Channel, type Idea } from '../types';
import { uid } from './id';

function matchChannel(raw: string, fallback: Channel): Channel {
  const t = raw.trim().toLowerCase();
  const exact = CHANNELS.find((c) => c.toLowerCase() === t);
  if (exact) return exact;
  for (const c of CHANNELS) if (CHANNEL_META[c].aliases.some((a) => t.includes(a))) return c;
  return fallback;
}

/**
 * Parse AI output (or anything pasted) into ideas.
 * Accepts "Title | Channel | Format" lines; also plain numbered/bulleted lines.
 */
export function parseIdeaLines(text: string, fallbackChannel: Channel): Idea[] {
  const out: Idea[] = [];
  for (const raw of text.split('\n')) {
    let line = raw.replace(/^\s*(\d+[.)]|[-*•])\s*/, '').replace(/\*\*/g, '').trim();
    if (!line || /^idea title\s*\|/i.test(line) || /^[-|\s]+$/.test(line)) continue;
    line = line.replace(/^\|/, '').replace(/\|$/, '').trim();
    const parts = line.split('|').map((s) => s.trim());
    const title = parts[0];
    if (!title || title.length < 6) continue;
    out.push({ title, channel: matchChannel(parts[1] ?? '', fallbackChannel), format: parts[2] || 'Post' });
  }
  return out;
}

export async function addIdeas(projectId: string, ideas: Idea[]): Promise<number> {
  const existing = new Set((await db.ideas.where('projectId').equals(projectId).toArray()).map((i) => i.title.toLowerCase()));
  const now = Date.now();
  const rows: BrandIdea[] = ideas
    .filter((i) => !existing.has(i.title.toLowerCase()))
    .map((i, n) => ({ id: uid('i_'), projectId, title: i.title, channel: i.channel, format: i.format, createdAt: now + n }));
  if (rows.length) await db.ideas.bulkAdd(rows);
  return rows.length;
}
