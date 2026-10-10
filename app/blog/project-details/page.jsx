import { Suspense } from "react";
import ProjectDetails from "@/views/ProjectDetails";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/blog/project-details");

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProjectDetails />
    </Suspense>
  );
}
