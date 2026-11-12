import { findItemBySlug, itemSlug, normalizeItem } from "../src/lib/content.js";
import { displayDate, toUtcIso } from "../src/lib/dates.js";
import { fallbackTitle, metaDescription, resolveSeo } from "../src/lib/meta.js";
import { PUBLISHED, catalogIso, legacyRedirects } from "../src/lib/published.js";

const livePaths = [
  "/projects/dubai-hills-15-10-2025-4-39-30-pm",
  "/projects/pwder-coating-22-10-2025-10-28-05-am",
  "/projects/powder-coating-22-10-2025-10-30-40-am",
  "/projects/powder-coating-22-10-2025-10-34-15-am",
  "/projects/powder-coating-23-10-2025-12-06-12-pm",
  "/projects/aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai-2025-03-11t08-30-50-000z",
  "/projects/industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi-2025-03-11t08-48-39-000z",
  "/projects/sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating-2025-03-11t09-04-02-000z",
  "/blog/why-powder-coating-is-the-best-finish-for-metal-products-24-11-2025-9-31-46-am",
  "/blog/celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates-2025-03-11t08-17-24-000z",
  "/blog/54-uae-national-day-2025-02-12t04-27-38-000z",
  "/projects/pepsico-powder-coating-panel-transformation-project-2025-12-12t05-06-40-000z",
  "/projects/curved-metal-structure-powder-coating-project-uae-2025-12-12t05-25-39-000z",
  "/projects/yellow-safety-bollards-protective-pipe-coating-madina-supermarket-24-12-2025-11-26-12-am",
  "/projects/decorative-mesh-panel-powder-coating-31-12-2025-11-08-48-am",
  "/blog/al-hadaf-metal-coating-llc-awarded-certification-by-sharjah-municipality-uae-25-1-2026-12-34-08-am",
  "/blog/powder-coating-in-sharjah-process-finishes-quotes-2026-08-10t11-45-09-000z",
  "/blog/aluminium-powder-coating-in-dubai-windows-doors-facades-2026-12-10t04-45-01-000z",
  "/blog/metal-coating-in-the-uae-a-guide-to-7-finishes-19-10-2026-10-16-57-am",
  "/blog/ral-colour-chart-for-powder-coating-how-to-choose-26-10-2026-10-10-36-am",
  "/blog/sandblasting-in-sharjah-why-prep-decides-coating-life-2026-02-11t04-46-33-000z",
  "/blog/powder-coating-vs-galvanizing-which-is-right-for-steel-2026-09-11t04-39-28-000z",
];

const correctedPaths = [
  "/blog/powder-coating-in-sharjah-process-finishes-quotes-2026-10-08t11-45-09-000z",
  "/blog/aluminium-powder-coating-in-dubai-windows-doors-facades-2026-10-12t04-45-01-000z",
  "/blog/sandblasting-in-sharjah-why-prep-decides-coating-life-2026-11-02t04-46-33-000z",
  "/blog/powder-coating-vs-galvanizing-which-is-right-for-steel-2026-11-09t04-39-28-000z",
  "/blog/celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates-2025-11-03t08-17-24-000z",
  "/blog/54-uae-national-day-2025-12-02t04-27-38-000z",
  "/projects/aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai-2025-11-03t08-30-50-000z",
  "/projects/industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi-2025-11-03t08-48-39-000z",
  "/projects/sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating-2025-11-03t09-04-02-000z",
];

