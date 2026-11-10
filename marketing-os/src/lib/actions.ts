import { completeTask, snoozeTask, undoComplete, updateTask } from './engine';
import { haptic, useUI } from './ui';
import { db } from '../db/db';

export function useTaskActions() {
  const { showToast } = useUI();

  return {
    async complete(id: string) {
      haptic([10, 30, 18]);
      const spawned = await completeTask(id);
      const recurring = spawned.filter((s) => s.source === 'recurring').length;
      const chain = spawned.length - recurring;
      const parts = ['Ho gaya! ✅'];
      if (chain) parts.push(`+${chain} next step${chain > 1 ? 's' : ''}`);
      else if (recurring) parts.push('agla wala set 🔁');
      showToast(parts.join(' · '), { label: 'Undo', run: () => undoComplete(id) });
    },
    async snooze(id: string) {
      haptic(8);
      const before = await db.tasks.get(id);
      await snoozeTask(id, 1);
      showToast('Kal pe shift kiya ⏭', before ? { label: 'Undo', run: () => updateTask(id, { due: before.due, dueTime: before.dueTime, snoozes: before.snoozes }) } : undefined);
    }
  };
}
