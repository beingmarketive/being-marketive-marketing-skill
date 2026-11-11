import { db, getSetting, setSetting } from '../db/db';
import { nowTimeHHMM, today } from './dates';

async function summary(): Promise<{ title: string; body: string }> {
  const T = today();
  const open = await db.tasks.where('status').equals('todo').toArray();
  const overdue = open.filter((t) => t.due < T).length;
  const todays = open.filter((t) => t.due === T);
  const top = todays.sort((a, b) => a.priority - b.priority)[0];
  return {
    title: `${todays.length} tasks today · ${overdue} overdue`,
    body: top ? `Start with: ${top.title}` : 'Open Marketing OS to see today\'s plan.'
  };
}

export async function showReminderNow(): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const { title, body } = await summary();
  const reg = await navigator.serviceWorker?.getRegistration();
  const opts: NotificationOptions = { body, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', tag: 'daily-reminder', data: { url: '/' } };
  if (reg) await reg.showNotification(title, opts);
  else new Notification(title, opts);
  await setSetting('lastReminder', today());
}

export async function enableReminders(): Promise<string> {
  if (!('Notification' in window)) return 'This browser does not support notifications';
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return 'Notification permission was denied';
  await setSetting('reminderOn', true);
  try {
    const reg = await navigator.serviceWorker?.ready;
    // Chrome (installed PWA) only — wakes the service worker roughly daily
    const ps = (reg as ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, o: { minInterval: number }) => Promise<void> } })?.periodicSync;
    if (ps) await ps.register('daily-reminder', { minInterval: 6 * 60 * 60 * 1000 });
  } catch {
    /* periodic sync not allowed — in-app timer still works */
  }
  const time = await getSetting('reminderTime', '09:00');
  return `Reminder on ✅ daily at ${time}`;
}

export async function disableReminders(): Promise<void> {
  await setSetting('reminderOn', false);
  try {
    const reg = await navigator.serviceWorker?.ready;
    const ps = (reg as ServiceWorkerRegistration & { periodicSync?: { unregister: (tag: string) => Promise<void> } })?.periodicSync;
    if (ps) await ps.unregister('daily-reminder');
  } catch {
    /* ignore */
  }
}

let timer: number | undefined;

/** While the app is open (or backgrounded), fire the reminder at the chosen time once per day. */
export async function scheduleInAppReminder(): Promise<void> {
  window.clearTimeout(timer);
  const on = await getSetting('reminderOn', false);
  if (!on) return;
  const time = await getSetting('reminderTime', '09:00');
  const last = await getSetting('lastReminder', '');
  if (last === today()) return;
  const now = nowTimeHHMM();
  if (now >= time) {
    // app opened after reminder time: the morning brief covers it, just mark as done
    await setSetting('lastReminder', today());
    return;
  }
  const [h, m] = time.split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  timer = window.setTimeout(() => showReminderNow(), target.getTime() - Date.now());
}
