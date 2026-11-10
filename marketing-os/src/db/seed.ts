import { db, getSetting, setSetting } from './db';
import { SEED_PROJECTS } from '../data/projects';
import { applyIndustryPack, addTask } from '../lib/engine';
import type { Project } from '../types';

export async function seedIfEmpty(): Promise<void> {
  const seeded = await getSetting<boolean>('seeded', false);
  if (seeded) return;
  const now = Date.now();
  for (const [i, sp] of SEED_PROJECTS.entries()) {
    const { onlyChannels, ...rest } = sp;
    const project: Project = { ...rest, createdAt: now + i };
    await db.projects.put(project);
    await applyIndustryPack(project, onlyChannels);
  }
  await addTask({
    title: 'Set up Marketing OS: reminder time + backup',
    channel: null,
    priority: 2,
    estMinutes: 5,
    notes: 'Tools → Settings: choose your daily reminder time, add your Claude API key (optional), and download a JSON backup once a week.',
    subtasks: ['Pick daily reminder time', 'Install app on phone (Add to Home screen)', 'Download first backup']
  });
  await setSetting('seeded', true);
}
