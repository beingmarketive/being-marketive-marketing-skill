import { CHANNEL_META } from '../data/channels';
import { detectChain } from '../data/chains';
import type { Channel, Priority, Project, Recurrence } from '../types';
import { CHANNELS } from '../types';
import { addDays, fromISO, toISO, today, weekday } from './dates';

export interface ParsedQuickAdd {
  title: string;
  projectId: string | null;
  channel: Channel | null;
  due: string;
  dueTime?: string;
  recurrence?: Recurrence;
  priority: Priority;
  estMinutes?: number;
  startsChain?: string;
  /** human-readable chips for the preview */
  hints: string[];
}

const WEEKDAYS: [number, string[]][] = [
  [0, ['sunday', 'ravivar', 'raviwar', 'itvaar', 'itwar', 'itvar', 'etvaar']],
  [1, ['monday', 'somvar', 'somwar', 'mon']],
  [2, ['tuesday', 'mangalvar', 'mangalwar', 'tue', 'tues']],
  [3, ['wednesday', 'budhvar', 'budhwar', 'wed']],
  [4, ['thursday', 'guruvar', 'guruwar', 'brihaspativar', 'veervar', 'thu', 'thurs']],
  [5, ['friday', 'shukravar', 'shukrawar', 'fri']],
  [6, ['saturday', 'shanivar', 'shaniwar']]
];
const WD_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4, jun: 5, june: 5,
  jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = (phrase: string) => new RegExp(`(^|\\s)${escapeRe(phrase)}(?=\\s|$|[,.!?])`, 'i');

function nextWeekday(from: string, wd: number): string {
  const diff = (wd - weekday(from) + 7) % 7;
  return addDays(from, diff);
}

