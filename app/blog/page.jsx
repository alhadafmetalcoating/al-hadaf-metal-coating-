import { Suspense } from "react";
import BlogDisplay from "@/views/BlogDisplay";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/blog");

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BlogDisplay />
    </Suspense>
  );
}
