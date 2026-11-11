import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const localRetail: IndustryPack = {
  id: 'local-retail',
  name: 'Local retail / printing',
  emoji: '🖨️',
  description: 'Neighbourhood shop or print business winning on Google Maps, reviews and WhatsApp.',
  defaultChannels: ['GBP', 'WhatsApp', 'Instagram'],
  recurring: [
    rt('GBP post (offer, product photo or recent job)', 'GBP', weekly(MON, THU), 20, 1, { playbookId: 'gbp-post', startsChain: 'gbp-post-followup' }),
    rt('Upload 5 fresh GBP photos (work samples, shop, team)', 'GBP', weekly(WED), 15, 1, { playbookId: 'gbp-photos' }),
    rt('Reply to all new Google reviews', 'GBP', weekly(MON, WED, FRI), 15, 1, { playbookId: 'review-replies' }),
    rt('Ask 5 happy customers for a Google review (WhatsApp link)', 'GBP', weekly(TUE, SAT), 15, 1, { playbookId: 'review-generation' }),
    rt('Answer / seed GBP Q&A and update products & services', 'GBP', weekly(FRI), 15, 2),
    rt('WhatsApp broadcast: offer or new product', 'WhatsApp', weekly(SAT), 20, 2, { playbookId: 'whatsapp-broadcast' }),
    rt('Instagram post of a finished job (before/after)', 'Instagram', weekly(TUE, FRI), 25, 2),
    rt('Check GBP insights: calls, directions, searches', 'Reporting', monthly(2), 25, 1, { playbookId: 'monthly-report' }),
    rt('Competitor check: top 3 on Maps — reviews, photos, categories', 'GBP', monthly(20), 30, 2, { playbookId: 'competitor-check' })
  ],
  ideas: [
    idea('Visiting card designs we printed this week', 'GBP', 'Photo post'),
    idea('Wedding card printing: 5 trending designs this season', 'Instagram', 'Carousel'),
    idea('Same-day printing offer for students (project reports)', 'GBP', 'Offer post'),
    idea('Behind the machine: how a flex banner is printed', 'Reels', 'Process reel'),
    idea('Customised T-shirt / mug printing for birthdays', 'Instagram', 'Product post'),
    idea('Corporate kit combo: ID card + lanyard + visiting card', 'GBP', 'Product + offer'),
    idea('Festival offer: Diwali gift hamper printing', 'WhatsApp', 'Broadcast'),
    idea('Customer review spotlight with photo of their order', 'Instagram', 'Testimonial post'),
    idea('FAQ: paper types explained (art paper vs matte vs gloss)', 'GBP', 'Q&A + post'),
    idea('How to send a print-ready file (PDF, CMYK, bleed)', 'Instagram', 'Educational carousel'),
    idea('Bulk order discount slab announcement', 'WhatsApp', 'Broadcast'),
    idea('Shop tour + team intro', 'Reels', 'Walkthrough reel'),
    idea('"Order on WhatsApp, pick up in 2 hours" campaign', 'GBP', 'Offer post'),
    idea('Election / event season banner printing', 'GBP', 'Seasonal post'),
    idea('Small business starter pack: logo + card + letterhead', 'Instagram', 'Package post'),
    idea('Directions video: how to reach the shop from main landmark', 'GBP', 'Video upload')
  ],
  kpis: ['GBP calls', 'Direction requests', 'Website clicks (GBP)', 'Google reviews count', 'Average rating', 'WhatsApp enquiries']
};
