import type { IndustryPack } from '../../types';
import { daily, weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const ecommerce: IndustryPack = {
  id: 'ecommerce',
  name: 'E-commerce / D2C',
  emoji: '🛒',
  description: 'Online brands scaling sales with ads, creatives, email and retention.',
  defaultChannels: ['Meta Ads', 'Google Ads', 'Instagram', 'Reels', 'Email', 'WhatsApp', 'Website'],
  recurring: [
    rt('Ads dashboard check: ROAS, CPA, spend pacing', 'Meta Ads', daily, 15, 1, { playbookId: 'meta-ads-check' }),
    rt('Launch 3 new ad creatives (hooks test)', 'Meta Ads', weekly(MON), 60, 1, { playbookId: 'meta-ads-check' }),
    rt('Google Shopping / PMax check: feed errors, search terms', 'Google Ads', weekly(TUE), 30, 1, { playbookId: 'google-ads-check' }),
    rt('UGC / product reel', 'Reels', weekly(WED, SAT), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Email campaign to list (launch / bestseller / offer)', 'Email', weekly(THU), 45, 1, { playbookId: 'email-campaign', startsChain: 'email-followup' }),
    rt('Abandoned cart + post-purchase flow check', 'Email', monthly(10), 30, 2, { playbookId: 'email-campaign' }),
    rt('Product page CRO: reviews, images, speed, COD/shipping clarity', 'Website', weekly(FRI), 40, 2, { playbookId: 'landing-cro' }),
    rt('Collect + publish customer reviews / UGC', 'Instagram', weekly(FRI), 20, 2),
    rt('Monthly P&L marketing report: MER, CAC, repeat rate', 'Reporting', monthly(1), 60, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Unboxing reel with customer voiceover', 'Reels', 'UGC reel'),
    idea('Founder story: why we started', 'Instagram', 'Story carousel'),
    idea('3 ways to use/style the product', 'Reels', 'How-to reel'),
    idea('Comparison: us vs generic alternative', 'Meta Ads', 'Comparison ad'),
    idea('Bestseller restock alert', 'Email', 'Announcement email'),
    idea('Bundle offer: buy 2 get 1', 'WhatsApp', 'Broadcast'),
    idea('Customer review compilation', 'Instagram', 'Testimonial carousel'),
    idea('Gift guide for festival season', 'Blog', 'Gift guide'),
    idea('Behind the scenes: packing orders', 'Reels', 'BTS reel'),
    idea('Ingredient / material deep dive', 'Instagram', 'Educational carousel'),
    idea('Influencer seeding campaign', 'Instagram', 'Micro-influencer collab'),
    idea('Quiz: find your perfect product', 'Website', 'Interactive quiz'),
    idea('Limited drop countdown', 'Email', 'Launch sequence'),
    idea('Win-back email: we miss you + code', 'Email', 'Win-back flow'),
    idea('Problem → solution ad with 3-second hook', 'Meta Ads', 'Video ad'),
    idea('Size / fit guide', 'Website', 'Guide page')
  ],
  kpis: ['Revenue', 'ROAS', 'CAC', 'Conversion rate', 'AOV', 'Repeat purchase %', 'Email revenue %']
};
