import type { Channel } from '../types';

export interface SeedProject {
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
  /** If set, only pack recurring tasks on these channels are created. */
  onlyChannels?: Channel[];
}

export const SEED_PROJECTS: SeedProject[] = [
  {
    id: 'being-marketive',
    name: 'Being Marketive',
    industryId: 'agency',
    color: '#7c5cff',
    emoji: '🚀',
    channels: ['Blog', 'SEO', 'Instagram', 'LinkedIn', 'Email', 'YouTube'],
    notes: 'My own brand. Daily industry-playbook blog → index → repurpose. Goal: topical authority on "marketing for [industry]" + inbound clients.',
    kpis: ['Organic clicks (GSC)', 'Indexed pages', 'Blog posts published', 'Newsletter subscribers', 'Inbound enquiries'],
    aliases: ['being marketive', 'beingmarketive', 'bm', 'being']
  },
  {
    id: 'marketomate',
    name: 'Marketomate',
    industryId: 'creator',
    color: '#ec4899',
    emoji: '🤖',
    channels: ['Instagram'],
    notes: '@marketomate.ai — carousel-only page: AI + marketing for small businesses. Keep design system consistent, hook on slide 1, save/share CTA on last slide.',
    kpis: ['Followers', 'Saves per post', 'Shares per post', 'Reach (7-day)', 'Profile visits'],
    aliases: ['marketomate', 'marketo', 'mm', 'marketomate.ai'],
    onlyChannels: ['Instagram', 'Reporting']
  },
  {
    id: 'cloudforz',
    name: 'Cloudforz',
    industryId: 'saas',
    color: '#22d3ee',
    emoji: '☁️',
    channels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Instagram', 'Google Ads', 'Email'],
    notes: 'cloudforz.com — field force management SaaS. Social content focused on pharma field teams (MRs, area managers, DCR, beat plans).',
    kpis: ['Demo requests', 'Organic traffic', 'MQLs', 'Cost per demo', 'LinkedIn followers'],
    aliases: ['cloudforz', 'cloud forz', 'cf', 'cloudfors'],
    website: 'https://cloudforz.com'
  },
  {
    id: 'trendy-prints',
    name: 'Trendy Prints',
    industryId: 'local-retail',
    color: '#f59e0b',
    emoji: '🖨️',
    channels: ['GBP'],
    notes: 'Printing business. I manage Google Business Profile only: posts, photos, reviews, Q&A, products.',
    kpis: ['GBP calls', 'Direction requests', 'Website clicks (GBP)', 'Google reviews count', 'Average rating'],
    aliases: ['trendy prints', 'trendy', 'tp', 'trendyprints'],
    onlyChannels: ['GBP', 'Reporting']
  },
  {
    id: 'rn-world',
    name: 'R N World Computers',
    industryId: 'electronics',
    color: '#ef4444',
    emoji: '🖥️',
    channels: ['GBP', 'Instagram', 'Reels', 'WhatsApp', 'Meta Ads', 'Email'],
    notes: 'Hyderabad PC hardware + gaming store. Services: repairs, networking, AMC. Push gaming builds on reels, AMC to offices.',
    kpis: ['GBP calls', 'WhatsApp leads', 'Cost per lead (Meta)', 'Google reviews', 'AMC contracts signed'],
    aliases: ['r n world', 'rn world', 'rnworld', 'rn', 'r n world computers', 'rnw']
  },
  {
    id: '14mittech',
    name: '14mittech',
    industryId: 'it-services',
    color: '#22c55e',
    emoji: '💻',
    channels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Instagram', 'GBP', 'Google Ads'],
    notes: '14mittech.com — website design + digital marketing services. Portfolio-led content, service pages for local SEO.',
    kpis: ['Enquiries', 'Projects closed', 'Organic traffic', 'Google reviews', 'Cost per lead (Ads)'],
    aliases: ['14mittech', '14mit', '14 mit', 'mittech', '14m'],
    website: 'https://14mittech.com'
  }
];
