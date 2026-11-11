import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { db } from '../db/db';
import { EVENTS } from '../data/calendar';
import { addDays, diffDays, fromISO, monthName, shortDate, toISO, WEEKDAY_SHORT } from '../lib/dates';
import { useProjectMap, useProjects, useToday } from '../lib/hooks';
import { TaskCard } from '../components/TaskCard';
import { createEventCampaign, eventStatus } from '../lib/campaigns';
import { useUI } from '../lib/ui';
import type { MarketingEvent } from '../types';
import { firstOnOrAfter, nextAfter } from '../lib/recurrence';

export default function Calendar() {
  const T = useToday();
  const [month, setMonth] = useState(() => {
    const d = fromISO(T);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(T);
  const pmap = useProjectMap();
  const open = useLiveQuery(() => db.tasks.where('status').equals('todo').toArray(), []) ?? [];

  const first = toISO(month);
  const gridStart = addDays(first, -((month.getDay() + 6) % 7)); // Monday start
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  /** Open tasks + projected future occurrences of recurring series (so the calendar shows the real load). */
  const byDay = useMemo(() => {
    const map: Record<string, number> = {};
    const end = days[41];
    for (const t of open) {
      if (t.due >= gridStart && t.due <= end) map[t.due] = (map[t.due] ?? 0) + 1;
      if (t.recurrence) {
        const anchor = t.anchor ?? t.due;
        let d = nextAfter(t.recurrence, t.due < T ? T : t.due, anchor);
        if (t.due < T) d = firstOnOrAfter(t.recurrence, addDays(T, 1), anchor);
        for (let i = 0; i < 60 && d <= end; i++) {
          if (d >= gridStart) map[d] = (map[d] ?? 0) + 1;
          d = nextAfter(t.recurrence, d, anchor);
        }
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, gridStart, T]);

  const eventsByDay = useMemo(() => {
    const m: Record<string, MarketingEvent[]> = {};
    for (const e of EVENTS) (m[e.date] ??= []).push(e);
    return m;
  }, []);

  const dayTasks = open.filter((t) => t.due === selected);
  const dayEvents = eventsByDay[selected] ?? [];
  const upcoming = EVENTS.filter((e) => diffDays(e.date, T) >= 0).slice(0, 12);

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center justify-between pt-5">
        <h1 className="text-2xl font-extrabold">
          {monthName(month.getMonth())} <span className="faint">{month.getFullYear()}</span>
        </h1>
        <div className="flex gap-2">
          <button aria-label="Previous month" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            <ChevronLeft size={20} />
          </button>
          <button aria-label="Next month" className="grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--input)' }} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="card mt-4 p-3">
        <div className="faint grid grid-cols-7 text-center text-[11px] font-bold uppercase">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <div key={d} className="py-1">
              {WEEKDAY_SHORT[d].slice(0, 2)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const inMonth = fromISO(d).getMonth() === month.getMonth();
            const n = byDay[d] ?? 0;
            const ev = eventsByDay[d];
            const isSel = d === selected;
            const isToday = d === T;
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className="relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-semibold transition"
                style={{ background: isSel ? 'var(--accent)' : isToday ? 'rgba(109,92,255,0.15)' : 'transparent', color: isSel ? '#fff' : inMonth ? 'var(--text)' : 'var(--faint)', opacity: inMonth ? 1 : 0.45 }}
              >
                {fromISO(d).getDate()}
                <span className="mt-0.5 flex h-1.5 gap-0.5">
                  {ev && <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />}
                  {n > 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? '#fff' : n > 14 ? 'var(--red)' : 'var(--amber)' }} />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="faint mt-2 flex gap-4 px-1 text-[11px]">
          <span>
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-pink-400" />
            Festival / marketing day
          </span>
          <span>
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            Tasks (incl. recurring)
          </span>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="section-title mb-3">
          {shortDate(selected)} · {byDay[selected] ?? 0} tasks
        </h2>
        {dayEvents.map((e) => (
          <EventRow key={e.id} e={e} />
        ))}
        {dayTasks.map((t) => (
          <TaskCard key={t.id} task={t} project={t.projectId ? pmap[t.projectId] : undefined} showDate={false} />
        ))}
        {selected > T && (byDay[selected] ?? 0) > dayTasks.length && <p className="faint text-xs">+ {(byDay[selected] ?? 0) - dayTasks.length} recurring tasks will appear automatically on this day.</p>}
        {!dayEvents.length && !(byDay[selected] ?? 0) && <p className="faint text-sm">Nothing on this day.</p>}
      </section>

      <section className="mt-7">
        <h2 className="section-title mb-3">📅 Upcoming marketing calendar</h2>
        {upcoming.map((e) => (
          <EventRow key={e.id} e={e} />
        ))}
        <p className="faint mt-2 text-xs">Dates editable in src/data/calendar.ts · "VERIFY" = lunar date, confirm with a panchang.</p>
      </section>
    </div>
  );
}

function EventRow({ e }: { e: MarketingEvent }) {
  const projects = useProjects();
  const { showToast } = useUI();
  const status = useLiveQuery(() => eventStatus(e.id), [e.id]);
  return (
    <div className="card mb-2.5 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold">
            {e.name}
            {e.verify && <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 align-middle text-[10px] font-bold text-amber-400">VERIFY</span>}
          </div>
          <div className="faint text-xs">
            {shortDate(e.date)} · {e.kind}
          </div>
          <div className="muted mt-1 text-sm">{e.angle}</div>
        </div>
      </div>
      {status === 'created' ? (
        <div className="mt-2 text-xs font-semibold text-emerald-400">✓ Campaign tasks created</div>
      ) : (
        <button
          className="btn-ghost mt-2 !min-h-[40px] w-full text-sm"
          onClick={async () => {
            const n = await createEventCampaign(e, projects);
            showToast(`${n} campaign tasks created 🎉`);
          }}
        >
          Create campaign tasks (all projects)
        </button>
      )}
    </div>
  );
}
