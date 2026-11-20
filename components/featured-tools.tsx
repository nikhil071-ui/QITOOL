import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredToolSlugs, tools } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";

const featuredTools = featuredToolSlugs
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter((tool) => tool !== undefined);

export function FeaturedTools() {
  return (
    <section className="featured-section section-pad" aria-labelledby="featured-heading">
      <div className="page-shell">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> EDITOR PICKS</p>
            <h2 id="featured-heading">A useful place to start.</h2>
            <p className="section-description">A small, curated selection from the full QITOOL collection.</p>
          </div>
          <Link href="/tools" className="inline-link">Explore all tools <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="tool-grid featured-grid">
          {featuredTools.map((tool, index) => <ToolCard key={tool.slug} tool={tool} index={index} />)}
        </div>
      </div>
    </section>
  );
}
