import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI } from './helpers';

export const saas: IndustryPack = {
  id: 'saas',
  name: 'B2B SaaS',
  emoji: '☁️',
  description: 'Demand generation for a B2B software product: SEO, LinkedIn, demos, nurture.',
  defaultChannels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Google Ads', 'Email'],
  recurring: [
    rt('Publish 1 bottom-funnel blog (use case / comparison / "X software for Y")', 'Blog', weekly(TUE), 120, 1, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
    rt('LinkedIn company post (product tip, customer story or industry data)', 'LinkedIn', weekly(MON, WED, FRI), 30, 1, { playbookId: 'linkedin-post' }),
    rt('Industry-focused social post (e.g. pharma field force pain point)', 'Instagram', weekly(TUE, THU), 30, 2, { playbookId: 'ig-carousel' }),
    rt('Google Ads search terms review + negatives', 'Google Ads', weekly(MON), 30, 1, { playbookId: 'google-ads-check' }),
    rt('Check demo-request page conversion rate + form drop-off', 'Website', weekly(THU), 25, 1, { playbookId: 'landing-cro' }),
    rt('Nurture email to trial / demo leads', 'Email', weekly(WED), 40, 2, { playbookId: 'email-campaign' }),
    rt('Competitor check: pricing pages, new features, ads', 'SEO', monthly(15), 45, 2, { playbookId: 'competitor-check' }),
    rt('Technical SEO + Core Web Vitals check', 'Website', monthly(10), 40, 2, { playbookId: 'technical-seo' }),
    rt('Monthly pipeline report: MQLs, demos, CAC by channel', 'Reporting', monthly(1), 60, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('"Field force management software for pharma companies" pillar page', 'Blog', 'Pillar landing page'),
    idea('How MRs waste 2 hours a day on manual reporting (and the fix)', 'LinkedIn', 'Pain-point post'),
    idea('[Your product] vs Excel: true cost of tracking field staff manually', 'Blog', 'Comparison article'),
    idea('Customer story: how a distributor improved visit compliance', 'LinkedIn', 'Document case study'),
    idea('ROI calculator for field sales tracking', 'Website', 'Interactive tool / lead magnet'),
    idea('Day in the life of a medical representative', 'Reels', 'Story reel'),
    idea('GPS attendance myths that stop managers from adopting apps', 'Instagram', 'Myth carousel'),
    idea('Checklist: choosing field force software (12 questions to ask)', 'Blog', 'Buyer\'s guide'),
    idea('Product feature in 30 seconds: geo-fenced check-in', 'YouTube', 'Short product demo'),
    idea('Webinar: improving secondary sales visibility', 'Email', 'Webinar invite sequence'),
    idea('Alternatives page: best alternatives to [competitor]', 'Blog', 'Alternatives article'),
    idea('Pharma sales manager survey results', 'LinkedIn', 'Data post'),
    idea('Integration announcement post', 'LinkedIn', 'Announcement'),
    idea('FAQ page with schema for pricing/onboarding questions', 'Website', 'FAQ page'),
    idea('Founder POV: why we built this', 'LinkedIn', 'Founder story text post'),
    idea('Glossary pages: DCR, beat plan, secondary sales', 'Blog', 'Glossary / programmatic SEO')
  ],
  kpis: ['Demo requests', 'Trial signups', 'MQLs', 'Organic traffic', 'Cost per demo', 'LinkedIn followers', 'Demo-to-paid %']
};
