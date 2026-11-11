import { getSetting } from '../db/db';

export const DEFAULT_MODEL = 'claude-opus-5-5';

export const AI_MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 — best quality (default)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 — faster, cheaper' },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5 — cheapest' }
];

const SYSTEM = `You are the in-app assistant of "Marketing OS", the daily work tool of Shaik Shareef, a digital marketer in Hyderabad, India with 5 years of experience who manages several brands.
Write ready-to-use marketing output (captions, scripts, outlines, replies, checklists) — not advice about what to write.
Write in clear, simple English for an Indian audience.
Be specific to the brand and industry given. Use short paragraphs and simple formatting that pastes cleanly into Instagram, Google Business Profile, WhatsApp or WordPress.
Never invent statistics, prices, reviews or awards; leave clearly marked placeholders like [price] instead.`;

export async function hasApiKey(): Promise<boolean> {
  return !!(await getSetting<string>('apiKey', '')).trim();
}

/** Calls Claude directly from the browser with the user's own key. */
export async function generate(prompt: string): Promise<string> {
  const apiKey = (await getSetting<string>('apiKey', '')).trim();
  if (!apiKey) throw new Error('Add your Claude API key in Settings.');
  const model = await getSetting<string>('aiModel', DEFAULT_MODEL);
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
  const supportsFallback = model === 'claude-opus-5-5' || model === 'claude-sonnet-5-5';

  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      system: SYSTEM,
      output_config: { effort: 'medium' },
      ...(supportsFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
      messages: [{ role: 'user', content: prompt }]
    });
    if (response.stop_reason === 'refusal') throw new Error('Claude declined this request. Rephrase the prompt and try again.');
    const text = response.content
      .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!text) throw new Error('Empty response — please try again.');
    return text;
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new Error('Invalid API key. Check it in Settings.');
    if (err instanceof Anthropic.RateLimitError) throw new Error('Rate limited — try again in a minute.');
    if (err instanceof Anthropic.APIConnectionError) throw new Error('No internet connection.');
    if (err instanceof Anthropic.APIError) throw new Error(`Claude API error ${err.status ?? ''}: ${err.message}`);
    throw err;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
