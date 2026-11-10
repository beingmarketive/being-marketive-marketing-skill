import type { Playbook } from '../../types';

export const localPlaybooks: Playbook[] = [
  {
    id: 'gbp-post',
    name: 'GBP post',
    emoji: '📍',
    channels: ['GBP'],
    match: ['gbp post', 'google business post', 'gmb post', 'gbp offer', 'gbp update'],
    summary: 'A Google Business Profile post that earns a call, direction request or website click — not just "views".',
    steps: [
      'Pick ONE goal: call, visit, enquiry on WhatsApp, or website click.',
      'Choose post type: Offer (with dates + code), Update (new product, recent job, tip) or Event (dates + time).',
      'Shoot or pick a real photo: product in hand, finished job, team at work. 4:3 ratio, min 720×540, no text-heavy banners.',
      'Write 80–150 words: first line = benefit + locality ("Same-day visiting cards in Kukatpally").',
      'Add one service keyword naturally and one proof point (years, jobs done, rating).',
      'Pick the button that matches the goal: Call now / Order online / Learn more / Book.',
      'For website buttons, add a UTM link (utm_source=google&utm_medium=gbp&utm_campaign=post).',
      'Publish, then open Google Maps on your phone and confirm the post shows on the profile.'
    ],
    tips: [
      'Post 2× per week minimum — consistency signals an active business.',
      'Real photos from the business beat stock images every time.',
      'Offer posts with an end date create urgency; renew the offer instead of leaving it expired.',
      'Reuse your best-performing Instagram post as a GBP post the same week.',
      'Mention landmark/area names people actually search: "near JNTU", "Ameerpet metro".'
    ],
    mistakes: [
      'Phone numbers inside the post text — Google may reject the post. Use the Call button.',
      'Pure festival greetings with no offer or info — low clicks.',
      'Same image every week.',
      'Linking to the homepage instead of the exact service page.'
    ],
    template: `[Benefit] in [Area] — [Business name]

[1–2 lines: what's new / what we did / what's on offer]
✔ [Proof point: e.g. 500+ jobs delivered, 4.8★ on Google]
✔ [Practical detail: timing / price from ₹___ / delivery]

Offer valid till [date]. Tap "Call now" or WhatsApp us to book.`,
    aiPrompt: `Write 3 Google Business Profile post options for {project} ({industry}).
Task: {task}
Context: {notes}
Rules: 80–150 words each, first line = clear benefit + Hyderabad locality, one natural service keyword, one proof point, no phone numbers in text, end with a CTA that matches a GBP button (Call now / Book / Learn more). Also suggest the best photo to use for each and the button type.`
  },
  {
    id: 'gbp-photos',
    name: 'GBP photos',
    emoji: '🖼️',
    channels: ['GBP'],
    match: ['gbp photo', 'photos', 'upload photo', 'gbp images', 'geo tag'],
    summary: 'Fresh, real photos every week keep the profile active and win more clicks than competitors with stale listings.',
    steps: [
      'Shoot 5–10 photos on a phone in daylight: exterior (from the road), interior, team, products, finished work, happy customer (with permission).',
      'Keep them real: no heavy filters, no text overlays, no stock images.',
      'Rename files descriptively before upload (e.g. visiting-card-printing-kukatpally.jpg) — good habit even if Google strips metadata.',
      'Upload in the right categories: Exterior, Interior, Product, At work, Team.',
      'Set/refresh the cover photo and logo if they are older than 6 months.',
      'Add a 10–30 sec video (shop walkthrough or work process) once a month.',
      'Check the "Photos" tab for customer uploads that are wrong or low quality and report them if irrelevant.'
    ],
    tips: [
      'Exterior photo from the road helps first-time visitors recognise the shop.',
      'Upload weekly in small batches instead of 50 at once.',
      'Products uploaded under GBP Products with price ranges get extra visibility.',
      'Ask customers to add photos with their review — customer photos build trust.'
    ],
    mistakes: ['Only uploading logos and posters.', 'Blurry night shots.', 'Using images from Google search (copyright + looks fake).', 'Ignoring spammy customer photos.'],
    template: `Weekly photo checklist for [Business]:
1. Exterior (road view) – 1
2. Interior / counter – 1
3. Work in progress – 2
4. Finished product close-up – 2
5. Team / owner – 1
6. Customer moment (with consent) – 1`,
    aiPrompt: `Create a 4-week Google Business Profile photo and video plan for {project} ({industry}). Task: {task}. Context: {notes}.
For each week give 6 specific shots (what to shoot, angle, which GBP category) and one 20-second video idea. Keep it doable with a phone in under 30 minutes per week.`
  },
  {
    id: 'review-replies',
    name: 'Review replies',
    emoji: '💬',
    channels: ['GBP'],
    match: ['review reply', 'reply review', 'reply to review', 'reviews reply', 'respond review', 'reviews'],
    summary: 'Reply to every review within 48 hours — it builds trust with future customers and signals an active business.',
    steps: [
      'Open GBP → Reviews → filter "Unreplied".',
      'For 5★: thank by name, mention the specific product/service they used, invite them back.',
      'For 3–4★: thank, acknowledge the gap, say what you have improved, invite them to contact you.',
      'For 1–2★: stay calm, apologise for the experience (not admitting fault), move the conversation offline with a contact path, never argue publicly.',
      'Naturally include a service + area once in a while ("glad you liked our wedding card printing in Ameerpet") — never stuff keywords.',
      'Fake/competitor review? Reply politely ("We have no record of this visit…") and flag it as a policy violation.',
      'Note recurring complaints and share them with the owner.'
    ],
    tips: ['Reply within 24–48 hours.', 'Vary the wording — copy-paste replies look robotic.', 'Sign off with a real name ("— Ravi, Trendy Prints").', 'Healthcare: never confirm someone was a patient or mention treatment details.'],
    mistakes: ['Arguing with an angry reviewer.', 'Same "Thank you for your review!" on every review.', 'Ignoring old negative reviews.', 'Offering discounts in exchange for changing a review.'],
    template: `5★: Thank you so much, [Name]! Glad the [product/service] turned out exactly how you wanted. See you again for your next [occasion/order]. — [Owner], [Business]

3★: Thanks for the honest feedback, [Name]. You're right about [issue] — we've since [fix]. We'd love a chance to make it right; please WhatsApp us at the number on our profile. — [Owner]

1★: We're sorry to hear this, [Name]. This isn't the experience we aim for. Please message us on WhatsApp with your order details so we can look into it personally. — [Owner]`,
    aiPrompt: `I manage Google reviews for {project} ({industry}). Write a reply for each review I paste below.
Rules: under 70 words, use the reviewer's first name, mention the specific thing they talked about, vary the wording, sound human, sign off as the team of {project}. For negative reviews: apologise, no arguing, move offline. Context: {notes}

Reviews:
[paste reviews here]`
  },
  {
    id: 'review-generation',
    name: 'Review generation',
    emoji: '⭐',
    channels: ['GBP'],
    match: ['ask review', 'review request', 'get review', 'review generation', 'review drive', 'happy customers', 'reviews from'],
    summary: 'A steady flow of new reviews (review velocity) matters more than one big push. Ask at the happiest moment.',
    steps: [
      'Get the direct review link: GBP → "Ask for reviews" → copy short link (g.page/r/…/review).',
      'Pick the moment: right after delivery, when the customer says "thank you", or when they share a photo.',
      'Send a personal WhatsApp message with their name + what they bought + the link.',
      'Make it easy: suggest what to mention ("speed, quality, price") — never write the review for them.',
      'Put a QR code to the review link on the counter, bill, packaging or visiting card.',
      'Follow up once after 2 days if no review — never more than once.',
      'Track: reviews this week vs last week in the KPI log.'
    ],
    tips: ['Target 4–8 new reviews per month for a local business — steady beats bursts.', 'Staff can ask in person; owner can thank publicly in the reply.', 'Reviews mentioning a service + area help local relevance.', 'Ask your happiest repeat customers first.'],
    mistakes: ['Offering discounts or gifts for reviews (against Google policy).', 'Asking family/staff to post reviews.', 'Sending the same bulk message to 500 contacts at once.', 'Review gating (only asking people you think are happy through a filter page).'],
    template: `Hi [Name] 👋 Thank you for choosing [Business] for your [product/service]!
If you're happy with it, would you mind sharing a quick Google review? It really helps a small business like ours.
👉 [review link]
Takes 30 seconds. Thank you! 🙏`,
    aiPrompt: `Create a review generation system for {project} ({industry}). Task: {task}. Context: {notes}.
Give me: 3 WhatsApp request messages (English, Hinglish, Telugu-friendly English), 1 follow-up message, counter QR card copy, and a staff script for asking in person. Must follow Google's review policy (no incentives, no gating).`
  }
];
