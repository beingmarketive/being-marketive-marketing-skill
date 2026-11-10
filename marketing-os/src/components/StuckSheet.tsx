import { Sheet } from './Sheet';
import { useUI } from '../lib/ui';

/** Phase 2: playbook for the task. */
export function StuckSheet() {
  const { stuckTaskId, openStuck } = useUI();
  return (
    <Sheet open={!!stuckTaskId} onClose={() => openStuck(null)} title="Main stuck hoon">
      <p className="muted py-6 text-center">Playbooks Phase 2 mein aa rahe hain.</p>
    </Sheet>
  );
}
