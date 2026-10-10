export const SERVICES = [
  {
    key: "powder",
    slug: "powder-coating",
    title: "Powder Coating",
    seoTitle: "Best Powder Coating in UAE | Sharjah & Dubai | Al-Hadaf",
    description:
      "Best powder coating in UAE from Al-Hadaf Metal Coating in Sharjah. RAL colours, electrostatic coating, sandblasting and durable finishes for aluminium, steel, gates, furniture and industrial metal across Dubai, Ajman and Abu Dhabi.",
    intro:
      "Al-Hadaf Metal Coating LLC is a Sharjah workshop for powder coating in the UAE. We pretreat, electrostatically spray and oven-cure aluminium, mild steel, galvanized steel and fabricated parts so the finish lasts in Gulf heat, salt air and UV. Contractors in Dubai, Ajman, Abu Dhabi and Ras Al Khaimah send architectural profiles, gates, fences, furniture and plant equipment here for colour-matched RAL work.",
    faqs: [
      {
        q: "Who offers the best powder coating in UAE?",
        a: "Choose a Sharjah or Dubai applicator that pretreats properly, uses named powder brands and cures in a controlled oven. Al-Hadaf Metal Coating does that process in Industrial Area 15, Sharjah, for jobs across the UAE.",
      },
      {
        q: "Do you powder coat aluminium in Sharjah?",
        a: "Yes. Architectural aluminium, steel gates, mesh, bollards, supermarket fixtures and industrial parts are coated in RAL and custom shades.",
      },
      {
        q: "Which areas do you cover?",
        a: "Pickup and delivery can be arranged for Sharjah, Dubai, Ajman, Abu Dhabi and other UAE emirates. The plant is in Industrial Area 15, near National Paints.",
      },
    ],
    related: [
      { href: "/services/galvanizing", label: "galvanizing Sharjah" },
      { href: "/services/electroplating", label: "electroplating Dubai" },
      { href: "/ralchart", label: "RAL powder coating colours UAE" },
      { href: "/contact", label: "powder coating quote Sharjah" },
    ],
  },
  {
    key: "galvanizing",
    slug: "galvanizing",
    title: "Galvanizing",
    seoTitle: "Galvanizing in Sharjah & UAE | Zinc Coating | Al-Hadaf",
    description:
      "Galvanizing and zinc coating in Sharjah for steel that needs corrosion protection in the UAE. Pair with powder coating for outdoor gates, structures and industrial metal in Dubai and Ajman.",
    intro:
      "Galvanizing puts a zinc layer on steel so it resists rust in coastal UAE weather. We prepare and finish galvanized and zinc-coated parts, then powder coat when you need colour as well as protection.",
    faqs: [
      {
        q: "Can galvanized steel be powder coated?",
        a: "Yes, after the right surface prep. That duplex system is common on outdoor steel in Sharjah and Dubai.",
      },
    ],
    related: [
      { href: "/services/powder-coating", label: "best powder coating in UAE" },
      { href: "/contact", label: "galvanizing quote Sharjah" },
    ],
  },
  {
    key: "electroplating",
    slug: "electroplating",
    title: "Electroplating",
    seoTitle: "Electroplating in Sharjah, Dubai & UAE | Al-Hadaf Metal Coating",
    description:
      "Electroplating in Sharjah for decorative and industrial metal. Chrome-look, nickel and specialist plating for parts used in Dubai, Ajman and across the UAE.",
    intro:
      "Electroplating deposits a metal layer for shine, wear resistance or corrosion control. We plate small to medium parts for industrial and decorative work around Sharjah and Dubai.",
    faqs: [
      {
        q: "Is electroplating available in Sharjah?",
        a: "Yes. Al-Hadaf Metal Coating offers electroplating alongside powder coating at Industrial Area 15, Sharjah.",
      },
    ],
    related: [
      { href: "/services/metal-plating", label: "gold and silver plating UAE" },
      { href: "/services/powder-coating", label: "powder coating Sharjah" },
    ],
  },
  {
    key: "tin",
    slug: "tin-plating",
    title: "Tin Plating",
    seoTitle: "Tin Plating in UAE | Food-Grade Metal Finish | Al-Hadaf Sharjah",
    description:
      "Tin plating in Sharjah for food-grade, electrical and corrosion-resistant metal parts used across the UAE.",
    intro:
      "Tin plating is a clean, solderable, corrosion-resistant finish for food-contact and electrical metal. We plate parts for UAE workshops that need a hygienic or conductive surface.",
    faqs: [
      {
        q: "When do I need tin plating instead of powder coating?",
        a: "Use tin plating for conductivity, solderability or food-grade contact. Use powder coating when you need colour and outdoor film build.",
      },
    ],
    related: [
      { href: "/services/electroplating", label: "electroplating UAE" },
      { href: "/services/powder-coating", label: "powder coating Dubai" },
    ],
  },
  {
    key: "metal",
    slug: "metal-plating",
    title: "Metal Plating",
    seoTitle: "Gold & Silver Metal Plating in Sharjah & Dubai | Al-Hadaf",
    description:
      "Gold, silver and custom metal plating in Sharjah for premium products, fittings and decorative metalwork in the UAE.",
    intro:
      "Precious-metal and custom plating is for fittings, display pieces and specialty parts that need a luxury look. The same Sharjah plant also runs powder coating for larger architectural and industrial jobs.",
    faqs: [
      {
        q: "Do you offer gold plating in Dubai and Sharjah?",
        a: "Yes. Gold, silver and related metal plating is done at Al-Hadaf Metal Coating in Sharjah for clients across the UAE.",
      },
    ],
    related: [
      { href: "/services/antique-finish", label: "antique brass finish Dubai" },
      { href: "/services/powder-coating", label: "best powder coating in UAE" },
    ],
  },
  {
    key: "antique",
    slug: "antique-finish",
    title: "Antique Finish",
    seoTitle: "Antique Brass & Metal Finish in Dubai & Sharjah | Al-Hadaf",
    description:
      "Antique brass and aged metal finishes in Sharjah for furniture, doors, grilles and decorative work in Dubai and the UAE.",
    intro:
      "Antique finishes give brass, steel and mixed metal a lived-in colour without waiting years. We use this on furniture, doors, decorative screens and architectural hardware.",
    faqs: [
      {
        q: "Can antique finishes be used outdoors in the UAE?",
        a: "Some systems need a clear protective coat for sun and humidity. Ask us for the right stack for outdoor Dubai or Sharjah use.",
      },
    ],
    related: [
      { href: "/services/metal-plating", label: "metal plating Sharjah" },
      { href: "/services/powder-coating", label: "powder coating furniture UAE" },
    ],
  },
];

export function serviceBySlug(slug) {
  return SERVICES.find((service) => service.slug === slug) || null;
}
