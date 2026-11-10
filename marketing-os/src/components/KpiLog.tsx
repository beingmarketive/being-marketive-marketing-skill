import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { db } from '../db/db';
import type { Project } from '../types';
import { shortDate, today } from '../lib/dates';
import { uid } from '../lib/id';
import { useUI } from '../lib/ui';

export function KpiLog({ project }: { project: Project }) {
  const { showToast } = useUI();
  const entries = useLiveQuery(() => db.kpis.where('projectId').equals(project.id).toArray(), [project.id]) ?? [];
  const kpis = project.kpis.length ? project.kpis : ['Leads'];
  const [kpi, setKpi] = useState(kpis[0]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(today());
  const [newKpi, setNewKpi] = useState('');

  const series = useMemo(() => entries.filter((e) => e.kpi === kpi).sort((a, b) => (a.date < b.date ? -1 : 1)), [entries, kpi]);
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const delta = last && prev ? last.value - prev.value : null;

  const add = async () => {
    const v = Number(value);
    if (!value.trim() || Number.isNaN(v)) return;
    await db.kpis.add({ id: uid('k_'), projectId: project.id, kpi, value: v, date });
    setValue('');
    showToast(`${kpi}: ${v} log ho gaya 📈`);
  };

  const addKpi = async () => {
    const k = newKpi.trim();
    if (!k || project.kpis.includes(k)) return;
    await db.projects.update(project.id, { kpis: [...project.kpis, k] });
    setKpi(k);
    setNewKpi('');
  };

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {kpis.map((k) => (
          <button key={k} className={`chip ${kpi === k ? 'chip-on' : ''}`} onClick={() => setKpi(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="card mt-3 p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="faint text-xs font-semibold uppercase">{kpi}</div>
            <div className="text-3xl font-extrabold">{last ? last.value.toLocaleString('en-IN') : '—'}</div>
          </div>
          {delta !== null && (
            <div className="text-sm font-bold" style={{ color: delta >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toLocaleString('en-IN')} vs last
            </div>
          )}
        </div>
        <LineChart points={series.map((s) => ({ x: s.date, y: s.value }))} color={project.color} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <input className="input" inputMode="decimal" placeholder={`${kpi} value`} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn-primary col-span-2" onClick={add}>
          Log {kpi}
        </button>
      </div>
      <p className="faint mt-2 text-xs">Tip: har Monday last week ke numbers daalo — trend tabhi dikhega.</p>

      {series.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {[...series].reverse().slice(0, 12).map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: 'var(--input)' }}>
              <span className="muted">{shortDate(e.date)}</span>
              <span className="font-semibold">{e.value.toLocaleString('en-IN')}</span>
              <button aria-label="Delete entry" className="faint p-1" onClick={() => db.kpis.delete(e.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <input className="input" placeholder="Naya KPI (e.g. GBP calls)" value={newKpi} onChange={(e) => setNewKpi(e.target.value)} />
        <button className="btn-ghost" onClick={addKpi}>
          Add KPI
        </button>
      </div>
    </div>
  );
}

export function LineChart({ points, color, height = 120 }: { points: { x: string; y: number }[]; color: string; height?: number }) {
  if (points.length < 2) {
    return <div className="faint grid place-items-center text-sm" style={{ height }}>{points.length ? 'Ek aur entry daalo — trend line ban jayegi' : 'Abhi koi data nahi'}</div>;
  }
  const W = 320;
  const pad = 8;
  const ys = points.map((p) => p.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const xy = points.map((p, i) => [pad + (i / (points.length - 1)) * (W - pad * 2), pad + (1 - (p.y - min) / span) * (height - pad * 2 - 14)] as const);
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${xy[xy.length - 1][0]},${height - 14} L${xy[0][0]},${height - 14} Z`;
  const gid = 'g' + color.replace('#', '');
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="mt-3 w-full" role="img" aria-label="KPI trend">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {xy.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
      ))}
      <text x={pad} y={height - 2} fontSize="10" fill="var(--faint)">
        {shortDate(points[0].x)}
      </text>
      <text x={W - pad} y={height - 2} fontSize="10" fill="var(--faint)" textAnchor="end">
        {shortDate(points[points.length - 1].x)}
      </text>
    </svg>
  );
}
