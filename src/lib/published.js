import { toUtcIso } from "./dates.js";
import { slugify } from "./slug.js";

/**
 * Stable URLs for posts and projects already in the sheet.
 * Slugs are the title, except where several projects share one title.
 * `raw` is the Timestamp currently stored (wrong ISO or day-month text).
 * Legacy dated paths, including the corrected-date form, redirect here.
 *
 * POST field names once the Apps Script is redeployed:
 * SeoTitle, SeoDescription, timestamp
 */
const RECORDS = [
  {
    type: "blog",
    title: "Why Powder Coating Is the Best Finish for Metal Products",
    slug: "why-powder-coating-is-the-best-finish-for-metal-products",
    raw: ["24/11/2025, 9:31:46 am"],
    seoTitle: "Why Powder Coating Is the Best Metal Finish | Al-Hadaf",
    seoDescription:
      "Powder coating is one of the most trusted and durable finishing solutions for metal products, offering long-lasting protection and a premium look.",
  },
  {
    type: "blog",
    title: "Celebrate UAE Flag Day 2025 – Unity, Heritage & Proud Colours of the United Arab Emirates",
    slug: "celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates",
    raw: ["2025-03-11T08:17:24.000Z"],
    seoTitle: "Celebrate UAE Flag Day 2025: Unity and Heritage",
    seoDescription:
      "We honour UAE Flag Day, celebrated every year on 3 November, a day of pride, identity and unity that reaffirms our allegiance and love for the nation.",
  },
  {
    type: "blog",
    title: "54 UAE National Day",
    slug: "54-uae-national-day",
    raw: ["2025-02-12T04:27:38.000Z"],
    seoTitle: "54 UAE National Day | Al Hadaf Metal Coating",
    seoDescription:
      "UAE National Day marks the historic union of the seven emirates on December 2nd, a day that symbolizes pride, unity, and remarkable progress.",
  },
  {
    type: "blog",
    title: "Al Hadaf Metal Coating LLC Awarded Certification by Sharjah Municipality, UAE",
    slug: "al-hadaf-metal-coating-llc-awarded-certification-by-sharjah-municipality-uae",
    raw: ["25/1/2026, 12:34:08 am"],
    seoTitle: "Al Hadaf Certified by Sharjah Municipality, UAE",
    seoDescription:
      "Al Hadaf Metal Coating LLC has been certified and recognized by the Municipal Authority of Sharjah, UAE, for quality services and professional excellence.",
  },
  {
    type: "blog",
    title: "Powder Coating in Sharjah: Process, Finishes & Quotes",
    slug: "powder-coating-in-sharjah-process-finishes-quotes",
    raw: ["2026-08-10T11:45:09.000Z"],
    seoTitle: "Powder Coating in Sharjah: Process, Finishes & Quotes",
    seoDescription:
      "If you are looking for powder coating in Sharjah, this guide covers the process, finishes and RAL colours, and what to send for an accurate quote.",
  },
  {
    type: "blog",
    title: "Aluminium Powder Coating in Dubai: Windows, Doors & Facades",
    slug: "aluminium-powder-coating-in-dubai-windows-doors-facades",
    raw: ["2026-12-10T04:45:01.000Z"],
    seoTitle: "Aluminium Powder Coating in Dubai: Windows, Doors & Facades",
    seoDescription:
      "Architects specifying powder coating in Dubai for aluminium windows, doors and facades need a finish that holds colour under strong sun and coastal air.",
  },
  {
    type: "blog",
    title: "Metal Coating in the UAE: A Guide to 7 Finishes",
    slug: "metal-coating-in-the-uae-a-guide-to-7-finishes",
    raw: ["19/10/2026, 10:16:57 am"],
    seoTitle: "Metal Coating in the UAE: A Guide to 7 Finishes",
    seoDescription:
      "This guide explains the main types of metal coating UAE workshops offer, what each one does, and which jobs it suits, from powder coating to antique finishes.",
  },
  {
    type: "blog",
    title: "RAL Colour Chart for Powder Coating: How to Choose",
    slug: "ral-colour-chart-for-powder-coating-how-to-choose",
    raw: ["26/10/2026, 10:10:36 am"],
    seoTitle: "RAL Colour Chart for Powder Coating: How to Choose",
    seoDescription:
      "A RAL colour chart for powder coating makes colour choice clear and repeatable. This guide explains how RAL codes work and how to use our interactive RAL tool.",
  },
  {
    type: "blog",
    title: "Sandblasting in Sharjah: Why Prep Decides Coating Life",
    slug: "sandblasting-in-sharjah-why-prep-decides-coating-life",
    raw: ["2026-02-11T04:46:33.000Z"],
    seoTitle: "Sandblasting in Sharjah: Why Prep Decides Coating Life",
    seoDescription:
      "Sandblasting in Sharjah is often the step customers never see, yet it has more effect on how long a coating lasts than almost anything else.",
  },
  {
    type: "blog",
    title: "Powder Coating vs Galvanizing: Which Is Right for Steel?",
    slug: "powder-coating-vs-galvanizing-which-is-right-for-steel",
    raw: ["2026-09-11T04:39:28.000Z"],
    seoTitle: "Powder Coating vs Galvanizing: Which Is Right?",
    seoDescription:
      "Powder coating vs galvanizing is one of the most common questions we hear from customers with steel to protect. Both stop rust, but they work in different ways.",
  },
  {
    type: "project",
    title: "Dubai Hills",
    slug: "dubai-hills",
    raw: ["15/10/2025, 4:39:30 pm"],
  },
  {
    type: "project",
    title: "Pwder Coating",
    slug: "powder-coating-dubai-rta-border-fencing",
    raw: ["22/10/2025, 10:28:05 am"],
    seoTitle: "Border Fencing Powder Coating for Dubai RTA",
    seoDescription:
      "Successfully completed the powder coating work for fencing at the border, ensuring a durable, corrosion-resistant and weatherproof finish that lasts.",
  },
  {
    type: "project",
    title: "Powder Coating",
    slug: "powder-coating-piccadilly-whippy",
    raw: ["22/10/2025, 10:30:40 am"],
    seoTitle: "Ice Cream Van Powder Coating | Piccadilly Whippy",
    seoDescription:
      "Successfully completed the Piccadilly Whippy ice cream van powder coating project, ensuring a high-quality, durable and uniform finish for outdoor use.",
  },
  {
    type: "project",
    title: "Powder Coating",
    slug: "powder-coating-carrefour-market",
    raw: ["22/10/2025, 10:34:15 am"],
    seoTitle: "Powder Coating Work for Carrefour Market, UAE",
    seoDescription:
      "Successfully completed wooden acrylic and powder coating work for Carrefour Market, UAE, delivering a high-quality, durable, and aesthetically refined finish.",
  },
  {
    type: "project",
    title: "Powder Coating",
    slug: "powder-coating-stanley-hardware",
    raw: ["23/10/2025, 12:06:12 pm"],
    seoTitle: "Powder Coating for Stanley Hardware and Tools",
    seoDescription:
      "Successfully completed the powder coating work for Stanley Hardware and Power Tools, ensuring a durable, corrosion-resistant, high-performance finish.",
  },
  {
    type: "project",
    title: "Aafina Hotel Powder Coating Project – Premium Metal Finishing by Al Hadaf Metal Coating, Jumeirah Lake Towers, Dubai",
    slug: "aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai",
    raw: ["2025-03-11T08:30:50.000Z"],
    seoTitle: "Aafina Hotel Powder Coating Project, JLT Dubai",
    seoDescription:
      "A high-end powder coating project for Aafina Hotel in Jumeirah Lake Towers, Dubai, covering decorative metal structures, railing panels and design fixtures.",
  },
  {
    type: "project",
    title: "Industrial Mesh Fence Powder Coating Project – KIZAD Industrial Zone, Abu Dhabi",
    slug: "industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi",
    raw: ["2025-03-11T08:48:39.000Z"],
    seoTitle: "Industrial Mesh Fence Powder Coating in KIZAD",
    seoDescription:
      "Large-scale industrial powder coating for KIZAD Industrial Zone in Abu Dhabi, covering heavy-duty mild steel mesh fence panels for harsh outdoor conditions.",
  },
  {
    type: "project",
    title: "Sharjah International Airport Cladding Project – Architectural Metal Finishing by Al Hadaf Metal Coating",
    slug: "sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating",
    raw: ["2025-03-11T09:04:02.000Z"],
    seoTitle: "Sharjah Airport Cladding Powder Coating Project",
    seoDescription:
      "Architectural finishing for Sharjah International Airport: aluminium and steel cladding powder coated in metallic silver and architectural white.",
  },
  {
    type: "project",
    title: "PepsiCo Powder Coating Panel Transformation Project",
    slug: "pepsico-powder-coating-panel-transformation-project",
    raw: ["2025-12-12T05:06:40.000Z"],
    seoTitle: "PepsiCo Mesh Panel Powder Coating Restoration",
    seoDescription:
      "Complete powder-coating restoration of large industrial metal mesh panels used by PepsiCo, from surface preparation to a high-gloss, vibrant yellow finish.",
  },
  {
    type: "project",
    title: "Curved Metal Structure Powder Coating Project – UAE",
    slug: "curved-metal-structure-powder-coating-project-uae",
    raw: ["2025-12-12T05:25:39.000Z"],
    seoTitle: "Curved Metal Structure Powder Coating in the UAE",
    seoDescription:
      "Powder coating of large curved metal structures for architectural or industrial use, prepared and oven-cured for long-term outdoor durability in the UAE.",
  },
  {
    type: "project",
    title: "Yellow Safety Bollards & Protective Pipe Coating – Madina Supermarket",
    slug: "yellow-safety-bollards-protective-pipe-coating-madina-supermarket",
    raw: ["24/12/2025, 11:26:12 am"],
    seoTitle: "Yellow Safety Bollards for Madina Supermarket",
    seoDescription:
      "Powder coating of cylindrical metal safety pipes and bollards for Madina Supermarket, finished in bright industrial yellow for parking and loading areas.",
  },
  {
    type: "project",
    title: "Decorative Mesh Panel Powder Coating",
    slug: "decorative-mesh-panel-powder-coating",
    raw: ["31/12/2025, 11:08:48 am"],
    seoTitle: "Decorative Mesh Panel Powder Coating, Hatta Wadi",
    seoDescription:
      "Powder coating of large decorative metal mesh panels developed for Hatta Wadi Park, intended for architectural, landscaping and public space applications.",
  },
];

