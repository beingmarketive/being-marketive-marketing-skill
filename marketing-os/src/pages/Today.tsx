import { AnimatePresence, motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronDown, Flame, LifeBuoy, Search, Timer, Check, Settings } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { TaskCard } from '../components/TaskCard';
import { ProgressRing } from '../components/ProgressRing';
import { QuickAddBar } from '../components/QuickAdd';
import { focusScore, sortTasks, useDoneOn, useOpenTasks, useProjectMap, useProjects, useToday } from '../lib/hooks';
import { addDays, greeting, longDate } from '../lib/dates';
import { getStreak } from '../lib/engine';
import { db } from '../db/db';
import { useUI } from '../lib/ui';
import { useTaskActions } from '../lib/actions';
import { CHANNEL_META } from '../data/channels';
import type { Task } from '../types';
import { EventNudge } from '../components/EventNudge';

export default function Today() {
  const T = useToday();
  const open = useOpenTasks();
  const doneToday = useDoneOn(T);
  const projects = useProjects();
  const pmap = useProjectMap();
  const [filter, setFilter] = useState<string>('all');
  const [showDone, setShowDone] = useState(false);
  const streak = useLiveQuery(() => getStreak(), [doneToday.length, T]) ?? 0;
  const ownerName = useLiveQuery(() => db.settings.get('name').then((r) => (r?.value as string) || 'Shareef'), []) ?? 'Shareef';

  const { overdue, todays, next, focus, counts } = useMemo(() => {
    const all = open ?? [];
    const counts: Record<string, number> = {};
    for (const t of all) if (t.due <= T && t.projectId) counts[t.projectId] = (counts[t.projectId] ?? 0) + 1;
    const f = filter === 'all' ? all : all.filter((t) => (filter === 'personal' ? !t.projectId : t.projectId === filter));
    const weekEnd = addDays(T, 7);
    const overdue = f.filter((t) => t.due < T).sort(sortTasks);
    const todays = f.filter((t) => t.due === T).sort(sortTasks);
    const next = f.filter((t) => t.due > T && t.due <= weekEnd).sort(sortTasks);
    const focus = [...overdue, ...todays].sort((a, b) => focusScore(b, T) - focusScore(a, T))[0];
    return { overdue, todays, next, focus, counts };
  }, [open, filter, T]);

  const doneFiltered = filter === 'all' ? doneToday : doneToday.filter((t) => (filter === 'personal' ? !t.projectId : t.projectId === filter));
  const total = doneFiltered.length + overdue.length + todays.length;
  const minutesLeft = [...overdue, ...todays].reduce((s, t) => s + t.estMinutes, 0);

  if (!open) return null;

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      {/* Header */}
      <header className="flex items-center justify-between pt-5">
        <div>
          <div className="faint text-xs font-semibold uppercase tracking-wider">{longDate(T)}</div>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight">
            {greeting()}, <span className="grad-text">{ownerName}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/search" aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
            <Search size={19} />
          </Link>
          <Link to="/settings" aria-label="Settings" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
            <Settings size={19} />
          </Link>
        </div>
      </header>

      {/* Stats row */}
      <section className="card mt-4 flex items-center gap-4 p-4">
        <ProgressRing done={doneFiltered.length} total={total} />
        <div className="grid flex-1 grid-cols-3 gap-2 text-center">
          <Stat value={overdue.length} label="Overdue" color="var(--red)" />
          <Stat value={todays.length} label="Today" color="var(--amber)" />
          <div>
            <div className="flex items-center justify-center gap-1 text-2xl font-extrabold">
              <Flame size={20} className={streak > 0 ? 'text-orange-400' : 'faint'} />
              {streak}
            </div>
            <div className="faint text-[11px] font-semibold uppercase">Streak</div>
          </div>
          <div className="faint col-span-3 text-xs">{minutesLeft > 0 ? `≈ ${Math.floor(minutesLeft / 60) ? Math.floor(minutesLeft / 60) + 'h ' : ''}${minutesLeft % 60}m of work left` : 'All clear for today 🎉'}</div>
        </div>
      </section>

      {/* Next Up */}
      <AnimatePresence mode="wait">{focus && <NextUp key={focus.id} task={focus} projectName={focus.projectId ? pmap[focus.projectId]?.name : undefined} color={focus.projectId ? pmap[focus.projectId]?.color : undefined} />}</AnimatePresence>

      <EventNudge />

      <div className="mt-4">
        <QuickAddBar />
      </div>

      {/* Project filter */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        <button className={`chip ${filter === 'all' ? 'chip-on' : ''}`} onClick={() => setFilter('all')}>
          All
        </button>
        {projects.map((p) => (
          <button key={p.id} className={`chip ${filter === p.id ? 'chip-on' : ''}`} onClick={() => setFilter(filter === p.id ? 'all' : p.id)}>
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
            {counts[p.id] ? <span className="rounded-full px-1.5 text-[10px] font-bold text-white" style={{ background: p.color }}>{counts[p.id]}</span> : null}
          </button>
        ))}
        <button className={`chip ${filter === 'personal' ? 'chip-on' : ''}`} onClick={() => setFilter(filter === 'personal' ? 'all' : 'personal')}>
          Personal
        </button>
      </div>

      <Section emoji="🔴" title="Overdue" count={overdue.length} tone="var(--red)" empty="Nothing overdue. Great work! 💪">
        {overdue.map((t) => (
          <TaskCard key={t.id} task={t} project={t.projectId ? pmap[t.projectId] : undefined} />
        ))}
      </Section>

      <Section emoji="🟡" title="Today" count={todays.length} tone="var(--amber)" empty="Nothing scheduled today. Pick a Pro Move from the Library 🚀">
        {todays.map((t) => (
          <TaskCard key={t.id} task={t} project={t.projectId ? pmap[t.projectId] : undefined} showDate={false} />
        ))}
      </Section>

      <Section emoji="🟢" title="Next 7 days" count={next.length} tone="var(--green)" empty="Next 7 days are empty." collapsible>
        {next.map((t) => (
          <TaskCard key={t.id} task={t} project={t.projectId ? pmap[t.projectId] : undefined} />
        ))}
      </Section>

      {doneFiltered.length > 0 && (
        <div className="mt-6">
          <button className="section-title faint" onClick={() => setShowDone(!showDone)}>
            ✅ Done ({doneFiltered.length}) <ChevronDown size={16} className={`transition ${showDone ? 'rotate-180' : ''}`} />
          </button>
          {showDone && (
            <div className="mt-3">
              {doneFiltered.map((t) => (
                <TaskCard key={t.id} task={t} project={t.projectId ? pmap[t.projectId] : undefined} showDate={false} />
              ))}
            </div>
          )}
        </div>
      )}

      <p className="faint mt-8 text-center text-xs">Swipe right → Done · Swipe left → Tomorrow</p>
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold" style={{ color: value ? color : 'var(--faint)' }}>
        {value}
      </div>
      <div className="faint text-[11px] font-semibold uppercase">{label}</div>
    </div>
  );
}

