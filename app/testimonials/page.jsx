import { Suspense } from "react";
import TestimonialPage from "@/views/TestimonialPage";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/testimonials");

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <TestimonialPage />
    </Suspense>
  );
}
