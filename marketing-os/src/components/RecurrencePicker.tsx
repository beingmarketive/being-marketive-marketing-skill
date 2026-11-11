import type { Recurrence } from '../types';
import { WEEKDAY_SHORT, fromISO, weekday } from '../lib/dates';

type Kind = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export function RecurrencePicker({ value, onChange, due }: { value?: Recurrence; onChange: (r?: Recurrence) => void; due: string }) {
  const kind: Kind = value?.type ?? 'none';
  const set = (k: Kind) => {
    if (k === 'none') onChange(undefined);
    if (k === 'daily') onChange({ type: 'daily' });
    if (k === 'weekly') onChange({ type: 'weekly', days: [weekday(due)] });
    if (k === 'monthly') onChange({ type: 'monthly', dayOfMonth: fromISO(due).getDate() });
    if (k === 'custom') onChange({ type: 'custom', everyDays: 2 });
  };
  const labels: Record<Kind, string> = { none: 'Once', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', custom: 'Custom' };
  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {(Object.keys(labels) as Kind[]).map((k) => (
          <button type="button" key={k} className={`chip ${kind === k ? 'chip-on' : ''}`} onClick={() => set(k)}>
            {labels[k]}
          </button>
        ))}
      </div>
      {value?.type === 'weekly' && (
        <div className="mt-3 flex justify-between gap-1">
          {WEEKDAY_SHORT.map((d, i) => {
            const on = value.days.includes(i);
            return (
              <button
                type="button"
                key={d}
                onClick={() => {
                  const days = on ? value.days.filter((x) => x !== i) : [...value.days, i];
                  onChange({ type: 'weekly', days: days.length ? days.sort() : [i] });
                }}
                className="h-11 flex-1 rounded-xl text-xs font-bold transition"
                style={{ background: on ? 'var(--accent)' : 'var(--input)', color: on ? '#fff' : 'var(--muted)' }}
              >
                {d.slice(0, 2)}
              </button>
            );
          })}
        </div>
      )}
      {value?.type === 'monthly' && (
        <label className="mt-3 flex items-center gap-3 text-sm muted">
          Every month on day
          <input type="number" min={1} max={31} value={value.dayOfMonth} onChange={(e) => onChange({ type: 'monthly', dayOfMonth: Math.min(31, Math.max(1, Number(e.target.value) || 1)) })} className="input !w-20 text-center" />
        </label>
      )}
      {value?.type === 'custom' && (
        <label className="mt-3 flex items-center gap-3 text-sm muted">
          Every
          <input type="number" min={1} max={90} value={value.everyDays} onChange={(e) => onChange({ type: 'custom', everyDays: Math.min(90, Math.max(1, Number(e.target.value) || 1)) })} className="input !w-20 text-center" />
          days
        </label>
      )}
    </div>
  );
}
