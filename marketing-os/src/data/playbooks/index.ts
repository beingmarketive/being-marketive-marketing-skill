import type { Playbook, Task } from '../../types';
import { localPlaybooks } from './local';
import { socialPlaybooks } from './social';
import { seoPlaybooks } from './seo';
import { adsReportingPlaybooks } from './ads-reporting';

export const PLAYBOOKS: Playbook[] = [...localPlaybooks, ...socialPlaybooks, ...seoPlaybooks, ...adsReportingPlaybooks];

export const PLAYBOOK_BY_ID: Record<string, Playbook> = Object.fromEntries(PLAYBOOKS.map((p) => [p.id, p]));

/** Fallback playbook per channel when nothing matches by keyword. */
const CHANNEL_DEFAULT: Record<string, string> = {
  SEO: 'blog-seo',
  GBP: 'gbp-post',
  Instagram: 'ig-carousel',
  Reels: 'reel-script',
  Blog: 'blog-seo',
  LinkedIn: 'linkedin-post',
  YouTube: 'youtube-seo',
  'Meta Ads': 'meta-ads-check',
  'Google Ads': 'google-ads-check',
  Email: 'email-campaign',
  WhatsApp: 'whatsapp-broadcast',
  Website: 'landing-cro',
  Reporting: 'monthly-report'
};

/** Best playbook for a task: explicit id → keyword match (longest) → channel default. */
export function findPlaybook(task: Pick<Task, 'title' | 'channel' | 'playbookId'>): Playbook | undefined {
  if (task.playbookId && PLAYBOOK_BY_ID[task.playbookId]) return PLAYBOOK_BY_ID[task.playbookId];
  const t = task.title.toLowerCase();
  let best: { p: Playbook; len: number } | null = null;
  for (const p of PLAYBOOKS) {
    for (const m of p.match) {
      if (t.includes(m) && (!best || m.length > best.len)) best = { p, len: m.length };
    }
  }
  if (best) return best.p;
  return task.channel ? PLAYBOOK_BY_ID[CHANNEL_DEFAULT[task.channel]] : undefined;
}

export function fillPrompt(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}
