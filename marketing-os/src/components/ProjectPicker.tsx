import { useProjects } from '../lib/hooks';

export function ProjectPicker({ value, onChange, allowNone = true }: { value: string | null; onChange: (id: string | null) => void; allowNone?: boolean }) {
  const projects = useProjects();
  return (
    <select className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      {allowNone && <option value="">Personal / no project</option>}
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.emoji} {p.name}
        </option>
      ))}
    </select>
  );
}
