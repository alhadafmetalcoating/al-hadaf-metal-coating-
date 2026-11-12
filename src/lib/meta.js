import { itemSlug, recordForSlug } from "./published.js";

const BLOG_SUFFIXES = [" | Powder Coating UAE | Al-Hadaf", " | Al-Hadaf"];
const PROJECT_SUFFIXES = [" | Powder Coating Project UAE | Al-Hadaf", " | Al-Hadaf"];

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

/**
 * Use the sheet title. Add a brand suffix only when the combined title
 * lands in the 50–60 character range.
 */
export function fallbackTitle(title, kind) {
  const clean = cleanText(title) || (kind === "project" ? "Project" : "Article");
  const suffixes = kind === "project" ? PROJECT_SUFFIXES : BLOG_SUFFIXES;
  for (const suffix of suffixes) {
    const withSuffix = `${clean}${suffix}`;
    if (withSuffix.length >= 50 && withSuffix.length <= 60) return withSuffix;
  }
  return clean;
}

function wordCut(text, max) {
  const room = max - 1;
  const slice = text.slice(0, room);
  const trimmed = slice.replace(/\s+\S*$/, "").trim();
  const base = trimmed || slice.trim();
  return `${base}…`;
}

/**
 * Excerpt for meta descriptions. Prefer a sentence boundary inside
 * 140–160 characters. An ellipsis is used only when the first sentence
 * itself is longer than 160 characters.
 */
export function metaDescription(text, { min = 140, max = 160 } = {}) {
  const clean = cleanText(text);
  if (!clean) return "";
  if (clean.length <= max && !/[.!?…]/.test(clean)) return clean;

  const sentences = [];
  const pattern = /[^.!?…]+[.!?…]+|[^.!?…]+$/g;
  for (const match of clean.matchAll(pattern)) {
    const sentence = match[0].trim();
    if (sentence) sentences.push(sentence);
  }
  if (!sentences.length) return clean.length <= max ? clean : wordCut(clean, max);

  const first = sentences[0];
  if (first.length > max) return wordCut(first, max);
  if (first.length >= min) return first;

  let built = "";
  for (const sentence of sentences) {
    const next = built ? `${built} ${sentence}` : sentence;
    if (next.length > max) break;
    built = next;
    if (built.length >= min) break;
  }
  return built || first;
}

function sheetField(item, names) {
  for (const name of names) {
    const value = cleanText(item?.[name]);
    if (value) return value;
  }
  return "";
}

export function resolveSeo(item, kind) {
  const slug = itemSlug(item);
  const record = recordForSlug(kind, slug);
  const customTitle = sheetField(item, ["SeoTitle", "seoTitle"]);
  const customDescription = sheetField(item, ["SeoDescription", "seoDescription"]);
  const title = customTitle || record?.seoTitle || fallbackTitle(item?.Title, kind);
  const fromBody = metaDescription(item?.Content);
  const description =
    customDescription ||
    record?.seoDescription ||
    fromBody ||
    (kind === "project"
      ? "Completed powder coating and metal finishing project by Al-Hadaf Metal Coating LLC in the UAE."
      : "Powder coating and metal finishing article from Al-Hadaf Metal Coating LLC in Sharjah, Dubai and the UAE.");
  return { title, description, slug };
}
