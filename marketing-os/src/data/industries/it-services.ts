import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI } from './helpers';

export const itServices: IndustryPack = {
  id: 'it-services',
  name: 'IT / web services',
  emoji: '💻',
  description: 'Website design, development and digital marketing services agency.',
  defaultChannels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Instagram', 'GBP', 'Google Ads'],
  recurring: [
    rt('Portfolio post: website we launched (screenshot + result)', 'Instagram', weekly(TUE), 30, 1, { playbookId: 'ig-carousel' }),
    rt('Service-page blog ("website design cost in Hyderabad" style)', 'Blog', weekly(WED), 120, 1, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
    rt('LinkedIn post: client win / web tip / process', 'LinkedIn', weekly(MON, THU), 25, 2, { playbookId: 'linkedin-post' }),
    rt('GBP post + reply to reviews', 'GBP', weekly(FRI), 20, 1, { playbookId: 'gbp-post' }),
    rt('Ask delivered clients for a Google review + testimonial', 'GBP', weekly(FRI), 15, 1, { playbookId: 'review-generation' }),
    rt('Google Ads check: search terms, CPC, lead quality', 'Google Ads', weekly(MON), 30, 1, { playbookId: 'google-ads-check' }),
    rt('Core Web Vitals + uptime check on own site', 'Website', monthly(5), 30, 2, { playbookId: 'technical-seo' }),
    rt('Build 2 backlinks (listing on design galleries, guest posts)', 'SEO', weekly(THU), 40, 2, { playbookId: 'backlinks' }),
    rt('Monthly lead report: enquiries by source, close rate', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Website design cost in Hyderabad (2026 price guide)', 'Blog', 'Pricing article'),
    idea('Before/after redesign with speed score improvement', 'Instagram', 'Before/after carousel'),
    idea('7 signs your website is losing you customers', 'Instagram', 'Carousel'),
    idea('WordPress vs custom code vs Shopify — what should you choose?', 'Blog', 'Comparison article'),
    idea('Our website launch checklist (50 points)', 'LinkedIn', 'Document post / lead magnet'),
    idea('Client testimonial video (30 sec)', 'Reels', 'Testimonial reel'),
    idea('Free website audit offer for local businesses', 'GBP', 'Offer post'),
    idea('How we take a site from 40 to 95 PageSpeed', 'YouTube', 'Process video'),
    idea('Industry landing pages: website design for doctors / schools / restaurants', 'Website', 'Programmatic service pages'),
    idea('What to prepare before hiring a web designer', 'Blog', 'Guide'),
    idea('Domain + hosting explained in Hinglish', 'Reels', 'Explainer reel'),
    idea('Maintenance plan explained: why websites break', 'Instagram', 'Carousel'),
    idea('Team / process behind a website project', 'LinkedIn', 'Behind-the-scenes post'),
    idea('Case study: local business that got 30 leads/month from website + SEO', 'Blog', 'Case study'),
    idea('Landing page teardown of a popular brand', 'Instagram', 'Teardown carousel'),
    idea('Year-end website refresh offer', 'Email', 'Offer email')
  ],
  kpis: ['Enquiries', 'Projects closed', 'Organic traffic', 'Google reviews', 'Cost per lead (Ads)', 'Portfolio pieces published']
};
