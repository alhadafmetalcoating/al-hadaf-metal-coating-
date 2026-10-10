import ServicePage from "@/views/Service";
import { SERVICES, serviceBySlug } from "@/data/services";
import { pageMetadata, SITE } from "@/lib/seo";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) {
    return pageMetadata("/services", {
      title: "Service not found | Al-Hadaf Metal Coating",
      description:
        "This finishing service is not listed. View powder coating, galvanizing, plating, and antique finishes in Sharjah.",
    });
  }
  return pageMetadata(`/services/${slug}`, {
    title: service.seoTitle,
    description: service.description,
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} UAE`,
      `${service.title.toLowerCase()} Sharjah`,
      `${service.title.toLowerCase()} Dubai`,
      "best powder coating in UAE",
      "powder coating Sharjah",
    ],
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  const faqSchema =
    service?.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;
  const serviceSchema = service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `${SITE}/services/${service.slug}`,
        areaServed: ["United Arab Emirates", "Sharjah", "Dubai", "Ajman", "Abu Dhabi"],
        provider: {
          "@type": "LocalBusiness",
          name: "Al-Hadaf Metal Coating LLC",
          url: SITE,
        },
      }
    : null;

  return (
    <>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ServicePage />
    </>
  );
}
