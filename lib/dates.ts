// Calendar-day helpers for due dates.
//
// Every date in this app is a calendar day written as "YYYY-MM-DD", the same
// shape Postgres returns for a `date` column. Two rules keep this free of the
// usual timezone bugs:
//
//   1. Never call `new Date("2026-09-13")`. That parses as UTC midnight, so
//      formatting it in any zone west of UTC renders the PREVIOUS day. Every
//      conversion here goes through `Date.UTC` and formats with timeZone "UTC",
//      which cancels out exactly.
//   2. Comparisons are plain string comparisons. Zero-padded ISO dates sort
//      lexicographically the same way they sort chronologically, so "is this
//      overdue" needs no date parsing at all.

/**
 * The calendar the app reasons in. "Due today" has to mean one specific day
 * for everyone looking at the list, so it is pinned to the workshop's zone
 * rather than read from each visitor's browser. Change this one constant to
 * move the app to another timezone.
 */
export const APP_TIME_ZONE = "Pacific/Honolulu";

/** Today's calendar day in the app's timezone, as "YYYY-MM-DD". */
export function todayInAppZone(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** True if `value` is a well-formed "YYYY-MM-DD" calendar day. */
export function isCalendarDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Round-trip catches impossible days like 2026-02-31, which Date rolls over.
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Whole days from `from` to `to`. Negative means `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  const toUtc = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

/**
 * A short human label for a due date: "Today", "Yesterday", "Tomorrow", or a
 * date like "Sep 15" (with the year once it is not the current one).
 */
export function formatDueDate(dueDate: string, today: string): string {
  const offset = daysBetween(today, dueDate);
  if (offset === 0) return "Today";
  if (offset === -1) return "Yesterday";
  if (offset === 1) return "Tomorrow";

  const [year, month, day] = dueDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(year === Number(today.slice(0, 4)) ? {} : { year: "numeric" }),
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
