import type { Playbook } from '../../types';

export const adsReportingPlaybooks: Playbook[] = [
  {
    id: 'meta-ads-check',
    name: 'Meta ads check',
    emoji: '🎯',
    channels: ['Meta Ads'],
    match: ['meta ads', 'fb ads', 'facebook ads', 'ads check', 'ctwa', 'lead ads', 'ad creatives', 'roas', 'ads dashboard'],
    summary: 'A 15-minute routine: is money being spent on the right results, and what should be scaled, fixed or killed?',
    steps: [
      'Ads Manager → last 7 days vs previous 7 days. Columns: spend, results, cost per result, CTR (link), CPM, frequency.',
      'Check tracking first: Pixel + Conversions API events firing (Events Manager), lead forms/WhatsApp conversations counted.',
      'Learning phase: don\'t edit ad sets with < 50 results/week unless clearly broken.',
      'Creative fatigue: frequency > 3 (cold) and CTR falling → add new creatives.',
      'Kill: ads with 2–3× target CPA spend and no result. Scale: winners by +20% budget every 2–3 days.',
      'Lead quality: call 5 recent leads or check CRM — cheap leads that never answer are not wins.',
      'Placements & audiences: Advantage+ audience usually wins; exclude existing customers for acquisition.',
      'Write 1 learning + next creative test in the task notes.'
    ],
    tips: ['Creative is the main targeting lever now — test 3–5 hooks per week.', 'Click-to-WhatsApp ads work great for local Indian businesses.', 'Use lead form "Higher intent" + a qualifying question to cut junk leads.'],
    mistakes: ['Editing budgets daily.', 'Judging after 1 day.', 'Boosting posts instead of running proper campaigns.', 'No CAPI → under-reported conversions.'],
    template: `Last 7 days: Spend ₹___ | Results ___ | CPR ₹___ | CTR __% | Freq __
Tracking OK? Y/N
Kill: [ad]  Scale: [ad set +20%]
New test: [hook/creative]
Lead quality note: [ ]`,
    aiPrompt: `Help me review Meta ads for {project} ({industry}). Task: {task}. Context: {notes}.
Here are my numbers: [paste campaign/ad set/ad metrics].
Diagnose what's working, what to kill, what to scale, likely reasons for CPR changes, and give 5 new creative hooks + 2 ad copy variations to test next week.`
  },
  {
    id: 'google-ads-check',
    name: 'Google Ads check',
    emoji: '💰',
    channels: ['Google Ads'],
    match: ['google ads', 'search terms', 'negatives', 'pmax', 'shopping', 'ppc', 'hotel ads'],
    summary: 'Weekly hygiene: search terms, negatives, conversion tracking and budget pacing. Most wasted spend hides in search terms.',
    steps: [
      'Check conversions are tracking (calls, forms, WhatsApp clicks) — Tools → Conversions → status.',
      'Search terms report (last 7–14 days): add irrelevant terms as negatives (free, jobs, course, DIY, competitor names you don\'t want).',
      'Add converting search terms as exact/phrase keywords.',
      'Check impression share lost to budget vs rank.',
      'Ads: at least 1 RSA per ad group with 10+ headlines, pin only if needed; check ad strength and asset performance.',
      'Assets: sitelinks, callouts, call asset, location asset (linked GBP), images.',
      'Locations: "Presence" (people in) not "Presence or interest" for local businesses.',
      'Note CPA trend and one change made (change history should be readable later).'
    ],
    tips: ['Shared negative keyword list across campaigns saves time.', 'Call-only/call assets + ad schedule during business hours for local services.', 'PMax: add brand exclusions and check search term insights.'],
    mistakes: ['Broad match without smart bidding and negatives.', 'Location option "interest".', 'Counting page views as conversions.', 'Changing bid strategy every week.'],
    template: `Week of [date]
Spend ₹___ | Conv ___ | CPA ₹___ | Conv rate __%
Negatives added: [ ]
New keywords: [ ]
Budget-limited? Y/N
Change made: [ ]`,
    aiPrompt: `Review my Google Ads for {project} ({industry}). Task: {task}. Context: {notes}.
Search terms / metrics: [paste here]
Give: negative keyword suggestions grouped by theme, keywords to add, 15 RSA headlines + 4 descriptions, 6 sitelinks + callouts, and the top 3 optimisations by impact.`
  },
  {
    id: 'monthly-report',
    name: 'Monthly client report',
    emoji: '📊',
    channels: ['Reporting'],
    match: ['report', 'monthly report', 'insights', 'review meeting', 'analytics'],
    summary: 'Clients don\'t want dashboards — they want: what happened, why, and what we do next. One page.',
    steps: [
      'Pull numbers for this month vs last month (and same month last year if available): GA4, GSC, GBP insights, Meta/Google Ads, Instagram insights.',
      'Pick the 3–5 KPIs that map to business goals (leads, calls, sales) — log them in the project KPI log.',
      'Write the summary first: 3 wins, 1–2 issues, 3 next actions.',
      'Explain "why" for every big change (campaign, season, algorithm, tracking).',
      'Add 2–3 screenshots max: best post, top keyword gains, lead trend.',
      'Share as PDF/Google Doc + a 3-minute Loom walkthrough.',
      'Book the next month plan (the chain creates the planning task).'
    ],
    tips: ['Lead with business outcomes, not vanity metrics.', 'Same template every month — easy to compare.', 'Flag risks early (budget, slow approvals).'],
    mistakes: ['20-page data dump.', 'No recommendations.', 'Hiding bad months.', 'Reporting metrics the client doesn\'t understand.'],
    template: `[Project] — Monthly Report — [Month Year]

Summary
✅ Wins: 1) 2) 3)
⚠️ Issues: 1)
➡️ Next month: 1) 2) 3)

KPIs (this month | last month | change)
Leads/Calls: __ | __ | __%
Website visits: __ | __ | __%
GBP calls/directions: __ | __
Ad spend / CPL: ₹__ / ₹__

Top content: [ ]
What we learned: [ ]`,
    aiPrompt: `Write the monthly marketing report summary for {project} ({industry}). Task: {task}. Context: {notes}.
Numbers this month vs last: [paste KPIs here]
Give: an executive summary (wins, issues, next actions), explanation of key changes, a short client-friendly email to send with the report, and next month's top 3 priorities.`
  }
];
