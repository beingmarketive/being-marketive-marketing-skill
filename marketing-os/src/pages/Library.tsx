import { AnimatePresence, motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronDown, Plus, Shuffle, Check, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PLAYBOOKS } from '../data/playbooks';
import { PRO_MOVES } from '../data/proMoves';
import { CHECKLISTS } from '../data/checklists';
import { INDUSTRIES, getIndustry } from '../data/industries';
import { CHANNEL_META } from '../data/channels';
import { PlaybookView } from '../components/PlaybookView';
import { Sheet } from '../components/Sheet';
import { AddTaskSheet } from '../components/AddTaskSheet';
import { AiBox } from '../components/AiBox';
import { useProjects } from '../lib/hooks';
import { fillPrompt } from '../data/playbooks';
import { haptic } from '../lib/ui';
import { db, getSetting, setSetting } from '../db/db';
import type { Checklist, Idea, Playbook, ProMove } from '../types';
import type { NewTask } from '../lib/engine';

const TABS = [
  ['playbooks', '📘 Playbooks'],
  ['ideas', '💡 Idea Bank'],
  ['pro', '🧠 Pro Moves'],
  ['checklists', '✅ Checklists']
] as const;
type Tab = (typeof TABS)[number][0];

export default function Library() {
  const { tab = 'playbooks' } = useParams();
  const nav = useNavigate();
  const [template, setTemplate] = useState<NewTask | null>(null);
  const [defaultProject, setDefaultProject] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <h1 className="pt-5 text-2xl font-extrabold">Library</h1>
      <p className="faint text-sm">Kabhi stuck mat ho — process, ideas aur advanced moves sab yahan.</p>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {TABS.map(([k, l]) => (
          <button key={k} className={`chip ${tab === k ? 'chip-on' : ''}`} onClick={() => nav(`/library/${k}`, { replace: true })}>
            {l}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {(tab as Tab) === 'playbooks' && <Playbooks />}
        {(tab as Tab) === 'ideas' && (
          <IdeaBank
            onAdd={(t, pid) => {
              setDefaultProject(pid);
              setTemplate(t);
            }}
          />
        )}
        {(tab as Tab) === 'pro' && <ProMoves onAdd={(t) => setTemplate(t)} />}
        {(tab as Tab) === 'checklists' && <Checklists onAdd={(t) => setTemplate(t)} />}
      </div>
      <AddTaskSheet template={template} defaultProjectId={defaultProject} onClose={() => setTemplate(null)} />
    </div>
  );
}

/* ---------------- Playbooks ---------------- */

function Playbooks() {
  const [open, setOpen] = useState<Playbook | null>(null);
  const [q, setQ] = useState('');
  const projects = useProjects();
  const [pid, setPid] = useState<string>('');
  const list = PLAYBOOKS.filter((p) => !q || (p.name + p.summary + p.match.join(' ')).toLowerCase().includes(q.toLowerCase()));
  const project = projects.find((p) => p.id === pid);
  return (
    <>
      <input className="input mb-3" placeholder="Search playbooks (GBP, reel, schema…)" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-2 gap-2.5">
        {list.map((p) => (
          <button key={p.id} onClick={() => setOpen(p)} className="card flex min-h-[96px] flex-col items-start justify-between p-3.5 text-left transition active:scale-[0.98]">
            <span className="text-2xl">{p.emoji}</span>
            <span className="text-sm font-bold leading-tight">{p.name}</span>
          </button>
        ))}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `${open.emoji} ${open.name}` : ''} full>
        {open && (
          <>
            <PlaybookView playbook={open} />
            <div className="mt-5">
              <label className="mb-2 block">
                <span className="label">AI prompt kis project ke liye?</span>
                <select className="input" value={pid} onChange={(e) => setPid(e.target.value)}>
                  <option value="">General</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <AiBox
                prompt={fillPrompt(open.aiPrompt, {
                  project: project?.name ?? '[brand]',
                  industry: getIndustry(project?.industryId)?.name ?? '[industry]',
                  task: open.name,
                  website: project?.website ?? '[website]',
                  notes: project?.notes ?? 'none'
                })}
              />
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}

/* ---------------- Idea Bank ---------------- */

function IdeaBank({ onAdd }: { onAdd: (t: NewTask, projectId: string | null) => void }) {
  const projects = useProjects();
  const [scope, setScope] = useState<string>(projects[0]?.id ?? 'agency');
  const project = projects.find((p) => p.id === scope);
  const industry = getIndustry(project ? project.industryId : scope) ?? INDUSTRIES[0];
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * industry.ideas.length));
  const [showAll, setShowAll] = useState(false);
  const idea = industry.ideas[idx % industry.ideas.length];

  const shuffle = () => {
    haptic(8);
    let n = idx;
    while (industry.ideas.length > 1 && n === idx) n = Math.floor(Math.random() * industry.ideas.length);
    setIdx(n);
  };
  const toTask = (i: Idea): NewTask => ({ title: i.title, channel: i.channel, estMinutes: 45, priority: 2, notes: `Format: ${i.format}`, source: 'idea', startsChain: i.channel === 'Reels' ? 'reel-followup' : i.channel === 'Blog' ? 'blog-pipeline' : undefined });

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {projects.map((p) => (
          <button key={p.id} className={`chip ${scope === p.id ? 'chip-on' : ''}`} onClick={() => setScope(p.id)}>
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} /> {p.name}
          </button>
        ))}
      </div>
      <select className="input mt-3" value={project ? '' : scope} onChange={(e) => e.target.value && setScope(e.target.value)}>
        <option value="">…ya koi bhi industry chuno</option>
        {INDUSTRIES.map((i) => (
          <option key={i.id} value={i.id}>
            {i.emoji} {i.name} ({i.ideas.length} ideas)
          </option>
        ))}
      </select>

      <div className="relative mt-4 overflow-hidden rounded-3xl p-[1.5px]" style={{ background: 'var(--grad)' }}>
        <div className="rounded-[22px] p-5" style={{ background: 'var(--card-solid)' }}>
          <div className="faint text-xs font-bold uppercase tracking-wider">
            {industry.emoji} {industry.name}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={idea.title} initial={{ opacity: 0, rotateX: -60, y: 10 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, rotateX: 60, y: -10 }} transition={{ duration: 0.25 }}>
              <div className="mt-3 text-xl font-bold leading-snug">{idea.title}</div>
              <div className="muted mt-2 text-sm">
                {CHANNEL_META[idea.channel].emoji} {idea.channel} · {idea.format}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button className="btn-ghost" onClick={shuffle}>
              <Shuffle size={18} /> Idea Shuffle
            </button>
            <button className="btn-primary" onClick={() => onAdd(toTask(idea), project?.id ?? null)}>
              <Plus size={18} /> Task banao
            </button>
          </div>
        </div>
      </div>

      <button className="section-title faint mt-6" onClick={() => setShowAll(!showAll)}>
        Saare ideas ({industry.ideas.length}) <ChevronDown size={16} className={`transition ${showAll ? 'rotate-180' : ''}`} />
      </button>
      {showAll && (
        <div className="mt-3 space-y-2">
          {industry.ideas.map((i) => (
            <div key={i.title} className="card flex items-center gap-3 p-3">
              <span className="text-lg">{CHANNEL_META[i.channel].emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold leading-snug">{i.title}</div>
                <div className="faint text-xs">{i.format}</div>
              </div>
              <button aria-label="Add as task" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: 'var(--input)' }} onClick={() => onAdd(toTask(i), project?.id ?? null)}>
                <Plus size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- Pro Moves ---------------- */

function ProMoves({ onAdd }: { onAdd: (t: NewTask) => void }) {
  const cats = useMemo(() => ['All', ...Array.from(new Set(PRO_MOVES.map((m) => m.category)))], []);
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<string | null>(null);
  const list = PRO_MOVES.filter((m) => cat === 'All' || m.category === cat);
  const toTask = (m: ProMove): NewTask => ({ ...m.task, subtasks: m.how, notes: `Why: ${m.why}`, source: 'promove' });
  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'chip-on' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="faint mt-3 text-xs">{PRO_MOVES.length} advanced tactics — har hafte ek try karo.</p>
      <div className="mt-3 space-y-2.5">
        {list.map((m) => (
          <div key={m.id} className="card overflow-hidden">
            <button className="flex w-full items-center gap-3 p-4 text-left" onClick={() => setOpen(open === m.id ? null : m.id)}>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold">{m.name}</div>
                <div className="faint text-xs">{m.category}</div>
              </div>
              <ChevronDown size={18} className={`faint transition ${open === m.id ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === m.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4">
                    <div className="label">Why</div>
                    <p className="text-[14px] leading-relaxed">{m.why}</p>
                    <div className="label mt-3">How</div>
                    <ol className="space-y-1.5">
                      {m.how.map((h, i) => (
                        <li key={i} className="flex gap-2 text-[14px] leading-relaxed">
                          <span className="faint font-bold">{i + 1}.</span>
                          {h}
                        </li>
                      ))}
                    </ol>
                    <button className="btn-primary mt-4 w-full" onClick={() => onAdd(toTask(m))}>
                      <Plus size={18} /> Add as task
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Checklists ---------------- */

function Checklists({ onAdd }: { onAdd: (t: NewTask) => void }) {
  const [open, setOpen] = useState<Checklist | null>(null);
  return (
    <>
      <div className="space-y-2.5">
        {CHECKLISTS.map((c) => {
          const total = c.sections.reduce((s, x) => s + x.items.length, 0);
          return (
            <button key={c.id} onClick={() => setOpen(c)} className="card flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]">
              <span className="text-2xl">{c.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold">{c.name}</div>
                <div className="faint text-xs">
                  {total} points · {c.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `${open.emoji} ${open.name}` : ''} full footer={open && <button className="btn-primary mb-1 w-full" onClick={() => onAdd({ title: `${open.name} checklist`, channel: open.id === 'gbp-optimisation' ? 'GBP' : open.id === 'reel-prepublish' ? 'Reels' : open.id === 'ad-launch' ? 'Meta Ads' : open.id === 'monthly-report' ? 'Reporting' : open.id === 'website-launch' ? 'Website' : 'SEO', estMinutes: 60, priority: 2, subtasks: open.sections.flatMap((s) => s.items), source: 'checklist' })}>
        <Plus size={18} /> Project ke liye task banao
      </button>}>
        {open && <ChecklistBody checklist={open} />}
      </Sheet>
    </>
  );
}

function ChecklistBody({ checklist }: { checklist: Checklist }) {
  const key = `cl:${checklist.id}`;
  const done = useLiveQuery(() => getSetting<string[]>(key, []), [key]) ?? [];
  const toggle = (item: string) => setSetting(key, done.includes(item) ? done.filter((d) => d !== item) : [...done, item]);
  const total = checklist.sections.reduce((s, x) => s + x.items.length, 0);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="muted text-sm">{checklist.description}</p>
        <button aria-label="Reset" className="faint flex items-center gap-1 text-xs" onClick={() => db.settings.delete(key)}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--input)' }}>
        <div className="grad-bg h-full transition-all" style={{ width: `${(done.length / total) * 100}%` }} />
      </div>
      <div className="faint mt-1 text-xs">
        {done.length}/{total} done
      </div>
      {checklist.sections.map((s) => (
        <div key={s.title} className="mt-5">
          <div className="section-title mb-2">{s.title}</div>
          <div className="space-y-1.5">
            {s.items.map((it) => {
              const on = done.includes(it);
              return (
                <button key={it} onClick={() => toggle(it)} className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 text-left text-[14px]" style={{ background: 'var(--input)' }}>
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2" style={{ borderColor: on ? 'var(--green)' : 'var(--faint)', background: on ? 'var(--green)' : 'transparent' }}>
                    {on && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className={on ? 'faint line-through' : ''}>{it}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
