import { SERVICES } from "@/data/services";
import { fetchSheetItems, itemSlug, toUtcIso } from "@/lib/content";
import { sectionBase } from "@/lib/published";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_PATHS = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/testimonials", priority: 0.6, changeFrequency: "monthly" },
  { path: "/ralchart", priority: 0.6, changeFrequency: "yearly" },
];

export default async function sitemap() {
  const lastModified = new Date();
  const entries = STATIC_PATHS.map((item) => ({
    url: `${SITE}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  for (const service of SERVICES) {
    entries.push({
      url: `${SITE}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: service.slug === "powder-coating" ? 0.95 : 0.85,
    });
  }

  try {
    const rows = await fetchSheetItems();
    for (const row of rows) {
      const slug = itemSlug(row);
      const iso = toUtcIso(row.TimestampRaw || row.Timestamp);
      const modified = iso ? new Date(iso) : undefined;
      if (row.Type === "blog" || row.Type === "project") {
        entries.push({
          url: `${SITE}${sectionBase(row.Type)}/${slug}`,
          lastModified: modified,
          changeFrequency: "monthly",
          priority: row.Type === "blog" ? 0.7 : 0.65,
        });
      }
    }
  } catch {
    // Keep the static and service URLs if the sheet is unreachable.
  }

  return entries;
}
