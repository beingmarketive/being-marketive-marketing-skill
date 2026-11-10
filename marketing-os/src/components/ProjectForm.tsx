import { useEffect, useState } from 'react';
import { Sheet } from './Sheet';
import { INDUSTRIES, getIndustry } from '../data/industries';
import { CHANNELS, type Channel, type Project } from '../types';
import { CHANNEL_META } from '../data/channels';
import { db } from '../db/db';
import { applyIndustryPack } from '../lib/engine';
import { uid } from '../lib/id';
import { useUI } from '../lib/ui';
import { describeRecurrence } from '../lib/recurrence';

const COLORS = ['#7c5cff', '#ec4899', '#22d3ee', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#14b8a6', '#f97316'];

export function ProjectForm({ open, onClose, project }: { open: boolean; onClose: () => void; project?: Project }) {
  const { showToast } = useUI();
  const [name, setName] = useState('');
  const [industryId, setIndustryId] = useState('agency');
  const [color, setColor] = useState(COLORS[0]);
  const [emoji, setEmoji] = useState('🚀');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [aliases, setAliases] = useState('');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState('');
  const [applyPack, setApplyPack] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (project) {
      setName(project.name);
      setIndustryId(project.industryId);
      setColor(project.color);
      setEmoji(project.emoji);
      setChannels(project.channels);
      setAliases(project.aliases.join(', '));
      setNotes(project.notes);
      setWebsite(project.website ?? '');
      setApplyPack(false);
    } else {
      setName('');
      setIndustryId('agency');
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setEmoji('🚀');
      setChannels(getIndustry('agency')!.defaultChannels);
      setAliases('');
      setNotes('');
      setWebsite('');
      setApplyPack(true);
    }
  }, [open, project]);

  const pack = getIndustry(industryId)!;

  const pickIndustry = (id: string) => {
    setIndustryId(id);
    const p = getIndustry(id)!;
    if (!project) {
      setChannels(p.defaultChannels);
      setEmoji(p.emoji);
    }
  };

  const save = async () => {
    if (!name.trim()) return;
    const data: Project = {
      id: project?.id ?? uid('p_'),
      name: name.trim(),
      industryId,
      color,
      emoji,
      channels,
      notes,
      kpis: project?.kpis?.length && project.industryId === industryId ? project.kpis : pack.kpis,
      aliases: aliases
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean),
      website: website.trim() || undefined,
      createdAt: project?.createdAt ?? Date.now(),
      archived: project?.archived
    };
    await db.projects.put(data);
    let n = 0;
    if (applyPack) n = await applyIndustryPack(data, channels.length ? [...channels, 'Reporting'] : undefined);
    showToast(project ? 'Project update ho gaya' : `Project ban gaya${n ? ` · ${n} recurring tasks set 🔁` : ''}`);
    onClose();
  };

  const packTasks = pack.recurring.filter((r) => !channels.length || channels.includes(r.channel) || r.channel === 'Reporting');

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={project ? 'Project edit' : 'Naya project'}
      full
      footer={
        <button className="btn-primary mb-1 w-full" disabled={!name.trim()} onClick={save}>
          {project ? 'Save' : 'Project banao'}
        </button>
      }
    >
      <div className="mb-4 grid grid-cols-[64px_1fr] gap-3">
        <label>
          <span className="label">Emoji</span>
          <input className="input text-center text-xl" value={emoji} maxLength={4} onChange={(e) => setEmoji(e.target.value)} />
        </label>
        <label>
          <span className="label">Name</span>
          <input className="input" value={name} placeholder="Brand / client name" onChange={(e) => setName(e.target.value)} autoFocus={!project} />
        </label>
      </div>

      <div className="mb-4">
        <span className="label">Industry</span>
        <select className="input" value={industryId} onChange={(e) => pickIndustry(e.target.value)}>
          {INDUSTRIES.map((i) => (
            <option key={i.id} value={i.id}>
              {i.emoji} {i.name}
            </option>
          ))}
        </select>
        <p className="faint mt-1.5 text-xs">{pack.description}</p>
      </div>

      <div className="mb-4">
        <span className="label">Color</span>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c} aria-label={c} onClick={() => setColor(c)} className="h-9 w-9 rounded-full transition" style={{ background: c, outline: color === c ? '3px solid var(--text)' : 'none', outlineOffset: 2 }} />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="label">Active channels</span>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button key={c} className={`chip ${channels.includes(c) ? 'chip-on' : ''}`} onClick={() => setChannels(channels.includes(c) ? channels.filter((x) => x !== c) : [...channels, c])}>
              {CHANNEL_META[c].emoji} {c}
            </button>
          ))}
        </div>
      </div>

      <label className="mb-4 block">
        <span className="label">Quick-add aliases (comma separated)</span>
        <input className="input" value={aliases} placeholder="e.g. tp, trendy" onChange={(e) => setAliases(e.target.value)} />
      </label>
      <label className="mb-4 block">
        <span className="label">Website</span>
        <input className="input" value={website} placeholder="https://" onChange={(e) => setWebsite(e.target.value)} />
      </label>
      <label className="mb-4 block">
        <span className="label">Notes</span>
        <textarea className="input min-h-[80px]" value={notes} placeholder="Goals, audience, brand voice, logins location…" onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="card p-4">
        <label className="flex items-center justify-between gap-3">
          <span className="font-semibold">{pack.emoji} Industry pack ke recurring tasks banao</span>
          <input type="checkbox" className="h-6 w-6 accent-violet-500" checked={applyPack} onChange={(e) => setApplyPack(e.target.checked)} />
        </label>
        {applyPack && (
          <ul className="mt-3 space-y-1.5 text-sm">
            {packTasks.map((r) => (
              <li key={r.title} className="flex justify-between gap-2">
                <span>
                  {CHANNEL_META[r.channel].emoji} {r.title}
                </span>
                <span className="faint shrink-0 text-xs">{describeRecurrence(r.recurrence)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}
