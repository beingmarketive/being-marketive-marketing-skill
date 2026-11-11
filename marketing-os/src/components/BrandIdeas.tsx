import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ChevronDown, Copy, Loader2, Plus, Shuffle, Sparkles, X } from 'lucide-react';
import { db } from '../db/db';
import { CHANNEL_META } from '../data/channels';
import { brandIdeasPrompt } from '../data/projects';
import { CHANNELS, type BrandIdea, type Channel } from '../types';
import { addIdeas, parseIdeaLines } from '../lib/ideas';
import { copyText, generate, hasApiKey } from '../lib/ai';
import { haptic, useUI } from '../lib/ui';
import { AddTaskSheet } from './AddTaskSheet';
import type { NewTask } from '../lib/engine';

/** Brand-specific idea bank for one project. */
export function BrandIdeas({ projectId }: { projectId: string }) {
  const { showToast } = useUI();
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const ideas = useLiveQuery(() => db.ideas.where('projectId').equals(projectId).sortBy('createdAt'), [projectId]) ?? [];
  const keyOk = useLiveQuery(() => hasApiKey(), []) ?? false;
  const fresh = useMemo(() => ideas.filter((i) => !i.usedAt), [ideas]);
  const used = ideas.filter((i) => i.usedAt);
  const [pick, setPick] = useState(0);
  const [template, setTemplate] = useState<{ task: NewTask; ideaId: string } | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [showUsed, setShowUsed] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState<Channel | ''>('');
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState('');
  const [genOpen, setGenOpen] = useState(false);

  if (!project) return null;
  const mainChannel: Channel = project.channels[0] ?? 'Instagram';
  const current = fresh.length ? fresh[pick % fresh.length] : undefined;
  const prompt = brandIdeasPrompt(project);

  const toTask = (i: BrandIdea): NewTask => ({
    title: i.title,
    channel: i.channel,
    projectId,
    estMinutes: i.channel === 'Blog' ? 90 : 45,
    priority: 2,
    notes: `Format: ${i.format}`,
    source: 'idea',
    startsChain: i.channel === 'Reels' ? 'reel-followup' : i.channel === 'Blog' ? 'blog-pipeline' : i.channel === 'Instagram' ? 'carousel-followup' : undefined
  });

  const shuffle = () => {
    haptic(8);
    if (fresh.length < 2) return;
    let n = pick;
    while (n % fresh.length === pick % fresh.length) n = Math.floor(Math.random() * fresh.length);
    setPick(n);
  };

  const importText = async (text: string) => {
    const parsed = parseIdeaLines(text, mainChannel).filter((i) => project.channels.includes(i.channel) || !project.channels.length);
    const n = await addIdeas(projectId, parsed.length ? parsed : parseIdeaLines(text, mainChannel));
    showToast(n ? `${n} ideas added for ${project.name} 💡` : 'No new ideas found in that text');
    return n;
  };

  return (
    <div>
      {current ? (
        <div className="relative overflow-hidden rounded-3xl p-[1.5px]" style={{ background: 'var(--grad)' }}>
          <div className="rounded-[22px] p-5" style={{ background: 'var(--card-solid)' }}>
            <div className="faint text-xs font-bold uppercase tracking-wider">
              {project.emoji} {project.name} · {fresh.length} fresh ideas
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, rotateX: -60, y: 10 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, rotateX: 60, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="mt-3 text-xl font-bold leading-snug">{current.title}</div>
                <div className="muted mt-2 text-sm">
                  {CHANNEL_META[current.channel].emoji} {current.channel} · {current.format}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={shuffle}>
                <Shuffle size={18} /> Idea Shuffle
              </button>
              <button className="btn-primary" onClick={() => setTemplate({ task: toTask(current), ideaId: current.id })}>
                <Plus size={18} /> Create task
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-5 text-center">
          <div className="text-3xl">💡</div>
          <div className="mt-2 font-bold">No ideas for {project.name} yet</div>
          <p className="muted mt-1 text-sm">Generate ideas from this brand's brief, or add your own below.</p>
        </div>
      )}

      {/* Generate */}
      <div className="card mt-4 p-4">
        <button className="section-title w-full" onClick={() => setGenOpen(!genOpen)}>
          <Sparkles size={15} style={{ color: 'var(--accent)' }} /> Generate more ideas for {project.name}
          <ChevronDown size={16} className={`faint ml-auto transition ${genOpen ? 'rotate-180' : ''}`} />
        </button>
        {genOpen && (
          <div className="mt-3 space-y-2">
            {!project.brief?.about && <p className="text-xs text-amber-400">Tip: fill the brand brief (Projects → {project.name} → Edit) so ideas are specific to this brand.</p>}
            {keyOk ? (
              <button
                className="btn-primary w-full"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await importText(await generate(prompt));
                  } catch (e) {
                    showToast((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {busy ? 'Generating…' : 'Generate 20 brand ideas'}
              </button>
            ) : (
              <>
                <button
                  className="btn-ghost w-full"
                  onClick={async () => {
                    await copyText(prompt);
                    showToast('Prompt copied — paste it into ChatGPT or Claude, then paste the answer below');
                  }}
                >
                  <Copy size={16} /> 1. Copy brand prompt
                </button>
                <textarea className="input min-h-[100px] text-sm" placeholder="2. Paste the AI answer here (one idea per line: Title | Channel | Format)" value={paste} onChange={(e) => setPaste(e.target.value)} />
                <button
                  className="btn-primary w-full"
                  disabled={!paste.trim()}
                  onClick={async () => {
                    if (await importText(paste)) setPaste('');
                  }}
                >
                  3. Import ideas
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add manually */}
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder={`Add your own idea for ${project.name}`} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <select className="input !w-28 shrink-0 text-sm" value={newChannel} onChange={(e) => setNewChannel(e.target.value as Channel)} aria-label="Channel">
          <option value="">{mainChannel}</option>
          {CHANNELS.filter((c) => c !== mainChannel).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="btn-ghost shrink-0"
          aria-label="Add idea"
          onClick={async () => {
            if (!newTitle.trim()) return;
            await addIdeas(projectId, [{ title: newTitle.trim(), channel: newChannel || mainChannel, format: 'Post' }]);
            setNewTitle('');
            showToast('Idea saved 💡');
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      {fresh.length > 0 && (
        <>
          <button className="section-title faint mt-6" onClick={() => setShowAll(!showAll)}>
            All {project.name} ideas ({fresh.length}) <ChevronDown size={16} className={`transition ${showAll ? 'rotate-180' : ''}`} />
          </button>
          {showAll && (
            <div className="mt-3 space-y-2">
              {fresh.map((i) => (
                <IdeaRow key={i.id} i={i} onTask={() => setTemplate({ task: toTask(i), ideaId: i.id })} />
              ))}
            </div>
          )}
        </>
      )}
      {used.length > 0 && (
        <>
          <button className="section-title faint mt-6" onClick={() => setShowUsed(!showUsed)}>
            Already used ({used.length}) <ChevronDown size={16} className={`transition ${showUsed ? 'rotate-180' : ''}`} />
          </button>
          {showUsed && (
            <div className="mt-3 space-y-2 opacity-70">
              {used.map((i) => (
                <IdeaRow key={i.id} i={i} onTask={() => setTemplate({ task: toTask(i), ideaId: i.id })} />
              ))}
            </div>
          )}
        </>
      )}

      <AddTaskSheet
        template={template?.task ?? null}
        defaultProjectId={projectId}
        onClose={() => setTemplate(null)}
        onCreated={() => template && db.ideas.update(template.ideaId, { usedAt: Date.now() })}
      />
    </div>
  );
}

function IdeaRow({ i, onTask }: { i: BrandIdea; onTask: () => void }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <span className="text-lg">{CHANNEL_META[i.channel].emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-snug">{i.title}</div>
        <div className="faint text-xs">
          {i.channel} · {i.format}
        </div>
      </div>
      <button aria-label="Create task" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: 'var(--input)' }} onClick={onTask}>
        <Plus size={18} />
      </button>
      <button aria-label="Delete idea" className="faint grid h-10 w-8 shrink-0 place-items-center" onClick={() => db.ideas.delete(i.id)}>
        <X size={15} />
      </button>
    </div>
  );
}
