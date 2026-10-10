"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useTranslation } from "react-i18next";
import {
  Brush,
  ShieldCheck,
  Zap,
  Factory,
  Layers,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PowderCoating from "../Components/PowderCoating";
import Galvanizing from "../Components/Galvanizing";
import Electroplating from "../Components/Electroplating";
import TinPlating from "../Components/TinPlating";
import MetalPlating from "../Components/MetalPlating";
import AntiqueFinish from "../Components/AntiqueFinish";
import { SERVICES } from "@/data/services";
import ServiceSeoCopy from "@/Components/ServiceSeoCopy";

const SERVICE_VIEWS = {
  powder: PowderCoating,
  galvanizing: Galvanizing,
  electroplating: Electroplating,
  tin: TinPlating,
  metal: MetalPlating,
  antique: AntiqueFinish,
};

const ICONS = {
  powder: Brush,
  galvanizing: ShieldCheck,
  electroplating: Zap,
  tin: Factory,
  metal: Layers,
  antique: Clock,
};

function ServiceNav({ activeSlug }) {
  return (
    <nav aria-label="Services" className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {SERVICES.map((service) => {
        const Icon = ICONS[service.key];
        const active = service.slug === activeSlug;
        return (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className={`flex items-center gap-3 min-w-max md:min-w-0 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              active
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{service.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function ServiceIndex() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <Header />
      <main className="pt-36 pb-20">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">
              Powder Coating and Metal Finishing in the UAE
            </h1>
            <p className="text-gray-600">
              Best powder coating in UAE plus galvanizing, electroplating, tin plating, gold plating and antique finishes from Al-Hadaf Metal Coating in Sharjah — serving Dubai, Ajman and Abu Dhabi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = ICONS[service.key];
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600">
                    {t(`serviceSection.items.${service.key}.title`)}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {t(`serviceSection.items.${service.key}.description`)}
                  </p>
                  <span className="text-sm font-semibold text-red-600">
                    {t("serviceSection.viewMore")}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const router = useRouter();
  const service = SERVICES.find((item) => item.slug === slug);

  if (!slug) return <ServiceIndex />;

  if (!service) {
    return (
      <div className="min-h-screen w-full bg-white text-black">
        <Header />
        <main className="pt-36 pb-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Service not found</h1>
          <Link href="/services" className="text-red-600 font-semibold">
            View all services
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const index = SERVICES.findIndex((item) => item.slug === slug);
  const prev = SERVICES[(index - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(index + 1) % SERVICES.length];
  const Selected = SERVICE_VIEWS[service.key];

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <Header />
      <main className="pt-36 pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              <Link href="/services" className="hover:text-red-600">Services</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-semibold">{service.title}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push(`/services/${prev.slug}`)}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200"
              >
                <ChevronLeft className="w-4 h-4" />
                {prev.title}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/services/${next.slug}`)}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200"
              >
                {next.title}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 shrink-0">
              <ServiceNav activeSlug={slug} />
            </div>
            <div className="flex-1 min-w-0">
              <Selected />
              <ServiceSeoCopy service={service} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
