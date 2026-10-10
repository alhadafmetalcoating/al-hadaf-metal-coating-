"use client";

import Link from "next/link";

export default function ServiceSeoCopy({ service }) {
  if (!service?.intro) return null;

  return (
    <section className="mt-12 max-w-3xl mx-auto text-left text-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {service.title} in Sharjah, Dubai and the UAE
      </h2>
      <p className="leading-relaxed mb-6">{service.intro}</p>

      {service.faqs?.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Common questions</h3>
          {service.faqs.map((item) => (
            <div key={item.q}>
              <h4 className="font-semibold text-gray-900">{item.q}</h4>
              <p className="text-sm leading-relaxed text-gray-700 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {service.related?.length > 0 && (
        <nav aria-label="Related searches" className="border-t border-gray-200 pt-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Related searches</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {service.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-red-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
