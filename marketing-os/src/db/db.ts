import Dexie, { type Table } from 'dexie';
import type { DayLog, HashtagSet, HistoryEntry, KpiEntry, Project, SettingRow, SwipeItem, Task, UserPrompt } from '../types';

export class MarketingOSDB extends Dexie {
  projects!: Table<Project, string>;
  tasks!: Table<Task, string>;
  history!: Table<HistoryEntry, string>;
  kpis!: Table<KpiEntry, string>;
  days!: Table<DayLog, string>;
  settings!: Table<SettingRow, string>;
  swipes!: Table<SwipeItem, string>;
  hashtags!: Table<HashtagSet, string>;
  prompts!: Table<UserPrompt, string>;

  constructor() {
    super('marketing-os');
    this.version(1).stores({
      projects: 'id, name, industryId, createdAt',
      tasks: 'id, status, due, projectId, seriesId, [status+due], doneAt, chain.runId',
      history: 'id, seriesId, projectId, due, status',
      kpis: 'id, projectId, kpi, date',
      days: 'date',
      settings: 'key',
      swipes: 'id, kind, createdAt',
      hashtags: 'id, projectId, createdAt',
      prompts: 'id, createdAt'
    });
  }
}

export const db = new MarketingOSDB();

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value });
}