function Section({ emoji, title, count, tone, empty, children, collapsible }: { emoji: string; title: string; count: number; tone: string; empty: string; children: ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-6">
      <button className="section-title mb-3 w-full" onClick={() => collapsible && setOpen(!open)}>
        <span>{emoji}</span>
        <span>{title}</span>
        <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ background: 'var(--input)', color: count ? tone : 'var(--faint)' }}>
          {count}
        </span>
        {collapsible && <ChevronDown size={16} className={`faint ml-auto transition ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && (count === 0 ? <div className="faint rounded-2xl border border-dashed px-4 py-5 text-center text-sm" style={{ borderColor: 'var(--border)' }}>{empty}</div> : <AnimatePresence initial={false}>{children}</AnimatePresence>)}
    </section>
  );
}

function NextUp({ task, projectName, color }: { task: Task; projectName?: string; color?: string }) {
  const { openTask, openStuck, openFocus } = useUI();
  const actions = useTaskActions();
  const ch = task.channel ? CHANNEL_META[task.channel] : null;
  return (
    <motion.section initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative mt-4 overflow-hidden rounded-3xl p-[1.5px]" style={{ background: 'var(--grad)' }}>
      <div className="rounded-[22px] p-5" style={{ background: 'var(--card-solid)' }}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="grad-text">⚡ Next Up</span>
          {projectName && (
            <span className="faint inline-flex items-center gap-1 normal-case tracking-normal">
              · <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {projectName}
            </span>
          )}
        </div>
        <button className="mt-2 block text-left text-xl font-bold leading-snug" onClick={() => openTask(task.id)}>
          {task.title}
        </button>
        <div className="muted mt-1.5 text-sm">
          {ch ? `${ch.emoji} ${task.channel} · ` : ''}
          {task.estMinutes} min{task.subtasks.length ? ` · ${task.subtasks.length} steps` : ''}
          {task.dueTime ? ` · 🕑 ${task.dueTime}` : ''}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
          <button className="btn-primary" onClick={() => actions.complete(task.id)}>
            <Check size={18} /> Done
          </button>
          <button className="btn-ghost" onClick={() => openFocus(task.id)} aria-label="Focus mode">
            <Timer size={18} />
          </button>
          <button className="btn-ghost" onClick={() => openStuck(task.id)} aria-label="I'm stuck">
            <LifeBuoy size={18} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
