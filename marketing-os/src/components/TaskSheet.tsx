import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { Check, Trash2, AlarmClockOff, Plus, X, LifeBuoy, Timer } from 'lucide-react';
import { db } from '../db/db';
import { Sheet } from './Sheet';
import { RecurrencePicker } from './RecurrencePicker';
import { useUI } from '../lib/ui';
import { useProjects } from '../lib/hooks';
import { addTask, deleteTask, updateTask, type NewTask } from '../lib/engine';
import { useTaskActions } from '../lib/actions';
import { CHANNELS, type Channel, type Priority, type Recurrence, type Subtask, type Task } from '../types';
import { CHANNEL_META, PRIORITY_META } from '../data/channels';
import { CHAINS, CHAIN_BY_ID } from '../data/chains';
import { uid } from '../lib/id';
import { today } from '../lib/dates';
import { describeRecurrence } from '../lib/recurrence';

type Form = {
  title: string;
  projectId: string | null;
  channel: Channel | null;
  due: string;
  dueTime: string;
  priority: Priority;
  estMinutes: number;
  notes: string;
  subtasks: Subtask[];
  recurrence?: Recurrence;
  startsChain?: string;
  topic: string;
};

function toForm(t: Partial<Task> | NewTask): Form {
  return {
    title: t.title ?? '',
    projectId: t.projectId ?? null,
    channel: t.channel ?? null,
    due: t.due ?? today(),
    dueTime: t.dueTime ?? '',
    priority: t.priority ?? 2,
    estMinutes: t.estMinutes ?? 20,
    notes: t.notes ?? '',
    subtasks: (t.subtasks ?? []).map((s) => (typeof s === 'string' ? { id: uid('st_'), text: s, done: false } : s)),
    recurrence: t.recurrence,
    startsChain: t.startsChain,
    topic: (t as Task).topic ?? ''
  };
}

