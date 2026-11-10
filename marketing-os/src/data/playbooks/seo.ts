import type { Playbook } from '../../types';

export const seoPlaybooks: Playbook[] = [
  {
    id: 'blog-seo',
    name: 'Blog SEO article',
    emoji: '✍️',
    channels: ['Blog', 'SEO'],
    match: ['blog', 'article', 'refresh', 'post lik', 'content refresh'],
    summary: 'Write for one search intent, beat the current top 3 on usefulness, and make it easy for Google (and AI answers) to understand.',
    steps: [
      'Pick 1 primary keyword + 3–5 related ones (Google autocomplete, "People also ask", GSC queries).',
      'Search it; note what the top 3 results cover, their format (list, guide, comparison) and gaps.',
      'Outline: H1 with keyword, intro that answers the query in 2–3 lines, H2s for each sub-question, FAQ at the end.',
      'Write with experience: real examples, Indian context, numbers, screenshots, your own opinion (E-E-A-T).',
      'Add a short "Key takeaways" or summary box near the top — AI Overviews love extractable answers.',
      'On-page: URL slug short with keyword, meta title ≤60 chars, meta description ≤155 chars with a reason to click.',
      'Images: compressed WebP, descriptive file names + alt text.',
      'Links: 3–5 internal links to/from related posts and service pages; 1–2 external links to authoritative sources.',
      'Add Article + FAQ schema, author box with bio, updated date.',
      'Publish → request indexing (the chain will create those tasks).'
    ],
    tips: ['One post = one intent. Two intents? Two posts.', 'Topic clusters: link every post to a pillar page.', 'Refresh posts that dropped in GSC clicks instead of always writing new ones.', 'Answer the main question in the first 100 words.'],
    mistakes: ['Writing for a keyword with no search intent match.', 'AI text with no examples or experience.', 'No internal links (orphan page).', 'Keyword stuffing.', 'Publishing and never updating.'],
    template: `H1: [Primary keyword]: [Benefit] ([Year])
Intro (answer in 2–3 lines)
Key takeaways (3 bullets)
H2: What is [topic]?
H2: Why it matters for [audience]
H2: Step-by-step [process]
H2: Examples / case study
H2: Common mistakes
H2: Cost / tools / timeline
H2: FAQs (4–6)
Conclusion + CTA to [service page]`,
    aiPrompt: `Create an SEO blog outline for {project} ({industry}) — website: {website}.
Task / topic: {task}
Context: {notes}
Give: primary keyword + 5 secondary keywords, search intent, 3 title options (<60 chars), meta description (<155), full H2/H3 outline with notes on what to cover in each section, a 2–3 line direct answer for the intro, 5 FAQs with short answers, 4 internal link ideas, and schema types to add. Indian audience.`
  },
  {
    id: 'indexing',
    name: 'Indexing (Search Console)',
    emoji: '🗂️',
    channels: ['SEO'],
    match: ['index', 'indexing', 'search console', 'gsc', 'coverage', 'sitemap'],
    summary: 'Unindexed pages earn zero traffic. Submit new URLs, fix "Crawled – not indexed" and keep the sitemap clean.',
    steps: [
      'GSC → URL Inspection → paste the new URL → "Request indexing".',
      'Confirm the URL is in the XML sitemap and the sitemap is submitted (Indexing → Sitemaps).',
      'Check Pages report: look at "Crawled – currently not indexed" and "Discovered – currently not indexed".',
      'For each important unindexed page: improve content depth/uniqueness, add 3+ internal links from indexed pages, then re-request indexing.',
      'Check that the page is not blocked: noindex tag, robots.txt, canonical pointing elsewhere.',
      'Remove/merge thin pages (tag pages, empty categories) or set them to noindex.',
      'Share the new URL on social / link from homepage "latest posts" for faster discovery.',
      'Re-check after 3–7 days.'
    ],
    tips: ['Internal links from strong pages are the best indexing signal you control.', 'Bing Webmaster Tools + IndexNow gets pages into Bing (and ChatGPT search) fast.', 'Requesting indexing has a daily quota — prioritise money pages.'],
    mistakes: ['Requesting indexing 10 times for the same URL.', 'Sitemaps full of redirected/404/noindex URLs.', 'Ignoring "Duplicate without user-selected canonical".'],
    template: `URL: [ ]
✓ In sitemap   ✓ Not noindex   ✓ Canonical = self
✓ Internal links added from: [page 1], [page 2], [page 3]
✓ Requested indexing on [date]
Re-check on: [date + 5]`,
    aiPrompt: `My page for {project} ({industry}) — {website} — is not getting indexed. Task: {task}. Context: {notes}.
Give me a diagnostic checklist in priority order (technical blockers → content quality → internal links → discovery), what each GSC status means, and exact fixes. Then suggest 5 internal-link anchor texts for it.`
  },
  {
    id: 'backlinks',
    name: 'Backlinks',
    emoji: '🔗',
    channels: ['SEO'],
    match: ['backlink', 'link building', 'guest post', 'citation', 'directory'],
    summary: 'Earn relevant links from real sites your audience reads. Quality and relevance beat quantity.',
    steps: [
      'List link opportunities: industry directories, local business listings, suppliers/partners, associations, local news, podcasts, guest posts.',
      'Check competitors\' backlinks (Ahrefs/Semrush free tools or GSC "Links" of your own site for patterns).',
      'Create a linkable asset: original data, free tool/calculator, checklist, ultimate guide.',
      'Pitch personally: short email, why their audience benefits, a specific article idea.',
      'Journalist requests (HARO-style platforms, Qwoted, Featured.com, X #journorequest): answer fast with an expert quote.',
      'Turn unlinked brand mentions into links (search "Brand name" -site:yoursite.com).',
      'Track every link in a sheet: URL, DA, anchor, date, status.'
    ],
    tips: ['2 good links/week compounds massively over a year.', 'Local links (chamber of commerce, college events, sponsorships) help local SEO.', 'Anchor text: mostly brand/URL, some partial match — never all exact keyword.'],
    mistakes: ['Buying cheap link packages (PBNs, Fiverr).', 'Irrelevant foreign directories.', 'Exact-match anchors everywhere.', 'Comment spam.'],
    template: `Subject: Article idea for [their site]: [topic]

Hi [Name],
I read your piece on [their article] — [specific compliment].
I'm [you], [credential]. I'd love to write "[headline]" for your readers: [3 bullet points they'd learn].
No promo — just practical advice with examples from [industry].
Would that fit your calendar?
— [Name], [site]`,
    aiPrompt: `Build a 30-day link-building plan for {project} ({industry}) — {website}. Task: {task}. Context: {notes}.
Give: 20 specific link opportunity types for India/Hyderabad, 3 linkable asset ideas, 2 guest-post pitch emails, 5 search operators to find prospects, and a weekly routine.`
  },
  {
    id: 'technical-seo',
    name: 'Technical SEO + Core Web Vitals',
    emoji: '⚙️',
    channels: ['Website', 'SEO'],
    match: ['technical seo', 'core web vitals', 'page speed', 'site speed', 'cwv', 'audit', 'uptime'],
    summary: 'Make the site fast, crawlable and error-free so content can rank. Fix the biggest issues first.',
    steps: [
      'PageSpeed Insights on homepage + top 3 pages (mobile): note LCP (<2.5s), INP (<200ms), CLS (<0.1).',
      'GSC → Core Web Vitals + Pages report: list errors by count.',
      'LCP fixes: compress hero image (WebP/AVIF), preload it, use caching/CDN, lighter theme, remove sliders.',
      'INP fixes: remove unused plugins/scripts, delay third-party scripts (chat widgets, pixels).',
      'CLS fixes: set width/height on images, reserve space for ads/embeds, preload fonts.',
      'Crawl the site (Screaming Frog free up to 500 URLs): fix 404s, redirect chains, missing titles, duplicate titles.',
      'Check robots.txt, XML sitemap, HTTPS everywhere, canonical tags, mobile usability.',
      'Re-test and log scores in the KPI log.'
    ],
    tips: ['Field data (real users) matters more than lab score.', 'WordPress: a good cache plugin + image optimiser solves 70% of issues.', 'Monitor uptime with a free tool (UptimeRobot).'],
    mistakes: ['Chasing 100/100 lab scores instead of fixing real-user metrics.', 'Installing 5 speed plugins together.', 'Blocking CSS/JS in robots.txt.'],
    template: `Page: [URL]
LCP: __s  INP: __ms  CLS: __
Top 3 issues:
1. [ ] → fix: [ ]
2. [ ] → fix: [ ]
3. [ ] → fix: [ ]
Crawl errors: 404 __ | redirects __ | missing titles __`,
    aiPrompt: `Act as a technical SEO for {project} ({industry}) — {website}. Task: {task}. Context: {notes}.
Give a prioritised technical audit checklist (crawl, index, speed/Core Web Vitals, mobile, structured data, security) with how to check each item using free tools and the typical fix on WordPress.`
  },
  {
    id: 'schema',
    name: 'Schema markup',
    emoji: '🧩',
    channels: ['SEO', 'Website'],
    match: ['schema', 'structured data', 'json-ld', 'rich result'],
    summary: 'Structured data tells Google and AI systems exactly what the business, page and FAQs are — helps rich results and entity understanding.',
    steps: [
      'Pick the types: Organization/LocalBusiness (homepage), Service, Product, Article/BlogPosting, FAQPage, BreadcrumbList, Review (only for genuine reviews on the page).',
      'Use the most specific LocalBusiness subtype (e.g. ComputerStore, MedicalClinic, Restaurant).',
      'Include NAP exactly as on GBP, geo coordinates, opening hours, sameAs (GBP, Instagram, LinkedIn, YouTube).',
      'Generate JSON-LD (or with Rank Math/Yoast) and add it in the <head>.',
      'Validate with Google Rich Results Test and Schema.org validator.',
      'Check GSC Enhancements reports after a week.'
    ],
    tips: ['sameAs links connect your entity across the web — important for AI search.', 'FAQ schema still helps machines understand Q&A even when rich results are limited.', 'Keep schema in sync with visible content.'],
    mistakes: ['Marking up content that isn\'t visible on the page.', 'Self-serving review stars on your own business.', 'Different NAP than GBP.'],
    template: `{
  "@context": "https://schema.org",
  "@type": "[LocalBusiness subtype]",
  "name": "[Business]",
  "url": "[https://…]",
  "telephone": "[+91…]",
  "address": { "@type": "PostalAddress", "streetAddress": "[ ]", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "[ ]", "addressCountry": "IN" },
  "geo": { "@type": "GeoCoordinates", "latitude": [ ], "longitude": [ ] },
  "openingHours": "Mo-Sa 10:00-20:00",
  "sameAs": ["[GBP link]", "[Instagram]", "[LinkedIn]"]
}`,
    aiPrompt: `Write valid JSON-LD schema for {project} ({industry}) — {website}. Task: {task}. Context: {notes}.
Include the most specific LocalBusiness/Organization subtype, Service entries, FAQPage for 4 likely FAQs, BreadcrumbList example and sameAs. Mark placeholders clearly in [brackets]. Explain where to paste it in WordPress.`
  },
  {
    id: 'aeo-geo',
    name: 'AEO / GEO (AI search)',
    emoji: '🤖',
    channels: ['SEO', 'Blog', 'Website'],
    match: ['aeo', 'geo', 'ai overview', 'chatgpt', 'perplexity', 'ai search', 'llm'],
    summary: 'Get cited in Google AI Overviews, ChatGPT, Perplexity and Gemini: be the clearest, most trusted, most consistent answer about your topic and brand.',
    steps: [
      'List 20 questions customers ask (sales calls, GBP Q&A, People Also Ask, Reddit/Quora).',
      'Ask those questions in ChatGPT, Perplexity, Gemini and Google; note who gets cited and why.',
      'Create answer-first content: a 40–60 word direct answer under each question heading, then depth.',
      'Use clear structure: H2 questions, lists, tables, definitions, comparison tables — easy to extract.',
      'Strengthen the entity: consistent name/description everywhere, About page, author bios, Organization schema with sameAs.',
      'Get mentioned on sources AI reads: industry lists, directories, Reddit/Quora answers, YouTube, news, Wikipedia-style references.',
      'Allow AI crawlers you want (OAI-SearchBot, PerplexityBot, Google-Extended decision) in robots.txt; submit to Bing (ChatGPT search uses Bing index).',
      'Track monthly: ask the same 20 prompts and log how often you are mentioned.'
    ],
    tips: ['Original data and first-hand experience are cited more than generic content.', 'Brand mentions without links still matter for AI.', 'Keep facts (prices, services, hours) consistent across site, GBP and directories.'],
    mistakes: ['Writing fluffy intros before the answer.', 'Blocking all AI bots without deciding.', 'Inconsistent brand descriptions across platforms.'],
    template: `Question (H2): [Exact customer question]?
Direct answer (40–60 words): [ ]
Details: [steps / list / table]
Proof: [example, number, experience]
Related: [internal link]`,
    aiPrompt: `Create an AEO/GEO plan for {project} ({industry}) — {website}. Task: {task}. Context: {notes}.
Give: 20 questions customers would ask AI assistants, a 50-word direct answer for the top 5, an entity consistency checklist, 10 third-party places to get mentioned in India, and a monthly AI-visibility tracking prompt list.`
  },
  {
    id: 'competitor-check',
    name: 'Competitor check',
    emoji: '🕵️',
    channels: ['SEO', 'GBP', 'Meta Ads', 'Instagram'],
    match: ['competitor', 'competition', 'spy'],
    summary: 'Monthly 30-minute scan of 3 competitors to steal what works and avoid what doesn\'t.',
    steps: [
      'Pick 3 competitors: the one ranking #1 on Maps, the one ranking #1 on Google, the one with best social.',
      'Google Maps: rating, review count + velocity, categories, photos, posts, Q&A.',
      'Website: new pages/services, pricing changes, offers, blog topics (site:competitor.com).',
      'Ads: Meta Ad Library (all active ads, creatives, how long they run) + Google Ads Transparency Center.',
      'Social: top posts by engagement in the last 30 days, formats, posting frequency.',
      'Write 3 things to copy (adapted) and 1 gap to own.',
      'Turn them into tasks right away.'
    ],
    tips: ['Ads running 30+ days are likely profitable — study those.', 'Read competitors\' 1–3★ reviews: they show what customers hate — your positioning.', 'Save good ideas to the Swipe File.'],
    mistakes: ['Copying exactly.', 'Watching too many competitors.', 'Doing analysis without creating tasks.'],
    template: `Competitor: [ ]
Maps: ★__ (__ reviews, +__ this month) | categories: [ ]
Website changes: [ ]
Active ads: [count] — best one: [ ]
Top social post: [ ]
Copy: 1) 2) 3)
Gap to own: [ ]`,
    aiPrompt: `Help me run a competitor check for {project} ({industry}). Task: {task}. Context: {notes}.
Give a 30-minute step-by-step checklist with exact tools/URLs (Meta Ad Library, Google Ads Transparency, Maps, site: searches), what to note, and a template to summarise into 3 actions. Then list 5 positioning gaps common in this industry in India.`
  },
  {
    id: 'landing-cro',
    name: 'Landing page CRO',
    emoji: '🧲',
    channels: ['Website'],
    match: ['landing page', 'cro', 'conversion', 'form', 'demo page', 'product page', 'booking engine'],
    summary: 'More enquiries from the same traffic: clear promise, proof, low friction, one action.',
    steps: [
      'Check the numbers: visitors, conversion rate, form starts vs submits (GA4 + Clarity).',
      'Watch 10 Clarity recordings and a heatmap: where do people stop, rage-click or drop?',
      'Above the fold: headline with the outcome, subhead with who/how, one CTA button, trust signal (rating/logos).',
      'Proof: reviews with names/photos, numbers, case studies, guarantees.',
      'Friction: fewer form fields (name + phone + 1 qualifier), WhatsApp button, click-to-call on mobile.',
      'Speed: < 2.5s LCP on mobile.',
      'Answer objections: pricing range, timeline, FAQ.',
      'Change ONE thing at a time and measure for 2 weeks (or A/B test with enough traffic).'
    ],
    tips: ['Message match: ad headline = landing page headline.', 'Sticky mobile CTA bar (Call | WhatsApp).', 'Thank-you page with next step + conversion tracking.'],
    mistakes: ['Homepage as ad landing page.', '10-field forms.', 'No mobile testing.', 'Changing 5 things at once.'],
    template: `Headline: [Outcome] for [audience] in [time/area]
Subhead: [How / what makes it different]
CTA: [Get free quote / Book demo] + WhatsApp
Trust: ★4.8 from [N] reviews · [logos]
3 benefits · How it works (3 steps) · Testimonials · Pricing/what's included · FAQ · Final CTA`,
    aiPrompt: `Audit and rewrite the landing page for {project} ({industry}) — {website}. Task: {task}. Context: {notes}.
Give: 5 headline options, above-the-fold layout, section-by-section copy outline, form field recommendation, 6 FAQs that remove objections, and 5 A/B test ideas ranked by expected impact.`
  }
];
