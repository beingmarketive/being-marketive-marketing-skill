import type { IndustryPack } from '../../types';
import { daily, weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const agency: IndustryPack = {
  id: 'agency',
  name: 'Digital marketing agency / personal brand',
  emoji: '🚀',
  description: 'Daily blogging, SEO and authority content for a marketer or agency brand.',
  defaultChannels: ['Blog', 'SEO', 'Instagram', 'LinkedIn', 'YouTube', 'Email'],
  recurring: [
    rt('Write today\'s industry-playbook blog post', 'Blog', daily, 90, 1, {
      playbookId: 'blog-seo',
      startsChain: 'blog-pipeline',
      subtasks: ['Pick 1 industry + 1 keyword', 'Outline H2s from top-3 SERP results', 'Write 1,200+ words with examples', 'Add FAQ section (3-5 questions)', 'Add featured image + alt text']
    }),
    rt('Check Search Console: new pages indexed + coverage errors', 'SEO', weekly(MON, THU), 20, 1, { playbookId: 'indexing' }),
    rt('LinkedIn post from yesterday\'s blog insight', 'LinkedIn', weekly(TUE, THU), 25, 2, { playbookId: 'linkedin-post' }),
    rt('Instagram carousel: one marketing lesson', 'Instagram', weekly(MON, WED, FRI), 45, 2, { playbookId: 'ig-carousel', startsChain: 'carousel-followup' }),
    rt('Build 2 quality backlinks (guest post / HARO-style / directory)', 'SEO', weekly(WED), 45, 2, { playbookId: 'backlinks' }),
    rt('Refresh 1 old blog post that lost clicks', 'SEO', weekly(SAT), 40, 2, { playbookId: 'blog-seo' }),
    rt('Weekly newsletter to subscribers', 'Email', weekly(FRI), 40, 2, { playbookId: 'email-campaign' }),
    rt('Monthly traffic + rankings report for the brand', 'Reporting', monthly(1), 60, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('"Marketing playbook for [industry] in 2026" — one industry per day series', 'Blog', 'Long-form guide'),
    idea('5 GBP mistakes local businesses in Hyderabad make', 'Instagram', 'Carousel'),
    idea('My exact daily marketing routine as a 5-year marketer', 'Reels', 'Talking-head reel'),
    idea('Before/after: how one client\'s Google ranking moved in 90 days', 'LinkedIn', 'Case-study document post'),
    idea('ChatGPT prompts I use every day for client work', 'Instagram', 'Carousel with prompt screenshots'),
    idea('How to get your business cited in Google AI Overviews', 'Blog', 'How-to guide'),
    idea('Free tools stack: what I use instead of paid SEO tools', 'YouTube', 'Screen-recorded walkthrough'),
    idea('Myth vs fact: "SEO is dead because of AI"', 'Reels', 'Myth-buster reel'),
    idea('Client onboarding checklist I send every new brand', 'LinkedIn', 'PDF document post / lead magnet'),
    idea('How much should a small business spend on Meta ads in India?', 'Blog', 'Pricing explainer'),
    idea('3 hooks that doubled my reel views', 'Reels', 'Screen + voiceover'),
    idea('Teardown: a local brand\'s Instagram — what I would change', 'Instagram', 'Carousel teardown'),
    idea('Monthly "what changed in Google" roundup', 'Email', 'Newsletter'),
    idea('Behind the scenes: planning a month of content in 60 minutes', 'YouTube', 'Process video'),
    idea('Glossary series: CTR, CPC, ROAS, CAC explained in Hinglish', 'Instagram', 'Carousel series'),
    idea('Why your website gets traffic but no enquiries', 'Blog', 'Problem-solution article'),
    idea('Poll: which platform gives your business most leads?', 'LinkedIn', 'Poll post')
  ],
  kpis: ['Organic clicks (GSC)', 'Indexed pages', 'Blog posts published', 'Newsletter subscribers', 'Instagram followers', 'LinkedIn impressions', 'Inbound enquiries']
};
