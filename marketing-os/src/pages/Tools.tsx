import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClipboardCheck, Link2, Recycle, Hash, ScrollText, Bookmark, Settings, Copy, Trash2, Plus, ExternalLink } from 'lucide-react';
import { db } from '../db/db';
import { BackLink } from './ProjectDetail';
import WeeklyReview from './WeeklyReview';
import { copyText } from '../lib/ai';
import { useUI } from '../lib/ui';
import { uid } from '../lib/id';
import { ProjectPicker } from '../components/ProjectPicker';
import { addTask } from '../lib/engine';
import { addDays, today } from '../lib/dates';
import { PROMPTS } from '../data/prompts';
import { CHAIN_BY_ID } from '../data/chains';
import type { Channel, SwipeItem } from '../types';
import { AiBox } from '../components/AiBox';

const TOOLS = [
  { id: 'review', name: 'Weekly review', desc: 'Health score, missed tasks, next week', icon: ClipboardCheck, color: '#10b981' },
  { id: 'utm', name: 'UTM builder', desc: 'Clean tracked links', icon: Link2, color: '#3b82f6' },
  { id: 'repurpose', name: 'Content repurposer', desc: '1 piece → 5 tasks', icon: Recycle, color: '#a855f7' },
  { id: 'hashtags', name: 'Hashtag sets', desc: 'Save & copy sets', icon: Hash, color: '#ec4899' },
  { id: 'prompts', name: 'Prompt library', desc: 'Ready AI prompts', icon: ScrollText, color: '#f59e0b' },
  { id: 'swipe', name: 'Swipe file', desc: 'Good ads, hooks, posts', icon: Bookmark, color: '#22d3ee' }
];

export default function Tools() {
  const { tool } = useParams();
  if (tool === 'review') return <WeeklyReview />;
  const t = TOOLS.find((x) => x.id === tool);
  if (t)
    return (
      <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
        <header className="flex items-center gap-3 pt-4">
          <BackLink to="/tools" />
          <h1 className="text-2xl font-extrabold">{t.name}</h1>
        </header>
        <div className="mt-4">
          {tool === 'utm' && <UtmBuilder />}
          {tool === 'repurpose' && <Repurposer />}
          {tool === 'hashtags' && <Hashtags />}
          {tool === 'prompts' && <Prompts />}
          {tool === 'swipe' && <SwipeFile />}
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <h1 className="pt-5 text-2xl font-extrabold">Tools</h1>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {TOOLS.map(({ id, name, desc, icon: Icon, color }) => (
          <Link key={id} to={`/tools/${id}`} className="card flex min-h-[120px] flex-col justify-between p-4 transition active:scale-[0.98]">
            <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: color + '22', color }}>
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-[15px] font-bold">{name}</span>
              <span className="faint block text-xs">{desc}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link to="/settings" className="card mt-3 flex items-center gap-3 p-4 font-semibold">
        <Settings size={20} /> Settings · Reminder · Backup · AI key
      </Link>
    </div>
  );
}

/* ---------------- UTM ---------------- */

const UTM_PRESETS: { label: string; source: string; medium: string }[] = [
  { label: 'Instagram bio', source: 'instagram', medium: 'social' },
  { label: 'Instagram story', source: 'instagram', medium: 'story' },
  { label: 'GBP website', source: 'google', medium: 'organic_gbp' },
  { label: 'GBP post', source: 'google', medium: 'gbp_post' },
  { label: 'WhatsApp', source: 'whatsapp', medium: 'message' },
  { label: 'LinkedIn', source: 'linkedin', medium: 'social' },
  { label: 'Newsletter', source: 'newsletter', medium: 'email' },
  { label: 'Meta ads', source: 'facebook', medium: 'paid_social' },
  { label: 'YouTube', source: 'youtube', medium: 'video' }
];

const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\-.]/g, '');

