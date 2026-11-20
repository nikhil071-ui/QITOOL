import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolArticlePage } from "@/components/tools/tool-article";
import { getToolArticle } from "@/lib/tool-content";
import { tools } from "@/lib/tools";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };
  const article = getToolArticle(tool);
  return pageMetadata(article.seoTitle, article.seoDescription, `/tools/${tool.slug}`);
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  return <ToolArticlePage tool={tool} article={getToolArticle(tool)} />;
}
