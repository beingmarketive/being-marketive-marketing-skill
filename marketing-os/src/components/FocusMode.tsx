import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Pause, Play, RotateCcw, X, LifeBuoy } from 'lucide-react';
import { db } from '../db/db';
import { useUI, haptic } from '../lib/ui';
import { updateTask } from '../lib/engine';
import { useTaskActions } from '../lib/actions';

const LENGTHS = [25, 15, 50];

/** Fullscreen Pomodoro with the task checklist. Timer is wall-clock based so it survives the screen locking. */
export function FocusMode() {
  const { focusTaskId, openFocus, openStuck } = useUI();
  const actions = useTaskActions();
  const task = useLiveQuery(() => (focusTaskId ? db.tasks.get(focusTaskId) : undefined), [focusTaskId]);
  const [len, setLen] = useState(25);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [left, setLeft] = useState(25 * 60);
  const [pausedLeft, setPausedLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!focusTaskId) {
      setEndAt(null);
      setPausedLeft(null);
      setLeft(len * 60);
    }
  }, [focusTaskId, len]);

  useEffect(() => {
    if (!endAt) return;
    const tick = () => {
      const s = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        setEndAt(null);
        haptic([200, 100, 200, 100, 400]);
        try {
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Focus session complete ✅', { body: task?.title ?? '', icon: '/icons/icon-192.png' });
        } catch {
          /* ignore */
        }
      }
    };
    tick();
    const iv = window.setInterval(tick, 500);
    return () => window.clearInterval(iv);
  }, [endAt, task?.title]);

  const running = !!endAt;
  const total = len * 60;
  const pct = 1 - left / total;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const R = 120;
  const C = 2 * Math.PI * R;

  const start = () => {
    haptic(10);
    setEndAt(Date.now() + (pausedLeft ?? left) * 1000);
    setPausedLeft(null);
  };
  const pause = () => {
    setPausedLeft(left);
    setEndAt(null);
  };
  const reset = (n = len) => {
    setEndAt(null);
    setPausedLeft(null);
    setLen(n);
    setLeft(n * 60);
  };

  return (
    <AnimatePresence>
      {focusTaskId && task && (
        <motion.div className="fixed inset-0 z-[65] overflow-y-auto" style={{ background: 'var(--bg)' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
          <div className="pt-safe mx-auto flex min-h-full max-w-xl flex-col px-5 pb-10">
            <div className="flex items-center justify-between pt-4">
              <span className="faint text-xs font-bold uppercase tracking-widest">Focus mode</span>
              <button aria-label="Close focus" onClick={() => openFocus(null)} className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
                <X size={20} />
              </button>
            </div>
            <h2 className="mt-4 text-center text-xl font-bold leading-snug">{task.title}</h2>

            <div className="relative mx-auto mt-6 grid place-items-center" style={{ width: 280, height: 280 }}>
              <svg width={280} height={280} className="-rotate-90">
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx={140} cy={140} r={R} fill="none" stroke="var(--input)" strokeWidth={14} />
                <circle cx={140} cy={140} r={R} fill="none" stroke="url(#focusGrad)" strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
              </svg>
              <div className="absolute text-center">
                <div className="font-mono text-6xl font-extrabold tabular-nums">
                  {mm}:{ss}
                </div>
                <div className="faint mt-1 text-sm">{left === 0 ? 'Session complete 🎉' : running ? 'Focus…' : pausedLeft !== null ? 'Paused' : 'Ready'}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {LENGTHS.map((n) => (
                <button key={n} className={`chip ${len === n ? 'chip-on' : ''}`} onClick={() => reset(n)}>
                  {n} min
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr_auto] gap-2">
              <button className="btn-ghost" aria-label="Reset" onClick={() => reset()}>
                <RotateCcw size={18} />
              </button>
              {running ? (
                <button className="btn-ghost !min-h-[54px] text-lg" onClick={pause}>
                  <Pause size={20} /> Pause
                </button>
              ) : (
                <button className="btn-primary !min-h-[54px] text-lg" onClick={start} disabled={left === 0}>
                  <Play size={20} /> {pausedLeft !== null ? 'Resume' : 'Start'}
                </button>
              )}
              <button
                className="btn-ghost"
                aria-label="I'm stuck"
                onClick={() => {
                  openFocus(null);
                  openStuck(task.id);
                }}
              >
                <LifeBuoy size={18} />
              </button>
            </div>

            {task.subtasks.length > 0 && (
              <div className="card mt-6 p-4">
                <div className="section-title mb-2">
                  Checklist · {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
                </div>
                <div className="space-y-1.5">
                  {task.subtasks.map((s) => (
                    <button key={s.id} onClick={() => updateTask(task.id, { subtasks: task.subtasks.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)) })} className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 text-left text-[15px]" style={{ background: 'var(--input)' }}>
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2" style={{ borderColor: s.done ? 'var(--green)' : 'var(--faint)', background: s.done ? 'var(--green)' : 'transparent' }}>
                        {s.done && <Check size={12} strokeWidth={3} className="text-white" />}
                      </span>
                      <span className={s.done ? 'faint line-through' : ''}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {task.notes && <p className="muted mt-4 whitespace-pre-wrap text-sm">{task.notes}</p>}

            <div className="flex-1" />
            <button
              className="btn-primary mt-8 !min-h-[56px] w-full text-lg"
              onClick={async () => {
                openFocus(null);
                await actions.complete(task.id);
              }}
            >
              <Check size={20} /> Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
