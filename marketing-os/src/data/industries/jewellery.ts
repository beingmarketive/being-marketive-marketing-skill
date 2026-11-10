import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const jewellery: IndustryPack = {
  id: 'jewellery',
  name: 'Jewellery / fashion',
  emoji: '💍',
  description: 'Jewellery stores and fashion boutiques — collections, occasions and trust.',
  defaultChannels: ['Instagram', 'Reels', 'GBP', 'WhatsApp', 'Meta Ads'],
  recurring: [
    rt('Collection reel (try-on / close-up / styling)', 'Reels', weekly(MON, THU), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Instagram carousel: new designs with weight/price range', 'Instagram', weekly(TUE, SAT), 40, 1, { playbookId: 'ig-carousel' }),
    rt('GBP photos + post: new arrivals', 'GBP', weekly(WED), 20, 1, { playbookId: 'gbp-post' }),
    rt('WhatsApp catalogue broadcast to VIP clients', 'WhatsApp', weekly(FRI), 25, 1, { playbookId: 'whatsapp-broadcast' }),
    rt('Reply to reviews + request reviews from buyers', 'GBP', weekly(MON, SAT), 15, 2, { playbookId: 'review-generation' }),
    rt('Meta ads: catalogue / store visit campaign check', 'Meta Ads', weekly(TUE), 25, 2, { playbookId: 'meta-ads-check' }),
    rt('Occasion calendar: plan wedding/festival content 3 weeks ahead', 'Instagram', weekly(SAT), 30, 2),
    rt('Monthly report: walk-ins, enquiries, top collections', 'Reporting', monthly(1), 40, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Bridal jewellery set try-on', 'Reels', 'Try-on reel'),
    idea('Gold rate today + buying tip', 'Instagram', 'Story / post'),
    idea('Lightweight daily-wear designs under 10 grams', 'Instagram', 'Carousel'),
    idea('Hallmark explained — how to check purity', 'Reels', 'Trust reel'),
    idea('Akshaya Tritiya pre-booking offer', 'WhatsApp', 'Broadcast'),
    idea('Customer wedding look featuring our set', 'Instagram', 'UGC post'),
    idea('Old gold exchange process', 'GBP', 'Service post'),
    idea('Styling: one saree, three jewellery looks', 'Reels', 'Styling reel'),
    idea('Craftsmanship: making of a necklace', 'Reels', 'Process reel'),
    idea('Gift ideas for anniversaries', 'Instagram', 'Gift carousel'),
    idea('Men\'s collection: chains and kadas', 'Instagram', 'Carousel'),
    idea('Diamond 4Cs simplified', 'Blog', 'Guide'),
    idea('Festive collection launch event', 'GBP', 'Event post'),
    idea('Video call shopping available', 'WhatsApp', 'Service broadcast'),
    idea('Kids jewellery — naming ceremony gifts', 'Instagram', 'Product post'),
    idea('Trend report: what brides are choosing this season', 'Instagram', 'Trend carousel')
  ],
  kpis: ['Store walk-ins', 'WhatsApp enquiries', 'Instagram DMs', 'GBP calls', 'Average rating', 'Cost per enquiry']
};
