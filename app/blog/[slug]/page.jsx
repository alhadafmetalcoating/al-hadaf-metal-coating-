import ContentArticle from "@/views/ContentArticle";
import { articleJsonLd, loadArticle } from "@/lib/article";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { path, seo } = await loadArticle("blog", slug);
  return pageMetadata(path, seo);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const loaded = await loadArticle("blog", slug);
  const jsonLd = articleJsonLd("blog", loaded.item, loaded.seo, loaded.path);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentArticle type="blog" />
    </>
  );
}
