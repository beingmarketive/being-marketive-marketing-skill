import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const education: IndustryPack = {
  id: 'education',
  name: 'Education / coaching',
  emoji: '🎓',
  description: 'Coaching institutes, schools and course creators driving demo classes and admissions.',
  defaultChannels: ['Instagram', 'Reels', 'YouTube', 'GBP', 'Meta Ads', 'WhatsApp'],
  recurring: [
    rt('Teaching reel: one concept in 45 seconds', 'Reels', weekly(MON, WED, FRI), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('YouTube lesson / doubt-solving video', 'YouTube', weekly(SAT), 90, 2, { playbookId: 'youtube-seo', startsChain: 'youtube-followup' }),
    rt('Student result / testimonial post', 'Instagram', weekly(TUE), 20, 1),
    rt('GBP post: batch timing / demo class', 'GBP', weekly(THU), 15, 1, { playbookId: 'gbp-post' }),
    rt('Ask parents/students for Google reviews', 'GBP', weekly(SAT), 10, 2, { playbookId: 'review-generation' }),
    rt('WhatsApp broadcast: new batch / free demo', 'WhatsApp', weekly(FRI), 20, 1, { playbookId: 'whatsapp-broadcast' }),
    rt('Meta lead ads check (demo-class form)', 'Meta Ads', weekly(MON, THU), 25, 1, { playbookId: 'meta-ads-check' }),
    rt('Free resource (notes / PDF) as lead magnet', 'Email', monthly(5), 60, 2),
    rt('Monthly admissions report: leads, demos, enrolments', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('3 tricks to solve [topic] questions faster', 'Reels', 'Teaching reel'),
    idea('Topper interview: study routine', 'YouTube', 'Interview'),
    idea('Exam countdown: 30-day plan', 'Instagram', 'Carousel'),
    idea('Free mock test announcement', 'WhatsApp', 'Broadcast'),
    idea('Common mistakes students make in exams', 'Reels', 'Tips reel'),
    idea('Classroom behind the scenes', 'Instagram', 'Stories'),
    idea('Parent FAQ: fees, batch size, timings', 'GBP', 'Q&A'),
    idea('Career options after 12th / graduation', 'Blog', 'Guide'),
    idea('Formula sheet (save-worthy)', 'Instagram', 'Carousel'),
    idea('Results day celebration post', 'Instagram', 'Celebration post'),
    idea('Live doubt session', 'YouTube', 'Live stream'),
    idea('Teacher introduction series', 'Reels', 'Intro reel'),
    idea('Scholarship test launch', 'Meta Ads', 'Lead ad'),
    idea('Study-with-me timer video', 'YouTube', 'Long video'),
    idea('Comparison: online vs offline coaching', 'Blog', 'Comparison article'),
    idea('Weekly quiz with prizes', 'Instagram', 'Interactive post')
  ],
  kpis: ['Leads', 'Demo classes attended', 'Enrolments', 'Cost per lead', 'YouTube subscribers', 'Google reviews']
};
