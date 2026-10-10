export const SITE = "https://www.alhadafmetalcoating.com";

export const PRIMARY_KEYWORDS = [
  "best powder coating in UAE",
  "powder coating Sharjah",
  "powder coating Dubai",
  "powder coating UAE",
  "metal coating Sharjah",
  "sandblasting UAE",
  "galvanizing Sharjah",
  "electroplating Dubai",
  "RAL powder coating UAE",
  "Al Hadaf Metal Coating",
];

export const PAGES = {
  "/": {
    title: "Best Powder Coating in UAE | Sharjah, Dubai & Ajman | Al-Hadaf",
    description:
      "Best powder coating in UAE from Al-Hadaf Metal Coating, Industrial Area 15, Sharjah. RAL colours, sandblasting, galvanizing and plating for Dubai, Ajman and Abu Dhabi. Call +971 58 532 8151.",
  },
  "/about": {
    title: "About Al-Hadaf | Powder Coating Company in Sharjah, UAE",
    description:
      "Al-Hadaf Metal Coating LLC is a Sharjah powder coating and metal finishing company (est. 2022) with 15+ years of coating experience serving Dubai, Ajman and the UAE.",
  },
  "/services": {
    title: "Powder Coating & Metal Finishing Services in UAE | Al-Hadaf Sharjah",
    description:
      "Powder coating, galvanizing, electroplating, tin plating, gold plating and antique finishes in Sharjah. Serving Dubai, Ajman and the wider UAE from Industrial Area 15.",
  },
  "/contact": {
    title: "Powder Coating Quote Sharjah | Contact Al-Hadaf Metal Coating",
    description:
      "Get a powder coating quote in Sharjah. Al-Hadaf Metal Coating LLC, Industrial Area 15, Near National Paints. WhatsApp +971 58 532 8151. Serving Dubai and Ajman.",
  },
  "/blog": {
    title: "Powder Coating Blog & Projects UAE | Al-Hadaf Metal Coating",
    description:
      "Guides and completed powder coating projects in Sharjah, Dubai and the UAE from Al-Hadaf Metal Coating LLC.",
  },
  "/testimonials": {
    title: "Powder Coating Reviews UAE | Al-Hadaf Metal Coating Sharjah",
    description:
      "Client reviews of powder coating, galvanizing and metal finishing by Al-Hadaf Metal Coating LLC in Sharjah, Dubai and Ajman.",
  },
  "/ralchart": {
    title: "RAL Colour Chart for Powder Coating UAE | Al-Hadaf Sharjah",
    description:
      "RAL colour chart for powder coating in Sharjah and Dubai. Compare standard RAL shades before you order at Al-Hadaf Metal Coating LLC.",
  },
  "/blog/project-details": {
    title: "Powder Coating Project Details | Al-Hadaf Metal Coating UAE",
    description:
      "Completed powder coating and metal finishing project by Al-Hadaf Metal Coating LLC in the UAE.",
  },
};

export function pageMetadata(pathname, extra = {}) {
  const page = { ...PAGES[pathname], ...extra };
  if (!page.title) return extra;
  const keywords = extra.keywords || PRIMARY_KEYWORDS;
  return {
    title: page.title,
    description: page.description,
    keywords,
    alternates: { canonical: pathname },
    openGraph: {
      title: page.title,
      description: page.description,
      url: pathname,
      siteName: "Al-Hadaf Metal Coating LLC",
      locale: "en_AE",
      type: "website",
      images: [
        {
          url: "/assets/hero-desktop.png",
          alt: "Best powder coating in UAE — Al-Hadaf Metal Coating workshop in Sharjah",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/assets/hero-desktop.png"],
    },
  };
}
