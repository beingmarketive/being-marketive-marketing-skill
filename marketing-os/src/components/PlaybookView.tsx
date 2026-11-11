import { useState } from 'react';
import { Copy } from 'lucide-react';
import type { Playbook } from '../types';
import { copyText } from '../lib/ai';
import { useUI } from '../lib/ui';

export function PlaybookView({ playbook }: { playbook: Playbook }) {
  const { showToast } = useUI();
  const [tab, setTab] = useState<'steps' | 'tips' | 'mistakes' | 'template'>('steps');
  return (
    <div>
      <p className="muted text-[15px] leading-relaxed">{playbook.summary}</p>
      <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1">
        {(
          [
            ['steps', `🪜 Steps (${playbook.steps.length})`],
            ['tips', '💡 Pro tips'],
            ['mistakes', '⚠️ Mistakes'],
            ['template', '📄 Template']
          ] as const
        ).map(([k, label]) => (
          <button key={k} className={`chip ${tab === k ? 'chip-on' : ''}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === 'steps' && (
          <ol className="space-y-2.5">
            {playbook.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed">
                <span className="grad-bg grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        )}
        {tab === 'tips' && (
          <ul className="space-y-2.5">
            {playbook.tips.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                <span>💡</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'mistakes' && (
          <ul className="space-y-2.5">
            {playbook.mistakes.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                <span>❌</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'template' && (
          <div>
            <pre className="whitespace-pre-wrap rounded-xl p-3.5 font-sans text-[14px] leading-relaxed" style={{ background: 'var(--input)' }}>
              {playbook.template}
            </pre>
            <button
              className="btn-ghost mt-2 w-full"
              onClick={async () => {
                await copyText(playbook.template);
                showToast('Template copied 📋');
              }}
            >
              <Copy size={16} /> Copy template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
