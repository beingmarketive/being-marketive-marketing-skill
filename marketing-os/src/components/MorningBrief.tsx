import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { db, getSetting, setSetting } from '../db/db';
import { focusScore, useToday } from '../lib/hooks';
import { getStreak } from '../lib/engine';
import { greeting, longDate } from '../lib/dates';
import { CHANNEL_META } from '../data/channels';
import { pendingNudges } from '../lib/campaigns';

/** Full-screen summary on the first open of each day. */
export function MorningBrief() {
  const T = useToday();
  const [show, setShow] = useState(false);

  useEffect(() => {
    getSetting<string>('lastBrief', '').then((last) => {
      if (last !== T) setShow(true);
    });
  }, [T]);

  const data = useLiveQuery(async () => {
    if (!show) return null;
    const open = await db.tasks.where('status').equals('todo').toArray();
    const projects = Object.fromEntries((await db.projects.toArray()).map((p) => [p.id, p]));
    const overdue = open.filter((t) => t.due < T);
    const todays = open.filter((t) => t.due === T);
    const top = [...overdue, ...todays].sort((a, b) => focusScore(b, T) - focusScore(a, T)).slice(0, 3);
    const mins = [...overdue, ...todays].reduce((s, t) => s + t.estMinutes, 0);
    const name = await getSetting('name', 'Shareef');
    const events = await pendingNudges(7);
    return { overdue: overdue.length, today: todays.length, top, projects, mins, streak: await getStreak(), name, events };
  }, [show, T]);

  const close = async () => {
    await setSetting('lastBrief', T);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && data && (
        <motion.div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background: 'var(--bg)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.3 }}>
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pt-safe relative mx-auto flex min-h-full max-w-xl flex-col px-6 pb-10">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="pt-14">
              <div className="faint text-xs font-bold uppercase tracking-widest">{longDate(T)}</div>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight">
                {greeting()}, <span className="grad-text">{data.name}</span> {new Date().getHours() < 12 ? '☀️' : '👋'}
              </h1>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 text-2xl font-bold leading-snug">
              Aaj ke <span className="text-amber-400">{data.today} kaam</span>, <span className="text-rose-400">{data.overdue} pending</span>, streak <span className="inline-flex items-center text-orange-400"><Flame size={22} />{data.streak}</span>
              <div className="faint mt-2 text-sm font-medium">≈ {Math.floor(data.mins / 60)}h {data.mins % 60}m ka kaam · ek ek karke, sab ho jayega.</div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
              <div className="section-title faint mb-3">🎯 Aaj ke top 3</div>
              <div className="space-y-2.5">
                {data.top.map((t, i) => {
                  const p = t.projectId ? data.projects[t.projectId] : undefined;
                  return (
                    <div key={t.id} className="card flex items-center gap-3 p-4">
                      <span className="grad-bg grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold text-white">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="font-semibold leading-snug">{t.title}</div>
                        <div className="faint text-xs">
                          {p?.name ?? 'Personal'}
                          {t.channel ? ` · ${CHANNEL_META[t.channel].emoji} ${t.channel}` : ''} · {t.estMinutes}m{t.due < T ? ' · overdue' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!data.top.length && <div className="card p-4 text-center">Aaj sab clear hai 🎉 Library se ek Pro Move try karo.</div>}
              </div>
            </motion.div>

            {data.events.length > 0 && (
              <div className="card mt-4 p-4 text-sm">
                📅 Aane wale: {data.events.map((e) => e.name).join(', ')} — Today screen par campaign tasks bana sakte ho.
              </div>
            )}

            <div className="flex-1" />
            <button className="btn-primary mt-10 !min-h-[56px] w-full text-lg" onClick={close}>
              Chalo shuru karein 🚀
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
