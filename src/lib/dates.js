/**
 * Timestamps are stored and parsed as ISO 8601 UTC: YYYY-MM-DDTHH:mm:ss.000Z.
 * Locale strings such as 19/10/2026, 10:16:57 am are day-month-year in
 * Asia/Kolkata (UTC+5:30). That matches the Asia/Calcutta publish-log clock
 * on the text-format rows. New Apps Script writes use UTC directly and do
 * not depend on the spreadsheet locale.
 */
export const SCRIPT_TIME_ZONE = "Asia/Kolkata";
const KOLKATA_OFFSET_MINUTES = 5 * 60 + 30;

/**
 * Known day/month swaps. The clock time is already UTC; only the calendar
 * date was stored backwards. Keys are the wrong stamped values. Corrected
 * values are not keys, so a repaired sheet is left as written.
 */
export const DAY_MONTH_CORRECTIONS = {
  "2026-08-10T11:45:09.000Z": "2026-10-08T11:45:09.000Z",
  "2026-12-10T04:45:01.000Z": "2026-10-12T04:45:01.000Z",
  "2026-02-11T04:46:33.000Z": "2026-11-02T04:46:33.000Z",
  "2026-09-11T04:39:28.000Z": "2026-11-09T04:39:28.000Z",
  "2025-03-11T08:17:24.000Z": "2025-11-03T08:17:24.000Z",
  "2025-02-12T04:27:38.000Z": "2025-12-02T04:27:38.000Z",
  "2025-03-11T08:30:50.000Z": "2025-11-03T08:30:50.000Z",
  "2025-03-11T08:48:39.000Z": "2025-11-03T08:48:39.000Z",
  "2025-03-11T09:04:02.000Z": "2025-11-03T09:04:02.000Z",
};

const ISO_UTC = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z)?)?$/i;
const DAY_MONTH_YEAR = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:[,\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([ap]m))?)?$/i;

function isValidUtcParts(year, month, day, hour, minute, second, ms) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  if (hour > 23 || minute > 59 || second > 59 || ms > 999) return false;
  const probe = new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day &&
    probe.getUTCHours() === hour &&
    probe.getUTCMinutes() === minute &&
    probe.getUTCSeconds() === second
  );
}

/** Parse an unambiguous UTC timestamp. Does not interpret day/month locale strings. */
export function parseIsoUtc(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const text = String(value ?? "").trim();
  const match = text.match(ISO_UTC);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hasTime = match[4] != null;
  const hour = hasTime ? Number(match[4]) : 0;
  const minute = hasTime ? Number(match[5]) : 0;
  const second = hasTime ? Number(match[6]) : 0;
  const ms = match[7] ? Number(match[7].padEnd(3, "0").slice(0, 3)) : 0;
  if (!isValidUtcParts(year, month, day, hour, minute, second, ms)) return null;
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms)).toISOString();
}

function parseDayMonthYear(value) {
  const text = String(value ?? "").trim();
  const match = text.match(DAY_MONTH_YEAR);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  let hour = match[4] == null ? 0 : Number(match[4]);
  const minute = match[5] == null ? 0 : Number(match[5]);
  const second = match[6] == null ? 0 : Number(match[6]);
  const meridian = (match[7] || "").toLowerCase();
  if (month < 1 || month > 12 || day < 1 || day > 31 || minute > 59 || second > 59) return null;
  if (meridian) {
    if (hour < 1 || hour > 12) return null;
    if (meridian === "am") hour = hour === 12 ? 0 : hour;
    else hour = hour === 12 ? 12 : hour + 12;
  } else if (hour > 23) {
    return null;
  }
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return null;
  }
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - KOLKATA_OFFSET_MINUTES * 60 * 1000;
  return new Date(utcMs).toISOString();
}

/**
 * Convert a sheet Timestamp to ISO 8601 UTC.
 * ISO values that match the known swap list are corrected.
 * Day/month/year text is read in Asia/Kolkata. Anything else returns null
 * so callers do not pass it to `new Date()`.
 */
export function toUtcIso(value) {
  const iso = parseIsoUtc(value);
  if (iso) return DAY_MONTH_CORRECTIONS[iso] || iso;
  return parseDayMonthYear(value);
}

export function publishedMs(item) {
  const raw = item?.TimestampRaw != null && String(item.TimestampRaw).trim()
    ? item.TimestampRaw
    : item?.Timestamp;
  const iso = toUtcIso(raw);
  const ms = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(ms) ? 0 : ms;
}

export function compareNewest(a, b) {
  return publishedMs(b) - publishedMs(a);
}

export function formatDubai(value) {
  const iso = toUtcIso(value);
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function displayDate(value) {
  return formatDubai(value);
}
