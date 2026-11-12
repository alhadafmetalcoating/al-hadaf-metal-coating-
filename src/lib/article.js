import { notFound, permanentRedirect } from "next/navigation";
import { fetchSheetItems, findItemBySlug, itemSlug } from "./content.js";
import { resolveSeo } from "./meta.js";
import { SITE } from "./seo.js";
import { sectionBase } from "./published.js";

export async function loadArticle(type, slug) {
  const rows = await fetchSheetItems();
  const item = findItemBySlug(rows, type, slug);
  if (!item) notFound();
  const canonical = itemSlug(item);
  const path = `${sectionBase(type)}/${canonical}`;
  if (slug !== canonical) permanentRedirect(path);
  const seo = resolveSeo(item, type);
  return { item, canonical, seo, path };
}

export function articleJsonLd(type, item, seo, path) {
  const iso = /^\d{4}-\d{2}-\d{2}T/.test(String(item?.Timestamp || "")) ? item.Timestamp : undefined;
  return {
    "@context": "https://schema.org",
    "@type": type === "blog" ? "BlogPosting" : "Article",
    headline: item.Title,
    name: seo.title,
    description: seo.description,
    datePublished: iso,
    dateModified: iso,
    mainEntityOfPage: `${SITE}${path}`,
    author: {
      "@type": "Organization",
      name: "Al-Hadaf Metal Coating LLC",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "Al-Hadaf Metal Coating LLC",
      url: SITE,
    },
  };
}
