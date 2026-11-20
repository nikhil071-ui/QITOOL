import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { PageIntro } from "@/components/page-intro";
import { ToolDirectory } from "@/components/tool-directory";
import { categoryGuides } from "@/lib/category-guides";
import { pageMetadata } from "@/lib/site";
import { categoryDescriptions, categoryLabels, toolCategories, type ToolCategoryId } from "@/lib/tools";

const categories = toolCategories.filter((category) => category.id !== "all").map((category) => category.id) as ToolCategoryId[];
const titles: Record<ToolCategoryId, string> = {
  calculators: "Online Calculators for Dates, Money and BMI",
  text: "Word and Character Counting Tools",
  images: "Image Compression and QR Code Tools",
  productivity: "Typing Practice and Password Tools",
  converters: "Measurement and Unit Converters",
};

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!categories.includes(category as ToolCategoryId)) return { title: "Category not found", robots: { index: false, follow: true } };
  const typedCategory = category as ToolCategoryId;
  return pageMetadata(titles[typedCategory], categoryDescriptions[typedCategory], `/tools/category/${typedCategory}`);
}

export default async function ToolCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.includes(category as ToolCategoryId)) notFound();
  const typedCategory = category as ToolCategoryId;
  return (
    <main id="main-content" className="inner-page">
      <div className="page-shell">
        <PageIntro title={titles[typedCategory]} description={categoryDescriptions[typedCategory]} eyebrow="BROWSE BY CATEGORY" crumbs={[{ label: "All tools", href: "/tools" }, { label: categoryLabels[typedCategory] }]} />
        <div className="inner-directory">
          <h2 className="sr-only">Tools in this category</h2>
          <ToolDirectory key={typedCategory} initialCategory={typedCategory} />
        </div>
        <div className="tool-guide-grid">
          {categoryGuides[typedCategory].map(lesson => (
            <section key={lesson.id} id={lesson.id} className="tool-guide-card">
              <h2>{lesson.title}</h2>
              {lesson.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {lesson.source && <p><a className="inline-link" href={lesson.source.url}>{lesson.source.label}</a></p>}
              {lesson.tools.map(link => <p key={link.slug}><Link className="inline-link" href={`/tools/${link.slug}`}>{link.label}</Link></p>)}
            </section>
          ))}
        </div>
        <AdSlot route={`/tools/category/${typedCategory}`} placement="category-after-guides" />
      </div>
    </main>
  );
}
