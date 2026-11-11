export interface LibraryPrompt {
  id: string;
  title: string;
  category: string;
  body: string;
}

/** Built-in prompt library. Replace [brackets] before using. */
export const PROMPTS: LibraryPrompt[] = [
  {
    id: 'month-plan',
    title: '30-day content calendar',
    category: 'Planning',
    body: 'Create a 30-day content calendar for [brand], a [industry] business in Hyderabad targeting [audience]. Channels: [channels]. Mix: 40% educational, 25% proof (reviews, results), 20% behind-the-scenes, 15% offers. Include festivals/marketing days this month. Output a table: date, channel, format, hook, CTA.'
  },
  {
    id: 'hooks-20',
    title: '20 scroll-stopping hooks',
    category: 'Social',
    body: 'Write 20 hooks for Instagram reels/carousels about [topic] for [audience]. Use these styles: number list, mistake, myth, before/after, question, bold claim, POV, "nobody tells you". Max 10 words each. Mark the 3 strongest.'
  },
  {
    id: 'caption-variants',
    title: 'Caption in 3 tones',
    category: 'Social',
    body: 'Write 3 captions for this post: [describe post]. Tones: (1) friendly Hinglish, (2) professional English, (3) witty. Each: hook first line with keyword, 3–5 short lines, a question CTA, 5 niche hashtags.'
  },
  {
    id: 'blog-brief',
    title: 'SEO blog brief',
    category: 'SEO',
    body: 'Create an SEO content brief for the keyword "[keyword]" for [website]. Include search intent, target reader, title options (<60 chars), meta description, H2/H3 outline, questions to answer, internal links to [pages], E-E-A-T elements to add, and FAQs. Indian audience.'
  },
  {
    id: 'meta-titles',
    title: 'Meta titles + descriptions for 10 pages',
    category: 'SEO',
    body: 'Write meta titles (≤60 chars) and meta descriptions (≤155 chars) for these pages of [website]: [list page names + main keyword each]. Include the keyword naturally, a benefit and a reason to click. Avoid duplicate patterns.'
  },
  {
    id: 'gbp-description',
    title: 'GBP business description (750 chars)',
    category: 'Local',
    body: 'Write a Google Business Profile description (max 750 characters) for [business], a [category] in [area], Hyderabad. Mention core services: [services], what makes it different: [USP], years in business: [years]. No URLs, no phone numbers, no ALL CAPS, natural keywords.'
  },
  {
    id: 'ad-copy',
    title: 'Meta ad copy (5 angles)',
    category: 'Ads',
    body: 'Write Meta ad copy for [offer] by [brand] targeting [audience] in [location]. Give 5 angles: pain, desire, social proof, urgency, curiosity. Each: primary text (≤125 chars first line), headline (≤40 chars), description, and a creative idea for the image/video.'
  },
  {
    id: 'rsa',
    title: 'Google Ads RSA (15 headlines)',
    category: 'Ads',
    body: 'Write a Google Ads responsive search ad for [service] in [city]. 15 headlines (≤30 chars) covering keyword, benefit, proof, offer, CTA; 4 descriptions (≤90 chars). Also 6 sitelinks with descriptions and 8 callouts.'
  },
  {
    id: 'client-email',
    title: 'Client update email',
    category: 'Client',
    body: 'Write a short, confident client update email for [client]. This week we did: [list]. Results: [numbers]. Blockers needing their input: [list]. Next week: [plan]. Tone: professional, warm, no jargon, under 180 words.'
  },
  {
    id: 'proposal',
    title: 'Marketing proposal outline',
    category: 'Client',
    body: 'Create a marketing proposal outline for [prospect], a [industry] business in [city] with goal [goal] and budget [budget/month]. Include: situation summary, opportunities, 90-day plan by month, deliverables per channel, KPIs, pricing table placeholder, and why us.'
  },
  {
    id: 'faq-gen',
    title: 'FAQ generator (AEO-ready)',
    category: 'AI Search',
    body: 'List the 15 questions real customers ask before buying [service/product] from a [industry] business in India. For each write a direct 40–60 word answer suitable for an FAQ section with FAQPage schema. Mark placeholders like [price].'
  },
  {
    id: 'competitor-gap',
    title: 'Competitor positioning gaps',
    category: 'Strategy',
    body: 'Here are 3 competitors of [brand] with their messaging: [paste]. Identify positioning gaps, overused claims, and 5 differentiated angles [brand] can own. Then write a one-line positioning statement for each angle.'
  },
  {
    id: 'repurpose-blog',
    title: 'Blog → 5 social posts',
    category: 'Content',
    body: 'Turn this blog post into: 1 carousel (8 slides), 1 reel script (30s), 1 LinkedIn post, 1 GBP post and 1 WhatsApp broadcast. Different hook for each platform. Blog: [paste text or URL summary].'
  },
  {
    id: 'review-reply-bulk',
    title: 'Reply to 10 reviews at once',
    category: 'Local',
    body: 'Reply to each of these Google reviews for [business]. Under 60 words each, use first names, mention specifics, vary wording, negative ones apologetic and move offline. Reviews: [paste].'
  }
];
