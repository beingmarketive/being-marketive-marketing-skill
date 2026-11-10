import { useLiveQuery } from 'dexie-react-hooks';
import { db, setSetting } from '../db/db';
import { addDays, shortDate, startOfWeek } from '../lib/dates';
import { healthScores } from '../lib/health';
import { useProjects, useToday } from '../lib/hooks';
import { useUI } from '../lib/ui';
import { BackLink } from './ProjectDetail';
import { useNavigate } from 'react-router-dom';

export default function WeeklyReview() {
  const T = useToday();
  const nav = useNavigate();
  const { showToast } = useUI();
  const projects = useProjects();
  const weekStart = startOfWeek(T);
  const weekEnd = addDays(weekStart, 6);
  const data = useLiveQuery(async () => {
    const start = new Date(weekStart + 'T00:00:00').getTime();
    const done = await db.tasks.where('doneAt').between(start, start + 7 * 86400000).toArray();
    const misses = await db.history.where('due').between(weekStart, addDays(weekEnd, 1), true, false).filter((h) => h.status !== 'ontime').toArray();
    const next = await db.tasks.where('[status+due]').between(['todo', addDays(T, 1)], ['todo', addDays(T, 7)], true, true).toArray();
    const overdue = await db.tasks.where('[status+due]').between(['todo', ''], ['todo', T], true, false).toArray();
    return { done, misses, next, overdue, health: await healthScores() };
  }, [T, weekStart]);

  if (!data) return null;
  const rows = [...projects.map((p) => ({ id: p.id, name: p.name, color: p.color })), { id: '_personal', name: 'Personal', color: '#64748b' }];
  const totalDone = data.done.length;

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center gap-3 pt-4">
        <BackLink to="/tools" />
        <div>
          <h1 className="text-2xl font-extrabold">Weekly review</h1>
          <div className="faint text-xs">
            {shortDate(weekStart)} – {shortDate(weekEnd)}
          </div>
        </div>
      </header>

      <section className="card mt-4 p-4">
        <div className="text-3xl font-extrabold">
          {totalDone} <span className="faint text-base font-semibold">kaam is hafte ho gaye</span>
        </div>
        <div className="muted mt-1 text-sm">
          {data.misses.length} recurring late/missed · {data.overdue.length} abhi pending
        </div>
      </section>

      <h2 className="section-title mb-3 mt-6">📊 Project-wise</h2>
      <div className="space-y-2">
        {rows.map((r) => {
          const done = data.done.filter((t) => (t.projectId ?? '_personal') === r.id).length;
          const h = data.health[r.id];
          const score = h?.total ? h.score : null;
          if (!done && !h && r.id === '_personal') return null;
          return (
            <div key={r.id} className="card p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                  {r.name}
                </div>
                <div className="text-sm font-bold" style={{ color: score === null ? 'var(--faint)' : score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                  {score === null ? '—' : `❤ ${score}%`}
                </div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: 'var(--input)' }}>
                <div className="h-full rounded-full" style={{ width: `${score ?? 0}%`, background: r.color }} />
              </div>
              <div className="faint mt-1.5 text-xs">
                {done} done this week{h ? ` · 14d: ${h.ontime} on-time, ${h.late} late, ${h.missed} missed` : ''}
              </div>
            </div>
          );
        })}
      </div>
      <p className="faint mt-2 text-xs">Health = last 14 din mein recurring tasks ka on-time %.</p>

      {data.misses.length > 0 && (
        <>
          <h2 className="section-title mb-3 mt-6">⚠️ Missed / late recurring</h2>
          <div className="space-y-1.5">
            {data.misses.slice(0, 20).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm" style={{ background: 'var(--input)' }}>
                <span className="truncate pr-2">{m.title}</span>
                <span className={`shrink-0 text-xs font-bold ${m.status === 'missed' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {m.status} · {shortDate(m.due)}
                </span>
              </div>
            ))}
          </div>
          <p className="faint mt-2 text-xs">Baar baar miss ho raha hai? Frequency kam karo ya time block fix karo — consistency {'>'} volume.</p>
        </>
      )}

      <h2 className="section-title mb-3 mt-6">🗓 Next week ka plan ({data.next.length})</h2>
      <div className="space-y-2">
        {rows.map((r) => {
          const list = data.next.filter((t) => (t.projectId ?? '_personal') === r.id);
          if (!list.length) return null;
          return (
            <div key={r.id} className="card p-3.5">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
                <span className="h-2 w-2 rounded-full" style={{ background: r.color }} /> {r.name} · {list.length}
              </div>
              <ul className="muted space-y-1 text-sm">
                {list.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex justify-between gap-2">
                    <span className="truncate">{t.title}</span>
                    <span className="faint shrink-0 text-xs">{shortDate(t.due)}</span>
                  </li>
                ))}
                {list.length > 6 && <li className="faint text-xs">+{list.length - 6} more</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <button
        className="btn-primary mt-6 w-full"
        onClick={async () => {
          await setSetting('lastReview', T);
          showToast('Weekly review done ✅ Agla hafta strong!');
          nav('/');
        }}
      >
        Review complete
      </button>
    </div>
  );
}
