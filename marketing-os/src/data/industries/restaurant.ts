import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT, SUN } from './helpers';

export const restaurant: IndustryPack = {
  id: 'restaurant',
  name: 'Restaurant / cafe',
  emoji: '🍽️',
  description: 'Footfall, delivery orders and repeat visits through Maps, reels and WhatsApp.',
  defaultChannels: ['GBP', 'Instagram', 'Reels', 'WhatsApp', 'Meta Ads'],
  recurring: [
    rt('Food reel: dish of the day / making-of shot', 'Reels', weekly(MON, WED, FRI), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('GBP post: weekend special / new dish with price', 'GBP', weekly(THU), 15, 1, { playbookId: 'gbp-post' }),
    rt('Upload 5 fresh food + ambience photos to GBP', 'GBP', weekly(TUE), 15, 1, { playbookId: 'gbp-photos' }),
    rt('Reply to Google + Zomato/Swiggy reviews', 'GBP', weekly(MON, WED, SAT), 20, 1, { playbookId: 'review-replies' }),
    rt('Table-card / bill QR review drive check (reviews this week)', 'GBP', weekly(SUN), 10, 2, { playbookId: 'review-generation' }),
    rt('Stories: today\'s menu, crowd, chef moments', 'Instagram', weekly(MON, TUE, WED, THU, FRI, SAT, SUN), 10, 2),
    rt('WhatsApp broadcast: weekend offer to regulars', 'WhatsApp', weekly(FRI), 15, 2, { playbookId: 'whatsapp-broadcast' }),
    rt('Meta ads: 3-5 km radius reach + CTWA for bookings', 'Meta Ads', weekly(MON), 20, 2, { playbookId: 'meta-ads-check' }),
    rt('Monthly report: calls, directions, orders, top dishes', 'Reporting', monthly(1), 40, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Cheese pull / sizzle close-up with trending audio', 'Reels', 'Food ASMR reel'),
    idea('Chef reveals secret of signature biryani', 'Reels', 'Behind-the-scenes'),
    idea('Combo for 2 under ₹499', 'GBP', 'Offer post'),
    idea('Customer first-bite reactions', 'Reels', 'UGC reel'),
    idea('Menu carousel with prices (save-worthy)', 'Instagram', 'Carousel'),
    idea('Birthday party package announcement', 'WhatsApp', 'Broadcast'),
    idea('Food blogger collab invite', 'Instagram', 'Collab post'),
    idea('Rainy-day special: chai + pakoda combo', 'GBP', 'Seasonal post'),
    idea('Kitchen hygiene tour (trust builder)', 'Reels', 'Walkthrough'),
    idea('Weekend live music / event post', 'GBP', 'Event post'),
    idea('"Guess the dish" story poll', 'Instagram', 'Interactive stories'),
    idea('Loyalty card: 10th meal free', 'WhatsApp', 'Offer broadcast'),
    idea('Festival thali launch', 'Instagram', 'Launch carousel'),
    idea('Corporate lunch box subscription', 'LinkedIn', 'B2B post'),
    idea('Staff spotlight: meet our head chef', 'Instagram', 'Story post'),
    idea('Late-night delivery available — announcement', 'GBP', 'Update post')
  ],
  kpis: ['GBP calls', 'Direction requests', 'Average rating', 'Online orders', 'Table bookings', 'Instagram reach']
};
