import ContentArticle from "@/views/ContentArticle";
import { findSheetItem, excerpt } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fallbackTitle = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Project";
  try {
    const item = await findSheetItem("project", slug);
    if (item) {
      return pageMetadata(`/projects/${slug}`, {
        title: `${item.Title} | Powder Coating Project UAE | Al-Hadaf`,
        description:
          excerpt(item.Content) ||
          `${item.Title} — completed powder coating project by Al-Hadaf Metal Coating in Sharjah, UAE.`,
      });
    }
  } catch {
    // Fall through to slug-based title if the sheet is unreachable.
  }
  return pageMetadata(`/projects/${slug}`, {
    title: `${fallbackTitle} | Powder Coating Project UAE | Al-Hadaf`,
    description:
      "Completed powder coating and metal finishing project by Al-Hadaf Metal Coating LLC in the UAE.",
  });
}

export default function Page() {
  return <ContentArticle type="project" />;
}
