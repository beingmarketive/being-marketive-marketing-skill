import type { Channel, Idea, Priority, Recurrence, RecurringTemplate } from '../../types';

export const SUN = 0, MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6;

export const daily: Recurrence = { type: 'daily' };
export const weekly = (...days: number[]): Recurrence => ({ type: 'weekly', days });
export const monthly = (dayOfMonth: number): Recurrence => ({ type: 'monthly', dayOfMonth });
export const every = (everyDays: number): Recurrence => ({ type: 'custom', everyDays });

export function rt(
  title: string,
  channel: Channel,
  recurrence: Recurrence,
  estMinutes: number,
  priority: Priority,
  extra: Partial<RecurringTemplate> = {}
): RecurringTemplate {
  return { title, channel, recurrence, estMinutes, priority, ...extra };
}

export const idea = (title: string, channel: Channel, format: string): Idea => ({ title, channel, format });
