import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT, SUN } from './helpers';

export const electronics: IndustryPack = {
  id: 'electronics',
  name: 'Computer / electronics store',
  emoji: '🖥️',
  description: 'PC hardware, gaming builds, repairs, networking and AMC contracts.',
  defaultChannels: ['GBP', 'Instagram', 'Reels', 'YouTube', 'WhatsApp', 'Meta Ads'],
  recurring: [
    rt('GBP post: new arrival / build of the week / repair offer', 'GBP', weekly(MON, THU), 20, 1, { playbookId: 'gbp-post', startsChain: 'gbp-post-followup' }),
    rt('Reel: gaming PC build / unboxing / repair time-lapse', 'Reels', weekly(TUE, FRI), 60, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Reply to Google reviews + ask repair customers for reviews', 'GBP', weekly(MON, WED, SAT), 20, 1, { playbookId: 'review-replies' }),
    rt('Upload GBP photos of builds and service desk', 'GBP', weekly(WED), 15, 2, { playbookId: 'gbp-photos' }),
    rt('Instagram carousel: price list / build guide by budget', 'Instagram', weekly(WED), 45, 2, { playbookId: 'ig-carousel' }),
    rt('WhatsApp broadcast to past buyers: upgrades / AMC renewal', 'WhatsApp', weekly(SAT), 20, 2, { playbookId: 'whatsapp-broadcast' }),
    rt('Meta ads check: CTWA (click-to-WhatsApp) campaign', 'Meta Ads', weekly(MON, THU), 20, 1, { playbookId: 'meta-ads-check' }),
    rt('LinkedIn / email outreach for office AMC & networking', 'Email', weekly(TUE), 40, 2, { playbookId: 'email-campaign' }),
    rt('Update product stock + prices on GBP Products', 'GBP', weekly(SUN), 15, 3),
    rt('Monthly report: calls, walk-ins, WhatsApp leads, ad cost per lead', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('₹50k / ₹80k / ₹1.2L gaming PC builds compared', 'Instagram', 'Comparison carousel'),
    idea('Build time-lapse: RGB gaming rig in 60 seconds', 'Reels', 'Time-lapse reel'),
    idea('Laptop slow? 5 fixes before you buy a new one', 'Reels', 'Tips reel'),
    idea('SSD upgrade offer: make your old laptop 3x faster', 'GBP', 'Offer post'),
    idea('Office networking setup we did this week (case study)', 'LinkedIn', 'Case-study post'),
    idea('AMC explained: what a small office saves per year', 'Blog', 'Explainer article'),
    idea('Customer reaction to their new build', 'Reels', 'UGC-style reel'),
    idea('Which GPU should you buy this month? (price-to-performance)', 'YouTube', 'Talking-head video'),
    idea('Back-to-college laptop guide by course', 'Instagram', 'Seasonal carousel'),
    idea('CCTV + networking combo for shops', 'GBP', 'Service post'),
    idea('Repair desk behind the scenes: motherboard repair', 'Reels', 'Process reel'),
    idea('Myth: "Assembled PCs are less reliable than branded"', 'Instagram', 'Myth carousel'),
    idea('Data recovery success story', 'GBP', 'Update post'),
    idea('Gaming accessories under ₹2,000', 'Instagram', 'Product carousel'),
    idea('Exchange offer: old PC for new build', 'WhatsApp', 'Broadcast'),
    idea('How to choose the right UPS for home office', 'Blog', 'Buying guide')
  ],
  kpis: ['GBP calls', 'WhatsApp leads', 'Walk-ins (manual count)', 'Cost per lead (Meta)', 'Google reviews', 'Reel views', 'AMC contracts signed']
};
