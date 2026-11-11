import type { Checklist } from '../types';

export const CHECKLISTS: Checklist[] = [
  {
    id: 'seo-audit',
    name: 'SEO audit',
    emoji: '🔎',
    description: 'Full-site SEO health check — run quarterly or when taking a new client.',
    sections: [
      { title: 'Indexing & crawl', items: ['GSC verified + sitemap submitted', 'Pages report: no important page "not indexed"', 'robots.txt not blocking key paths', 'No accidental noindex on money pages', 'Canonical tags point to self on key pages', 'HTTP → HTTPS and www/non-www redirect to one version', 'No redirect chains / 404s on internal links'] },
      { title: 'Speed & mobile', items: ['Core Web Vitals pass on mobile (LCP < 2.5s, INP < 200ms, CLS < 0.1)', 'Images compressed (WebP) with width/height', 'Mobile layout: tap targets, font size, no horizontal scroll', 'Unused plugins/scripts removed'] },
      { title: 'On-page', items: ['Unique title (≤60 chars) on every page', 'Unique meta description with a reason to click', 'One H1 per page with primary keyword', 'Service pages target one intent each', 'Internal links to money pages from blog posts', 'Image alt text on important images'] },
      { title: 'Content', items: ['Top pages answer the query in the first 100 words', 'Decaying posts identified in GSC', 'Thin/duplicate pages merged or noindexed', 'Author bios + About page show expertise', 'FAQ sections on service pages'] },
      { title: 'Authority & local', items: ['Organization/LocalBusiness schema with sameAs', 'GBP linked and NAP consistent', 'Backlink profile checked for spam', 'Brand mentions in AI assistants tested'] }
    ]
  },
  {
    id: 'gbp-optimisation',
    name: 'GBP optimisation',
    emoji: '📍',
    description: 'Make a Google Business Profile complete and competitive in Maps.',
    sections: [
      { title: 'Basics', items: ['Business name exactly as signage (no keyword stuffing)', 'Primary category = most specific match', '3–9 relevant secondary categories', 'Address/service area correct, pin on the right spot', 'Phone + WhatsApp number, website with UTM', 'Opening hours + special/holiday hours'] },
      { title: 'Content', items: ['750-character description with services + area', 'All services added with descriptions', 'Top products with photos and price range', 'Attributes set (women-owned, wheelchair, online appointments…)', 'Logo + cover photo updated', '20+ real photos across categories', 'At least 1 post in the last 7 days'] },
      { title: 'Reviews & engagement', items: ['Review short link + QR created', 'All reviews replied', 'Messaging/chat settings reviewed', 'Q&A checked for wrong answers'] },
      { title: 'Tracking', items: ['Monthly insights logged (calls, directions, clicks)', 'Competitor top 3 benchmarked'] }
    ]
  },
  {
    id: 'website-launch',
    name: 'Website launch',
    emoji: '🚀',
    description: 'Pre- and post-launch checklist for any new website or redesign.',
    sections: [
      { title: 'Before launch', items: ['All pages proofread + placeholder text removed', 'Forms tested (email arrives, thank-you page works)', 'WhatsApp + click-to-call buttons work on mobile', 'Favicon, logo, OG image set', 'Privacy policy + terms pages', 'Speed test on mobile passes', '301 redirects mapped from old URLs (redesign)', 'Titles, meta descriptions, H1s set', 'Schema added and validated'] },
      { title: 'Launch day', items: ['Remove "discourage search engines" / noindex', 'SSL active, HTTPS redirect', 'GA4 + GTM + Clarity installed', 'Key events tracked (form, call, WhatsApp)', 'GSC + Bing Webmaster verified, sitemap submitted', 'GBP website link updated'] },
      { title: 'After launch (week 1)', items: ['Request indexing for key pages', 'Check 404s in GSC', 'Uptime monitor on', 'Backup schedule active', 'Client handover doc + logins shared'] }
    ]
  },
  {
    id: 'monthly-report',
    name: 'Monthly report',
    emoji: '📊',
    description: 'Everything to collect and write for a client\'s monthly report.',
    sections: [
      { title: 'Collect data', items: ['GA4: sessions by channel, key events, top pages', 'GSC: clicks, impressions, top queries, new keywords', 'GBP: calls, directions, website clicks, new reviews', 'Social: reach, followers, top 3 posts', 'Ads: spend, results, CPL/CPA, ROAS', 'Leads/sales from client (CRM or WhatsApp count)'] },
      { title: 'Write', items: ['3 wins with numbers', '1–2 issues with reasons', 'Explain any big change', '3 actions for next month', 'Screenshots of best content'] },
      { title: 'Deliver', items: ['KPIs logged in Marketing OS', 'Report shared (PDF/Doc)', '3-min Loom walkthrough', 'Next month plan meeting booked'] }
    ]
  },
  {
    id: 'reel-prepublish',
    name: 'Reel pre-publish',
    emoji: '🎬',
    description: 'Run this 60-second check before every reel goes live.',
    sections: [
      { title: 'Video', items: ['Hook in first 1–2 seconds (visual + text)', 'No dead air / pauses', 'Captions on, inside safe zone', 'Audio clear; trending audio volume low under voice', 'No watermark from other apps', 'Length matches content (most 15–35s)', 'Ending loops or has clear CTA'] },
      { title: 'Post', items: ['Cover image readable in grid', 'Caption first line has keyword + hook', 'CTA: comment / share / save', '3–5 niche hashtags', 'Location tag (local business)', 'Collaborator / product tags added', 'Trial reel? decided'] },
      { title: 'After posting', items: ['Shared to story', 'Reply to comments for 1 hour', 'Insights checked after 48 hrs'] }
    ]
  },
  {
    id: 'ad-launch',
    name: 'Ad campaign launch',
    emoji: '🎯',
    description: 'Avoid wasted budget — check everything before switching ads on.',
    sections: [
      { title: 'Tracking', items: ['Pixel/tag fires on landing + thank-you page', 'Conversions API / enhanced conversions set', 'Conversion event chosen = real business result', 'UTMs on all ad URLs'] },
      { title: 'Campaign', items: ['Objective matches goal (leads, sales, messages)', 'Budget + schedule set, end date if promo', 'Location: correct radius / "people in" location', 'Audience exclusions (existing customers, employees)', 'Negative keywords (Google)', 'Placements reviewed'] },
      { title: 'Creative & landing', items: ['3–5 creatives with different hooks', 'Copy checked for policy (no personal attributes, no false claims)', 'Message match ad ↔ landing page', 'Landing page fast on mobile', 'Lead form has qualifying question', 'WhatsApp quick replies ready'] },
      { title: 'After launch', items: ['Ads approved', 'Day-1 delivery check', 'No edits during learning (3 days)', 'Day-7 optimisation scheduled'] }
    ]
  }
];
