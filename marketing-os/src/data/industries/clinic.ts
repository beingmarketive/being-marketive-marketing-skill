import type { IndustryPack } from '../../types';
import { weekly, monthly, rt, idea, MON, TUE, WED, THU, FRI, SAT } from './helpers';

export const clinic: IndustryPack = {
  id: 'clinic',
  name: 'Clinic / healthcare',
  emoji: '🩺',
  description: 'Doctors, dental, physio and diagnostic clinics — trust, reviews and appointments.',
  defaultChannels: ['GBP', 'Website', 'SEO', 'Instagram', 'Reels', 'Google Ads', 'WhatsApp'],
  recurring: [
    rt('GBP post: health tip / service / doctor availability', 'GBP', weekly(MON, THU), 15, 1, { playbookId: 'gbp-post' }),
    rt('Reply to all Google reviews (no patient details!)', 'GBP', weekly(MON, WED, FRI), 15, 1, { playbookId: 'review-replies' }),
    rt('Send review request to today\'s satisfied patients', 'GBP', weekly(TUE, SAT), 10, 1, { playbookId: 'review-generation' }),
    rt('Doctor explainer reel (myth or FAQ, 30-45 sec)', 'Reels', weekly(WED), 45, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
    rt('Condition / treatment blog page with FAQ schema', 'Blog', weekly(TUE), 90, 2, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
    rt('Google Ads check: calls + appointment form leads', 'Google Ads', weekly(MON), 25, 1, { playbookId: 'google-ads-check' }),
    rt('WhatsApp: follow-up / health camp broadcast', 'WhatsApp', weekly(FRI), 20, 2, { playbookId: 'whatsapp-broadcast' }),
    rt('Schema check: MedicalClinic + Physician + FAQ', 'SEO', monthly(12), 30, 2, { playbookId: 'schema' }),
    rt('Monthly report: appointments by source, calls, rating', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
  ],
  ideas: [
    idea('5 signs you should see a dentist now', 'Instagram', 'Carousel'),
    idea('Doctor answers top 3 Google questions about the treatment', 'Reels', 'FAQ reel'),
    idea('Cost of [treatment] in Hyderabad — transparent guide', 'Blog', 'Cost article'),
    idea('Patient journey: from booking to recovery', 'Instagram', 'Process carousel'),
    idea('Free check-up camp announcement', 'GBP', 'Event post'),
    idea('Myth vs fact about [condition]', 'Reels', 'Myth-buster reel'),
    idea('Meet the doctor: qualifications + experience', 'Website', 'Doctor profile page'),
    idea('Clinic tour: equipment and hygiene', 'Reels', 'Walkthrough'),
    idea('World Health Day awareness post', 'Instagram', 'Awareness post'),
    idea('Pre-procedure checklist PDF for patients', 'WhatsApp', 'Document share'),
    idea('Insurance / cashless accepted list', 'GBP', 'Update post'),
    idea('Seasonal: monsoon illness prevention tips', 'Instagram', 'Seasonal carousel'),
    idea('Patient testimonial (with consent)', 'Reels', 'Testimonial'),
    idea('Symptoms checker page for top condition', 'Website', 'Interactive page'),
    idea('Exercise / home-care tips video series', 'YouTube', 'Educational series'),
    idea('Doctor\'s LinkedIn post on new technique', 'LinkedIn', 'Thought leadership')
  ],
  kpis: ['Appointments booked', 'GBP calls', 'Average rating', 'Cost per appointment', 'Organic traffic', 'WhatsApp enquiries']
};
