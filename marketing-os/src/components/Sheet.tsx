import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  full?: boolean;
  footer?: ReactNode;
}

/** Bottom sheet with drag-to-dismiss. */
export function Sheet({ open, onClose, title, children, full, footer }: Props) {
  const controls = useDragControls();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative flex w-full max-w-xl flex-col rounded-t-3xl border-t ${full ? 'h-[94dvh]' : 'max-h-[90dvh]'}`}
            style={{ background: 'var(--card-solid)', borderColor: 'var(--border)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            dragListener={false}
            dragControls={controls}
            onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
          >
            <div className="flex cursor-grab touch-none items-center justify-between px-5 pb-2 pt-3" onPointerDown={(e) => controls.start(e)}>
              <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full" style={{ background: 'var(--border)' }} />
              <div className="mt-2 text-lg font-bold">{title}</div>
              <button aria-label="Close" onClick={onClose} className="mt-2 grid h-10 w-10 place-items-center rounded-full" style={{ background: 'var(--input)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
            {footer && (
              <div className="pb-safe border-t px-5 pt-3" style={{ borderColor: 'var(--border)' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
