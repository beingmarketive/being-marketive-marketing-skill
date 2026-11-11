import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { Copy, Sparkles, Loader2, NotebookPen } from 'lucide-react';
import { copyText, generate, hasApiKey } from '../lib/ai';
import { useUI } from '../lib/ui';

/** Prompt box: "Generate" with a Claude key, otherwise "Copy prompt". */
export function AiBox({ prompt, onSaveToNotes, title = 'AI prompt' }: { prompt: string; onSaveToNotes?: (text: string) => void; title?: string }) {
  const { showToast } = useUI();
  const keyOk = useLiveQuery(() => hasApiKey(), []) ?? false;
  const [text, setText] = useState(prompt);
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setText(prompt);
    setOut('');
    setErr('');
  }, [prompt]);

  const run = async () => {
    setBusy(true);
    setErr('');
    try {
      setOut(await generate(text));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="section-title mb-2">
        <Sparkles size={15} style={{ color: 'var(--accent)' }} /> {title}
      </div>
      <textarea className="input min-h-[140px] font-mono !text-[13px] leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="btn-ghost"
          onClick={async () => {
            await copyText(text);
            showToast('Prompt copied 📋 — paste it into ChatGPT or Claude');
          }}
        >
          <Copy size={16} /> Copy prompt
        </button>
        {keyOk ? (
          <button className="btn-primary" onClick={run} disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {busy ? 'Writing…' : 'Generate'}
          </button>
        ) : (
          <Link to="/settings" className="btn-ghost text-sm">
            🔑 Add API key
          </Link>
        )}
      </div>
      {err && <p className="mt-3 rounded-xl p-3 text-sm text-rose-300" style={{ background: 'rgba(244,63,94,0.12)' }}>{err}</p>}
      {out && (
        <div className="mt-4">
          <div className="whitespace-pre-wrap rounded-xl p-3.5 text-[14px] leading-relaxed" style={{ background: 'var(--input)' }}>
            {out}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              className="btn-ghost"
              onClick={async () => {
                await copyText(out);
                showToast('Copied 📋');
              }}
            >
              <Copy size={16} /> Copy
            </button>
            {onSaveToNotes && (
              <button
                className="btn-ghost"
                onClick={() => {
                  onSaveToNotes(out);
                  showToast('Saved to task notes');
                }}
              >
                <NotebookPen size={16} /> Save to notes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