const titleLengths = {
  "why-powder-coating-is-the-best-finish-for-metal-products": 54,
  "celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates": 47,
  "54-uae-national-day": 44,
  "al-hadaf-metal-coating-llc-awarded-certification-by-sharjah-municipality-uae": 47,
  "powder-coating-in-sharjah-process-finishes-quotes": 53,
  "aluminium-powder-coating-in-dubai-windows-doors-facades": 59,
  "metal-coating-in-the-uae-a-guide-to-7-finishes": 47,
  "ral-colour-chart-for-powder-coating-how-to-choose": 50,
  "sandblasting-in-sharjah-why-prep-decides-coating-life": 54,
  "powder-coating-vs-galvanizing-which-is-right-for-steel": 46,
  "powder-coating-dubai-rta-border-fencing": 43,
  "powder-coating-piccadilly-whippy": 48,
  "powder-coating-carrefour-market": 45,
  "powder-coating-stanley-hardware": 45,
  "aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai": 46,
  "industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi": 45,
  "sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating": 47,
  "pepsico-powder-coating-panel-transformation-project": 45,
  "curved-metal-structure-powder-coating-project-uae": 48,
  "yellow-safety-bollards-protective-pipe-coating-madina-supermarket": 45,
  "decorative-mesh-panel-powder-coating": 48,
};

const descriptionLengths = {
  "why-powder-coating-is-the-best-finish-for-metal-products": 146,
  "celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates": 150,
  "54-uae-national-day": 141,
  "al-hadaf-metal-coating-llc-awarded-certification-by-sharjah-municipality-uae": 154,
  "powder-coating-in-sharjah-process-finishes-quotes": 146,
  "aluminium-powder-coating-in-dubai-windows-doors-facades": 152,
  "metal-coating-in-the-uae-a-guide-to-7-finishes": 158,
  "ral-colour-chart-for-powder-coating-how-to-choose": 159,
  "sandblasting-in-sharjah-why-prep-decides-coating-life": 140,
  "powder-coating-vs-galvanizing-which-is-right-for-steel": 160,
  "powder-coating-dubai-rta-border-fencing": 149,
  "powder-coating-piccadilly-whippy": 151,
  "powder-coating-carrefour-market": 158,
  "powder-coating-stanley-hardware": 150,
  "aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai": 156,
  "industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi": 156,
  "sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating": 145,
  "pepsico-powder-coating-panel-transformation-project": 155,
  "curved-metal-structure-powder-coating-project-uae": 153,
  "yellow-safety-bollards-protective-pipe-coating-madina-supermarket": 153,
  "decorative-mesh-panel-powder-coating": 154,
};

