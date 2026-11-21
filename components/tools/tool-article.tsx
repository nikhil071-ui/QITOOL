import Link from "next/link";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { PageIntro } from "@/components/page-intro";
import { ToolInterface } from "@/components/tools/tool-interface";
import { JsonLd } from "@/components/json-ld";
import { categoryGuides } from "@/lib/category-guides";
import { calculateLoanTenureComparison, formatAmount } from "@/lib/calculations";
import { toolStructuredData } from "@/lib/structured-data";
import { categoryLabels, toolCategories, tools as toolList, type ToolInfo } from "@/lib/tools";
import type { ToolArticle } from "@/lib/tool-content";

const toolsBySlug: Record<string, ToolInfo> = Object.fromEntries(toolList.map((tool) => [tool.slug, tool]));

function EmiExampleTable({ principal, annualRatePercent, tenures }: NonNullable<ToolArticle["example"]["loanComparison"]>) {
  const loans = calculateLoanTenureComparison(principal, annualRatePercent, tenures);
  return (
    <>
      <div className="schedule-table-wrap">
        <table className="schedule-table">
          <caption className="sr-only">Estimated EMI, total interest and total repayment by loan tenure</caption>
          <thead>
            <tr>
              <th scope="col">Tenure</th>
              <th scope="col">Monthly EMI</th>
              <th scope="col">Total interest</th>
              <th scope="col">Total repayment</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.inputs.months}>
                <th scope="row">{loan.inputs.months} months</th>
                <td>{formatAmount(loan.monthlyPayment)}</td>
                <td>{formatAmount(loan.totalInterest)}</td>
                <td>{formatAmount(loan.totalPayment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link className="inline-link" href="/tools/loan-calculator">Inspect one loan’s monthly repayment schedule</Link>
    </>
  );
}

export function ToolArticlePage({ tool, article }: { tool: ToolInfo; article: ToolArticle }) {
  const categoryHref = toolCategories.find((category) => category.id === tool.category)?.href ?? "/tools";
  const relatedTools = article.related.map((slug) => toolsBySlug[slug]).filter((tool): tool is ToolInfo => Boolean(tool));
  const lesson = categoryGuides[tool.category].find(item => item.tools.some(link => link.slug === tool.slug));
  const application = toolStructuredData(tool.slug, tool.name, article.introduction);

  return (
    <main id="main-content" className="inner-page tool-detail-page">
      <div className="page-shell">
        {application && <JsonLd data={application} />}
        <PageIntro
          title={article.seoTitle}
          description={article.introduction}
          eyebrow={`${categoryLabels[tool.category].toUpperCase()} · FREE ONLINE TOOL`}
          crumbs={[{ label: "All tools", href: "/tools" }, { label: categoryLabels[tool.category], href: categoryHref }, { label: tool.name }]}
        />

        <div className="tool-workspace">
          <section className="tool-app-card" aria-labelledby="tool-app-heading">
            <div className="tool-app-card-heading">
              <div><p className="eyebrow">YOUR TOOL</p><h2 id="tool-app-heading">{tool.name}</h2></div>
              <span className="tool-local-badge"><CheckCircle2 size={14} aria-hidden="true" />Runs in your browser</span>
            </div>
            <ToolInterface slug={tool.slug} />
          </section>
          <aside className="tool-privacy-callout"><span><Info size={16} aria-hidden="true" /></span><p><strong>Private by design</strong> Inputs and results stay on this device. QITOOL does not save them.</p></aside>
        </div>

        <div className="tool-guide-grid">
          <section className="tool-guide-card"><p className="eyebrow">THE PURPOSE</p><h2>What this tool does</h2><p>{article.whatItDoes}</p></section>
          <section className="tool-guide-card"><p className="eyebrow">STEP BY STEP</p><h2>How to use it</h2><ol className="tool-instructions">{article.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></section>
          <section className="tool-guide-card tool-example-card">
            <p className="eyebrow">PRACTICAL EXAMPLE</p>
            <h2>{article.example.title}</h2>
            <p>{article.example.details}</p>
            {article.example.loanComparison && <EmiExampleTable {...article.example.loanComparison} />}
          </section>
          <section className="tool-guide-card">
            <p className="eyebrow">UNDERSTANDING THE OUTPUT</p><h2>What the result means</h2>
            <p>{article.resultExplanation}</p>
            {lesson && <Link className="inline-link" href={`${categoryHref}#${lesson.id}`}>{lesson.title}</Link>}
          </section>
        </div>

        <AdSlot route={`/tools/${tool.slug}`} placement="tool-after-guide" />

        <section className="tool-common-mistakes" aria-labelledby="common-mistakes-heading">
          <div className="tool-section-heading"><p className="eyebrow">CHECK YOUR INPUTS</p><h2 id="common-mistakes-heading">Common mistakes to avoid</h2></div>
          <ul className="common-mistakes-list">{article.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
        </section>

        <section className="tool-faq-section" aria-labelledby="tool-faq-heading">
          <div className="tool-section-heading"><p className="eyebrow">COMMON QUESTIONS</p><h2 id="tool-faq-heading">Frequently asked questions</h2></div>
          <div className="faq-list">{article.faqs.map((faq) => <details className="faq-item" key={faq.question}><summary><span>{faq.question}</span><span className="faq-toggle" aria-hidden="true"><span /><span /></span></summary><p>{faq.answer}</p></details>)}</div>
        </section>

        <section className="related-tools-section" aria-labelledby="related-tools-heading">
          <div className="tool-section-heading"><p className="eyebrow">KEEP EXPLORING</p><h2 id="related-tools-heading">Related tools</h2></div>
          <div className="related-tools-grid">{relatedTools.map((related) => <Link className="related-tool-card" href={`/tools/${related.slug}`} key={related.slug}><span>{categoryLabels[related.category]}</span><strong>{related.name}</strong><p>{related.description}</p><b>Open tool <ArrowRight size={14} aria-hidden="true" /></b></Link>)}</div>
        </section>
      </div>
    </main>
  );
}

