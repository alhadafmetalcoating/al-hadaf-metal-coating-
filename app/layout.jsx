import Script from "next/script";
import Providers from "./providers";
import StickyContactButtons from "@/Components/StickyContactButtons";
import ScrollToTop from "@/Components/ScrollToTop";
import { pageMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.alhadafmetalcoating.com"),
  ...pageMetadata("/"),
  keywords: [
    "best powder coating in UAE",
    "powder coating UAE",
    "powder coating Sharjah",
    "powder coating Dubai",
    "powder coating Ajman",
    "metal coating Sharjah",
    "sandblasting UAE",
    "galvanizing Sharjah",
    "electroplating Dubai",
    "RAL powder coating UAE",
    "gold plating Ajman",
    "antique brass finish Dubai",
    "Al Hadaf Metal Coating",
  ],
  authors: [{ name: "Al-Hadaf Metal Coating LLC" }],
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#dc2626",
    "geo.region": "AE-SH",
    "geo.placename": "Sharjah",
    "geo.position": "25.2859702;55.4314394",
    ICBM: "25.2859702, 55.4314394",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Al-Hadaf Metal Coating LLC",
  alternateName: "Best Powder Coating in UAE — Al-Hadaf Sharjah",
  description:
    "Best powder coating in UAE from Al-Hadaf Metal Coating LLC in Industrial Area 15, Sharjah. Powder coating, sandblasting, galvanizing, electroplating and metal finishing for Dubai, Ajman and Abu Dhabi.",
  image: "https://www.alhadafmetalcoating.com/assets/logo.png",
  telephone: "+971585328151",
  email: "info@alhadafmetalcoating.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Industrial Area 15, Near National Paints",
    addressLocality: "Sharjah",
    addressRegion: "Sharjah",
    addressCountry: "AE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.2859702,
    longitude: 55.4314394,
  },
  areaServed: ["Sharjah", "Dubai", "Ajman", "Abu Dhabi", "United Arab Emirates"],
  knowsAbout: [
    "best powder coating in UAE",
    "powder coating Sharjah",
    "powder coating Dubai",
    "galvanizing",
    "electroplating",
    "RAL powder coating",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Metal coating services in the UAE",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Powder Coating", url: "https://www.alhadafmetalcoating.com/services/powder-coating" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Galvanizing", url: "https://www.alhadafmetalcoating.com/services/galvanizing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Electroplating", url: "https://www.alhadafmetalcoating.com/services/electroplating" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tin Plating", url: "https://www.alhadafmetalcoating.com/services/tin-plating" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Metal Plating", url: "https://www.alhadafmetalcoating.com/services/metal-plating" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Antique Finish", url: "https://www.alhadafmetalcoating.com/services/antique-finish" } },
    ],
  },
  sameAs: [
    "https://www.instagram.com/alhadafmetalcoating/",
    "https://www.facebook.com/profile.php?id=61582487084256",
  ],
  url: "https://www.alhadafmetalcoating.com",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/vite.svg" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <ScrollToTop />
          <StickyContactButtons placement="desktop" />
          {children}
        </Providers>
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17841818062" strategy="afterInteractive" />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17841818062');
          `}
        </Script>
      </body>
    </html>
  );
}