function dubai(value) {
  return displayDate(value).replace(/\u202f/g, " ").replace(/\u00a0/g, " ");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const redirects = legacyRedirects();
const sources = new Set(redirects.map((item) => item.source));
const destinations = new Set(redirects.map((item) => item.destination));

for (const path of livePaths.concat(correctedPaths)) {
  assert(sources.has(path), `missing redirect for ${path}`);
  assert(!destinations.has(path), `redirect target is also a source: ${path}`);
}

for (const item of redirects) {
  assert(!sources.has(item.destination), `redirect chain via ${item.destination}`);
  assert(item.source !== item.destination, `self redirect ${item.source}`);
}

const slugs = PUBLISHED.map((record) => record.slug);
assert(new Set(slugs).size === slugs.length, "canonical slugs are not unique");

const cutoff = Date.parse("2026-11-11T20:00:00.000Z");
for (const record of PUBLISHED) {
  const iso = catalogIso(record);
  assert(iso && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(iso), `bad iso for ${record.slug}`);
  assert(Date.parse(iso) < cutoff, `future date ${record.slug} ${iso} ${dubai(iso)}`);
  if (record.seoTitle) assert(record.seoTitle.length === titleLengths[record.slug], `${record.slug} title ${record.seoTitle.length}`);
  if (record.seoDescription) {
    assert(record.seoDescription.length === descriptionLengths[record.slug], `${record.slug} description ${record.seoDescription.length}`);
  }
}

assert(catalogIso(PUBLISHED.find((record) => record.slug === "powder-coating-in-sharjah-process-finishes-quotes")) === "2026-10-08T11:45:09.000Z");
assert(catalogIso(PUBLISHED.find((record) => record.slug === "aluminium-powder-coating-in-dubai-windows-doors-facades")) === "2026-10-12T04:45:01.000Z");
assert(catalogIso(PUBLISHED.find((record) => record.slug === "sandblasting-in-sharjah-why-prep-decides-coating-life")) === "2026-11-02T04:46:33.000Z");
assert(catalogIso(PUBLISHED.find((record) => record.slug === "powder-coating-vs-galvanizing-which-is-right-for-steel")) === "2026-11-09T04:39:28.000Z");
assert(dubai("2026-11-09T04:39:28.000Z").startsWith("9 Nov 2026, 8:39"));
assert(dubai("2025-11-03T08:17:24.000Z").startsWith("3 Nov 2025, 12:17"));
assert(dubai("2025-12-02T04:27:38.000Z").startsWith("2 Dec 2025, 8:27"));
assert(toUtcIso("2026-11-09T04:39:28.000Z") === "2026-11-09T04:39:28.000Z", "corrected iso was swapped again");
assert(toUtcIso("19/10/2026, 10:16:57 am") === "2026-10-19T04:46:57.000Z");
assert(toUtcIso("26/10/2026, 10:10:36 am") === "2026-10-26T04:40:36.000Z");
assert(toUtcIso("09/11/2026") === "2026-11-08T18:30:00.000Z", "09/11/2026 was not read as 9 November");
assert(toUtcIso("9/11/2026") === "2026-11-08T18:30:00.000Z");

const rows = PUBLISHED.map((record) =>
  normalizeItem({
    Type: record.type,
    Title: record.title,
    Timestamp: record.raw[0],
    Content: "Aluminium Caldding",
  })
);

for (const record of PUBLISHED) {
  const row = rows.find((item) => itemSlug(item) === record.slug);
  assert(row, `no row for ${record.slug}`);
  assert(itemSlug(row) === record.slug);
  for (const source of redirects.filter((item) => item.destination.endsWith(`/${record.slug}`))) {
    const slug = source.source.split("/").pop();
    assert(findItemBySlug(rows, record.type, slug)?.Title === record.title, `legacy lookup failed for ${slug}`);
  }
  const seo = resolveSeo(row, record.type);
  if (record.seoTitle) {
    assert(seo.title === record.seoTitle, `seo title mismatch ${record.slug}`);
    assert(!seo.title.endsWith("| Powder Coating UAE | Al-Hadaf") || record.seoTitle.endsWith("| Powder Coating UAE | Al-Hadaf"));
    assert(!seo.title.includes("| Powder Coating Project UAE | Al-Hadaf"));
  }
}

assert(findItemBySlug(rows, "blog", "not-a-real-post") === null);
assert(fallbackTitle("Dubai Hills", "project") === "Dubai Hills | Powder Coating Project UAE | Al-Hadaf");
assert(fallbackTitle("Powder Coating vs Galvanizing: Which Is Right for Steel?", "blog") === "Powder Coating vs Galvanizing: Which Is Right for Steel?");

const custom = resolveSeo({ ...rows[0], SeoTitle: "Custom Title", SeoDescription: "Custom description." }, rows[0].Type);
assert(custom.title === "Custom Title");
assert(custom.description === "Custom description.");

assert(metaDescription("Aluminium Caldding") === "Aluminium Caldding");
const short = "Powder coating protects metal. It is used across the UAE.";
assert(metaDescription(short) === short);
const longSentence = `${"Durable ".repeat(40)}finish for steel.`;
const cut = metaDescription(longSentence);
assert(cut.endsWith("…") && cut.length <= 160 && !cut.includes("Durable finish"));
const first = "Powder coating is one of the most trusted and durable finishing solutions for metal products, offering long-lasting protection and a premium look.";
assert(metaDescription(`${first} Extra sentence that should not be added.`) === first);

console.log(`ok ${PUBLISHED.length} records, ${redirects.length} redirects`);
for (const record of PUBLISHED) {
  console.log(`${record.type}\t${catalogIso(record)}\t${dubai(catalogIso(record))}\t/${record.type === "project" ? "projects" : "blog"}/${record.slug}`);
}
