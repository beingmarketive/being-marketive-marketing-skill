import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarHeart, ClipboardCheck, X } from 'lucide-react';
import { createEventCampaign, dismissEvent, pendingNudges } from '../lib/campaigns';
import { useProjects, useToday } from '../lib/hooks';
import { diffDays, shortDate, weekday } from '../lib/dates';
import { useUI, haptic } from '../lib/ui';
import { db, getSetting } from '../db/db';

/** Festival nudges (7 days before) + Sunday weekly-review card. */
export function EventNudge() {
  const T = useToday();
  const projects = useProjects();
  const { showToast } = useUI();
  // re-query when settings change (create/dismiss writes settings)
  const settingsCount = useLiveQuery(() => db.settings.count(), []);
  const events = useLiveQuery(() => pendingNudges(7), [T, settingsCount]) ?? [];
  const reviewDone = useLiveQuery(() => getSetting<string>('lastReview', ''), [settingsCount]);
  const isSunday = weekday(T) === 0;

  return (
    <AnimatePresence initial={false}>
      {isSunday && reviewDone !== T && (
        <motion.div key="review" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <Link to="/tools/review" className="card mt-4 flex items-center gap-3 p-4">
            <ClipboardCheck className="shrink-0 text-emerald-400" />
            <div className="flex-1">
              <div className="font-bold">Sunday hai — Weekly review karo</div>
              <div className="faint text-xs">Projects ka health, missed tasks, next week ka plan · 10 min</div>
            </div>
          </Link>
        </motion.div>
      )}
      {events.map((e) => {
        const d = diffDays(e.date, T);
        return (
          <motion.div key={e.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="card relative mt-4 p-4">
              <button aria-label="Dismiss" className="faint absolute right-3 top-3 p-1" onClick={() => dismissEvent(e.id)}>
                <X size={16} />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <CalendarHeart className="mt-0.5 shrink-0 text-pink-400" />
                <div>
                  <div className="font-bold">
                    {e.name} {d === 0 ? 'aaj hai!' : `${d} din mein`} <span className="faint text-xs font-medium">· {shortDate(e.date)}</span>
                    {e.verify && <span className="ml-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">VERIFY DATE</span>}
                  </div>
                  <div className="muted mt-1 text-sm">{e.angle}</div>
                </div>
              </div>
              <button
                className="btn-primary mt-3 w-full"
                onClick={async () => {
                  haptic(12);
                  const n = await createEventCampaign(e, projects);
                  showToast(`${n} campaign tasks ban gaye 🎉`);
                }}
              >
                Sab projects ke liye campaign tasks banao?
              </button>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
