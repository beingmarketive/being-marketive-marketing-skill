import type { IndustryPack } from '../../types';
import { daily, weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT, SUN } from './helpers';

export const creator: IndustryPack = {
  id: 'creator',
  name: 'Instagram creator page',
  emoji: '📱',
  description: 'Carousel / reel-first page growing followers, saves and shares.',
  defaultChannels: ['Instagram', 'Reels'],
  recurring: [
    rt('Design + post today\'s carousel', 'Instagram', weekly(MON, TUE, WED, THU, FRI), 60, 1, {
      playbookId: 'ig-carousel',
      startsChain: 'carousel-followup',
      subtasks: ['Hook slide (max 8 words)', '6-8 value slides, one idea each', 'CTA slide: save + share + follow', 'Caption with keyword in first line', 'Alt text + 3-5 niche hashtags']
    }),
    rt('Reply to every comment and DM (30 min engagement block)', 'Instagram', daily, 30, 1),
    rt('Engage on 15 posts from niche accounts before posting', 'Instagram', daily, 15, 2),
    rt('Save 5 trending hooks/formats to swipe file', 'Instagram', weekly(SUN, WED), 15, 3),
    rt('Post 3 stories (poll, behind-the-scenes, carousel teaser)', 'Instagram', daily, 10, 2),
    rt('Write next week\'s carousel topics + hooks (batch)', 'Instagram', weekly(SAT), 45, 1, { playbookId: 'ig-carousel' }),
    rt('Trial reel / collab post experiment', 'Reels', weekly(THU), 40, 2, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Weekly insights: top 3 posts by saves + shares, note why', 'Reporting', weekly(SUN), 20, 2),
    rt('Monthly growth review + content pillar check', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('10 AI tools a small business can start using today (free)', 'Instagram', 'List carousel'),
    idea('ChatGPT prompt to write a month of social posts in 10 minutes', 'Instagram', 'Prompt carousel'),
    idea('Before AI vs after AI: a shop owner\'s marketing day', 'Instagram', 'Comparison carousel'),
    idea('How a kirana store can use WhatsApp + AI for repeat orders', 'Instagram', 'Story-style carousel'),
    idea('5 automation ideas that save 5 hours a week', 'Instagram', 'Carousel'),
    idea('"Steal this prompt" series — one prompt per post', 'Instagram', 'Carousel series'),
    idea('Canva + AI workflow to make 30 posts in one afternoon', 'Reels', 'Screen-record reel'),
    idea('AI mistakes small businesses make (and fixes)', 'Instagram', 'Myth/mistake carousel'),
    idea('Tool face-off: ChatGPT vs Claude vs Gemini for captions', 'Instagram', 'Comparison carousel'),
    idea('How to reply to Google reviews using AI (with template)', 'Instagram', 'Template carousel'),
    idea('AI for local SEO: 4 tasks to automate', 'Instagram', 'Checklist carousel'),
    idea('Weekly "AI news for business owners" in 6 slides', 'Instagram', 'News roundup carousel'),
    idea('Case study: bakery that got 2x orders with AI-written WhatsApp offers', 'Instagram', 'Case-study carousel'),
    idea('Save-worthy cheat sheet: best AI tool for each marketing task', 'Instagram', 'Cheat-sheet carousel'),
    idea('Common questions from followers — answered', 'Instagram', 'FAQ carousel'),
    idea('Collab carousel with a small-business creator', 'Instagram', 'Collab post'),
    idea('"I tried X AI tool for 7 days" honest review', 'Reels', 'Review reel')
  ],
  kpis: ['Followers', 'Saves per post', 'Shares per post', 'Reach (7-day)', 'Profile visits', 'Link clicks']
};
