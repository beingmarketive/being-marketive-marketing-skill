import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { Download, Upload, Moon, Sun, Bell, KeyRound, Trash2 } from 'lucide-react';
import { db, getSetting, setSetting } from '../db/db';
import { downloadBackup, importBackup, resetEverything } from '../db/backup';
import { useUI } from '../lib/ui';
import { BackLink } from './ProjectDetail';
import { enableReminders, disableReminders } from '../lib/notify';
import { AI_MODELS, DEFAULT_MODEL } from '../lib/ai';

export function useTheme(): ['dark' | 'light', (t: 'dark' | 'light') => void] {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
  const setTheme = (t: 'dark' | 'light') => {
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#070b19' : '#f4f6fb');
    try {
      localStorage.setItem('mos-theme', t);
    } catch {
      /* private mode */
    }
    setThemeState(t);
  };
  return [theme, setTheme];
}

export default function Settings() {
  const { showToast } = useUI();
  const [theme, setTheme] = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [reminder, setReminder] = useState('09:00');
  const reminderOn = useLiveQuery(() => getSetting<boolean>('reminderOn', false), []) ?? false;
  const lastBackup = useLiveQuery(() => getSetting<string>('lastBackup', ''), []);

  useEffect(() => {
    (async () => {
      setName(await getSetting('name', 'Shareef'));
      setApiKey(await getSetting('apiKey', ''));
      setModel(await getSetting('aiModel', DEFAULT_MODEL));
      setReminder(await getSetting('reminderTime', '09:00'));
    })();
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <header className="flex items-center gap-3 pt-4">
        <BackLink to="/tools" />
        <h1 className="text-2xl font-extrabold">Settings</h1>
      </header>

      <Block title="Profile">
        <label className="block">
          <span className="label">Your name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setSetting('name', name.trim() || 'Shareef')} />
        </label>
        <div className="mt-4 flex gap-2">
          <button className={`chip flex-1 justify-center ${theme === 'dark' ? 'chip-on' : ''}`} onClick={() => setTheme('dark')}>
            <Moon size={15} /> Dark
          </button>
          <button className={`chip flex-1 justify-center ${theme === 'light' ? 'chip-on' : ''}`} onClick={() => setTheme('light')}>
            <Sun size={15} /> Light
          </button>
        </div>
      </Block>

      <Block title="Daily reminder" icon={<Bell size={16} />}>
        <div className="flex items-center gap-3">
          <input type="time" className="input !w-36" value={reminder} onChange={(e) => setReminder(e.target.value)} onBlur={() => setSetting('reminderTime', reminder)} />
          <button
            className={reminderOn ? 'btn-ghost flex-1' : 'btn-primary flex-1'}
            onClick={async () => {
              await setSetting('reminderTime', reminder);
              if (reminderOn) {
                await disableReminders();
                showToast('Reminder off');
              } else {
                const r = await enableReminders();
                showToast(r);
              }
            }}
          >
            {reminderOn ? 'Reminder on · turn off' : 'Turn on reminder'}
          </button>
        </div>
        <p className="faint mt-2 text-xs leading-relaxed">
          Install the app on your phone first (Chrome menu → Install app / Safari → Add to Home Screen). On Android the installed app can remind you at your chosen time even when it is closed; on iPhone (iOS 16.4+) reminders work best while the app is open or recently used. The morning brief always shows on your first open of the day.
        </p>
      </Block>

      <Block title="Claude AI (optional)" icon={<KeyRound size={16} />}>
        <label className="block">
          <span className="label">Claude API key</span>
          <input className="input font-mono text-sm" type="password" autoComplete="off" placeholder="sk-ant-…" value={apiKey} onChange={(e) => setApiKey(e.target.value)} onBlur={() => setSetting('apiKey', apiKey.trim())} />
        </label>
        <label className="mt-3 block">
          <span className="label">Model</span>
          <select
            className="input"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setSetting('aiModel', e.target.value);
            }}
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <p className="faint mt-2 text-xs leading-relaxed">Your key is stored only on this device and is never included in backups. Without a key, every AI button becomes "Copy prompt" — paste it into ChatGPT or the Claude app.</p>
      </Block>

      <Block title="Backup">
        <div className="grid grid-cols-2 gap-2">
          <button
            className="btn-primary"
            onClick={async () => {
              await downloadBackup();
              await setSetting('lastBackup', new Date().toISOString());
              showToast('Backup downloaded 💾');
            }}
          >
            <Download size={18} /> Export
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={18} /> Import
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            if (!confirm('Importing replaces all current data. Continue?')) return;
            try {
              const r = await importBackup(file);
              showToast(`Restored: ${r.projects} projects, ${r.tasks} tasks`);
            } catch (err) {
              showToast((err as Error).message);
            }
          }}
        />
        <p className="faint mt-2 text-xs">{lastBackup ? `Last backup: ${new Date(lastBackup).toLocaleString('en-IN')}` : 'No backup yet. Export one every week.'}</p>
      </Block>

      <Block title="Danger zone">
        <button
          className="btn-danger w-full"
          onClick={async () => {
            if (!confirm('This deletes all data (projects, tasks, KPIs). Take a backup first! Continue?')) return;
            await resetEverything();
          }}
        >
          <Trash2 size={18} /> Reset everything
        </button>
      </Block>

      <p className="faint mt-6 text-center text-xs">Marketing OS · local-first · {navigator.onLine ? 'online' : 'offline'} · data stays on this device</p>
      <DataCounts />
    </div>
  );
}

function DataCounts() {
  const c = useLiveQuery(async () => ({ t: await db.tasks.count(), p: await db.projects.count(), k: await db.kpis.count() }), []);
  if (!c) return null;
  return (
    <p className="faint mt-1 text-center text-xs">
      {c.p} projects · {c.t} tasks · {c.k} KPI entries
    </p>
  );
}

function Block({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card mt-4 p-4">
      <h2 className="section-title mb-3">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