export function TaskSheet() {
  const { taskId, draft, closeTask, openStuck, openFocus, showToast } = useUI();
  const task = useLiveQuery(() => (taskId ? db.tasks.get(taskId) : undefined), [taskId]);
  const projects = useProjects();
  const actions = useTaskActions();
  const [f, setF] = useState<Form | null>(null);
  const [newSub, setNewSub] = useState('');
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const open = !!taskId || !!draft;
  const isNew = !!draft;

  useEffect(() => {
    if (draft) setF(toForm(draft));
    else if (task && loadedId !== task.id) {
      setF(toForm(task));
      setLoadedId(task.id);
    }
    if (!open) {
      setF(null);
      setLoadedId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, task, open]);

  if (!open || !f) return <Sheet open={false} onClose={closeTask}>{null}</Sheet>;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF({ ...f, [k]: v });

  // edits to an existing task save immediately on blur/change
  const persist = async (patch: Partial<Form>) => {
    const next = { ...f, ...patch };
    setF(next);
    if (isNew || !task) return;
    const p: Partial<Task> = { ...patch, dueTime: next.dueTime || undefined } as Partial<Task>;
    if ('recurrence' in patch) {
      if (patch.recurrence && !task.seriesId) Object.assign(p, { seriesId: uid('s_'), anchor: next.due });
      if (!patch.recurrence) Object.assign(p, { seriesId: undefined, anchor: undefined });
    }
    await updateTask(task.id, p);
  };

  const save = async () => {
    if (!f.title.trim()) return;
    await addTask({ ...f, dueTime: f.dueTime || undefined, source: draft?.source ?? 'manual', playbookId: draft?.playbookId, chain: draft?.chain });
    showToast('Task added ✨');
    closeTask();
  };

  const toggleSub = (id: string) => persist({ subtasks: f.subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)) });
  const addSub = () => {
    if (!newSub.trim()) return;
    persist({ subtasks: [...f.subtasks, { id: uid('st_'), text: newSub.trim(), done: false }] });
    setNewSub('');
  };

  const footer = isNew ? (
    <button className="btn-primary mb-1 w-full" onClick={save} disabled={!f.title.trim()}>
      <Plus size={18} /> Add task
    </button>
  ) : task?.status === 'todo' ? (
    <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-2">
      <button
        className="btn-primary"
        onClick={async () => {
          closeTask();
          await actions.complete(task.id);
        }}
      >
        <Check size={18} /> Done
      </button>
      <button
        className="btn-ghost"
        aria-label="Snooze to tomorrow"
        onClick={async () => {
          closeTask();
          await actions.snooze(task.id);
        }}
      >
        <AlarmClockOff size={18} /> Tomorrow
      </button>
      <button
        className="btn-ghost"
        aria-label="Delete"
        onClick={async () => {
          if (!confirm(task.recurrence ? 'This is a recurring task. Deleting it stops the whole series. Delete?' : 'Delete this task?')) return;
          closeTask();
          await deleteTask(task.id);
          showToast('Task deleted');
        }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  ) : (
    <div className="faint mb-1 py-2 text-center text-sm">✅ This task is done</div>
  );

  return (
    <Sheet open={open} onClose={closeTask} title={isNew ? 'New task' : 'Task'} full footer={footer}>
      <textarea
        className="input mb-4 min-h-[60px] resize-none !text-lg font-semibold"
        placeholder="What needs to be done?"
        value={f.title}
        rows={2}
        autoFocus={isNew}
        onChange={(e) => set('title', e.target.value)}
        onBlur={() => !isNew && persist({ title: f.title })}
      />

      {!isNew && task && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            className="btn-ghost !min-h-[50px] !justify-start"
            onClick={() => {
              closeTask();
              openStuck(task.id);
            }}
          >
            <LifeBuoy size={18} className="text-amber-400" /> I'm stuck
          </button>
          <button
            className="btn-ghost !min-h-[50px] !justify-start"
            onClick={() => {
              closeTask();
              openFocus(task.id);
            }}
          >
            <Timer size={18} className="text-cyan-400" /> Focus 25 min
          </button>
        </div>
      )}

      <div className="mb-4">
        <span className="label">Project</span>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          <button className={`chip ${!f.projectId ? 'chip-on' : ''}`} onClick={() => persist({ projectId: null })}>
            Personal
          </button>
          {projects.map((p) => (
            <button key={p.id} className={`chip ${f.projectId === p.id ? 'chip-on' : ''}`} onClick={() => persist({ projectId: p.id })}>
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="label">Channel</span>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button key={c} className={`chip ${f.channel === c ? 'chip-on' : ''}`} onClick={() => persist({ channel: f.channel === c ? null : c })}>
              {CHANNEL_META[c].emoji} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label>
          <span className="label">Due date</span>
          <input type="date" className="input" value={f.due} onChange={(e) => e.target.value && persist({ due: e.target.value })} />
        </label>
        <label>
          <span className="label">Time (optional)</span>
          <input type="time" className="input" value={f.dueTime} onChange={(e) => persist({ dueTime: e.target.value })} />
        </label>
      </div>

      <div className="mb-4 grid grid-cols-[1fr_110px] gap-3">
        <div>
          <span className="label">Priority</span>
          <div className="grid grid-cols-3 gap-1.5">
            {([1, 2, 3] as Priority[]).map((p) => (
              <button key={p} className="h-[46px] rounded-xl text-sm font-semibold transition" onClick={() => persist({ priority: p })} style={{ background: f.priority === p ? PRIORITY_META[p].color : 'var(--input)', color: f.priority === p ? '#fff' : 'var(--muted)' }}>
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span className="label">Minutes</span>
          <input type="number" min={5} step={5} className="input text-center" value={f.estMinutes} onChange={(e) => set('estMinutes', Number(e.target.value) || 0)} onBlur={() => persist({ estMinutes: Math.max(5, f.estMinutes) })} />
        </label>
      </div>

      <div className="mb-4">
        <span className="label">Repeat · {describeRecurrence(f.recurrence)}</span>
        <RecurrencePicker value={f.recurrence} due={f.due} onChange={(r) => persist({ recurrence: r })} />
      </div>

      <div className="mb-4">
        <span className="label">After done (chain)</span>
        {task?.chain ? (
          <div className="rounded-xl p-3 text-sm muted" style={{ background: 'var(--input)' }}>
            ⛓ {CHAIN_BY_ID[task.chain.chainId]?.name} · step {task.chain.step + 1}/{CHAIN_BY_ID[task.chain.chainId]?.steps.length}
          </div>
        ) : (
          <select className="input" value={f.startsChain ?? ''} onChange={(e) => persist({ startsChain: e.target.value || undefined })}>
            <option value="">Nothing</option>
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        {f.startsChain && !task?.chain && (
          <input className="input mt-2" placeholder="Topic / title (e.g. blog title) — used to name the next steps" value={f.topic} onChange={(e) => set('topic', e.target.value)} onBlur={() => persist({ topic: f.topic })} />
        )}
      </div>

      <div className="mb-4">
        <span className="label">
          Checklist {f.subtasks.length > 0 && `· ${f.subtasks.filter((s) => s.done).length}/${f.subtasks.length}`}
        </span>
        <div className="space-y-1.5">
          {f.subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2 rounded-xl px-2" style={{ background: 'var(--input)' }}>
              <button onClick={() => toggleSub(s.id)} className="flex min-h-[44px] flex-1 items-center gap-3 text-left text-sm">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2" style={{ borderColor: s.done ? 'var(--green)' : 'var(--faint)', background: s.done ? 'var(--green)' : 'transparent' }}>
                  {s.done && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                <span className={s.done ? 'faint line-through' : ''}>{s.text}</span>
              </button>
              <button aria-label="Remove" className="faint p-2" onClick={() => persist({ subtasks: f.subtasks.filter((x) => x.id !== s.id) })}>
                <X size={14} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input className="input" placeholder="Add a step…" value={newSub} onChange={(e) => setNewSub(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSub()} />
            <button className="btn-ghost" onClick={addSub} aria-label="Add step">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <label className="block">
        <span className="label">Notes</span>
        <textarea className="input min-h-[90px]" value={f.notes} placeholder="Links, brief, client feedback…" onChange={(e) => set('notes', e.target.value)} onBlur={() => persist({ notes: f.notes })} />
      </label>
    </Sheet>
  );
}
