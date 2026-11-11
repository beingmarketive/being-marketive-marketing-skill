import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { parseQuickAdd } from '../lib/quickAdd';
import { addTask } from '../lib/engine';
import { useProjects } from '../lib/hooks';
import { haptic, useUI } from '../lib/ui';

const EXAMPLES = ['Trendy Prints GBP post tomorrow', 'Cloudforz LinkedIn post every monday', 'BM write blog today urgent', 'RN World reel friday 5pm', 'Marketomate carousel daily'];

export function QuickAddBar({ autoFocus = false, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const projects = useProjects();
  const { showToast, newTask } = useUI();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const parsed = useMemo(() => (text.trim() ? parseQuickAdd(text, projects) : null), [text, projects]);
  const placeholder = useMemo(() => EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)], []);

  const submit = async () => {
    if (!parsed) return;
    haptic(10);
    await addTask({
      title: parsed.title,
      projectId: parsed.projectId,
      channel: parsed.channel,
      due: parsed.due,
      dueTime: parsed.dueTime,
      recurrence: parsed.recurrence,
      priority: parsed.priority,
      estMinutes: parsed.estMinutes,
      startsChain: parsed.startsChain
    });
    showToast(`Added: ${parsed.title}`);
    setText('');
    onDone?.();
  };

  return (
    <div className="card p-2">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Sparkles size={18} className="ml-2 shrink-0" style={{ color: 'var(--accent)' }} />
        <input
          className="min-h-[46px] flex-1 bg-transparent text-[15px] outline-none placeholder:text-[color:var(--faint)]"
          placeholder={`"${placeholder}"`}
          value={text}
          autoFocus={autoFocus}
          enterKeyHint="done"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={(e) => setText(e.target.value)}
          aria-label="Quick add task"
        />
        {parsed ? (
          <button type="submit" aria-label="Add" className="grad-bg grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white">
            <ArrowUp size={20} />
          </button>
        ) : (
          <button type="button" aria-label="Detailed task" onClick={() => newTask()} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl muted" style={{ background: 'var(--input)' }}>
            <SlidersHorizontal size={18} />
          </button>
        )}
      </form>
      <AnimatePresence>
        {parsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1.5 px-2 pb-1 pt-2">
              <span className="text-sm font-semibold">{parsed.title}</span>
              {parsed.hints.map((h) => (
                <span key={h} className="rounded-full px-2 py-0.5 text-xs font-medium muted" style={{ background: 'var(--input)' }}>
                  {h}
                </span>
              ))}
              <button
                type="button"
                className="ml-auto text-xs font-semibold"
                style={{ color: 'var(--accent)' }}
                onClick={() => {
                  newTask({ title: parsed.title, projectId: parsed.projectId, channel: parsed.channel, due: parsed.due, dueTime: parsed.dueTime, recurrence: parsed.recurrence, priority: parsed.priority, estMinutes: parsed.estMinutes, startsChain: parsed.startsChain });
                  setText('');
                }}
              >
                Edit details →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {focused && !text && (
        <div className="faint px-2 pb-1 pt-2 text-xs leading-relaxed">
          Try: <b>today · tomorrow · monday · 15 nov · 5pm · daily · weekly · monthly · every 3 days · urgent · 30m</b> + project name
        </div>
      )}
    </div>
  );
}
