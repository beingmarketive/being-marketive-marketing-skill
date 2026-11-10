import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { db } from '../db/db';
import { INDUSTRIES } from '../data/industries';
import { PLAYBOOKS } from '../data/playbooks';
import { PRO_MOVES } from '../data/proMoves';
import { CHECKLISTS } from '../data/checklists';
import { CHANNEL_META } from '../data/channels';
import { BackLink } from './ProjectDetail';
import { useUI } from '../lib/ui';
import { useProjectMap } from '../lib/hooks';
import { shortDate } from '../lib/dates';
import { AddTaskSheet } from '../components/AddTaskSheet';
import type { NewTask } from '../lib/engine';

interface Hit {
  key: string;
  group: string;
  title: string;
  sub: string;
  go: () => void;
}

export default function Search() {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const { openTask } = useUI();
  const pmap = useProjectMap();
  const [template, setTemplate] = useState<NewTask | null>(null);
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const swipes = useLiveQuery(() => db.swipes.toArray(), []) ?? [];

  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    const words = s.split(/\s+/);
    const m = (txt: string) => {
      const l = txt.toLowerCase();
      return words.every((w) => l.includes(w));
    };
    const out: Hit[] = [];
    for (const t of tasks)
      if (m(`${t.title} ${t.notes} ${t.channel ?? ''} ${t.projectId ? pmap[t.projectId]?.name ?? '' : ''}`))
        out.push({ key: t.id, group: t.status === 'done' ? 'Done tasks' : 'Tasks', title: t.title, sub: `${t.projectId ? pmap[t.projectId]?.name : 'Personal'} · ${shortDate(t.due)}`, go: () => openTask(t.id) });
    for (const p of PLAYBOOKS) if (m(`${p.name} ${p.summary} ${p.match.join(' ')} ${p.steps.join(' ')}`)) out.push({ key: 'pb' + p.id, group: 'Playbooks', title: `${p.emoji} ${p.name}`, sub: p.summary, go: () => nav('/library/playbooks') });
    for (const pm of PRO_MOVES) if (m(`${pm.name} ${pm.why} ${pm.how.join(' ')}`)) out.push({ key: 'pm' + pm.id, group: 'Pro Moves', title: pm.name, sub: pm.why, go: () => setTemplate({ ...pm.task, subtasks: pm.how, notes: `Why: ${pm.why}`, source: 'promove' }) });
    for (const c of CHECKLISTS) if (m(`${c.name} ${c.description} ${c.sections.flatMap((x) => x.items).join(' ')}`)) out.push({ key: 'cl' + c.id, group: 'Checklists', title: `${c.emoji} ${c.name}`, sub: c.description, go: () => nav('/library/checklists') });
    for (const ind of INDUSTRIES)
      for (const i of ind.ideas)
        if (m(`${i.title} ${i.format} ${i.channel} ${ind.name}`))
          out.push({ key: ind.id + i.title, group: 'Ideas', title: i.title, sub: `${CHANNEL_META[i.channel].emoji} ${i.channel} · ${ind.name}`, go: () => setTemplate({ title: i.title, channel: i.channel, estMinutes: 45, notes: `Format: ${i.format}`, source: 'idea' }) });
    for (const sw of swipes) if (m(`${sw.title} ${sw.note} ${sw.tags.join(' ')} ${sw.kind}`)) out.push({ key: sw.id, group: 'Swipe file', title: sw.title, sub: sw.note || sw.kind, go: () => nav('/tools/swipe') });
    return out.slice(0, 120);
  }, [q, tasks, swipes, pmap, nav, openTask]);

  const groups = Array.from(new Set(hits.map((h) => h.group)));

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center gap-3 pt-4">
        <BackLink />
        <div className="relative flex-1">
          <SearchIcon size={18} className="faint absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input autoFocus className="input !pl-10" placeholder="Tasks, ideas, playbooks, swipe file…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </header>
      {groups.map((g) => (
        <section key={g} className="mt-5">
          <h2 className="section-title faint mb-2">
            {g} · {hits.filter((h) => h.group === g).length}
          </h2>
          <div className="space-y-1.5">
            {hits
              .filter((h) => h.group === g)
              .slice(0, 25)
              .map((h) => (
                <button key={h.key} onClick={h.go} className="card block w-full p-3 text-left">
                  <div className="text-sm font-semibold">{h.title}</div>
                  <div className="faint line-clamp-1 text-xs">{h.sub}</div>
                </button>
              ))}
          </div>
        </section>
      ))}
      {q.trim().length >= 2 && !hits.length && <p className="faint mt-10 text-center">Kuch nahi mila "{q}" ke liye.</p>}
      {q.trim().length < 2 && <p className="faint mt-10 text-center text-sm">Try: "review", "schema", "diwali", "reel hook", "Cloudforz"</p>}
      <AddTaskSheet template={template} onClose={() => setTemplate(null)} />
    </div>
  );
}
