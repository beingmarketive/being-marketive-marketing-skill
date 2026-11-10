import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { UIProvider, useUI } from './lib/ui';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { TaskSheet } from './components/TaskSheet';
import { StuckSheet } from './components/StuckSheet';
import { FocusMode } from './components/FocusMode';
import { MorningBrief } from './components/MorningBrief';
import { Sheet } from './components/Sheet';
import { QuickAddBar } from './components/QuickAdd';
import Today from './pages/Today';
import { seedIfEmpty } from './db/seed';
import { ensureDailyMaintenance } from './lib/engine';
import { scheduleInAppReminder } from './lib/notify';
import { today } from './lib/dates';

const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Library = lazy(() => import('./pages/Library'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Tools = lazy(() => import('./pages/Tools'));
const Settings = lazy(() => import('./pages/Settings'));
const Search = lazy(() => import('./pages/Search'));

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let lastDay = today();
    (async () => {
      await seedIfEmpty();
      await ensureDailyMaintenance();
      setReady(true);
      scheduleInAppReminder();
    })();
    const onVis = async () => {
      if (document.visibilityState !== 'visible') return;
      if (today() !== lastDay) {
        lastDay = today();
        await ensureDailyMaintenance();
      }
      scheduleInAppReminder();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!ready) return <Splash />;

  return (
    <BrowserRouter>
      <UIProvider>
        <Shell />
      </UIProvider>
    </BrowserRouter>
  );
}

function Shell() {
  const location = useLocation();
  const { quickAddOpen, setQuickAdd } = useUI();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === '1') setQuickAdd(true);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
          <Suspense fallback={<div className="h-screen" />}>
            <Routes location={location}>
              <Route path="/" element={<Today />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:tab" element={<Library />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/:tool" element={<Tools />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Today />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      {['/projects', '/library', '/calendar', '/tools'].some((x) => location.pathname === x || (x === '/library' && location.pathname.startsWith('/library/'))) && (
        <button aria-label="Quick add" onClick={() => setQuickAdd(true)} className="grad-bg fixed bottom-[88px] right-4 z-30 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-xl shadow-violet-900/40 active:scale-95">
          <Plus size={26} />
        </button>
      )}

      <Sheet open={quickAddOpen} onClose={() => setQuickAdd(false)} title="Quick add">
        <QuickAddBar autoFocus onDone={() => setQuickAdd(false)} />
      </Sheet>

      <BottomNav />
      <TaskSheet />
      <StuckSheet />
      <FocusMode />
      <MorningBrief />
      <Toast />
    </>
  );
}

function Splash() {
  return (
    <div className="grid h-[100dvh] place-items-center">
      <img src="/icons/icon.svg" alt="" className="h-16 w-16 animate-pulse" />
    </div>
  );
}
