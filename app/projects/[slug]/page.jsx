import ContentArticle from "@/views/ContentArticle";
import { articleJsonLd, loadArticle } from "@/lib/article";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { path, seo } = await loadArticle("project", slug);
  return pageMetadata(path, seo);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const loaded = await loadArticle("project", slug);
  const jsonLd = articleJsonLd("project", loaded.item, loaded.seo, loaded.path);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentArticle type="project" />
    </>
  );
}
