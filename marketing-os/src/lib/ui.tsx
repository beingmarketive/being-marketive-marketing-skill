import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { NewTask } from './engine';

export interface ToastMsg {
  id: number;
  text: string;
  action?: { label: string; run: () => void };
}

interface UIState {
  taskId: string | null;
  draft: NewTask | null;
  quickAddOpen: boolean;
  stuckTaskId: string | null;
  focusTaskId: string | null;
  toast: ToastMsg | null;
  openTask: (id: string) => void;
  newTask: (draft?: Partial<NewTask>) => void;
  closeTask: () => void;
  setQuickAdd: (open: boolean) => void;
  openStuck: (id: string | null) => void;
  openFocus: (id: string | null) => void;
  showToast: (text: string, action?: ToastMsg['action']) => void;
}

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NewTask | null>(null);
  const [quickAddOpen, setQuickAdd] = useState(false);
  const [stuckTaskId, openStuck] = useState<string | null>(null);
  const [focusTaskId, openFocus] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const timer = useRef<number>();

  const showToast = useCallback((text: string, action?: ToastMsg['action']) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, action });
    timer.current = window.setTimeout(() => setToast(null), action ? 5000 : 2600);
  }, []);

  const value = useMemo<UIState>(
    () => ({
      taskId,
      draft,
      quickAddOpen,
      stuckTaskId,
      focusTaskId,
      toast,
      openTask: (id) => {
        setDraft(null);
        setTaskId(id);
      },
      newTask: (d) => {
        setTaskId(null);
        setDraft({ title: '', ...d });
      },
      closeTask: () => {
        setTaskId(null);
        setDraft(null);
      },
      setQuickAdd,
      openStuck,
      openFocus,
      showToast
    }),
    [taskId, draft, quickAddOpen, stuckTaskId, focusTaskId, toast, showToast]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI(): UIState {
  const v = useContext(Ctx);
  if (!v) throw new Error('UIProvider missing');
  return v;
}

export function haptic(pattern: number | number[] = 12) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* not supported */
  }
}
