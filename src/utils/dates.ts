/**
 * Returns today's local calendar date as a YYYY-MM-DD string.
 * Uses local time, not UTC, so users in UTC+3 (and elsewhere) always
 * get the correct local date even after midnight.
 */
export const localToday = (): string => dateToLocalIso(new Date());

/**
 * Converts any Date object to a YYYY-MM-DD string in local time.
 * Use this everywhere instead of `new Date().toISOString().split('T')[0]`
 * which produces a UTC date and can be off by one day for UTC+ timezones.
 */
export const dateToLocalIso = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
