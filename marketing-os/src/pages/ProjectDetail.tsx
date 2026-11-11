import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Archive, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BrandIdeas } from '../components/BrandIdeas';
import { db } from '../db/db';
import { TaskCard } from '../components/TaskCard';
import { ProjectForm } from '../components/ProjectForm';
import { getIndustry } from '../data/industries';
import { CHANNEL_META } from '../data/channels';
import { sortTasks, useToday } from '../lib/hooks';
import { describeRecurrence } from '../lib/recurrence';
import { healthScores } from '../lib/health';
import { useUI } from '../lib/ui';
import { KpiLog } from '../components/KpiLog';
import { prettyDate } from '../lib/dates';

export default function ProjectDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const T = useToday();
  const { newTask, openTask, showToast } = useUI();
  const [edit, setEdit] = useState(false);
  const [params] = useSearchParams();
  const [tab, setTab] = useState<'tasks' | 'ideas' | 'recurring' | 'kpi'>((params.get('tab') as 'ideas') || 'tasks');
  const project = useLiveQuery(() => db.projects.get(id), [id]);
  const tasks = useLiveQuery(() => db.tasks.where('projectId').equals(id).filter((t) => t.status === 'todo').toArray(), [id]) ?? [];
  const health = useLiveQuery(() => healthScores().then((h) => h[id]), [id, T]);

  if (!project) return null;
  const pack = getIndustry(project.industryId);
  const overdue = tasks.filter((t) => t.due < T).length;
  const recurring = tasks.filter((t) => t.recurrence).sort((a, b) => a.title.localeCompare(b.title));
  const score = health?.total ? health.score : null;

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center justify-between pt-4">
        <button onClick={() => nav(-1)} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button aria-label="Edit project" onClick={() => setEdit(true)} className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
            <Pencil size={18} />
          </button>
          <button
            aria-label="Archive project"
            onClick={async () => {
              if (!confirm(`Archive ${project.name}? Its open tasks stay on Today until you delete them.`)) return;
              await db.projects.update(id, { archived: true });
              showToast('Project archived');
              nav('/projects');
            }}
            className="grid h-11 w-11 place-items-center rounded-full"
            style={{ background: 'var(--input)' }}
          >
            <Archive size={18} />
          </button>
          <button
            aria-label="Delete project"
            onClick={async () => {
              if (!confirm(`Delete ${project.name} permanently? Its tasks, ideas and KPI entries will be deleted too.`)) return;
              await db.transaction('rw', [db.projects, db.tasks, db.ideas, db.kpis], async () => {
                await db.tasks.where('projectId').equals(id).delete();
                await db.ideas.where('projectId').equals(id).delete();
                await db.kpis.where('projectId').equals(id).delete();
                await db.projects.delete(id);
              });
              showToast('Project deleted');
              nav('/projects');
            }}
            className="grid h-11 w-11 place-items-center rounded-full text-rose-400"
            style={{ background: 'var(--input)' }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <section className="card relative mt-4 overflow-hidden p-5">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: project.color }} />
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: project.color + '22' }}>
            {project.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold">{project.name}</h1>
            <div className="faint text-xs">
              {pack?.name}
              {project.website && (
                <>
                  {' · '}
                  <a href={project.website} target="_blank" rel="noreferrer" className="underline">
                    {project.website.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl py-2" style={{ background: 'var(--input)' }}>
            <div className="text-2xl font-extrabold" style={{ color: score === null ? 'var(--faint)' : score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)' }}>
              {score === null ? '—' : `${score}%`}
            </div>
            <div className="faint text-[10px] font-semibold uppercase">Health (14d)</div>
          </div>
          <div className="rounded-xl py-2" style={{ background: 'var(--input)' }}>
            <div className="text-2xl font-extrabold" style={{ color: overdue ? 'var(--red)' : 'var(--faint)' }}>
              {overdue}
            </div>
            <div className="faint text-[10px] font-semibold uppercase">Pending</div>
          </div>
          <div className="rounded-xl py-2" style={{ background: 'var(--input)' }}>
            <div className="text-2xl font-extrabold">{recurring.length}</div>
            <div className="faint text-[10px] font-semibold uppercase">Recurring</div>
          </div>
        </div>
        {health && health.total > 0 && (
          <div className="faint mt-2 text-center text-xs">
            Last 14 din: {health.ontime} on-time · {health.late} late · {health.missed} missed
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.channels.map((c) => (
            <span key={c} className="chip !min-h-[28px] !text-xs">
              {CHANNEL_META[c].emoji} {c}
            </span>
          ))}
        </div>
        {project.notes && <p className="muted mt-3 whitespace-pre-wrap text-sm">{project.notes}</p>}
      </section>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
        {(['tasks', 'ideas', 'recurring', 'kpi'] as const).map((t) => (
          <button key={t} className={`chip ${tab === t ? 'chip-on' : ''}`} onClick={() => setTab(t)}>
            {t === 'tasks' ? `Open (${tasks.length})` : t === 'ideas' ? '💡 Ideas' : t === 'recurring' ? 'Recurring' : 'KPI log'}
          </button>
        ))}
        <button className="chip" onClick={() => newTask({ projectId: id })}>
          <Plus size={14} /> Task
        </button>
      </div>

      <div className="mt-4">
        {tab === 'tasks' &&
          (tasks.length ? (
            [...tasks].sort(sortTasks).map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <div className="faint py-8 text-center text-sm">No open tasks.</div>
          ))}
        {tab === 'recurring' && (
          <div className="space-y-2">
            {recurring.map((t) => (
              <button key={t.id} onClick={() => openTask(t.id)} className="card flex w-full items-center justify-between gap-3 p-3.5 text-left">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {t.channel ? CHANNEL_META[t.channel].emoji : '•'} {t.title}
                  </div>
                  <div className="faint text-xs">{describeRecurrence(t.recurrence)}</div>
                </div>
                <span className="faint shrink-0 text-xs">Next: {prettyDate(t.due)}</span>
              </button>
            ))}
            {!recurring.length && <div className="faint py-8 text-center text-sm">No recurring tasks. Edit the project to apply an industry pack.</div>}
          </div>
        )}
        {tab === 'ideas' && <BrandIdeas projectId={id} />}
        {tab === 'kpi' && <KpiLog project={project} />}
      </div>

      <ProjectForm open={edit} onClose={() => setEdit(false)} project={project} />
    </div>
  );
}

export function BackLink({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
      <ArrowLeft size={20} />
    </Link>
  );
}
