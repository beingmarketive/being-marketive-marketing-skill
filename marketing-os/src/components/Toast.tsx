import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../lib/ui';

export function Toast() {
  const { toast, showToast } = useUI();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[92px] z-[60] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl"
            style={{ background: '#151b33', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span>{toast.text}</span>
            {toast.action && (
              <button
                className="rounded-lg px-2 py-1 font-bold"
                style={{ color: '#a5b4fc' }}
                onClick={() => {
                  toast.action!.run();
                  showToast('Undone ↩︎');
                }}
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
