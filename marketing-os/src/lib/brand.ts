import type { Project } from '../types';
import { getIndustry } from '../data/industries';

/** Brand context text used in every AI prompt. */
export function brandContext(p?: Project): string {
  if (!p) return 'none';
  const b = p.brief;
  const parts = [
    b?.about && `About: ${b.about}`,
    b?.audience && `Audience: ${b.audience}`,
    b?.offerings && `Products/services: ${b.offerings}`,
    b?.location && `Location: ${b.location}`,
    b?.usp && `Why customers choose us: ${b.usp}`,
    b?.tone && `Tone: ${b.tone}`,
    p.notes && `Notes: ${p.notes}`
  ].filter(Boolean);
  return parts.length ? parts.join('\n') : 'none';
}

export function promptVars(p: Project | undefined, task: string, extraNotes = ''): Record<string, string> {
  return {
    project: p?.name ?? '[brand]',
    industry: getIndustry(p?.industryId)?.name ?? '[industry]',
    task,
    website: p?.website ?? '[website]',
    notes: [brandContext(p), extraNotes].filter((x) => x && x !== 'none').join('\n') || 'none'
  };
}