export function parseQuickAdd(input: string, projects: Pick<Project, 'id' | 'name' | 'aliases' | 'channels'>[]): ParsedQuickAdd {
  const T = today();
  let text = ` ${input.trim()} `;
  const hints: string[] = [];
  const take = (re: RegExp): RegExpMatchArray | null => {
    const m = text.match(re);
    if (m) text = text.replace(re, ' ');
    return m;
  };
  /** Remove the match only when `fn` returns a value. */
  const takeIf = <R,>(re: RegExp, fn: (mm: RegExpMatchArray) => R | null): R | null => {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const mm of text.matchAll(g)) {
      const r = fn(mm);
      if (r !== null) {
        text = text.slice(0, mm.index!) + ' ' + text.slice(mm.index! + mm[0].length);
        return r;
      }
    }
    return null;
  };

  /* ---- project ---- */
  let projectId: string | null = null;
  const candidates = projects
    .flatMap((p) => [p.name, ...(p.aliases ?? [])].map((a) => ({ id: p.id, name: p.name, alias: a.toLowerCase().trim() })))
    .filter((c) => c.alias.length > 1)
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const c of candidates) {
    if (take(wordRe(c.alias))) {
      projectId = c.id;
      hints.push(`📁 ${c.name}`);
      break;
    }
  }

  /* ---- recurrence ---- */
  let recurrence: Recurrence | undefined;
  let m: RegExpMatchArray | null;
  if ((m = take(/(^|\s)(har|every)\s+(\d{1,2})\s+(din|days?)(?=\s|$)/i))) {
    recurrence = { type: 'custom', everyDays: Number(m[3]) };
  } else if (take(/(^|\s)(har\s+roz|har\s+din|roz(ana)?|daily|every\s*day|everyday)(?=\s|$)/i)) {
    recurrence = { type: 'daily' };
  } else if (take(/(^|\s)(weekdays|mon\s*-\s*fri|somvar\s+se\s+shukravar)(?=\s|$)/i)) {
    recurrence = { type: 'weekly', days: [1, 2, 3, 4, 5] };
  } else if (take(/(^|\s)(har\s+(hafte|hafta|week)|weekly|every\s+week)(?=\s|$)/i)) {
    recurrence = { type: 'weekly', days: [] };
  } else if (take(/(^|\s)(har\s+(mahine|mahina|month)|monthly|every\s+month)(?=\s|$)/i)) {
    recurrence = { type: 'monthly', dayOfMonth: 0 };
  }

  /* "har somvar", "every monday" → weekly on that day (can be several: "har somvar aur guruvar") */
  const weekdaysFound: number[] = [];
  for (const [wd, names] of WEEKDAYS) {
    for (const n of names) {
      const re = new RegExp(`(^|\\s)((har|every)\\s+)?${n}(\\s+(ko|aur|and|,))?(?=\\s|$|,)`, 'i');
      const mm = text.match(re);
      if (mm) {
        text = text.replace(re, ' ');
        weekdaysFound.push(wd);
        if (mm[3] && !recurrence) recurrence = { type: 'weekly', days: [] };
        break;
      }
    }
  }

  /* ---- due date ---- */
  let due: string | null = null;
  if ((m = take(/(^|\s)(\d{1,2})\s+(din|days?)\s+(baad|bad|later|mein|me)(?=\s|$)/i)) || (m = take(/(^|\s)in\s+(\d{1,2})\s+days?(?=\s|$)/i))) {
    due = addDays(T, Number(m[2]));
  } else if (take(/(^|\s)(parso|parson|day\s+after\s+tomorrow)(\s+(ko|tak))?(?=\s|$)/i)) {
    due = addDays(T, 2);
  } else if (take(/(^|\s)(kal|kl|tomorrow|tmrw|tmr)(\s+(ko|tak))?(?=\s|$)/i)) {
    due = addDays(T, 1);
  } else if (take(/(^|\s)(aaj|aj|today|abhi)(\s+(hi|ko|tak))?(?=\s|$)/i)) {
    due = T;
  } else if (take(/(^|\s)(agle|next)\s+(hafte|week|hafta)(\s+(ko|tak))?(?=\s|$)/i)) {
    due = nextWeekday(addDays(T, 1), 1);
  } else if (take(/(^|\s)(agle|next)\s+(mahine|month)(\s+(ko|tak))?(?=\s|$)/i)) {
    const d = fromISO(T);
    due = toISO(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  } else {
    due =
      takeIf(/(^|\s)(\d{1,2})(st|nd|rd|th)?\s+([a-z]{3,9})(?=\s|$)/i, (mm) => (MONTHS[mm[4].toLowerCase()] !== undefined ? resolveDayMonth(Number(mm[2]), MONTHS[mm[4].toLowerCase()], T) : null)) ??
      takeIf(/(^|\s)([a-z]{3,9})\s+(\d{1,2})(st|nd|rd|th)?(?=\s|$)/i, (mm) => (MONTHS[mm[2].toLowerCase()] !== undefined ? resolveDayMonth(Number(mm[3]), MONTHS[mm[2].toLowerCase()], T) : null)) ??
      takeIf(/(^|\s)(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?(?=\s|$)/, (mm) => resolveDayMonth(Number(mm[2]), Number(mm[3]) - 1, T));
  }

  if (!due && weekdaysFound.length) due = nextWeekday(T, weekdaysFound[0]);
  if (!due) due = T;

  if (recurrence?.type === 'weekly' && recurrence.days.length === 0) {
    recurrence = { type: 'weekly', days: weekdaysFound.length ? weekdaysFound : [weekday(due)] };
  }
  if (recurrence?.type === 'monthly' && recurrence.dayOfMonth === 0) {
    recurrence = { type: 'monthly', dayOfMonth: fromISO(due).getDate() };
  }

  /* ---- time ---- */
  let dueTime: string | undefined;
  if ((m = take(/(^|\s)(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje)(?=\s|$)/i))) {
    let h = Number(m[2]);
    const min = m[3] ? Number(m[3]) : 0;
    const suffix = m[4].toLowerCase();
    if (suffix === 'pm' && h < 12) h += 12;
    if (suffix === 'am' && h === 12) h = 0;
    if (suffix === 'baje' && h >= 1 && h <= 7) h += 12; // "5 baje" → 5 pm in work context
    dueTime = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  } else if ((m = take(/(^|\s)([01]?\d|2[0-3]):([0-5]\d)(?=\s|$)/))) {
    dueTime = `${m[2].padStart(2, '0')}:${m[3]}`;
  }

  /* ---- priority ---- */
  let priority: Priority = 2;
  if (take(/(^|\s)(urgent|zaroori|jaruri|zaruri|important|asap|high\s+priority|p1)(?=\s|$)/i) || take(/\s!{1,3}(?=\s|$)/)) {
    priority = 1;
  } else if (take(/(^|\s)(low\s+priority|p3|jab\s+time\s+mile)(?=\s|$)/i)) {
    priority = 3;
  }

  /* ---- estimate ---- */
  let estMinutes: number | undefined;
  if ((m = take(/(^|\s)(\d{1,3})\s*(m|min|mins|minute|minutes)(?=\s|$)/i))) estMinutes = Number(m[2]);
  else if ((m = take(/(^|\s)(\d(?:\.\d)?)\s*(h|hr|hrs|hour|hours|ghanta|ghante)(?=\s|$)/i))) estMinutes = Math.round(Number(m[2]) * 60);

  /* ---- channel (kept in the title) ---- */
  let channel: Channel | null = null;
  const lower = text.toLowerCase();
  const channelCandidates = CHANNELS.flatMap((c) => CHANNEL_META[c].aliases.map((a) => ({ c, a }))).sort((x, y) => y.a.length - x.a.length);
  let best: { c: Channel; idx: number; len: number } | null = null;
  for (const { c, a } of channelCandidates) {
    const mm = lower.match(wordRe(a));
    if (mm && mm.index !== undefined) {
      // prefer the earliest mention; on ties, the longest alias
      if (!best || mm.index < best.idx || (mm.index === best.idx && a.length > best.len)) best = { c, idx: mm.index, len: a.length };
    }
  }
  if (best) channel = best.c;
  if (!channel && projectId) {
    const p = projects.find((x) => x.id === projectId);
    if (p && p.channels.length === 1) channel = p.channels[0];
  }

  /* ---- title ---- */
  let title = text.replace(/\s+/g, ' ').replace(/^[\s,.\-–:]+|[\s,.\-–:]+$/g, '').trim();
  title = title.replace(/\s+(ko|tak|par|pe)$/i, '').trim();
  if (!title) title = channel ? `${channel} task` : 'New task';
  title = title.charAt(0).toUpperCase() + title.slice(1);

  const startsChain = detectChain(title);

  if (channel) hints.push(`${CHANNEL_META[channel].emoji} ${channel}`);
  hints.push(`📅 ${dueLabel(due, T)}${dueTime ? ' ' + dueTime : ''}`);
  if (recurrence) hints.push(`🔁 ${recLabel(recurrence)}`);
  if (priority === 1) hints.push('🔥 Zaroori');
  if (estMinutes) hints.push(`⏱ ${estMinutes}m`);
  if (startsChain) hints.push('⛓ Chain');

  return { title, projectId, channel, due, dueTime, recurrence, priority, estMinutes, startsChain, hints };
}

function resolveDayMonth(day: number, month0: number, T: string): string | null {
  if (month0 < 0 || month0 > 11 || day < 1 || day > 31) return null;
  const t = fromISO(T);
  let d = new Date(t.getFullYear(), month0, day);
  if (toISO(d) < T) d = new Date(t.getFullYear() + 1, month0, day);
  return toISO(d);
}

function dueLabel(due: string, T: string): string {
  if (due === T) return 'Aaj';
  if (due === addDays(T, 1)) return 'Kal';
  if (due === addDays(T, 2)) return 'Parso';
  const d = fromISO(due);
  return `${WD_LABEL[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function recLabel(r: Recurrence): string {
  switch (r.type) {
    case 'daily':
      return 'Har roz';
    case 'weekly':
      return 'Har ' + r.days.map((d) => WD_LABEL[d]).join(', ');
    case 'monthly':
      return `Har mahine ${r.dayOfMonth} ko`;
    case 'custom':
      return `Har ${r.everyDays} din`;
  }
}
