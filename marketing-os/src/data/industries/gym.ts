import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT, SUN } from './helpers';

export const gym: IndustryPack = {
  id: 'gym',
  name: 'Gym / fitness',
  emoji: '🏋️',
  description: 'Gyms, studios and trainers driving trials, memberships and renewals.',
  defaultChannels: ['Instagram', 'Reels', 'GBP', 'WhatsApp', 'Meta Ads'],
  recurring: [
    rt('Workout / form-tip reel by trainer', 'Reels', weekly(MON, WED, FRI), 40, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Member transformation story post (with consent)', 'Instagram', weekly(TUE), 25, 1),
    rt('GBP post: free trial / batch timings / challenge', 'GBP', weekly(THU), 15, 1, { playbookId: 'gbp-post' }),
    rt('Reply to reviews + request reviews from regulars', 'GBP', weekly(MON, SAT), 15, 1, { playbookId: 'review-generation' }),
    rt('Meta ads: free 3-day trial campaign check', 'Meta Ads', weekly(MON, THU), 20, 1, { playbookId: 'meta-ads-check' }),
    rt('WhatsApp: renewal reminders to expiring members', 'WhatsApp', weekly(SAT), 20, 1, { playbookId: 'whatsapp-broadcast' }),
    rt('Stories: class schedule + member shout-outs', 'Instagram', weekly(MON, TUE, WED, THU, FRI, SAT, SUN), 10, 2),
    rt('Monthly fitness challenge launch', 'Instagram', monthly(1), 40, 2),
    rt('Monthly report: trials, conversions, renewals, churn', 'Reporting', monthly(2), 40, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('3 exercises to fix back pain from desk jobs', 'Reels', 'Tips reel'),
    idea('Member 90-day transformation', 'Instagram', 'Before/after carousel'),
    idea('Diet myths: Indian food edition', 'Instagram', 'Myth carousel'),
    idea('Free trial week announcement', 'GBP', 'Offer post'),
    idea('Trainer introduction series', 'Reels', 'Intro reels'),
    idea('30-day plank challenge', 'Instagram', 'Challenge post'),
    idea('Gym tour: equipment walkthrough', 'Reels', 'Walkthrough'),
    idea('Protein sources for vegetarians', 'Instagram', 'Carousel'),
    idea('Couple membership offer', 'WhatsApp', 'Broadcast'),
    idea('Beginner first-week plan', 'YouTube', 'Guide video'),
    idea('Common gym mistakes', 'Reels', 'Mistakes reel'),
    idea('Corporate wellness tie-up', 'LinkedIn', 'B2B post'),
    idea('New Year resolution packages', 'Meta Ads', 'Offer ad'),
    idea('Member spotlight of the month', 'Instagram', 'Spotlight post'),
    idea('Morning vs evening workouts', 'Reels', 'Explainer'),
    idea('Refer-a-buddy free month', 'WhatsApp', 'Referral broadcast')
  ],
  kpis: ['Trial signups', 'Trial-to-member %', 'New memberships', 'Renewals', 'Cost per trial', 'Google reviews']
};