function UtmBuilder() {
  const { showToast } = useUI();
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('');
  const [content, setContent] = useState('');
  const [term, setTerm] = useState('');
  const result = useMemo(() => {
    if (!url.trim()) return '';
    try {
      const u = new URL(/^https?:\/\//.test(url.trim()) ? url.trim() : 'https://' + url.trim());
      const set = (k: string, v: string) => v && u.searchParams.set(k, slug(v));
      set('utm_source', source);
      set('utm_medium', medium);
      set('utm_campaign', campaign);
      set('utm_content', content);
      set('utm_term', term);
      return u.toString();
    } catch {
      return '';
    }
  }, [url, source, medium, campaign, content, term]);

  return (
    <div className="space-y-3">
      <input className="input" inputMode="url" placeholder="https://cloudforz.com/demo" value={url} onChange={(e) => setUrl(e.target.value)} />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {UTM_PRESETS.map((p) => (
          <button
            key={p.label}
            className={`chip ${source === p.source && medium === p.medium ? 'chip-on' : ''}`}
            onClick={() => {
              setSource(p.source);
              setMedium(p.medium);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="label">Source *</span>
          <input className="input" value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
        <label>
          <span className="label">Medium *</span>
          <input className="input" value={medium} onChange={(e) => setMedium(e.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className="label">Campaign *</span>
        <input className="input" placeholder="diwali_offer_2027" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="label">Content</span>
          <input className="input" placeholder="reel_1 / blue_cta" value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <label>
          <span className="label">Term</span>
          <input className="input" placeholder="keyword" value={term} onChange={(e) => setTerm(e.target.value)} />
        </label>
      </div>
      {result && (
        <div className="card p-4">
          <div className="break-all font-mono text-[13px]">{result}</div>
          <button
            className="btn-primary mt-3 w-full"
            onClick={async () => {
              await copyText(result);
              showToast('UTM link copy ho gaya 🔗');
            }}
          >
            <Copy size={16} /> Copy link
          </button>
        </div>
      )}
      <p className="faint text-xs">Rule: sab lowercase, spaces ki jagah underscore. Same naming har jagah — tabhi GA4 mein clean data milega.</p>
    </div>
  );
}

/* ---------------- Repurposer ---------------- */

const REPURPOSE: { label: string; channel: Channel; playbookId: string; est: number; offset: number; chain?: string }[] = [
  { label: 'Carousel', channel: 'Instagram', playbookId: 'ig-carousel', est: 45, offset: 1, chain: 'carousel-followup' },
  { label: 'Reel', channel: 'Reels', playbookId: 'reel-script', est: 45, offset: 2, chain: 'reel-followup' },
  { label: 'LinkedIn post', channel: 'LinkedIn', playbookId: 'linkedin-post', est: 20, offset: 3 },
  { label: 'Newsletter section', channel: 'Email', playbookId: 'email-campaign', est: 30, offset: 5 },
  { label: 'GBP / WhatsApp update', channel: 'GBP', playbookId: 'gbp-post', est: 15, offset: 6 },
  { label: 'YouTube Short', channel: 'YouTube', playbookId: 'youtube-seo', est: 30, offset: 7 },
  { label: 'Blog post', channel: 'Blog', playbookId: 'blog-seo', est: 90, offset: 7, chain: 'blog-pipeline' }
];

function Repurposer() {
  const { showToast } = useUI();
  const [source, setSource] = useState('');
  const [link, setLink] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>(REPURPOSE.slice(0, 5).map((r) => r.label));

  const create = async () => {
    if (!source.trim()) return;
    const T = today();
    for (const r of REPURPOSE.filter((x) => picked.includes(x.label))) {
      await addTask({
        title: `${r.label}: ${source.trim()}`,
        projectId,
        channel: r.channel,
        playbookId: r.playbookId,
        estMinutes: r.est,
        due: addDays(T, r.offset),
        notes: link ? `Source: ${link}` : '',
        startsChain: r.chain && CHAIN_BY_ID[r.chain] ? r.chain : undefined,
        source: 'repurpose'
      });
    }
    showToast(`${picked.length} repurpose tasks ban gaye ♻️ (agle 7 din mein spread)`);
    setSource('');
    setLink('');
  };

  return (
    <div className="space-y-3">
      <input className="input" placeholder="Source piece (e.g. GBP optimisation guide)" value={source} onChange={(e) => setSource(e.target.value)} />
      <input className="input" placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
      <ProjectPicker value={projectId} onChange={setProjectId} />
      <div className="flex flex-wrap gap-2">
        {REPURPOSE.map((r) => (
          <button key={r.label} className={`chip ${picked.includes(r.label) ? 'chip-on' : ''}`} onClick={() => setPicked(picked.includes(r.label) ? picked.filter((x) => x !== r.label) : [...picked, r.label])}>
            {r.label} <span className="faint text-[10px]">+{r.offset}d</span>
          </button>
        ))}
      </div>
      <button className="btn-primary w-full" disabled={!source.trim() || !picked.length} onClick={create}>
        <Recycle size={18} /> {picked.length} tasks banao
      </button>
      <AiBox prompt={`Repurpose this piece "${source || '[title]'}" ${link ? `(${link}) ` : ''}into: ${picked.join(', ')}. Give a platform-specific hook and full draft for each. Audience: small business owners in India.`} title="AI: sab drafts ek saath" />
    </div>
  );
}

/* ---------------- Hashtags ---------------- */

function Hashtags() {
  const { showToast } = useUI();
  const sets = useLiveQuery(() => db.hashtags.orderBy('createdAt').reverse().toArray(), []) ?? [];
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const count = tags.split(/\s+/).filter((t) => t.startsWith('#')).length;
  return (
    <div>
      <div className="card space-y-2 p-4">
        <input className="input" placeholder="Set name (e.g. Marketomate – AI tools)" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="input min-h-[90px]" placeholder="#aitools #smallbusinessindia #marketingtips" value={tags} onChange={(e) => setTags(e.target.value)} />
        <div className="faint text-xs">{count} hashtags · 3–5 niche tags usually beat 30 generic ones.</div>
        <ProjectPicker value={projectId} onChange={setProjectId} />
        <button
          className="btn-primary w-full"
          disabled={!name.trim() || !tags.trim()}
          onClick={async () => {
            await db.hashtags.add({ id: uid('hs_'), name: name.trim(), tags: tags.trim(), projectId, createdAt: Date.now() });
            setName('');
            setTags('');
            showToast('Hashtag set save ho gaya #️⃣');
          }}
        >
          <Plus size={18} /> Save set
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {sets.map((s) => (
          <div key={s.id} className="card p-3.5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{s.name}</div>
              <div className="flex gap-1">
                <button
                  aria-label="Copy"
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: 'var(--input)' }}
                  onClick={async () => {
                    await copyText(s.tags);
                    showToast('Hashtags copy ho gaye');
                  }}
                >
                  <Copy size={15} />
                </button>
                <button aria-label="Delete" className="faint grid h-9 w-9 place-items-center rounded-lg" onClick={() => db.hashtags.delete(s.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="muted mt-1 text-sm">{s.tags}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Prompts ---------------- */

function Prompts() {
  const { showToast } = useUI();
  const mine = useLiveQuery(() => db.prompts.orderBy('createdAt').reverse().toArray(), []) ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const all = [...mine.map((p) => ({ ...p, category: 'Mine' })), ...PROMPTS];
  return (
    <div>
      <div className="space-y-2">
        {all.map((p) => (
          <div key={p.id} className="card overflow-hidden">
            <button className="flex w-full items-center justify-between gap-2 p-3.5 text-left" onClick={() => setOpen(open === p.id ? null : p.id)}>
              <span className="font-semibold">{p.title}</span>
              <span className="faint shrink-0 text-xs">{p.category}</span>
            </button>
            {open === p.id && (
              <div className="px-3.5 pb-3.5">
                <AiBox prompt={p.body} title={p.title} />
                {p.category === 'Mine' && (
                  <button className="faint mt-2 text-xs" onClick={() => db.prompts.delete(p.id)}>
                    Delete prompt
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="card mt-5 space-y-2 p-4">
        <div className="section-title">Apna prompt save karo</div>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input min-h-[100px]" placeholder="Prompt text…" value={body} onChange={(e) => setBody(e.target.value)} />
        <button
          className="btn-primary w-full"
          disabled={!title.trim() || !body.trim()}
          onClick={async () => {
            await db.prompts.add({ id: uid('pr_'), title: title.trim(), body: body.trim(), createdAt: Date.now() });
            setTitle('');
            setBody('');
            showToast('Prompt save ho gaya');
          }}
        >
          <Plus size={18} /> Save
        </button>
      </div>
    </div>
  );
}

/* ---------------- Swipe file ---------------- */

const KINDS: SwipeItem['kind'][] = ['Ad', 'Post', 'Hook', 'Reel', 'Email', 'Landing page', 'Other'];

function SwipeFile() {
  const { showToast } = useUI();
  const items = useLiveQuery(() => db.swipes.orderBy('createdAt').reverse().toArray(), []) ?? [];
  const [kind, setKind] = useState<SwipeItem['kind']>('Ad');
  const [filter, setFilter] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const list = items.filter((i) => filter === 'All' || i.kind === filter);
  return (
    <div>
      <div className="card space-y-2 p-4">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {KINDS.map((k) => (
            <button key={k} className={`chip ${kind === k ? 'chip-on' : ''}`} onClick={() => setKind(k)}>
              {k}
            </button>
          ))}
        </div>
        <input className="input" placeholder="What is it? (e.g. Zomato rain push copy)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" inputMode="url" placeholder="Link (ad library / post URL)" value={link} onChange={(e) => setLink(e.target.value)} />
        <textarea className="input min-h-[70px]" placeholder="Why is it good? What to steal?" value={note} onChange={(e) => setNote(e.target.value)} />
        <input className="input" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button
          className="btn-primary w-full"
          disabled={!title.trim()}
          onClick={async () => {
            await db.swipes.add({ id: uid('sw_'), kind, title: title.trim(), link: link.trim(), note: note.trim(), tags: tags.split(',').map((t) => t.trim()).filter(Boolean), createdAt: Date.now() });
            setTitle('');
            setLink('');
            setNote('');
            setTags('');
            showToast('Swipe file mein save 🔖');
          }}
        >
          <Bookmark size={18} /> Save
        </button>
      </div>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {['All', ...KINDS].map((k) => (
          <button key={k} className={`chip ${filter === k ? 'chip-on' : ''}`} onClick={() => setFilter(k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {list.map((i) => (
          <div key={i.id} className="card p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold">{i.title}</div>
                <div className="faint text-xs">
                  {i.kind}
                  {i.tags.length ? ` · ${i.tags.join(', ')}` : ''}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {i.link && (
                  <a aria-label="Open link" href={i.link} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: 'var(--input)' }}>
                    <ExternalLink size={15} />
                  </a>
                )}
                <button aria-label="Delete" className="faint grid h-9 w-9 place-items-center rounded-lg" onClick={() => db.swipes.delete(i.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            {i.note && <p className="muted mt-1.5 whitespace-pre-wrap text-sm">{i.note}</p>}
          </div>
        ))}
        {!list.length && <p className="faint py-6 text-center text-sm">Abhi kuch save nahi kiya. Jo bhi accha ad/hook dikhe — yahan daal do.</p>}
      </div>
    </div>
  );
}
