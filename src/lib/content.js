export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx0tO-WtDoYrojLZtAwcgxVBcc2DChXfLvrU0aTZ8NrFsBkp9UYmZtejrArvtXa2bXUbA/exec";

export function slugify(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

export function itemSlug(item) {
  const title = slugify(item?.Title);
  const stamp = slugify(item?.Timestamp).slice(0, 32);
  return stamp ? `${title}-${stamp}` : title;
}

export function splitImages(value) {
  return String(value || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function fetchSheetItems() {
  const options = { next: { revalidate: 3600 } };
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    options.signal = AbortSignal.timeout(8000);
  }
  const response = await fetch(APPS_SCRIPT_URL, options);
  const result = await response.json();
  if (result.result !== "success" || !Array.isArray(result.data)) {
    throw new Error("Failed to fetch content");
  }
  return result.data;
}

export async function findSheetItem(type, slug) {
  const rows = await fetchSheetItems();
  return rows.find((row) => row.Type === type && itemSlug(row) === slug) || null;
}

export function excerpt(text, length = 155) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}…`;
}
