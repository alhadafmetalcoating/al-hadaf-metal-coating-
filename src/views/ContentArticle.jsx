"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { ArrowLeft, Building2, User, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchSheetItems, itemSlug, splitImages } from "@/lib/content";

export default function ContentArticle({ type }) {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isProject = type === "project";
  const listHref = isProject ? "/blog?tab=projects" : "/blog";
  const listLabel = isProject ? "All projects" : "All blogs";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setCurrentImageIndex(0);

    fetchSheetItems()
      .then((rows) => {
        if (!active) return;
        const match = rows.find((row) => row.Type === type && itemSlug(row) === slug);
        setItem(match || null);
        if (!match) setError("This page could not be found.");
      })
      .catch(() => {
        if (active) setError("Network error. Check your internet connection.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, type]);

  const images = splitImages(item?.ImageURLs);
  const team = [item?.Member1, item?.Member2, item?.Member3].filter((name) => name && name !== "-");

  const stepImage = (direction) => {
    if (images.length < 2) return;
    setCurrentImageIndex((prev) => (prev + direction + images.length) % images.length);
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      <Header />
      <main className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button asChild className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold">
              <Link href={listHref} className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                {listLabel}
              </Link>
            </Button>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{error}</h1>
              <Link href={listHref} className="text-red-600 font-semibold">
                {listLabel}
              </Link>
            </div>
          )}

          {!loading && item && (
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden rounded-2xl shadow-2xl">
                {images.length > 0 ? (
                  <div className="relative bg-gray-900">
                    <div className="relative w-full pb-[56.25%] bg-gray-800">
                      <img
                        src={images[currentImageIndex]}
                        alt={`${item.Title} — powder coating ${isProject ? "project" : "article"} in UAE, image ${currentImageIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = isProject ? "/assets/default-project.jpg" : "/assets/default-blog.jpg";
                        }}
                      />
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => stepImage(-1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepImage(1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                ) : (
                  <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-500">
                    No images available
                  </div>
                )}

                <div className="p-8 md:p-12 bg-white">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{item.Title}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">{isProject ? "Project lead" : "Author"}</p>
                        <p className="font-bold text-gray-900">{item["Author/Lead"] || "Al-Hadaf Metal Coating"}</p>
                      </div>
                    </div>
                    {isProject && (
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-red-600 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Client</p>
                          <p className="font-bold text-gray-900">{item.Company || "N/A"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Date</p>
                        <p className="font-bold text-gray-900">{item.Timestamp || "N/A"}</p>
                      </div>
                    </div>
                    {isProject && team.length > 0 && (
                      <div className="flex items-start gap-3 md:col-span-3">
                        <Users className="w-5 h-5 text-red-600 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Team</p>
                          <p className="font-bold text-gray-900">{team.join(", ")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{item.Content}</p>
                </div>
              </Card>

              {images.length > 1 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`relative aspect-square rounded-lg overflow-hidden border-4 ${
                          currentImageIndex === index ? "border-red-600" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${item.Title} powder coating UAE thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
