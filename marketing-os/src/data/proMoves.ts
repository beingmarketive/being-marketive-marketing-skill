import type { ProMove } from '../types';

const pm = (m: ProMove) => m;

export const PRO_MOVES: ProMove[] = [
  pm({
    id: 'aeo-geo',
    name: 'AEO / GEO optimisation',
    category: 'AI Search',
    why: 'Buyers now ask ChatGPT, Perplexity and Google AI Overviews instead of clicking 10 links. If AI doesn\'t mention your brand, you are invisible in that conversation.',
    how: ['List 20 real customer questions.', 'Test them in ChatGPT, Perplexity, Gemini and note who is cited.', 'Add 40–60 word direct answers under question-style H2s on your pages.', 'Make your brand description identical on site, GBP, LinkedIn and directories.', 'Re-test monthly and log mentions.'],
    task: { title: 'AEO audit: test 20 customer questions in ChatGPT/Perplexity/Gemini', channel: 'SEO', estMinutes: 60, priority: 2, playbookId: 'aeo-geo' }
  }),
  pm({
    id: 'entity-seo',
    name: 'Entity SEO + schema',
    category: 'SEO',
    why: 'Google ranks entities (things it understands), not just keywords. A well-defined brand entity ranks faster and shows in knowledge panels and AI answers.',
    how: ['Add Organization/LocalBusiness schema with sameAs to every profile.', 'Create a strong About page: founder, history, credentials.', 'Use consistent NAP and description everywhere.', 'Get listed on Wikidata-style and industry databases where eligible.', 'Link author bios to LinkedIn.'],
    task: { title: 'Add Organization schema with sameAs + upgrade About page', channel: 'SEO', estMinutes: 45, priority: 2, playbookId: 'schema' }
  }),
  pm({
    id: 'topic-clusters',
    name: 'Topic clusters',
    category: 'SEO',
    why: 'One pillar page linked to 8–15 supporting posts shows topical authority — clusters rank faster than random posts.',
    how: ['Pick one money topic (e.g. "GBP optimisation").', 'Write a pillar guide covering it broadly.', 'List 10 sub-questions → one post each.', 'Link every post to the pillar and pillar to every post.', 'Add a cluster menu/box on each page.'],
    task: { title: 'Plan a topic cluster: 1 pillar + 10 supporting posts', channel: 'Blog', estMinutes: 60, priority: 2, playbookId: 'blog-seo' }
  }),
  pm({
    id: 'content-refresh',
    name: 'Content refresh for decaying posts',
    category: 'SEO',
    why: 'Updating a post that used to rank is 3× faster than ranking a new one. Most sites leak traffic from outdated content.',
    how: ['GSC → Performance → compare last 3 months vs previous 3 → sort by click loss.', 'Pick top 5 decaying URLs.', 'Update stats, year, screenshots, add missing sub-topics from the current top 3.', 'Improve title for CTR.', 'Change "updated on" date and request indexing.'],
    task: { title: 'Find 5 decaying posts in GSC and refresh the top one', channel: 'SEO', estMinutes: 60, priority: 1, playbookId: 'blog-seo' }
  }),
  pm({
    id: 'gsc-query-mining',
    name: 'Search Console query mining',
    category: 'SEO',
    why: 'GSC shows queries you already rank for on page 2 (positions 8–20). Small tweaks push them to page 1 — the cheapest traffic you will ever get.',
    how: ['GSC → Performance → Queries, filter position 8–20, sort by impressions.', 'Map each query to the ranking page.', 'Add the exact query as an H2/FAQ with a direct answer.', 'Add internal links with that anchor.', 'Track position after 3–4 weeks.'],
    task: { title: 'GSC query mining: optimise 5 page-2 keywords', channel: 'SEO', estMinutes: 45, priority: 1, playbookId: 'indexing' }
  }),
  pm({
    id: 'programmatic-local',
    name: 'Programmatic local landing pages',
    category: 'Local',
    why: 'Pages like "Laptop repair in Kukatpally" / "Ameerpet" capture high-intent local searches across many areas with one good template.',
    how: ['List services × areas you actually serve.', 'Build one strong template: unique intro, local landmarks, area-specific reviews, map, FAQs.', 'Write genuinely unique content per area (not just name swap).', 'Link from a "Areas we serve" hub page.', 'Start with 5 areas, measure, then expand.'],
    task: { title: 'Create 5 service × area landing pages (template + first page)', channel: 'Website', estMinutes: 120, priority: 2, playbookId: 'landing-cro' }
  }),
  pm({
    id: 'nap-citations',
    name: 'NAP citations',
    category: 'Local',
    why: 'Consistent Name-Address-Phone across directories (Justdial, Sulekha, IndiaMART, Bing Places, Apple Maps) strengthens Maps rankings and trust.',
    how: ['Write the master NAP exactly as on GBP.', 'Claim Bing Places, Apple Business Connect, Justdial, Sulekha, IndiaMART, Facebook page.', 'Fix inconsistent old listings.', 'Add website + hours + categories everywhere.', 'Track in a sheet.'],
    task: { title: 'NAP citation sweep: claim/fix 8 directory listings', channel: 'GBP', estMinutes: 60, priority: 2 }
  }),
  pm({
    id: 'review-velocity',
    name: 'Review velocity system',
    category: 'Local',
    why: 'Steady new reviews every week beat a one-time burst — recency is a ranking and trust factor on Maps.',
    how: ['Create the GBP short review link + QR.', 'Add a review request to the delivery/billing process.', 'WhatsApp template ready for staff.', 'Target 2 reviews per week per location.', 'Reply to every review within 48h.'],
    task: { title: 'Set up review velocity system (link, QR, WhatsApp template, staff script)', channel: 'GBP', estMinutes: 45, priority: 1, playbookId: 'review-generation' }
  }),
  pm({
    id: 'gbp-products-services',
    name: 'GBP Products & Services catalogue',
    category: 'Local',
    why: 'Products/services with descriptions and prices give Google more keywords to match and show in the profile — most competitors leave them empty.',
    how: ['Add every service with a 300-character keyword-rich description.', 'Add top 10 products with photo, price range and link.', 'Use secondary categories that match services.', 'Refresh seasonally.'],
    task: { title: 'Fill GBP Products & Services with descriptions + photos', channel: 'GBP', estMinutes: 45, priority: 2, playbookId: 'gbp-post' }
  }),
  pm({
    id: 'gbp-qna-seeding',
    name: 'GBP Q&A seeding',
    category: 'Local',
    why: 'Pre-answering the top questions on your profile removes objections before the call and adds relevant keywords.',
    how: ['Collect 10 FAQs from calls/WhatsApp.', 'Post answers clearly (where the Q&A feature is available) or put them in posts/services.', 'Upvote helpful answers.', 'Monitor for wrong public answers.'],
    task: { title: 'Seed 10 FAQs on GBP (Q&A / posts / services)', channel: 'GBP', estMinutes: 30, priority: 3 }
  }),
  pm({
    id: 'clarity-heatmaps',
    name: 'Microsoft Clarity heatmaps',
    category: 'Analytics',
    why: 'Free session recordings and heatmaps show exactly where visitors get confused, rage-click or drop — the fastest way to find CRO fixes.',
    how: ['Create a free Clarity project and add the script (or WordPress plugin).', 'Connect to GA4.', 'After 7 days, watch 10 recordings of mobile users on key pages.', 'Check dead clicks and scroll depth.', 'List 3 fixes.'],
    task: { title: 'Install Microsoft Clarity + review 10 recordings', channel: 'Website', estMinutes: 40, priority: 2, playbookId: 'landing-cro' }
  }),
  pm({
    id: 'meta-capi',
    name: 'Meta Conversions API (CAPI)',
    category: 'Ads',
    why: 'Browser pixels lose 20–40% of events (iOS, ad blockers). CAPI sends events server-side so Meta optimises on real conversions and CPL drops.',
    how: ['Events Manager → Settings → Conversions API.', 'Use the WordPress/Shopify partner integration or a gateway.', 'Send Lead/Purchase with event_id for deduplication.', 'Check Event Match Quality (aim 6+).', 'Compare reported conversions after 7 days.'],
    task: { title: 'Set up Meta Conversions API + check event match quality', channel: 'Meta Ads', estMinutes: 60, priority: 1, playbookId: 'meta-ads-check' }
  }),
  pm({
    id: 'utm-discipline',
    name: 'UTM discipline',
    category: 'Analytics',
    why: 'Without UTMs, Instagram bio clicks, WhatsApp links and GBP clicks show up as "direct" — you can\'t prove which channel brings leads.',
    how: ['Fix naming: lowercase, source = platform, medium = type (social, email, cpc, gbp), campaign = name.', 'Use the UTM builder in Tools for every link.', 'Tag GBP website button and bio links.', 'Save conventions in a doc.', 'Check GA4 Traffic acquisition weekly.'],
    task: { title: 'Tag all bio/GBP/WhatsApp links with UTMs', channel: 'Reporting', estMinutes: 30, priority: 2 }
  }),
  pm({
    id: 'retargeting-lookalikes',
    name: 'Retargeting + lookalikes',
    category: 'Ads',
    why: 'Warm audiences convert 3–10× better. Retarget site visitors and video viewers; build lookalikes from buyers.',
    how: ['Create custom audiences: 30-day website visitors, 50% video viewers, IG engagers, customer list.', 'Retarget with testimonials/offer creatives.', 'Build 1% lookalike of buyers/leads.', 'Exclude converters.', 'Small budget (₹200–500/day) is enough to start.'],
    task: { title: 'Build retargeting audiences + 1% lookalike and launch test', channel: 'Meta Ads', estMinutes: 60, priority: 2, startsChain: 'ads-launch', playbookId: 'meta-ads-check' }
  }),
  pm({
    id: 'ctwa-ads',
    name: 'Click-to-WhatsApp ads',
    category: 'Ads',
    why: 'Indian customers prefer chatting over forms. CTWA ads start a WhatsApp conversation — higher response and easier follow-up for local businesses.',
    how: ['Objective: Engagement/Leads → Messaging apps → WhatsApp.', 'Pre-fill a greeting + 3 quick-reply questions.', 'Use a real offer + location radius targeting.', 'Reply within 5 minutes (quick replies ready).', 'Track conversations → sales manually.'],
    task: { title: 'Launch a Click-to-WhatsApp ad with pre-filled questions', channel: 'Meta Ads', estMinutes: 45, priority: 1, startsChain: 'ads-launch', playbookId: 'meta-ads-check' }
  }),
  pm({
    id: 'ig-collab-posts',
    name: 'Instagram collab posts',
    category: 'Social',
    why: 'A collab post appears on both accounts\' feeds with shared likes/comments — instant reach to a new, relevant audience for free.',
    how: ['List 10 non-competing accounts with the same audience.', 'Propose a co-created carousel/reel.', 'Use Instagram\'s Invite collaborator when posting.', 'Both reply to comments.', 'Repeat with the best partners monthly.'],
    task: { title: 'Pitch 3 collab-post partners and plan one collab carousel', channel: 'Instagram', estMinutes: 40, priority: 2, playbookId: 'ig-carousel' }
  }),
  pm({
    id: 'trial-reels',
    name: 'Instagram Trial Reels',
    category: 'Social',
    why: 'Trial reels are shown to non-followers first — test new hooks and formats without hurting your profile or followers\' feed.',
    how: ['Pick 2 hook variations of the same idea.', 'Post one as a Trial Reel.', 'If it beats your average in 24–72h, share it to followers.', 'Note which hook won.', 'Use this weekly for experiments.'],
    task: { title: 'Post a Trial Reel to test a new hook', channel: 'Reels', estMinutes: 40, priority: 2, playbookId: 'reel-script', startsChain: 'reel-followup' }
  }),
  pm({
    id: 'broadcast-channels',
    name: 'Instagram / WhatsApp broadcast channels',
    category: 'Social',
    why: 'Broadcast channels deliver notifications straight to followers\' inboxes — far better reach than feed posts for announcements and drops.',
    how: ['Create the channel with a clear name/promise.', 'Invite followers via story + post.', 'Post 2–4 times a week: behind the scenes, early access, polls.', 'Use it to push new posts in the golden hour.'],
    task: { title: 'Start a broadcast channel and invite followers', channel: 'Instagram', estMinutes: 25, priority: 3 }
  }),
  pm({
    id: 'linkedin-documents',
    name: 'LinkedIn document posts',
    category: 'Social',
    why: 'PDF carousels keep people swiping (high dwell time) — LinkedIn rewards that with reach. You can reuse Instagram carousels.',
    how: ['Export your best carousel as a PDF (1080×1350).', 'Upload as a document with a title.', 'Write a hook + 3-line context post.', 'Ask a specific question.', 'Reply to every comment for an hour.'],
    task: { title: 'Repost best carousel as a LinkedIn document post', channel: 'LinkedIn', estMinutes: 20, priority: 2, playbookId: 'linkedin-post' }
  }),
  pm({
    id: 'ugc-micro-influencers',
    name: 'UGC + micro-influencers',
    category: 'Social',
    why: 'Real customers and 5k–50k local creators are trusted more than brand ads and cost a fraction of big influencers. UGC also makes the best ad creatives.',
    how: ['Find 10 local creators with real engagement (comments, not just likes).', 'Offer product/service + small fee for 1 reel.', 'Get usage rights for ads.', 'Ask customers for video testimonials on delivery.', 'Run the best UGC as Meta ads.'],
    task: { title: 'Shortlist 10 micro-influencers + send 3 outreach DMs', channel: 'Instagram', estMinutes: 45, priority: 2 }
  }),
  pm({
    id: 'lead-magnet-nurture',
    name: 'Lead magnet + email nurture',
    category: 'Email & CRM',
    why: 'Most visitors aren\'t ready to buy. A free checklist/template captures them and a 5-email nurture turns them into clients over 2 weeks.',
    how: ['Pick one painful problem → make a 1-page checklist/template.', 'Landing page + form (name, email, WhatsApp).', 'Write 5 emails: deliver, quick win, story, case study, offer.', 'Promote via bio link, blog CTAs, ads.', 'Measure signup rate and replies.'],
    task: { title: 'Create a lead magnet + 5-email nurture sequence', channel: 'Email', estMinutes: 120, priority: 2, playbookId: 'email-campaign' }
  }),
  pm({
    id: 'win-back',
    name: 'Win-back campaign',
    category: 'Email & CRM',
    why: 'Past customers are 5× cheaper to bring back than new ones. Most local businesses never message them again.',
    how: ['Export customers who bought 60–180 days ago.', 'Send a personal WhatsApp/email with a "we miss you" reason + offer.', 'Follow up once.', 'Track returns.'],
    task: { title: 'Run a win-back WhatsApp to 60–180 day old customers', channel: 'WhatsApp', estMinutes: 40, priority: 2, playbookId: 'whatsapp-broadcast' }
  }),
  pm({
    id: 'video-testimonials',
    name: 'Video testimonials on autopilot',
    category: 'Content',
    why: 'A 20-second customer video beats any copy. Use them on GBP, landing pages, ads and reels.',
    how: ['Ask at delivery: "Can I record 20 seconds of how it went?"', 'Give 3 prompts: before, experience, result.', 'Shoot vertical, quiet place.', 'Add captions.', 'Collect consent in writing (WhatsApp is fine).'],
    task: { title: 'Collect 2 video testimonials this week', channel: 'Reels', estMinutes: 30, priority: 2 }
  }),
  pm({
    id: 'internal-linking-sprint',
    name: 'Internal linking sprint',
    category: 'SEO',
    why: 'Internal links pass authority to money pages and help indexing — 1 hour of linking can move rankings more than a new post.',
    how: ['List 5 money pages.', 'Search site:yoursite.com "keyword" to find related posts.', 'Add contextual links with descriptive anchors.', 'Fix orphan pages.', 'Add "related posts" blocks.'],
    task: { title: 'Internal linking sprint: 20 links to 5 money pages', channel: 'SEO', estMinutes: 60, priority: 2, playbookId: 'blog-seo' }
  }),
  pm({
    id: 'featured-snippets',
    name: 'Featured snippet hunting',
    category: 'SEO',
    why: 'Snippets sit above result #1 and feed voice/AI answers. You can win them from position 2–10 with formatting alone.',
    how: ['Find queries where you rank 2–10 and a snippet exists.', 'Copy the snippet format (paragraph/list/table).', 'Add a 40–50 word answer right under a question H2.', 'Use lists/tables for steps/comparisons.', 'Re-check in 2 weeks.'],
    task: { title: 'Optimise 3 pages for featured snippets', channel: 'SEO', estMinutes: 45, priority: 3, playbookId: 'aeo-geo' }
  }),
  pm({
    id: 'youtube-shorts-funnel',
    name: 'Shorts → long video funnel',
    category: 'Social',
    why: 'Shorts bring discovery; linking a Short to a related long video ("Related video") converts viewers into subscribers who watch longer.',
    how: ['Cut 3 Shorts from each long video.', 'Use the Related video link on each Short.', 'Hook = the most surprising moment.', 'Post 1 Short every 2 days.'],
    task: { title: 'Cut 3 Shorts and link them to the long video', channel: 'YouTube', estMinutes: 45, priority: 3, playbookId: 'youtube-seo' }
  }),
  pm({
    id: 'ga4-key-events',
    name: 'GA4 key events + lead tracking',
    category: 'Analytics',
    why: 'If calls, WhatsApp clicks and form submits aren\'t key events in GA4, you can\'t optimise ads or prove ROI.',
    how: ['Track click-to-call, WhatsApp click, form submit, thank-you page via GTM.', 'Mark them as key events in GA4.', 'Import into Google Ads.', 'Build a simple Looker Studio dashboard.', 'Test each event in DebugView.'],
    task: { title: 'Set up GA4 key events: call, WhatsApp, form', channel: 'Reporting', estMinutes: 60, priority: 1 }
  }),
  pm({
    id: 'looker-dashboard',
    name: 'Looker Studio client dashboard',
    category: 'Analytics',
    why: 'An auto-updating dashboard cuts monthly reporting time from hours to minutes and makes clients trust the numbers.',
    how: ['Connect GA4, GSC, Google Ads (free connectors).', 'One page: leads, sessions by channel, top pages, top queries.', 'Date comparison vs previous period.', 'Share view link with client.'],
    task: { title: 'Build a 1-page Looker Studio dashboard for a client', channel: 'Reporting', estMinutes: 90, priority: 3, playbookId: 'monthly-report' }
  }),
  pm({
    id: 'offer-stacking',
    name: 'Irresistible offer stack',
    category: 'Ads',
    why: 'Ads fail more often because of a weak offer than bad targeting. Stacking bonuses, guarantees and urgency lifts conversion without discounting.',
    how: ['Core offer + 2–3 bonuses with perceived value.', 'Risk reversal (guarantee/free trial).', 'Real deadline or limited slots.', 'Write it in one line.', 'Test vs current offer in ads.'],
    task: { title: 'Design an offer stack and test it in ads/GBP', channel: 'Meta Ads', estMinutes: 40, priority: 2 }
  }),
  pm({
    id: 'reddit-quora',
    name: 'Reddit & Quora answers',
    category: 'AI Search',
    why: 'Google and AI assistants heavily cite Reddit/Quora threads. Genuine helpful answers bring traffic and AI mentions.',
    how: ['Find 5 threads about your niche (site:reddit.com + keyword).', 'Write genuinely helpful answers with experience.', 'Mention the brand only where relevant.', 'Reply weekly.'],
    task: { title: 'Answer 5 Reddit/Quora questions in your niche', channel: 'SEO', estMinutes: 40, priority: 3, playbookId: 'aeo-geo' }
  }),
  pm({
    id: 'image-seo',
    name: 'Image SEO + Google Lens',
    category: 'SEO',
    why: 'Product/service photos with good file names, alt text and context rank in Google Images and Lens — a free channel for visual businesses (printing, jewellery, food).',
    how: ['Rename images descriptively.', 'Write useful alt text.', 'Compress to WebP.', 'Put images near relevant text.', 'Add image sitemap or ensure images are in the main sitemap.'],
    task: { title: 'Image SEO pass on top 10 product/service images', channel: 'Website', estMinutes: 40, priority: 3 }
  }),
  pm({
    id: 'bing-indexnow',
    name: 'Bing Webmaster + IndexNow',
    category: 'AI Search',
    why: 'ChatGPT search and Copilot lean on Bing\'s index. Most Indian sites ignore Bing — easy visibility win.',
    how: ['Import site from GSC into Bing Webmaster Tools.', 'Submit sitemap.', 'Enable IndexNow (Rank Math/Yoast/Cloudflare).', 'Fix Bing-specific errors.'],
    task: { title: 'Set up Bing Webmaster Tools + IndexNow', channel: 'SEO', estMinutes: 25, priority: 2, playbookId: 'indexing' }
  }),
  pm({
    id: 'seasonal-calendar',
    name: 'Seasonal campaign calendar',
    category: 'Content',
    why: 'Planning festival campaigns 3 weeks ahead beats last-minute greeting posts — offers, creatives and ads are ready when demand peaks.',
    how: ['Check the Calendar tab monthly.', 'Pick 2 relevant events per project.', 'Plan offer + creative + ad + WhatsApp 3 weeks ahead.', 'Launch 7–10 days before the event.'],
    task: { title: 'Plan next 2 festival campaigns for all projects', channel: 'Reporting', estMinutes: 45, priority: 2 }
  })
];
