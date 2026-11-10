import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { ProjectPicker } from './ProjectPicker';
import { addTask, type NewTask } from '../lib/engine';
import { addDays, today } from '../lib/dates';
import { useUI, haptic } from '../lib/ui';
import { CHANNEL_META } from '../data/channels';

/** "Add as task" flow: pick project + when, then create. */
export function AddTaskSheet({ template, onClose, defaultProjectId = null, extraNote }: { template: NewTask | null; onClose: () => void; defaultProjectId?: string | null; extraNote?: string }) {
  const { showToast } = useUI();
  const [projectId, setProjectId] = useState<string | null>(defaultProjectId);
  const [when, setWhen] = useState<'today' | 'tomorrow' | 'week' | 'custom'>('tomorrow');
  const [custom, setCustom] = useState(addDays(today(), 3));
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setProjectId(template.projectId ?? defaultProjectId);
      setWhen('tomorrow');
    }
  }, [template, defaultProjectId]);

  const due = when === 'today' ? today() : when === 'tomorrow' ? addDays(today(), 1) : when === 'week' ? addDays(today(), 5) : custom;

  return (
    <Sheet
      open={!!template}
      onClose={onClose}
      title="Task banao"
      footer={
        <button
          className="btn-primary mb-1 w-full"
          onClick={async () => {
            if (!template) return;
            haptic(10);
            await addTask({ ...template, title: title.trim() || template.title, projectId, due });
            showToast('Task ban gaya ✅');
            onClose();
          }}
        >
          Add karo
        </button>
      }
    >
      {template && (
        <div className="space-y-4">
          <label className="block">
            <span className="label">Title</span>
            <textarea className="input min-h-[64px]" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          {template.channel && (
            <div className="muted text-sm">
              {CHANNEL_META[template.channel].emoji} {template.channel} · {template.estMinutes ?? 20} min
              {template.subtasks?.length ? ` · ${template.subtasks.length} steps` : ''}
            </div>
          )}
          {extraNote && <p className="faint text-xs">{extraNote}</p>}
          <label className="block">
            <span className="label">Project</span>
            <ProjectPicker value={projectId} onChange={setProjectId} />
          </label>
          <div>
            <span className="label">Kab?</span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['today', 'Aaj'],
                  ['tomorrow', 'Kal'],
                  ['week', 'Is hafte'],
                  ['custom', 'Date chuno']
                ] as const
              ).map(([k, l]) => (
                <button key={k} className={`chip ${when === k ? 'chip-on' : ''}`} onClick={() => setWhen(k)}>
                  {l}
                </button>
              ))}
            </div>
            {when === 'custom' && <input type="date" className="input mt-2" value={custom} onChange={(e) => setCustom(e.target.value)} />}
          </div>
        </div>
      )}
    </Sheet>
  );
}
