import { db } from './db';

const TABLES = ['projects', 'tasks', 'history', 'kpis', 'days', 'settings', 'swipes', 'hashtags', 'prompts', 'ideas'] as const;

export async function exportBackup(): Promise<Blob> {
  const data: Record<string, unknown[]> = {};
  for (const name of TABLES) {
    let rows = await db.table(name).toArray();
    // never export the API key
    if (name === 'settings') rows = rows.filter((r: { key: string }) => r.key !== 'apiKey');
    data[name] = rows;
  }
  const payload = { app: 'marketing-os', version: 1, exportedAt: new Date().toISOString(), data };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}

export async function downloadBackup(): Promise<void> {
  const blob = await exportBackup();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `marketing-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function importBackup(file: File): Promise<{ tasks: number; projects: number }> {
  const text = await file.text();
  const payload = JSON.parse(text);
  if (payload?.app !== 'marketing-os' || !payload.data) throw new Error('This does not look like a Marketing OS backup file.');
  const apiKey = await db.settings.get('apiKey');
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const name of TABLES) {
      await db.table(name).clear();
      const rows = payload.data[name];
      if (Array.isArray(rows) && rows.length) await db.table(name).bulkPut(rows);
    }
    if (apiKey) await db.settings.put(apiKey);
  });
  return { tasks: payload.data.tasks?.length ?? 0, projects: payload.data.projects?.length ?? 0 };
}

export async function resetEverything(): Promise<void> {
  await db.delete();
  location.reload();
}
