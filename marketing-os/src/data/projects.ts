import type { BrandBrief, Channel, Idea, RecurringTemplate } from '../types';
import { daily, weekly, monthly, rt, idea, SUN, MON, TUE, WED, THU, FRI, SAT } from './industries/helpers';

/**
 * Your own brands. Everything here is specific to each brand —
 * edit the brief, recurring tasks and ideas as the brand evolves.
 * (Projects you add later in the app get their ideas from their own brand brief.)
 */
export interface SeedProject {
  id: string;
  name: string;
  industryId: string;
  color: string;
  emoji: string;
  channels: Channel[];
  notes: string;
  kpis: string[];
  aliases: string[];
  website?: string;
  brief: BrandBrief;
  recurring: RecurringTemplate[];
  ideas: Idea[];
}

export const SEED_PROJECTS: SeedProject[] = [
  /* ------------------------------------------------------------------ */
  {
    id: 'being-marketive',
    name: 'Being Marketive',
    industryId: 'agency',
    color: '#7c5cff',
    emoji: '🚀',
    channels: ['Blog', 'SEO', 'Instagram', 'LinkedIn', 'Email', 'YouTube'],
    notes: 'My own brand. One industry playbook blog every day → index → repurpose. Goal: topical authority on "digital marketing for [industry]" and inbound client enquiries.',
    kpis: ['Organic clicks (GSC)', 'Indexed playbook pages', 'Playbooks published', 'Newsletter subscribers', 'Inbound enquiries'],
    aliases: ['being marketive', 'beingmarketive', 'bm'],
    brief: {
      about: 'Digital marketing brand and blog by Shaik Shareef that publishes a practical marketing playbook for a different industry every day.',
      audience: 'Small business owners, founders and junior marketers in India who want step-by-step marketing plans for their industry.',
      offerings: 'Free industry marketing playbooks, SEO / GBP / social media guides, templates, and done-for-you marketing services.',
      location: 'Hyderabad, India (audience across India)',
      usp: 'Industry-specific, step-by-step playbooks written from 5 years of hands-on client work — not generic tips.',
      tone: 'Practical, friendly, expert; clear simple English with real examples.'
    },
    recurring: [
      rt("Write today's industry playbook: \"Digital marketing playbook for [industry]\"", 'Blog', daily, 90, 1, {
        playbookId: 'blog-seo',
        startsChain: 'blog-pipeline',
        subtasks: ['Pick the industry (next on the playbook list)', 'Primary keyword: "digital marketing for [industry]"', 'Sections: goals, channels, 30-day plan, content ideas, KPIs, mistakes', 'Add FAQ (4–5 questions) + Article/FAQ schema', 'Link to the Industry Playbooks hub page']
      }),
      rt('Search Console: check indexing of new playbook pages', 'SEO', weekly(MON, THU), 20, 1, { playbookId: 'indexing' }),
      rt("LinkedIn post: key lesson from yesterday's playbook", 'LinkedIn', weekly(TUE, THU), 25, 2, { playbookId: 'linkedin-post' }),
      rt('Instagram carousel: "5 marketing moves for [industry]" from this week\'s playbooks', 'Instagram', weekly(WED, SAT), 45, 2, { playbookId: 'ig-carousel', startsChain: 'carousel-followup' }),
      rt('Update the Industry Playbooks hub page + internal links to new playbooks', 'SEO', weekly(FRI), 25, 2, { playbookId: 'blog-seo' }),
      rt('Build 2 backlinks to the playbook hub (guest post / directory / quote)', 'SEO', weekly(WED), 45, 2, { playbookId: 'backlinks' }),
      rt('Refresh one older playbook that lost clicks in GSC', 'SEO', weekly(SAT), 40, 2, { playbookId: 'blog-seo' }),
      rt('Newsletter: "This week\'s 7 industry playbooks"', 'Email', weekly(SUN), 35, 2, { playbookId: 'email-campaign', startsChain: 'email-followup' }),
      rt('Monthly report: organic clicks, indexed playbooks, enquiries', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
    ],
    ideas: [
      idea('Digital marketing playbook for dental clinics in India', 'Blog', 'Industry playbook'),
      idea('Digital marketing playbook for printing shops — with Trendy Prints as a GBP case study', 'Blog', 'Playbook + case study'),
      idea('Digital marketing playbook for computer & gaming stores — lessons from R N World', 'Blog', 'Playbook + case study'),
      idea('How to market a field force SaaS to pharma companies — lessons from Cloudforz', 'Blog', 'Playbook + case study'),
      idea('How I grew a carousel-only Instagram page (Marketomate) — what worked', 'Blog', 'Case study'),
      idea('Hub page: "Marketing Playbooks for 100 Industries" with filters by category', 'Website', 'Pillar / hub page'),
      idea('Free quiz: "Which marketing channel should my business start with?"', 'Website', 'Interactive lead magnet'),
      idea('Download: 30-day content calendar template for Indian small businesses', 'Email', 'Lead magnet + nurture'),
      idea('My 90-minute routine for writing one industry playbook every day', 'Reels', 'Talking-head reel'),
      idea('"Industry playbook in 8 slides" carousel series (one industry per post)', 'Instagram', 'Carousel series'),
      idea('Restaurant marketing playbook as a LinkedIn PDF document post', 'LinkedIn', 'Document post'),
      idea('AEO playbook: how a local business gets mentioned in ChatGPT answers', 'Blog', 'How-to guide'),
      idea('Hyderabad local SEO guide by area: Kukatpally, Ameerpet, Madhapur, Dilsukhnagar', 'Blog', 'Local guide'),
      idea('Live walkthrough: building a 30-day plan for a real business from a playbook', 'YouTube', 'Screen-share video'),
      idea('Newsletter special: this month\'s Google update and what local businesses should do', 'Email', 'Newsletter issue'),
      idea('Glossary hub: 50 marketing terms explained in simple English', 'Blog', 'Glossary / pillar'),
      idea('Interview a business owner from each industry for its playbook (quotes + photo)', 'Blog', 'Expert quotes'),
      idea('Programmatic pages: "Digital marketing for [industry] in Hyderabad"', 'Website', 'Programmatic SEO'),
      idea('"DIY with a playbook vs hiring an agency — when each makes sense"', 'LinkedIn', 'Opinion post'),
      idea('Pitch guest posts to Indian SME blogs using one playbook as a sample', 'SEO', 'Outreach')
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: 'marketomate',
    name: 'Marketomate',
    industryId: 'creator',
    color: '#ec4899',
    emoji: '🤖',
    channels: ['Instagram'],
    notes: '@marketomate.ai — carousel-only page: AI + marketing for small businesses. Same design system every post, hook on slide 1, save/share CTA on the last slide.',
    kpis: ['Followers', 'Saves per post', 'Shares per post', 'Reach (7-day)', 'Profile visits'],
    aliases: ['marketomate', 'marketo', 'mm', 'marketomate.ai'],
    brief: {
      about: 'Instagram page @marketomate.ai that posts only carousels on using AI tools for marketing in small businesses.',
      audience: 'Small business owners, shop owners, freelancers and early-stage founders in India who want to save time with AI.',
      offerings: 'Free educational carousels: AI tools, prompts, automations and step-by-step workflows for marketing.',
      location: 'India (online)',
      usp: 'Practical, save-worthy AI workflows a non-technical business owner can use the same day.',
      tone: 'Simple, punchy, helpful; short slides with one idea each.'
    },
    recurring: [
      rt("Design + post today's AI carousel", 'Instagram', weekly(MON, TUE, WED, THU, FRI), 60, 1, {
        playbookId: 'ig-carousel',
        startsChain: 'carousel-followup',
        subtasks: ['Hook slide (max 8 words)', '6–8 slides, one AI step/tool per slide', 'Screenshot or prompt on at least 2 slides', 'Last slide: save + share + follow @marketomate.ai', 'Caption with keyword in first line + alt text']
      }),
      rt('Reply to every comment and DM (30-min engagement block)', 'Instagram', daily, 30, 1),
      rt('Research 3 new AI tools/updates useful for small businesses', 'Instagram', weekly(MON, THU), 25, 2),
      rt('Story: carousel teaser + poll ("Which AI tool should I explain next?")', 'Instagram', daily, 10, 2),
      rt("Batch-write next week's 5 carousel hooks + outlines", 'Instagram', weekly(SAT), 45, 1, { playbookId: 'ig-carousel' }),
      rt('Pitch 1 collab carousel to a small-business creator', 'Instagram', weekly(WED), 20, 2),
      rt('Weekly insights: top carousel by saves + shares — note why it worked', 'Reporting', weekly(SUN), 20, 2),
      rt('Monthly growth review: followers, saves/post, best topics', 'Reporting', monthly(1), 40, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
    ],
    ideas: [
      idea('ChatGPT prompt to write a week of WhatsApp offers for a kirana store', 'Instagram', 'Prompt carousel'),
      idea('5 free AI tools to make product photos look professional', 'Instagram', 'Tool list carousel'),
      idea('Canva Magic Studio: create 10 posts in 20 minutes (step by step)', 'Instagram', 'Workflow carousel'),
      idea('Reply to every Google review in 5 minutes with AI (copy this prompt)', 'Instagram', 'Prompt + template carousel'),
      idea('ChatGPT vs Claude vs Gemini for writing captions — same prompt, 3 results', 'Instagram', 'Comparison carousel'),
      idea('How a salon can turn 1 photo into a week of posts using AI', 'Instagram', 'Before/after carousel'),
      idea('AI for printing shops: create design mockups for customers in minutes', 'Instagram', 'Use-case carousel'),
      idea('3 AI automations that save a restaurant owner 5 hours a week', 'Instagram', 'List carousel'),
      idea('10 prompts every small business owner should save', 'Instagram', 'Prompt pack carousel'),
      idea('Make reels without showing your face — 4 AI video tools', 'Instagram', 'Tool list carousel'),
      idea('How to show up in ChatGPT answers: AEO basics for local businesses', 'Instagram', 'Explainer carousel'),
      idea('Myth vs fact: "AI will replace my marketing person"', 'Instagram', 'Myth-buster carousel'),
      idea('AI tool of the week: what it does, price, best use case', 'Instagram', 'Weekly series'),
      idea('Build a FAQ chatbot for your website with no code (5 steps)', 'Instagram', 'Tutorial carousel'),
      idea('Turn customer voice notes into Instagram captions with AI', 'Instagram', 'Workflow carousel'),
      idea('5 mistakes small businesses make with AI-written content', 'Instagram', 'Mistakes carousel'),
      idea('This week in AI for business owners (6 slides)', 'Instagram', 'News roundup carousel'),
      idea('Cheat sheet: the best AI tool for each marketing task', 'Instagram', 'Save-worthy cheat sheet'),
      idea('Write a month of Google Business Profile posts with one prompt', 'Instagram', 'Prompt carousel'),
      idea('AI-powered WhatsApp follow-ups for clinics and coaching centres', 'Instagram', 'Use-case carousel')
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: 'cloudforz',
    name: 'Cloudforz',
    industryId: 'saas',
    color: '#22d3ee',
    emoji: '☁️',
    channels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Instagram', 'Google Ads', 'Email'],
    notes: 'cloudforz.com — field force management SaaS. Social content focused on pharma field teams (MRs, area managers, DCR, beat plans). Only mention product features that are confirmed by the team.',
    kpis: ['Demo requests', 'Organic traffic', 'MQLs', 'Cost per demo', 'LinkedIn followers'],
    aliases: ['cloudforz', 'cloud forz', 'cf', 'cloudfors'],
    website: 'https://cloudforz.com',
    brief: {
      about: 'Cloudforz is a field force management SaaS that helps companies track and manage their field sales teams.',
      audience: 'Pharma companies and distributors — sales heads, area managers and owners managing medical representatives (MRs).',
      offerings: 'Field force management app: attendance, visit tracking, daily call reporting, beat planning, expenses and reports (confirm exact features with the team).',
      location: 'India',
      usp: 'Built around how Indian pharma field teams actually work — simple for MRs, full visibility for managers.',
      tone: 'Professional, clear, problem-focused; speaks the language of pharma sales (DCR, beat plan, doctor coverage).'
    },
    recurring: [
      rt('LinkedIn post: pharma field force pain point (DCR, beat plans, doctor coverage)', 'LinkedIn', weekly(MON, WED, FRI), 30, 1, { playbookId: 'linkedin-post' }),
      rt('Instagram carousel for pharma sales managers', 'Instagram', weekly(TUE, THU), 40, 2, { playbookId: 'ig-carousel' }),
      rt('Bottom-funnel blog: "field force app for pharma" topic', 'Blog', weekly(TUE), 120, 1, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
      rt('Google Ads: search terms for "field force management software" + add negatives', 'Google Ads', weekly(MON), 30, 1, { playbookId: 'google-ads-check' }),
      rt('Check demo page conversion rate + form drop-off', 'Website', weekly(THU), 25, 1, { playbookId: 'landing-cro' }),
      rt('Nurture email to demo / trial leads', 'Email', weekly(WED), 40, 2, { playbookId: 'email-campaign', startsChain: 'email-followup' }),
      rt('Competitor check: other field force apps — pricing, features, ads', 'SEO', monthly(15), 45, 2, { playbookId: 'competitor-check' }),
      rt('Technical SEO + Core Web Vitals check on cloudforz.com', 'Website', monthly(10), 40, 2, { playbookId: 'technical-seo' }),
      rt('Monthly pipeline report: demos, MQLs, cost per demo by channel', 'Reporting', monthly(1), 60, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
    ],
    ideas: [
      idea('How MRs lose 2 hours a day to manual reporting — and how a field force app fixes it', 'LinkedIn', 'Pain-point post'),
      idea('Field force management software for pharma companies (pillar page)', 'Blog', 'Pillar landing page'),
      idea('Buyer\'s checklist: 12 questions to ask before choosing a field force app for pharma', 'Blog', 'Buyer\'s guide'),
      idea('Excel + WhatsApp vs a field force app: the real cost of tracking 50 MRs', 'Blog', 'Comparison article'),
      idea('Beat plan compliance: what area managers should review every week', 'Instagram', 'Checklist carousel'),
      idea('Doctor coverage report explained in one slide deck', 'LinkedIn', 'Document post'),
      idea('Fake visits and inflated expense claims — how GPS tracking reduces them', 'LinkedIn', 'Problem/solution post'),
      idea('Day in the life of an MR: before vs after a field force app', 'Instagram', 'Story carousel'),
      idea('ROI calculator: field force app for 25 / 50 / 100 reps', 'Website', 'Interactive calculator'),
      idea('Glossary pages: DCR, beat plan, POB, secondary sales, doctor coverage', 'Blog', 'Glossary / programmatic SEO'),
      idea('Onboarding a field team to a new app in one day — checklist', 'Blog', 'How-to guide'),
      idea('Why offline mode matters for reps in tier-2 and tier-3 towns', 'LinkedIn', 'Insight post'),
      idea('LinkedIn poll: biggest challenge managing pharma field teams?', 'LinkedIn', 'Poll'),
      idea('Webinar: data-driven field force management for pharma sales heads', 'Email', 'Webinar invite sequence'),
      idea('Vertical landing pages: field force app for FMCG / medical devices / distributors', 'Website', 'Landing pages'),
      idea('Alternatives page: comparing popular field force management apps', 'Blog', 'Alternatives article'),
      idea('Customer story: how a pharma team improved visit compliance (with permission)', 'LinkedIn', 'Case study'),
      idea('Founder story: why Cloudforz was built for Indian field teams', 'LinkedIn', 'Founder post'),
      idea('Monthly review template for pharma sales managers (free download)', 'Email', 'Lead magnet'),
      idea('5 reports every pharma sales head should see every Monday', 'Instagram', 'List carousel')
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: 'trendy-prints',
    name: 'Trendy Prints',
    industryId: 'local-retail',
    color: '#f59e0b',
    emoji: '🖨️',
    channels: ['GBP'],
    notes: 'Printing business. I manage the Google Business Profile only: posts, photos, reviews, Q&A, products & services. Update the services list in the brief to match what the shop actually offers.',
    kpis: ['GBP calls', 'Direction requests', 'Website clicks (GBP)', 'Google reviews count', 'Average rating'],
    aliases: ['trendy prints', 'trendy', 'tp', 'trendyprints'],
    brief: {
      about: 'Trendy Prints is a local printing shop for personal and business printing.',
      audience: 'Local residents, students, small businesses, offices and event organisers nearby.',
      offerings: 'Visiting cards, flex banners, wedding & invitation cards, pamphlets, ID cards, T-shirt and mug printing, stickers, letterheads (edit to match actual services).',
      location: 'Hyderabad (update with exact area / landmark)',
      usp: 'Quick turnaround, good print quality and friendly help with designs.',
      tone: 'Friendly local shop; short, clear, offer-focused.'
    },
    recurring: [
      rt("GBP post: this week's finished print job (photo + service + area)", 'GBP', weekly(MON, THU), 20, 1, { playbookId: 'gbp-post', startsChain: 'gbp-post-followup' }),
      rt('Upload 5 fresh photos to GBP (recent jobs, counter, machines, team)', 'GBP', weekly(WED), 15, 1, { playbookId: 'gbp-photos' }),
      rt('Reply to all new Trendy Prints Google reviews', 'GBP', weekly(MON, WED, FRI), 15, 1, { playbookId: 'review-replies' }),
      rt('Send review link to 5 happy Trendy Prints customers', 'GBP', weekly(TUE, SAT), 15, 1, { playbookId: 'review-generation' }),
      rt('Update GBP Products & Services (prices, new items, photos)', 'GBP', weekly(FRI), 15, 2),
      rt('Check GBP Q&A + add 1 FAQ answer', 'GBP', monthly(12), 15, 3),
      rt('GBP insights: calls, directions, searches — log in KPI', 'Reporting', monthly(2), 25, 1, { playbookId: 'monthly-report' }),
      rt('Competitor check: top 3 printing shops on Maps nearby', 'GBP', monthly(20), 30, 2, { playbookId: 'competitor-check' })
    ],
    ideas: [
      idea('Same-day visiting card printing — offer post with sample photos', 'GBP', 'Offer post'),
      idea('Wedding card designs printed this season (3 photos)', 'GBP', 'Update post'),
      idea('Flex banners for shop openings and events', 'GBP', 'Service post'),
      idea('Custom T-shirt and mug printing for birthdays', 'GBP', 'Product post'),
      idea('Corporate ID cards + lanyards bundle for offices', 'GBP', 'Offer post'),
      idea('Student project reports: printing and binding while you wait', 'GBP', 'Service post'),
      idea('Letterheads + bill books starter pack for new businesses', 'GBP', 'Product post'),
      idea('New Year calendar and diary printing for businesses', 'GBP', 'Seasonal offer'),
      idea('Stickers and labels for home businesses (food, cosmetics, gifts)', 'GBP', 'Product post'),
      idea('Bulk pamphlet printing — price slabs for 1,000 / 5,000 copies', 'GBP', 'Offer post'),
      idea('Event backdrops and standees', 'GBP', 'Service post'),
      idea('FAQ: how to send a print-ready file (PDF, CMYK, bleed)', 'GBP', 'Q&A + update post'),
      idea('Before/after: logo cleanup + new visiting card', 'GBP', 'Update post'),
      idea('Customer review spotlight with photo of their order', 'GBP', 'Update post'),
      idea('Paper types explained: art paper vs matte vs gloss', 'GBP', 'Q&A post'),
      idea('Menu card printing for restaurants and cafes nearby', 'GBP', 'Service post'),
      idea('Printed packaging bags and boxes for small brands', 'GBP', 'Product post'),
      idea('Shop front photo + "how to reach us" from the nearest landmark', 'GBP', 'Photo update'),
      idea('Festival greeting card printing for businesses (Diwali / New Year)', 'GBP', 'Seasonal offer'),
      idea('WhatsApp your design, collect your print — how ordering works', 'GBP', 'Update post')
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: 'rn-world',
    name: 'R N World Computers',
    industryId: 'electronics',
    color: '#ef4444',
    emoji: '🖥️',
    channels: ['GBP', 'Instagram', 'Reels', 'WhatsApp', 'Meta Ads', 'Email'],
    notes: 'Hyderabad PC hardware + gaming store. Services: repairs, networking, AMC. Push gaming builds on reels, AMC and networking to offices.',
    kpis: ['GBP calls', 'WhatsApp leads', 'Cost per lead (Meta)', 'Google reviews', 'AMC contracts signed'],
    aliases: ['r n world', 'rn world', 'rnworld', 'rn', 'r n world computers', 'rnw'],
    brief: {
      about: 'R N World Computers is a Hyderabad store for PC hardware, custom gaming PCs, laptops, repairs, networking and AMC services.',
      audience: 'Gamers, students, creators and home users in Hyderabad; small offices needing networking, CCTV and annual maintenance.',
      offerings: 'Custom gaming PC builds, components (GPU, SSD, RAM), laptops, repairs and upgrades, office networking, AMC contracts.',
      location: 'Hyderabad',
      usp: 'Expert custom builds and fast, honest repairs from a local store you can walk into.',
      tone: 'Enthusiastic and techy for gamers; reliable and clear for offices.'
    },
    recurring: [
      rt('GBP post: new arrival / build of the week / repair offer', 'GBP', weekly(MON, THU), 20, 1, { playbookId: 'gbp-post', startsChain: 'gbp-post-followup' }),
      rt('Reel: gaming PC build time-lapse / unboxing / repair', 'Reels', weekly(TUE, FRI), 60, 1, { playbookId: 'reel-script', startsChain: 'reel-followup' }),
      rt('Reply to Google reviews + send review link to repair customers', 'GBP', weekly(MON, WED, SAT), 20, 1, { playbookId: 'review-replies' }),
      rt('Upload GBP photos of this week\'s builds and service desk', 'GBP', weekly(WED), 15, 2, { playbookId: 'gbp-photos' }),
      rt('Carousel: gaming PC builds by budget (current Hyderabad prices)', 'Instagram', weekly(WED), 45, 2, { playbookId: 'ig-carousel' }),
      rt('WhatsApp broadcast to past buyers: upgrades / AMC renewal', 'WhatsApp', weekly(SAT), 20, 2, { playbookId: 'whatsapp-broadcast' }),
      rt('Meta click-to-WhatsApp ads check', 'Meta Ads', weekly(MON, THU), 20, 1, { playbookId: 'meta-ads-check' }),
      rt('Email outreach to 10 offices for AMC + networking', 'Email', weekly(TUE), 40, 2, { playbookId: 'email-campaign' }),
      rt('Update GBP Products with current prices and stock', 'GBP', weekly(SUN), 15, 3),
      rt('Monthly report: calls, walk-ins, WhatsApp leads, cost per lead', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
    ],
    ideas: [
      idea('₹60k vs ₹90k vs ₹1.5L gaming PC builds — this month\'s Hyderabad prices', 'Instagram', 'Comparison carousel'),
      idea('Build of the week: 60-second RGB time-lapse', 'Reels', 'Time-lapse reel'),
      idea('Laptop slow? SSD + RAM upgrade offer (before/after boot time)', 'GBP', 'Offer post'),
      idea('Office AMC explained: what\'s covered and yearly cost', 'Instagram', 'Explainer carousel'),
      idea('Small office networking setup we completed this week', 'GBP', 'Case-study post'),
      idea('CCTV + Wi-Fi combo package for shops', 'GBP', 'Service post'),
      idea('Data recovery story: we saved a student\'s final-year project', 'Reels', 'Story reel'),
      idea('Which GPU should you buy this month? (price to performance)', 'Reels', 'Talking-head reel'),
      idea('Back-to-college laptop guide for Hyderabad engineering students', 'Instagram', 'Seasonal carousel'),
      idea('Customer reaction to their new gaming rig', 'Reels', 'Reaction reel'),
      idea('Gaming accessories under ₹2,000', 'Instagram', 'Product carousel'),
      idea('Exchange offer: bring your old PC, upgrade to a new build', 'WhatsApp', 'Broadcast'),
      idea('Repair desk behind the scenes: motherboard repair', 'Reels', 'Process reel'),
      idea('Myth: assembled PCs are less reliable than branded ones', 'Instagram', 'Myth carousel'),
      idea('Summer special: PC cleaning + thermal paste service', 'GBP', 'Seasonal offer'),
      idea('Streaming / content creator PC build for YouTubers', 'Reels', 'Build reel'),
      idea('UPS buying guide for home offices', 'Instagram', 'Guide carousel'),
      idea('Sponsor a college LAN / esports event', 'Instagram', 'Event collab'),
      idea('RAM and SSD upgrade price list (save-worthy)', 'Instagram', 'Price list carousel'),
      idea('Click-to-WhatsApp ad: "Send your budget, get a build quote in 10 minutes"', 'Meta Ads', 'Lead ad')
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: '14mittech',
    name: '14mittech',
    industryId: 'it-services',
    color: '#22c55e',
    emoji: '💻',
    channels: ['Website', 'SEO', 'Blog', 'LinkedIn', 'Instagram', 'GBP', 'Google Ads'],
    notes: '14mittech.com — website design + digital marketing services. Portfolio-led content, service pages for local SEO.',
    kpis: ['Enquiries', 'Projects closed', 'Organic traffic', 'Google reviews', 'Cost per lead (Ads)'],
    aliases: ['14mittech', '14mit', '14 mit', 'mittech', '14m'],
    website: 'https://14mittech.com',
    brief: {
      about: '14mittech designs websites and runs digital marketing for small and medium businesses.',
      audience: 'Local business owners, clinics, schools, restaurants and startups who need a website that brings enquiries.',
      offerings: 'Website design (WordPress / custom), e-commerce sites, SEO, Google Business Profile, Google Ads, social media marketing, maintenance plans.',
      location: 'Hyderabad, India',
      usp: 'Websites built to generate enquiries — fast, mobile-first, SEO-ready, with marketing support after launch.',
      tone: 'Professional, approachable, results-focused.'
    },
    recurring: [
      rt('Portfolio post: website we launched (screenshot + result)', 'Instagram', weekly(TUE), 30, 1, { playbookId: 'ig-carousel' }),
      rt('Service-page blog for Hyderabad keywords (e.g. "website design for clinics in Hyderabad")', 'Blog', weekly(WED), 120, 1, { playbookId: 'blog-seo', startsChain: 'blog-pipeline' }),
      rt('LinkedIn post: client win / web tip / our process', 'LinkedIn', weekly(MON, THU), 25, 2, { playbookId: 'linkedin-post' }),
      rt('14mittech GBP post + reply to reviews', 'GBP', weekly(FRI), 20, 1, { playbookId: 'gbp-post' }),
      rt('Ask delivered clients for a Google review + testimonial', 'GBP', weekly(FRI), 15, 1, { playbookId: 'review-generation' }),
      rt('Google Ads check: search terms, CPC, lead quality', 'Google Ads', weekly(MON), 30, 1, { playbookId: 'google-ads-check' }),
      rt('Build 2 backlinks (design galleries, directories, guest posts)', 'SEO', weekly(THU), 40, 2, { playbookId: 'backlinks' }),
      rt('Core Web Vitals + uptime check on 14mittech.com', 'Website', monthly(5), 30, 2, { playbookId: 'technical-seo' }),
      rt('Monthly lead report: enquiries by source, close rate', 'Reporting', monthly(1), 45, 1, { playbookId: 'monthly-report', startsChain: 'monthly-report-next' })
    ],
    ideas: [
      idea('Website design cost in Hyderabad (2026 package guide)', 'Blog', 'Pricing article'),
      idea('Portfolio teardown: a site we launched + its PageSpeed score', 'Instagram', 'Case-study carousel'),
      idea('7 signs your website is losing you customers', 'Instagram', 'Carousel'),
      idea('WordPress vs Shopify vs custom: what should a small business choose?', 'Blog', 'Comparison article'),
      idea('Our 50-point website launch checklist (free download)', 'LinkedIn', 'Document post / lead magnet'),
      idea('Free website audit offer for Hyderabad businesses', 'GBP', 'Offer post'),
      idea('Landing pages: website design for doctors / schools / restaurants in Hyderabad', 'Website', 'Service landing pages'),
      idea('Website + SEO + GBP combo package for local businesses', 'GBP', 'Package post'),
      idea('30-second client testimonial video', 'Reels', 'Testimonial reel'),
      idea('How we take a site from 40 to 95 PageSpeed', 'LinkedIn', 'Process post'),
      idea('Domain, hosting and SSL explained simply', 'Reels', 'Explainer reel'),
      idea('Website maintenance plans: why sites break and what we cover', 'Instagram', 'Explainer carousel'),
      idea('Landing page teardown of a well-known brand', 'Instagram', 'Teardown carousel'),
      idea('Case study: local business enquiries after website + SEO (with permission)', 'Blog', 'Case study'),
      idea('What to prepare before hiring a web designer', 'Blog', 'Guide'),
      idea('WhatsApp ordering website for home businesses', 'Instagram', 'Service carousel'),
      idea('Year-end website refresh offer', 'Email', 'Offer email'),
      idea('AI chatbot add-on for business websites', 'LinkedIn', 'Service post'),
      idea('Google Ads + landing page package for quick leads', 'Google Ads', 'Offer campaign'),
      idea('Before/after redesign of a client homepage', 'Instagram', 'Before/after carousel')
    ]
  }
];

/** Prompt that asks AI for brand ideas in a format the app can import. */
export function brandIdeasPrompt(p: { name: string; channels: string[]; website?: string; notes?: string; brief?: BrandBrief }, count = 20): string {
  const b = p.brief;
  return `Generate ${count} content ideas for the brand "${p.name}".
${b ? `About: ${b.about}
Audience: ${b.audience}
Products / services: ${b.offerings}
Location: ${b.location}
Why customers choose us: ${b.usp}
Tone: ${b.tone}` : ''}
${p.website ? `Website: ${p.website}` : ''}
${p.notes ? `Notes: ${p.notes}` : ''}
Active channels: ${p.channels.join(', ')}

Rules:
- Every idea must be specific to THIS brand, its products/services, audience and location. No generic marketing tips.
- Use only the active channels listed above.
- Mix: educational, proof (reviews, results, behind the scenes), offers, seasonal.
- Do not invent prices, statistics or client names — use [placeholders].

Output exactly ${count} lines, nothing else, in this format:
Idea title | Channel | Format`;
}
