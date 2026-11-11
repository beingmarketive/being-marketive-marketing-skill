import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { PlaybookView } from './PlaybookView';
import { AiBox } from './AiBox';
import { useUI } from '../lib/ui';
import { db } from '../db/db';
import { PLAYBOOKS, fillPrompt, findPlaybook } from '../data/playbooks';
import { getIndustry } from '../data/industries';
import { updateTask } from '../lib/engine';
import { promptVars } from '../lib/brand';
import type { Playbook } from '../types';

export function StuckSheet() {
  const { stuckTaskId, openStuck } = useUI();
  const task = useLiveQuery(() => (stuckTaskId ? db.tasks.get(stuckTaskId) : undefined), [stuckTaskId]);
  const project = useLiveQuery(() => (task?.projectId ? db.projects.get(task.projectId) : undefined), [task?.projectId]);
  const [override, setOverride] = useState<Playbook | null>(null);

  useEffect(() => setOverride(null), [stuckTaskId]);

  const playbook = override ?? (task ? findPlaybook(task) : undefined) ?? PLAYBOOKS[0];
  const prompt = task
    ? fillPrompt(playbook.aiPrompt, promptVars(project, task.title, task.notes))
    : '';

  return (
    <Sheet
      open={!!stuckTaskId}
      onClose={() => openStuck(null)}
      full
      title={
        <span>
          🛟 I'm stuck <span className="faint text-sm font-medium">· {playbook.emoji} {playbook.name}</span>
        </span>
      }
    >
      {task && (
        <>
          <div className="mb-4 rounded-2xl p-3 text-sm" style={{ background: 'var(--input)' }}>
            <div className="faint text-xs font-semibold uppercase">Task</div>
            <div className="font-semibold">{task.title}</div>
            {project && <div className="faint text-xs">{project.name} · {getIndustry(project.industryId)?.name}</div>}
          </div>
          <PlaybookView playbook={playbook} />
          <div className="mt-5">
            <AiBox
              prompt={prompt}
              title={`AI: ${playbook.name} for ${project?.name ?? 'this task'}`}
              onSaveToNotes={(text) => updateTask(task.id, { notes: (task.notes ? task.notes + '\n\n' : '') + text })}
            />
          </div>
          <label className="mt-5 block">
            <span className="label">Wrong playbook? Pick another</span>
            <select className="input" value={playbook.id} onChange={(e) => setOverride(PLAYBOOKS.find((p) => p.id === e.target.value) ?? null)}>
              {PLAYBOOKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
    </Sheet>
  );
}
