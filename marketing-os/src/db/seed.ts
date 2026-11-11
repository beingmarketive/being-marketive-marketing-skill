import { db, getSetting, setSetting } from './db';
import { SEED_PROJECTS } from '../data/projects';
import { addTask, buildTask, fromTemplate } from '../lib/engine';
import { addIdeas } from '../lib/ideas';
import { today } from '../lib/dates';
import type { Project } from '../types';

export async function seedIfEmpty(): Promise<void> {
  const seeded = await getSetting<boolean>('seeded', false);
  if (!seeded) {
    const now = Date.now();
    const T = today();
    for (const [i, sp] of SEED_PROJECTS.entries()) {
      const { recurring, ideas, ...rest } = sp;
      const project: Project = { ...rest, createdAt: now + i };
      await db.projects.put(project);
      await db.tasks.bulkAdd(recurring.map((r) => buildTask({ ...fromTemplate(r, project.id), recurrence: r.recurrence, due: T, source: 'pack' })));
      await addIdeas(project.id, ideas);
    }
    await addTask({
      title: 'Set up Marketing OS: reminder time + backup',
      channel: null,
      priority: 2,
      estMinutes: 5,
      notes: 'Tools → Settings: choose your daily reminder time, add your Claude API key (optional), and download a JSON backup once a week.',
      subtasks: ['Pick daily reminder time', 'Install the app on your phone (Add to Home screen)', 'Download first backup']
    });
    await setSetting('seeded', true);
    await setSetting('brandSeedV2', true);
    return;
  }

  // Upgrade for installs seeded before brand-specific content existed
  if (!(await getSetting<boolean>('brandSeedV2', false))) {
    for (const sp of SEED_PROJECTS) {
      const p = await db.projects.get(sp.id);
      if (!p) continue;
      if (!p.brief) await db.projects.update(sp.id, { brief: sp.brief });
      await addIdeas(sp.id, sp.ideas);
    }
    await setSetting('brandSeedV2', true);
  }
}