export function datedSlug(title, stampValue) {
  const titleSlug = slugify(title);
  const stamp = slugify(stampValue).slice(0, 32);
  if (!titleSlug || !stamp) return titleSlug || "item";
  return `${titleSlug}-${stamp}`;
}

function withLegacy(record) {
  const legacy = [];
  for (const raw of record.raw) {
    const fromRaw = datedSlug(record.title, raw);
    if (fromRaw && fromRaw !== record.slug && !legacy.includes(fromRaw)) legacy.push(fromRaw);
    const iso = toUtcIso(raw);
    if (!iso) continue;
    const fromIso = datedSlug(record.title, iso);
    if (fromIso && fromIso !== record.slug && !legacy.includes(fromIso)) legacy.push(fromIso);
  }
  return { ...record, legacy };
}

export const PUBLISHED = RECORDS.map(withLegacy);

export function sectionBase(type) {
  return type === "project" ? "/projects" : "/blog";
}

export function rawStamp(row) {
  if (row?.TimestampRaw != null && String(row.TimestampRaw).trim()) return String(row.TimestampRaw).trim();
  return String(row?.Timestamp ?? "").trim();
}

export function explicitSlug(row) {
  return slugify(row?.Slug ?? row?.slug ?? "");
}

export function recordForSlug(type, slug) {
  return PUBLISHED.find((record) => record.type === type && record.slug === slug) || null;
}

