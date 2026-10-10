import ContentArticle from "@/views/ContentArticle";
import { findSheetItem, excerpt } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fallbackTitle = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Blog";
  try {
    const item = await findSheetItem("blog", slug);
    if (item) {
      const title = `${item.Title} | Powder Coating UAE | Al-Hadaf`;
      return pageMetadata(`/blog/${slug}`, {
        title,
        description:
          excerpt(item.Content) ||
          `${item.Title} — powder coating and metal finishing article from Al-Hadaf Metal Coating in Sharjah, UAE.`,
      });
    }
  } catch {
    // Fall through to slug-based title if the sheet is unreachable.
  }
  return pageMetadata(`/blog/${slug}`, {
    title: `${fallbackTitle} | Powder Coating UAE | Al-Hadaf`,
    description:
      "Powder coating and metal finishing article from Al-Hadaf Metal Coating LLC in Sharjah, Dubai and the UAE.",
  });
}

export default function Page() {
  return <ContentArticle type="blog" />;
}
