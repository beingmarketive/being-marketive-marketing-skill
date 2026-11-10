/** All dates are local-time YYYY-MM-DD strings. */

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

let fakeToday: string | null = null;
/** Test hook. */
export function setFakeToday(iso: string | null) {
  fakeToday = iso;
}

export function today(): string {
  return fakeToday ?? toISO(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((fromISO(a).getTime() - fromISO(b).getTime()) / 86400000);
}

export function weekday(iso: string): number {
  return fromISO(iso).getDay();
}

export function daysInMonth(y: number, m0: number): number {
  return new Date(y, m0 + 1, 0).getDate();
}

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAY_HI = ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar', 'Guruvar', 'Shukravar', 'Shanivar'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function prettyDate(iso: string): string {
  const t = today();
  const d = diffDays(iso, t);
  if (d === 0) return 'Aaj';
  if (d === 1) return 'Kal';
  if (d === 2) return 'Parso';
  if (d === -1) return 'Kal (beeta)';
  if (d < 0) return `${-d} din pehle`;
  const dt = fromISO(iso);
  if (d < 7) return WEEKDAY_SHORT[dt.getDay()];
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}

export function longDate(iso: string): string {
  const dt = fromISO(iso);
  return `${WEEKDAY_SHORT[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function shortDate(iso: string): string {
  const dt = fromISO(iso);
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}

export function monthName(m0: number): string {
  return MONTHS[m0];
}

/** Monday of the week containing iso. */
export function startOfWeek(iso: string): string {
  const wd = weekday(iso);
  return addDays(iso, wd === 0 ? -6 : 1 - wd);
}

export function nowTimeHHMM(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function addHoursToNow(h: number): { date: string; time: string } {
  const d = new Date(Date.now() + h * 3600000);
  return { date: toISO(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
