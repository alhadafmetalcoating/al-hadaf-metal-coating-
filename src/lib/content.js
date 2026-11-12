import { toUtcIso } from "./dates.js";
import { findItemBySlug } from "./published.js";

export { slugify } from "./slug.js";
export { itemSlug, findItemBySlug } from "./published.js";
export { displayDate, compareNewest, publishedMs, toUtcIso } from "./dates.js";

export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx0tO-WtDoYrojLZtAwcgxVBcc2DChXfLvrU0aTZ8NrFsBkp9UYmZtejrArvtXa2bXUbA/exec";

export const SEO_TITLE_PARAM = "SeoTitle";
export const SEO_DESCRIPTION_PARAM = "SeoDescription";
export const TIMESTAMP_PARAM = "timestamp";

function stringifyTimestamp(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  return String(value ?? "").trim();
}

export function normalizeItem(row) {
  const TimestampRaw = stringifyTimestamp(row?.Timestamp);
  const iso = toUtcIso(TimestampRaw);
  return {
    ...row,
    Type: String(row?.Type || "").trim(),
    TimestampRaw,
    Timestamp: iso || TimestampRaw,
  };
}

export function splitImages(value) {
  return String(value || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function fetchSheetItems() {
  const onServer = typeof window === "undefined";
  const options = onServer ? { next: { revalidate: 3600 } } : { cache: "no-store" };
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    options.signal = AbortSignal.timeout(20000);
  }
  const response = await fetch(onServer ? APPS_SCRIPT_URL : "/api/content", options);
  const result = await response.json();
  if (result.result !== "success" || !Array.isArray(result.data)) {
    throw new Error("Failed to fetch content");
  }
  return result.data.map(normalizeItem);
}

export async function findSheetItem(type, slug) {
  const rows = await fetchSheetItems();
  return findItemBySlug(rows, type, slug);
}