export function recordForRow(row) {
  const type = String(row?.Type || "").trim();
  const explicit = explicitSlug(row);
  if (explicit) {
    const bySlug = recordForSlug(type, explicit);
    if (bySlug) return bySlug;
  }
  const dated = datedSlug(row?.Title, rawStamp(row));
  return PUBLISHED.find((record) => record.type === type && record.legacy.includes(dated)) || null;
}

export function itemSlug(row) {
  const explicit = explicitSlug(row);
  if (explicit) return explicit;
  const record = recordForRow(row);
  if (record) return record.slug;
  return slugify(row?.Title) || "item";
}

export function legacySlugsForRow(row) {
  const slugs = new Set();
  const record = recordForRow(row);
  if (record) {
    for (const path of record.legacy) slugs.add(path);
  }
  const titleOnly = slugify(row?.Title);
  const dated = datedSlug(row?.Title, rawStamp(row));
  if (dated && dated !== titleOnly) slugs.add(dated);
  const iso = toUtcIso(rawStamp(row));
  if (iso) {
    const isoDated = datedSlug(row?.Title, iso);
    if (isoDated && isoDated !== titleOnly) slugs.add(isoDated);
  }
  slugs.delete(itemSlug(row));
  return slugs;
}

export function findItemBySlug(rows, type, slug) {
  const typed = rows.filter((row) => String(row?.Type || "").trim() === type);
  return (
    typed.find((row) => itemSlug(row) === slug) ||
    typed.find((row) => legacySlugsForRow(row).has(slug)) ||
    null
  );
}

export function legacyRedirects() {
  const redirects = [];
  for (const record of PUBLISHED) {
    const destination = `${sectionBase(record.type)}/${record.slug}`;
    for (const sourceSlug of record.legacy) {
      const source = `${sectionBase(record.type)}/${sourceSlug}`;
      if (source !== destination) redirects.push({ source, destination });
    }
  }
  return redirects;
}

export function catalogIso(record) {
  return toUtcIso(record.raw[0]);
}
