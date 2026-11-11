import { NavLink } from 'react-router-dom';
import { CalendarDays, FolderKanban, LibraryBig, Sun, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { to: '/', label: 'Today', icon: Sun },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/library', label: 'Library', icon: LibraryBig },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/tools', label: 'Tools', icon: Wrench }
];

export function BottomNav() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="mx-auto flex max-w-xl justify-around px-2 pt-1.5">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className="relative flex min-h-[54px] flex-1 flex-col items-center justify-center gap-0.5">
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="navpill" className="absolute inset-x-3 inset-y-1 rounded-2xl" style={{ background: 'rgba(109,92,255,0.16)' }} transition={{ type: 'spring', damping: 30, stiffness: 400 }} />}
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} className="relative" style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }} />
                <span className="relative text-[11px] font-semibold" style={{ color: isActive ? 'var(--text)' : 'var(--faint)' }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
