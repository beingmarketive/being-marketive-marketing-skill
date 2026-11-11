import { useLiveQuery } from 'dexie-react-hooks';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useProjects, useToday } from '../lib/hooks';
import { ProjectForm } from '../components/ProjectForm';
import { getIndustry } from '../data/industries';
import { CHANNEL_META } from '../data/channels';
import { healthScores } from '../lib/health';

export default function Projects() {
  const projects = useProjects();
  const T = useToday();
  const [formOpen, setFormOpen] = useState(false);
  const stats = useLiveQuery(async () => {
    const open = await db.tasks.where('status').equals('todo').toArray();
    const out: Record<string, { overdue: number; today: number; open: number }> = {};
    for (const t of open) {
      if (!t.projectId) continue;
      const s = (out[t.projectId] ??= { overdue: 0, today: 0, open: 0 });
      s.open++;
      if (t.due < T) s.overdue++;
      else if (t.due === T) s.today++;
    }
    return out;
  }, [T]);
  const health = useLiveQuery(() => healthScores(), [T]) ?? {};

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center justify-between pt-5">
        <h1 className="text-2xl font-extrabold">Projects</h1>
        <button className="btn-primary !min-h-[42px]" onClick={() => setFormOpen(true)}>
          <Plus size={18} /> Add project
        </button>
      </header>

      <div className="mt-5 space-y-3">
        {projects.map((p, i) => {
          const s = stats?.[p.id] ?? { overdue: 0, today: 0, open: 0 };
          const h = health[p.id];
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link to={`/projects/${p.id}`} className="card relative block overflow-hidden p-4 transition active:scale-[0.99]">
                <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: p.color }} />
                <div className="flex items-start gap-3 pl-1">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: p.color + '22' }}>
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[17px] font-bold">{p.name}</div>
                      {h && h.total > 0 && (
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: 'var(--input)', color: h.score >= 80 ? 'var(--green)' : h.score >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                          ❤ {h.score}%
                        </span>
                      )}
                    </div>
                    <div className="faint truncate text-xs">{getIndustry(p.industryId)?.name}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.channels.slice(0, 7).map((c) => (
                        <span key={c} title={c} className="text-sm">
                          {CHANNEL_META[c].emoji}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-3 text-xs font-semibold">
                      <span style={{ color: s.overdue ? 'var(--red)' : 'var(--faint)' }}>🔴 {s.overdue} overdue</span>
                      <span style={{ color: s.today ? 'var(--amber)' : 'var(--faint)' }}>🟡 {s.today} today</span>
                      <span className="faint">{s.open} open</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
        <button onClick={() => setFormOpen(true)} className="flex min-h-[96px] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-4 transition active:scale-[0.99]" style={{ borderColor: 'var(--border)' }}>
          <Plus size={22} style={{ color: 'var(--accent)' }} />
          <span className="font-bold">Add a new project</span>
          <span className="faint text-xs">Any brand or client — pick its industry, fill the brand brief, get brand ideas</span>
        </button>
      </div>
      <ProjectForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
