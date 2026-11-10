import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check, Clock, Link2, Repeat, AlarmClockOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { CHANNEL_META, PRIORITY_META } from '../data/channels';
import { prettyDate, today } from '../lib/dates';
import type { Project, Task } from '../types';
import { useUI, haptic } from '../lib/ui';
import { useTaskActions } from '../lib/actions';

const THRESHOLD = 96;

export function TaskCard({ task, project, showDate = true }: { task: Task; project?: Project; showDate?: boolean }) {
  const { openTask } = useUI();
  const actions = useTaskActions();
  const x = useMotionValue(0);
  const [armed, setArmed] = useState<'done' | 'snooze' | null>(null);
  const dragging = useRef(false);
  const doneOpacity = useTransform(x, [0, THRESHOLD], [0, 1]);
  const snoozeOpacity = useTransform(x, [-THRESHOLD, 0], [1, 0]);
  const subDone = task.subtasks.filter((s) => s.done).length;
  const ch = task.channel ? CHANNEL_META[task.channel] : null;
  const isDone = task.status === 'done';

  const finish = async (kind: 'done' | 'snooze') => {
    await animate(x, kind === 'done' ? 500 : -500, { duration: 0.22 });
    if (kind === 'done') await actions.complete(task.id);
    else await actions.snooze(task.id);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="relative mb-2.5 overflow-hidden rounded-2xl">
      {/* swipe backgrounds */}
      <motion.div style={{ opacity: doneOpacity }} className="absolute inset-0 flex items-center rounded-2xl bg-emerald-500 pl-5 font-bold text-white">
        <Check size={20} className="mr-2" /> Ho gaya
      </motion.div>
      <motion.div style={{ opacity: snoozeOpacity }} className="absolute inset-0 flex items-center justify-end rounded-2xl bg-amber-500 pr-5 font-bold text-white">
        Kal <AlarmClockOff size={20} className="ml-2" />
      </motion.div>

      <motion.div
        drag={isDone ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => {
          dragging.current = true;
        }}
        onDrag={(_, info) => {
          const a = info.offset.x > THRESHOLD ? 'done' : info.offset.x < -THRESHOLD ? 'snooze' : null;
          if (a !== armed) {
            if (a) haptic(6);
            setArmed(a);
          }
        }}
        onDragEnd={(_, info) => {
          setArmed(null);
          window.setTimeout(() => (dragging.current = false), 80);
          if (info.offset.x > THRESHOLD) finish('done');
          else if (info.offset.x < -THRESHOLD) finish('snooze');
        }}
        className="card relative flex items-stretch gap-3 !rounded-2xl p-3.5"
        style={{ x, background: 'var(--card-solid)' }}
      >
        <button
          aria-label={isDone ? 'Done' : 'Mark done'}
          onClick={(e) => {
            e.stopPropagation();
            if (dragging.current) return;
            if (!isDone) finish('done');
          }}
          className="grid h-8 w-8 shrink-0 place-items-center self-center rounded-full border-2 transition active:scale-90"
          style={{ borderColor: isDone ? 'var(--green)' : PRIORITY_META[task.priority].color, background: isDone ? 'var(--green)' : 'transparent' }}
        >
          {isDone && <Check size={16} className="text-white" strokeWidth={3} />}
        </button>

        <button className="min-w-0 flex-1 text-left" onClick={() => !dragging.current && openTask(task.id)}>
          <div className={`text-[15px] font-semibold leading-snug ${isDone ? 'faint line-through' : ''}`}>{task.title}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs muted">
            {project && (
              <span className="inline-flex items-center gap-1 font-medium">
                <span className="h-2 w-2 rounded-full" style={{ background: project.color }} />
                {project.name}
              </span>
            )}
            {ch && (
              <span>
                {ch.emoji} {task.channel}
              </span>
            )}
            {showDate && <span className={task.due < today() && !isDone ? 'font-semibold text-rose-400' : ''}>{prettyDate(task.due)}</span>}
            {task.dueTime && <span>🕑 {task.dueTime}</span>}
            <span className="inline-flex items-center gap-0.5">
              <Clock size={11} /> {task.estMinutes}m
            </span>
            {task.recurrence && <Repeat size={12} aria-label="recurring" />}
            {(task.chain || task.startsChain) && <Link2 size={12} aria-label="chain" />}
            {task.subtasks.length > 0 && (
              <span>
                ☑ {subDone}/{task.subtasks.length}
              </span>
            )}
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}
