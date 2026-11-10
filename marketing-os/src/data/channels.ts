import type { Channel } from '../types';

export interface ChannelMeta {
  emoji: string;
  color: string;
  /** lower-case words/phrases that mean this channel in quick add (English + Hinglish) */
  aliases: string[];
}

export const CHANNEL_META: Record<Channel, ChannelMeta> = {
  SEO: { emoji: '🔎', color: '#22c55e', aliases: ['seo', 'search console', 'gsc', 'indexing', 'index', 'backlink', 'backlinks', 'keyword', 'keywords', 'schema', 'aeo', 'geo'] },
  GBP: { emoji: '📍', color: '#f59e0b', aliases: ['gbp', 'gmb', 'google business', 'google business profile', 'google my business', 'maps', 'review', 'reviews'] },
  Instagram: { emoji: '📸', color: '#ec4899', aliases: ['instagram', 'insta', 'ig', 'carousel', 'story', 'stories', 'post'] },
  Reels: { emoji: '🎬', color: '#f43f5e', aliases: ['reel', 'reels', 'short', 'shorts video'] },
  Blog: { emoji: '✍️', color: '#8b5cf6', aliases: ['blog', 'article', 'blog post', 'lekh'] },
  LinkedIn: { emoji: '💼', color: '#0ea5e9', aliases: ['linkedin', 'li', 'linked in'] },
  YouTube: { emoji: '▶️', color: '#ef4444', aliases: ['youtube', 'yt', 'video', 'shorts'] },
  'Meta Ads': { emoji: '🎯', color: '#3b82f6', aliases: ['meta ads', 'fb ads', 'facebook ads', 'insta ads', 'meta ad', 'ads manager', 'boost'] },
  'Google Ads': { emoji: '💰', color: '#eab308', aliases: ['google ads', 'gads', 'adwords', 'ppc', 'search ads', 'pmax'] },
  Email: { emoji: '📧', color: '#14b8a6', aliases: ['email', 'mail', 'newsletter', 'mailer'] },
  WhatsApp: { emoji: '💬', color: '#22c55e', aliases: ['whatsapp', 'wa', 'whats app', 'broadcast'] },
  Website: { emoji: '🌐', color: '#6366f1', aliases: ['website', 'site', 'landing page', 'web', 'wordpress', 'page speed'] },
  Reporting: { emoji: '📊', color: '#a855f7', aliases: ['report', 'reporting', 'analytics', 'ga4', 'insights', 'review meeting'] }
};

export const PRIORITY_META = {
  1: { label: 'High', hinglish: 'Zaroori', color: '#f43f5e' },
  2: { label: 'Medium', hinglish: 'Normal', color: '#f59e0b' },
  3: { label: 'Low', hinglish: 'Baad mein', color: '#64748b' }
} as const;
