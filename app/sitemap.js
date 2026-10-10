import { SERVICES } from "@/data/services";
import { fetchSheetItems, itemSlug } from "@/lib/content";
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
      const parsed = row.Timestamp ? new Date(row.Timestamp) : lastModified;
      const modified = Number.isNaN(parsed.getTime()) ? lastModified : parsed;
      if (row.Type === "blog") {
        entries.push({
          url: `${SITE}/blog/${slug}`,
          lastModified: modified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
      if (row.Type === "project") {
        entries.push({
          url: `${SITE}/projects/${slug}`,
          lastModified: modified,
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  } catch {
    // Keep the static and service URLs if the sheet is unreachable.
  }

  return entries;
}
