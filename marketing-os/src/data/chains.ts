import type { Chain } from '../types';

/**
 * Chain workflows. A task with `startsChain` (or whose title matches a trigger)
 * creates steps[0] when completed. Completing every task of step N creates step N+1.
 * `{topic}` in a title is replaced with the original task's title.
 */
export const CHAINS: Chain[] = [
  {
    id: 'blog-pipeline',
    name: 'Blog → Publish → Index → Repurpose',
    description: 'Every blog gets published with internal links, indexed in Search Console, then turned into 3 social pieces.',
    triggers: [['blog', 'write'], ['blog', 'likh'], ['article', 'write'], ['blog', 'post']],
    steps: [
      [
        {
          title: 'Publish + add internal links: {topic}',
          channel: 'Blog',
          estMinutes: 25,
          priority: 1,
          offsetDays: 0,
          playbookId: 'blog-seo',
          subtasks: ['Final proofread + meta title (≤60 chars) + meta description (≤155)', 'Add 3-5 internal links TO this post from older related posts', 'Add 2-3 links FROM this post to service/pillar pages', 'Set featured image + alt text', 'Add FAQ / Article schema']
        }
      ],
      [
        {
          title: 'Request indexing in Search Console: {topic}',
          channel: 'SEO',
          estMinutes: 5,
          priority: 1,
          offsetDays: 0,
          playbookId: 'indexing',
          subtasks: ['GSC → URL Inspection → paste URL', 'Request indexing', 'Confirm the URL is in sitemap.xml', 'Share once on social so Google discovers it faster']
        }
      ],
      [
        { title: 'Repurpose into carousel: {topic}', channel: 'Instagram', estMinutes: 40, priority: 2, offsetDays: 1, playbookId: 'ig-carousel' },
        { title: 'Repurpose into reel: {topic}', channel: 'Reels', estMinutes: 40, priority: 2, offsetDays: 2, playbookId: 'reel-script' },
        { title: 'Repurpose into LinkedIn post: {topic}', channel: 'LinkedIn', estMinutes: 20, priority: 2, offsetDays: 1, playbookId: 'linkedin-post' }
      ]
    ]
  },
  {
    id: 'reel-followup',
    name: 'Reel → Reply comments → Insights',
    description: 'After posting a reel, reply to comments in the first hour and review insights after 48 hours.',
    triggers: [['reel', 'post'], ['reel', 'upload'], ['reel', 'publish']],
    steps: [
      [{ title: 'Reply to reel comments (first hour): {topic}', channel: 'Reels', estMinutes: 15, priority: 1, offsetHours: 1, subtasks: ['Reply to every comment with a question back', 'Pin the best comment', 'Share reel to story with a poll sticker'] }],
      [{ title: 'Check reel insights after 48 hrs: {topic}', channel: 'Reporting', estMinutes: 10, priority: 2, offsetDays: 2, subtasks: ['Note 3-sec hold rate / skip rate', 'Note watch time + replays', 'Note shares + saves', 'Write 1 learning for the next reel'] }]
    ]
  },
  {
    id: 'carousel-followup',
    name: 'Carousel → Engage → Insights',
    description: 'Engage in the golden hour after a carousel goes live and learn from saves/shares.',
    triggers: [['carousel', 'post'], ['carousel', 'publish']],
    steps: [
      [{ title: 'Golden-hour engagement on carousel: {topic}', channel: 'Instagram', estMinutes: 15, priority: 1, offsetHours: 1, subtasks: ['Reply to every comment', 'Share to story with "new post" sticker', 'Send to 5 relevant DMs / broadcast channel'] }],
      [{ title: 'Carousel insights (saves, shares, reach): {topic}', channel: 'Reporting', estMinutes: 10, priority: 3, offsetDays: 2 }]
    ]
  },
  {
    id: 'monthly-report-next',
    name: 'Monthly report → Plan next month',
    description: 'A report is useless without a plan: every report creates next month\'s content plan.',
    triggers: [['monthly', 'report'], ['month', 'report']],
    steps: [
      [
        {
          title: 'Plan next month\'s content calendar: {topic}',
          channel: 'Reporting',
          estMinutes: 60,
          priority: 1,
          offsetDays: 1,
          subtasks: ['Double down on top 3 formats from the report', 'Check marketing calendar for festivals/events', 'Fill 4 weeks: pillar topics × channels', 'Book shoot/design days', 'Share plan with client (if client project)']
        }
      ]
    ]
  },
  {
    id: 'youtube-followup',
    name: 'YouTube upload → Engage → CTR check → Shorts',
    description: 'Get early engagement, review CTR/retention and cut the long video into Shorts.',
    triggers: [['youtube', 'upload'], ['video', 'upload']],
    steps: [
      [{ title: 'Pin comment + reply to all comments (2 hrs): {topic}', channel: 'YouTube', estMinutes: 15, priority: 1, offsetHours: 2 }],
      [{ title: 'Check CTR + retention after 72 hrs: {topic}', channel: 'Reporting', estMinutes: 15, priority: 2, offsetDays: 3, subtasks: ['CTR below 4%? Test a new thumbnail', 'Find the biggest retention drop and note why'] }],
      [{ title: 'Cut 2 Shorts from the video: {topic}', channel: 'YouTube', estMinutes: 40, priority: 2, offsetDays: 1, playbookId: 'repurposing' }]
    ]
  },
  {
    id: 'email-followup',
    name: 'Email sent → Stats → Resend to non-openers',
    description: 'Check opens/clicks next day and resend with a new subject line to non-openers.',
    triggers: [['email', 'send'], ['newsletter', 'send']],
    steps: [
      [{ title: 'Check open + click rate: {topic}', channel: 'Email', estMinutes: 10, priority: 2, offsetDays: 1 }],
      [{ title: 'Resend to non-openers with new subject: {topic}', channel: 'Email', estMinutes: 15, priority: 2, offsetDays: 2 }]
    ]
  },
  {
    id: 'ads-launch',
    name: 'Ads launched → Learning check → Optimise',
    description: 'Do not touch ads in the learning phase; check after 3 days, optimise after 7.',
    triggers: [['ads', 'launch'], ['campaign', 'launch'], ['ad', 'live']],
    steps: [
      [{ title: 'Check delivery + learning phase (don\'t edit yet): {topic}', channel: 'Meta Ads', estMinutes: 10, priority: 1, offsetDays: 3, playbookId: 'meta-ads-check' }],
      [{ title: 'Optimise: kill losers, scale winners 20%: {topic}', channel: 'Meta Ads', estMinutes: 25, priority: 1, offsetDays: 4, playbookId: 'meta-ads-check' }]
    ]
  },
  {
    id: 'gbp-post-followup',
    name: 'GBP post → Views check',
    description: 'Check which GBP posts get views and clicks to repeat what works.',
    triggers: [['gbp', 'post']],
    steps: [[{ title: 'Check GBP post views/clicks after 7 days: {topic}', channel: 'GBP', estMinutes: 5, priority: 3, offsetDays: 7 }]]
  }
];

export const CHAIN_BY_ID: Record<string, Chain> = Object.fromEntries(CHAINS.map((c) => [c.id, c]));

/** Detect a chain from a free-text title (used by quick add). */
export function detectChain(title: string): string | undefined {
  const t = title.toLowerCase();
  for (const c of CHAINS) {
    if (c.triggers.some((group) => group.every((w) => t.includes(w)))) return c.id;
  }
  return undefined;
}
