import type { Playbook } from '../../types';

export const socialPlaybooks: Playbook[] = [
  {
    id: 'ig-carousel',
    name: 'Instagram carousel',
    emoji: '🎠',
    channels: ['Instagram'],
    match: ['carousel', 'slides', 'instagram post', 'insta post', 'ig post'],
    summary: 'Carousels win on saves and shares. One idea, one slide at a time, a hook that stops the scroll.',
    steps: [
      'Pick ONE problem your audience has (from comments, DMs, Google "People also ask").',
      'Write 10 hook options; pick the one with a number, a pain or a surprise ("Your GBP is invisible because of these 5 mistakes").',
      'Outline 6–8 slides: hook → why it matters → points (one per slide) → summary → CTA.',
      'Max ~25 words per slide, 1 bold keyword per slide, big readable font (min 40px on 1080×1350).',
      'Design in your template (same fonts/colours every post). Use 4:5 (1080×1350).',
      'Slide 2 must deliver value immediately — it\'s shown again to people who skipped slide 1.',
      'Last slide: "Save this for later + share with a business owner who needs it".',
      'Caption: first line repeats the hook with a keyword (Instagram search reads captions), 3–5 lines of context, 3–5 niche hashtags, alt text.',
      'Post at your best time (Insights → Most active times); reply to comments in the first hour.'
    ],
    tips: ['Save/share rate > likes. Track saves per reach.', 'Use a "1/7" counter so people know there\'s more.', 'Turn high-performing carousels into reels and LinkedIn document posts.', 'Collab posts with a creator double reach for free.'],
    mistakes: ['Paragraphs of text on a slide.', 'Changing design style every post.', 'Weak first slide ("Tips for marketing").', 'CTA asking for "follow" only — ask for save/share.'],
    template: `Slide 1 (hook): [Number] [things/mistakes/tools] that [result] for [audience]
Slide 2: Why this matters: [pain in one line]
Slides 3–7: [Point] → [1 line how/example]
Slide 8: Quick recap: ✓ ✓ ✓
Slide 9: Save this 📌 + share with a [audience] who needs it. Follow @[handle] for more.

Caption: [Hook repeated with keyword]
[2–3 lines context]
Which one are you trying first? 👇
#[niche1] #[niche2] #[niche3]`,
    aiPrompt: `Write a 9-slide Instagram carousel for {project} ({industry}).
Topic / task: {task}
Context: {notes}
Give: 5 hook options (pick the best), slide-by-slide copy (max 25 words per slide, mark the bold keyword), a caption whose first line contains a search keyword, 5 niche hashtags and alt text. Audience: small business owners in India.`
  },
  {
    id: 'reel-script',
    name: 'Reel script + hooks',
    emoji: '🎬',
    channels: ['Reels', 'Instagram', 'YouTube'],
    match: ['reel', 'reels', 'short video', 'shorts', 'video script'],
    summary: 'The first 1–3 seconds decide everything. Script the hook visually AND verbally, keep it tight, end with a reason to rewatch or share.',
    steps: [
      'Pick the format: talking head tip, before/after, process time-lapse, POV, myth vs fact, list ("3 things…").',
      'Write the hook: on-screen text + first spoken line + a visual change in the first second.',
      'Script 15–35 seconds: hook (0–3s) → payoff/points (3–25s) → CTA or loop (last 3s).',
      'Shoot vertical 9:16, good light facing a window, phone at eye level, clean audio (lapel mic if talking).',
      'Edit: cut every pause, add captions (most watch on mute), a pattern break every 2–3 seconds.',
      'Cover image readable in the grid; title text in the safe zone.',
      'Caption with a keyword + question CTA; post as Trial Reel first if testing a new style.',
      'Reply to comments for the first hour (chain will remind you) and check insights after 48 hrs.'
    ],
    tips: ['Watch-time and shares drive reach — design for a rewatch (fast list, loop ending).', 'Trending audio at low volume under your voiceover works.', 'Batch-shoot 4 reels in one session.', 'Original content gets priority over reposted/watermarked clips.'],
    mistakes: ['Logo intro or "Hi guys, welcome back".', 'Slow 5-second build-up.', 'No captions.', 'TikTok/CapCut watermark.', 'Ending with "follow for more" only.'],
    template: `HOOK (0–3s)
On-screen text: "[Bold claim / question]"
Say: "[First line — under 10 words]"
Visual: [movement / reveal]

BODY (3–25s)
1. [Point] — B-roll: [shot]
2. [Point] — B-roll: [shot]
3. [Point] — B-roll: [shot]

END (25–30s)
Say: "[Payoff / loop line]"
On-screen CTA: "Send this to someone who [situation]"`,
    aiPrompt: `Write a 30-second Instagram Reel script for {project} ({industry}).
Task: {task}
Context: {notes}
Give: 7 hook options (visual + spoken), then the full script with timestamps, on-screen text, B-roll shot list, trending-audio style suggestion, caption with a keyword, and a share-worthy CTA. Make it shootable on a phone in under 20 minutes.`
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn post',
    emoji: '💼',
    channels: ['LinkedIn'],
    match: ['linkedin'],
    summary: 'LinkedIn rewards dwell time and real conversations. Lead with a sharp first line, tell a specific story, end with a genuine question.',
    steps: [
      'Pick a format: lesson from a client, contrarian take, how-to, data point, document (PDF carousel) post.',
      'First 2 lines must earn the "…see more" click — specific, short, a little tension.',
      'Body: short lines, white space, one idea, concrete numbers/examples.',
      'Keep external links out of the post body; put them in the first comment if needed.',
      'End with a specific question that experts can answer in one comment.',
      'Post on weekdays 8–10 am IST; stay for 30–60 min to reply to every comment.',
      'Comment thoughtfully on 5 posts from your ICP before and after posting.'
    ],
    tips: ['Document posts (PDF carousels) get high dwell time — reuse Instagram carousels.', 'Personal profile beats company page — post from the founder/your profile and reshare.', '3 hashtags max.', 'Tag people only if they were genuinely involved.'],
    mistakes: ['Corporate press-release tone.', 'Link in the post body.', 'Engagement bait ("Comment YES").', 'Posting and disappearing.'],
    template: `[Short, specific hook — what happened / the surprising result]

[Context: who, what problem, in 2 lines]

What we did:
→ [Step 1]
→ [Step 2]
→ [Step 3]

Result: [number / outcome]

Lesson: [one-line takeaway]

[Specific question to the audience]?`,
    aiPrompt: `Write a LinkedIn post for {project} ({industry}).
Task: {task}
Context: {notes}
Give 3 hook options, then the full post (150–250 words, short lines, one specific example, no links in body, ends with a question for experts), plus a first comment and 3 hashtags.`
  },
  {
    id: 'youtube-seo',
    name: 'YouTube video SEO',
    emoji: '▶️',
    channels: ['YouTube'],
    match: ['youtube', 'yt video', 'video seo', 'thumbnail'],
    summary: 'Win the click (title + thumbnail) and the watch (first 30 seconds + retention); search metadata helps the video get discovered.',
    steps: [
      'Research the keyword: YouTube search autocomplete, competitor titles, comments with questions.',
      'Title: keyword near the front + curiosity/benefit, under 60 characters.',
      'Thumbnail: 1 face/emotion or 1 object, max 3–4 words, high contrast, readable on a phone.',
      'First 30 seconds: confirm the promise of the title, show the result, skip intros.',
      'Description: first 2 lines summarise with the keyword; add chapters (00:00 …), links with UTMs.',
      'Add 3–5 relevant tags, the right category, captions (upload/clean auto-captions).',
      'End screen to the next best video + playlist; pin a comment with a question.',
      'After 72 hrs: CTR < 4% → change thumbnail; big retention drop → note the reason for the next video.'
    ],
    tips: ['Make 2–3 Shorts from every long video to feed the channel.', 'Series/playlists increase session time.', 'Embed the video in a related blog post for extra views and SEO.', 'Local businesses: tutorial/FAQ videos rank well with low competition.'],
    mistakes: ['Clickbait the video doesn\'t deliver.', 'Long branded intro.', 'Thumbnail text too small.', 'No chapters on long videos.'],
    template: `Title: [Keyword]: [Benefit/curiosity] ([Year])
Thumbnail text: [3 words]
Description:
[2-line summary with keyword]
Chapters:
00:00 [Hook]
00:30 [Section]
…
Links: [site with UTM]
Pinned comment: [question]`,
    aiPrompt: `I'm making a YouTube video for {project} ({industry}). Task: {task}. Context: {notes}.
Give: 5 title options (<60 chars, keyword first), 3 thumbnail concepts (text ≤4 words + visual), a hook script for the first 30 seconds, a full description with chapters placeholder, 5 tags, a pinned comment, and 3 Shorts I can cut from it.`
  },
  {
    id: 'repurposing',
    name: 'Content repurposing',
    emoji: '♻️',
    channels: ['Instagram', 'Reels', 'LinkedIn', 'YouTube', 'Blog', 'Email', 'WhatsApp'],
    match: ['repurpose', 'repurposing', 'shorts from', 'cut shorts'],
    summary: 'Create once, distribute 5 ways. Every strong piece should become a carousel, reel, LinkedIn post, email and WhatsApp/GBP update.',
    steps: [
      'Pick the source: a blog post, video, client result or a high-performing post.',
      'Extract the core: 1 big idea, 3–7 supporting points, 1 story/example, 1 stat.',
      'Carousel: big idea as hook, points as slides.',
      'Reel: the single most surprising point as a 20-sec talking head or screen recording.',
      'LinkedIn: the story/lesson version, text or document post.',
      'Email/newsletter: the "why it matters to you" version with a link back to the original.',
      'GBP / WhatsApp: the local, actionable tip version.',
      'Schedule them across 7–10 days, not all on the same day.'
    ],
    tips: ['Use the Tools → Content repurposer to create all 5 tasks in one tap.', 'Change the hook for each platform — the idea stays, the packaging changes.', 'Link everything back to the source to build SEO signals.'],
    mistakes: ['Posting identical copy everywhere.', 'Repurposing weak content — only repurpose winners.', 'Forgetting platform aspect ratios.'],
    template: `Source: [title/link]
Big idea: [1 line]
Points: 1) 2) 3)
Story/example: [ ]
→ Carousel hook: [ ]
→ Reel hook: [ ]
→ LinkedIn first line: [ ]
→ Email subject: [ ]
→ GBP/WhatsApp tip: [ ]`,
    aiPrompt: `Repurpose this piece for {project} ({industry}). Task: {task}. Context: {notes}.
Source content: [paste blog/video transcript here]
Create: a 7-slide carousel outline, a 25-sec reel script, a LinkedIn post, a newsletter section (subject + 120 words), and a GBP/WhatsApp update. Each with a platform-specific hook.`
  },
  {
    id: 'whatsapp-broadcast',
    name: 'WhatsApp broadcast',
    emoji: '💬',
    channels: ['WhatsApp'],
    match: ['whatsapp', 'broadcast', 'wa message'],
    summary: 'WhatsApp is the highest-open channel in India — use it for offers and reminders, not spam. Personal, short, one CTA.',
    steps: [
      'Segment the list: past buyers, enquiries who didn\'t buy, VIP/repeat, by product interest.',
      'Use WhatsApp Business broadcast lists (only people who saved your number receive it) or the WhatsApp Business API for templates.',
      'One message = one offer/update + one CTA (reply "YES", call, visit, link).',
      'Personal tone, under 60 words, 1–2 emojis, a real photo or short video.',
      'Add urgency only if real (date, limited slots).',
      'Send between 10 am–1 pm or 6–8 pm; avoid early mornings and late nights.',
      'Reply to every response fast; tag responders with labels (New lead, Order, Follow-up).',
      'Max 1–2 broadcasts per week to the same list. Let people opt out easily.'
    ],
    tips: ['Ask customers to save your number on the bill/receipt so broadcasts reach them.', 'WhatsApp catalogue + quick replies speed up sales.', 'Use Channels for one-to-many updates without broadcast limits.'],
    mistakes: ['Long forwards with 10 emojis.', 'Daily messages — people block you.', 'No CTA.', 'Messaging people who never interacted (risk of ban).'],
    template: `Hi [Name] 👋
[One-line offer/update] at [Business].
✅ [Key detail: price / date / benefit]
Reply *YES* and we'll [reserve / send details].
Offer till [date]. — [Your name]`,
    aiPrompt: `Write 3 WhatsApp broadcast messages for {project} ({industry}). Task: {task}. Context: {notes}.
Under 60 words each, personal tone, one CTA (reply YES / call / visit), suggest the image/video to attach, and one follow-up message for people who replied but didn't convert.`
  },
  {
    id: 'email-campaign',
    name: 'Email campaign',
    emoji: '📧',
    channels: ['Email'],
    match: ['email', 'newsletter', 'mailer', 'nurture'],
    summary: 'One email, one job. Subject line gets the open, first line keeps them reading, single CTA gets the click.',
    steps: [
      'Define the job: click to read, book a demo, buy, reply.',
      'Segment: who should get this (and who should not)?',
      'Write 5 subject lines (curiosity, benefit, number, personal, question) — pick 2 for an A/B test.',
      'Preview text continues the subject — never "View in browser".',
      'Body: 100–200 words, one idea, short paragraphs, one primary button (+ the same link once in text).',
      'UTM-tag every link (utm_source=newsletter&utm_medium=email&utm_campaign=...).',
      'Send a test to yourself on mobile; check links, images, unsubscribe link.',
      'Next day: check opens/clicks; resend to non-openers with a new subject after 2–3 days.'
    ],
    tips: ['Plain-text-style emails often beat designed templates for B2B.', 'Send from a person, not "noreply".', 'Clean inactive subscribers every quarter to protect deliverability.', 'SPF, DKIM and DMARC must be set on your domain.'],
    mistakes: ['3 different CTAs.', 'Image-only emails.', 'Buying email lists.', 'Never cleaning the list.'],
    template: `Subject: [Benefit / curiosity, under 45 chars]
Preview: [continues the subject]

Hi [First name],

[1-line hook relevant to them]

[2–3 short paragraphs: problem → insight → what to do]

[Button: one clear action]

[Sign-off with real name]
P.S. [Secondary nudge or deadline]`,
    aiPrompt: `Write an email for {project} ({industry}). Task: {task}. Context: {notes}.
Give 5 subject lines + preview text, a 150-word body with one CTA, a P.S., and a resend version for non-openers with a new subject line.`
  }
];
