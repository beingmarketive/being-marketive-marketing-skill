export const CHANNELS = [
  'SEO',
  'GBP',
  'Instagram',
  'Reels',
  'Blog',
  'LinkedIn',
  'YouTube',
  'Meta Ads',
  'Google Ads',
  'Email',
  'WhatsApp',
  'Website',
  'Reporting'
] as const;

export type Channel = (typeof CHANNELS)[number];

/** 1 = high, 2 = medium, 3 = low */
export type Priority = 1 | 2 | 3;

export type Recurrence =
  | { type: 'daily' }
  | { type: 'weekly'; days: number[] } // 0 = Sunday … 6 = Saturday
  | { type: 'monthly'; dayOfMonth: number } // 1-31, clamps to month end
  | { type: 'custom'; everyDays: number };

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export type TaskSource =
  | 'manual'
  | 'pack'
  | 'recurring'
  | 'chain'
  | 'calendar'
  | 'idea'
  | 'promove'
  | 'repurpose'
  | 'checklist';

export interface ChainRef {
  chainId: string;
  step: number;
  runId: string;
  topic: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  channel: Channel | null;
  /** YYYY-MM-DD (local) */
  due: string;
  /** HH:mm, optional */
  dueTime?: string;
  priority: Priority;
  estMinutes: number;
  notes: string;
  subtasks: Subtask[];
  status: 'todo' | 'done';
  doneAt?: number;
  createdAt: number;
  updatedAt: number;
  recurrence?: Recurrence;
  /** Shared by every instance of the same recurring task. */
  seriesId?: string;
  /** First due date of the series (anchor for "every N days"). */
  anchor?: string;
  /** What was actually made (e.g. the blog title) — used to name chain steps. */
  topic?: string;
  /** history row written on completion (used for undo). */
  historyId?: string;
  /** Set when this task is a step inside a chain workflow. */
  chain?: ChainRef;
  /** When this task is completed, start this chain. */
  startsChain?: string;
  playbookId?: string;
  source: TaskSource;
  snoozes?: number;
  /** ids of tasks created when this one was completed (used for undo). */
  spawned?: string[];
}

export interface BrandBrief {
  /** What the business does, in one or two lines */
  about: string;
  /** Who the customers are */
  audience: string;
  /** Main products / services */
  offerings: string;
  /** City / areas served */
  location: string;
  /** Why customers choose this brand */
  usp: string;
  /** Voice / style notes */
  tone: string;
}

export interface Project {
  id: string;
  name: string;
  industryId: string;
  color: string;
  emoji: string;
  channels: Channel[];
  notes: string;
  kpis: string[];
  aliases: string[];
  website?: string;
  brief?: BrandBrief;
  createdAt: number;
  archived?: boolean;
}

export interface BrandIdea {
  id: string;
  projectId: string;
  title: string;
  channel: Channel;
  format: string;
  createdAt: number;
  usedAt?: number;
}

export interface HistoryEntry {
  id: string;
  seriesId: string;
  projectId: string | null;
  title: string;
  due: string;
  status: 'ontime' | 'late' | 'missed';
  at: number;
}

export interface KpiEntry {
  id: string;
  projectId: string;
  kpi: string;
  value: number;
  date: string;
}

export interface DayLog {
  date: string;
  done: number;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

export interface SwipeItem {
  id: string;
  kind: 'Ad' | 'Post' | 'Hook' | 'Reel' | 'Email' | 'Landing page' | 'Other';
  title: string;
  link: string;
  note: string;
  tags: string[];
  createdAt: number;
}

export interface HashtagSet {
  id: string;
  name: string;
  tags: string;
  projectId: string | null;
  createdAt: number;
}

export interface UserPrompt {
  id: string;
  title: string;
  body: string;
  createdAt: number;
}

/* ---------- Knowledge (static data) ---------- */

export interface TaskTemplate {
  title: string;
  channel: Channel;
  estMinutes: number;
  priority: Priority;
  playbookId?: string;
  startsChain?: string;
  subtasks?: string[];
  notes?: string;
}

export interface RecurringTemplate extends TaskTemplate {
  recurrence: Recurrence;
}

export interface Idea {
  title: string;
  channel: Channel;
  format: string;
}

export interface IndustryPack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  defaultChannels: Channel[];
  recurring: RecurringTemplate[];
  ideas: Idea[];
  kpis: string[];
}

export interface ChainStepTemplate extends TaskTemplate {
  offsetDays?: number;
  offsetHours?: number;
}

export interface Chain {
  id: string;
  name: string;
  description: string;
  /** Lower-case keywords; a task title containing ALL words of any group starts this chain. */
  triggers: string[][];
  steps: ChainStepTemplate[][];
}

export interface Playbook {
  id: string;
  name: string;
  emoji: string;
  channels: Channel[];
  /** lower-case keywords used to match a task title to this playbook */
  match: string[];
  summary: string;
  steps: string[];
  tips: string[];
  mistakes: string[];
  template: string;
  /** Use {project}, {industry}, {task}, {website}, {notes} placeholders. */
  aiPrompt: string;
}

export interface ProMove {
  id: string;
  name: string;
  category: 'SEO' | 'Local' | 'Social' | 'Ads' | 'Analytics' | 'Email & CRM' | 'Content' | 'AI Search';
  why: string;
  how: string[];
  task: TaskTemplate;
}

export interface Checklist {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sections: { title: string; items: string[] }[];
}

export interface MarketingEvent {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  date: string;
  verify?: boolean;
  kind: 'festival' | 'national' | 'marketing-day' | 'sale' | 'season';
  angle: string;
  industries?: string[];
}
