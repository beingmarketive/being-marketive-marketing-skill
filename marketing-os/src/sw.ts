/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> };

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

/* ---------- Daily reminder via Periodic Background Sync (Chrome/Android installed PWA) ---------- */

function idbGet<T>(db: IDBDatabase, store: string, key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    try {
      const req = db.transaction(store, 'readonly').objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const req = indexedDB.open('marketing-os');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

const pad = (n: number) => String(n).padStart(2, '0');
const localISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

async function maybeRemind(): Promise<void> {
  const db = await openDB();
  if (!db) return;
  const on = await idbGet<{ value: boolean }>(db, 'settings', 'reminderOn');
  if (!on?.value) return;
  const time = (await idbGet<{ value: string }>(db, 'settings', 'reminderTime'))?.value ?? '09:00';
  const last = (await idbGet<{ value: string }>(db, 'settings', 'lastReminder'))?.value;
  const now = new Date();
  const today = localISO(now);
  if (last === today || `${pad(now.getHours())}:${pad(now.getMinutes())}` < time) return;

  const counts = await new Promise<{ overdue: number; today: number }>((resolve) => {
    const out = { overdue: 0, today: 0 };
    try {
      const idx = db.transaction('tasks', 'readonly').objectStore('tasks').index('status');
      const cur = idx.openCursor(IDBKeyRange.only('todo'));
      cur.onsuccess = () => {
        const c = cur.result;
        if (!c) return resolve(out);
        const due = (c.value as { due: string }).due;
        if (due < today) out.overdue++;
        else if (due === today) out.today++;
        c.continue();
      };
      cur.onerror = () => resolve(out);
    } catch {
      resolve(out);
    }
  });

  await self.registration.showNotification(`Aaj ke ${counts.today} kaam · ${counts.overdue} pending`, {
    body: 'Marketing OS kholo — Next Up ready hai.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'daily-reminder',
    data: { url: '/' }
  });
  try {
    db.transaction('settings', 'readwrite').objectStore('settings').put({ key: 'lastReminder', value: today });
  } catch {
    /* ignore */
  }
}

self.addEventListener('periodicsync', (event: Event) => {
  const e = event as ExtendableEvent & { tag: string };
  if (e.tag === 'daily-reminder') e.waitUntil(maybeRemind());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return (c as WindowClient).focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
