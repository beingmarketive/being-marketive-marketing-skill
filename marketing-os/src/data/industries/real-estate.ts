import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const realEstate: IndustryPack = {
  id: 'real-estate',
  name: 'Real estate',
  emoji: '🏢',
  description: 'Builders, brokers and projects generating site visits from ads and content.',
  defaultChannels: ['Meta Ads', 'Google Ads', 'Instagram', 'Reels', 'YouTube', 'WhatsApp', 'Website'],
  recurring: [
    rt('Meta lead ads check: CPL, lead quality, creative fatigue', 'Meta Ads', weekly(MON, THU), 30, 1, { playbookId: 'meta-ads-check' }),
    rt('Google Ads check: project-name + location keywords', 'Google Ads', weekly(TUE), 30, 1, { playbookId: 'google-ads-check' }),
    rt('Property walkthrough reel', 'Reels', weekly(WED, SAT), 60, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Construction progress update post', 'Instagram', weekly(FRI), 20, 2),
    rt('WhatsApp follow-up broadcast to warm leads (new offer / site visit slots)', 'WhatsApp', weekly(SAT), 25, 1, { playbookId: 'whatsapp-broadcast' }),
    rt('Locality guide blog / video (schools, IT parks, metro)', 'Blog', weekly(TUE), 90, 2, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
    rt('GBP post + reviews from buyers', 'GBP', weekly(MON), 15, 2, { playbookId: 'gbp-post' }),
    rt('Landing page CRO: form, WhatsApp button, speed', 'Website', monthly(8), 40, 2, { playbookId: 'landing-cro' }),
    rt('Monthly report: leads, site visits, bookings, CPL by source', 'Reporting', monthly(1), 60, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('2BHK vs 3BHK: which suits your family budget?', 'Instagram', 'Comparison carousel'),
    idea('Sunrise drone shot of the project', 'Reels', 'Drone reel'),
    idea('Locality guide: living near [IT corridor]', 'YouTube', 'Area tour video'),
    idea('Home loan EMI calculator explained', 'Blog', 'Calculator article'),
    idea('Site visit weekend with cab pickup', 'WhatsApp', 'Offer broadcast'),
    idea('Happy family key-handover moment', 'Reels', 'Testimonial reel'),
    idea('RERA approval explained — why it matters', 'Instagram', 'Trust carousel'),
    idea('Amenities walkthrough: clubhouse, pool, gym', 'Reels', 'Walkthrough'),
    idea('Price trend in the area over 5 years', 'LinkedIn', 'Data post'),
    idea('NRI investment guide', 'Blog', 'Guide'),
    idea('Festive booking offer (Akshaya Tritiya / Dussehra)', 'Meta Ads', 'Offer creative'),
    idea('Floor plan explainer with furniture layout', 'Instagram', 'Carousel'),
    idea('Builder track record: delivered projects', 'Website', 'Trust page'),
    idea('Common mistakes first-time home buyers make', 'Reels', 'Tips reel'),
    idea('Vastu-friendly home features', 'Instagram', 'Carousel'),
    idea('Construction quality: materials we use', 'YouTube', 'Explainer')
  ],
  kpis: ['Leads', 'Cost per lead', 'Site visits', 'Bookings', 'Lead-to-visit %', 'WhatsApp responses']
};
