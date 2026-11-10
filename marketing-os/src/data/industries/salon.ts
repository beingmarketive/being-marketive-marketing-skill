import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT, SUN } from './helpers';

export const salon: IndustryPack = {
  id: 'salon',
  name: 'Salon / beauty',
  emoji: '💇',
  description: 'Salons, spas and makeup artists filling appointment slots.',
  defaultChannels: ['Instagram', 'Reels', 'GBP', 'WhatsApp', 'Meta Ads'],
  recurring: [
    rt('Transformation reel (before → after)', 'Reels', weekly(MON, WED, FRI), 40, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('GBP photos: today\'s looks + salon interiors', 'GBP', weekly(TUE), 15, 1, { playbookId: 'gbp-photos' }),
    rt('GBP post: service offer / weekday discount', 'GBP', weekly(THU), 15, 1, { playbookId: 'gbp-post' }),
    rt('Reply to reviews + ask today\'s clients for reviews', 'GBP', weekly(MON, THU, SAT), 15, 1, { playbookId: 'review-generation' }),
    rt('Stories: chair-side moments, slot availability', 'Instagram', weekly(MON, TUE, WED, THU, FRI, SAT, SUN), 10, 2),
    rt('WhatsApp broadcast: empty-slot offer for weekdays', 'WhatsApp', weekly(TUE), 15, 2, { playbookId: 'whatsapp-broadcast' }),
    rt('Meta ads: bridal / package campaign check', 'Meta Ads', weekly(MON), 20, 2, { playbookId: 'meta-ads-check' }),
    rt('Repeat-visit reminder to clients due for service', 'WhatsApp', weekly(SUN), 20, 2),
    rt('Monthly report: bookings, repeat %, top services', 'Reporting', monthly(1), 40, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Hair colour transformation with trending audio', 'Reels', 'Transformation reel'),
    idea('Bridal makeup timeline: 6 months before wedding', 'Instagram', 'Carousel'),
    idea('Which haircut suits your face shape?', 'Instagram', 'Carousel'),
    idea('Weekday happy hours: 20% off before 2 pm', 'GBP', 'Offer post'),
    idea('Hair spa vs keratin — what do you need?', 'Reels', 'Explainer reel'),
    idea('Client reaction to final look', 'Reels', 'Reaction reel'),
    idea('Hygiene and tool sterilisation process', 'Instagram', 'Trust post'),
    idea('Festive glam package', 'WhatsApp', 'Broadcast'),
    idea('Stylist introduction series', 'Instagram', 'Profile posts'),
    idea('Monsoon hair care tips', 'Instagram', 'Seasonal carousel'),
    idea('Groom grooming package', 'GBP', 'Service post'),
    idea('Refer a friend, both get 15% off', 'WhatsApp', 'Referral broadcast'),
    idea('Product we use and why', 'Reels', 'Product reel'),
    idea('Nail art trends this month', 'Instagram', 'Carousel'),
    idea('Gift card for birthdays/anniversaries', 'GBP', 'Product post'),
    idea('Behind the chair: day in a stylist\'s life', 'Reels', 'Vlog reel')
  ],
  kpis: ['Appointments', 'Repeat client %', 'GBP calls', 'Average rating', 'Instagram DMs', 'Cost per booking']
};
