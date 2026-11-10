import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const hotel: IndustryPack = {
  id: 'hotel',
  name: 'Hotel / travel',
  emoji: '🏨',
  description: 'Hotels, resorts, homestays and tour operators driving direct bookings.',
  defaultChannels: ['GBP', 'Instagram', 'Reels', 'Website', 'Google Ads', 'Email', 'WhatsApp'],
  recurring: [
    rt('Experience reel: room tour / view / food / activity', 'Reels', weekly(MON, THU), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Reply to Google, TripAdvisor and OTA reviews', 'GBP', weekly(MON, WED, FRI), 25, 1, { playbookId: 'review-replies' }),
    rt('GBP post: package / weekend offer / event', 'GBP', weekly(TUE), 15, 1, { playbookId: 'gbp-post' }),
    rt('Upload fresh GBP photos (rooms, dining, guests\' moments)', 'GBP', weekly(SAT), 15, 2, { playbookId: 'gbp-photos' }),
    rt('Google Hotel Ads / search campaign check', 'Google Ads', weekly(MON), 25, 1, { playbookId: 'google-ads-check' }),
    rt('Destination blog: things to do near the property', 'Blog', weekly(WED), 90, 2, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
    rt('Email past guests: seasonal package / direct-booking perk', 'Email', monthly(5), 45, 2, { playbookId: 'email-campaign' }),
    rt('Check booking engine speed + direct-booking CTA', 'Website', monthly(15), 30, 2, { playbookId: 'landing-cro' }),
    rt('Monthly report: direct vs OTA bookings, ADR, reviews', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('Sunrise from the balcony — 10-second reel', 'Reels', 'Aesthetic reel'),
    idea('Weekend getaway itinerary from Hyderabad', 'Blog', 'Itinerary article'),
    idea('Room-type comparison: deluxe vs suite', 'Instagram', 'Carousel'),
    idea('Book direct and get free breakfast', 'GBP', 'Offer post'),
    idea('Guest testimonial from a family stay', 'Reels', 'Testimonial'),
    idea('Local food guide near the property', 'Instagram', 'Carousel'),
    idea('Staycation package for couples', 'WhatsApp', 'Broadcast'),
    idea('Destination wedding venue tour', 'YouTube', 'Venue walkthrough'),
    idea('Monsoon / winter season offer', 'Email', 'Seasonal email'),
    idea('Behind the scenes: housekeeping standards', 'Reels', 'Trust reel'),
    idea('Workcation package with Wi-Fi speed test', 'Instagram', 'Offer post'),
    idea('Kids activities at the resort', 'Instagram', 'Family carousel'),
    idea('Influencer stay collab', 'Instagram', 'Collab post'),
    idea('FAQ: check-in, pets, parking', 'Website', 'FAQ page with schema'),
    idea('Festive dinner event', 'GBP', 'Event post'),
    idea('Corporate offsite package', 'LinkedIn', 'B2B post')
  ],
  kpis: ['Direct bookings', 'Occupancy %', 'ADR', 'Average rating', 'OTA commission saved', 'Website conversion rate']
};
