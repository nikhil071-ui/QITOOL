import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight,
  MousePointer2, QrCode, Ruler, ShieldCheck, Type, WandSparkles, Zap,
} from "lucide-react";
import { ToolDirectory } from "@/components/tool-directory";
import { FeaturedTools } from "@/components/featured-tools";
import { JsonLd } from "@/components/json-ld";
import { toolCategories } from "@/lib/tools";
import { pageMetadata, siteDescription } from "@/lib/site";
import { homeStructuredData } from "@/lib/structured-data";

export const metadata = pageMetadata("Free Online Calculators and Browser Tools | QITOOL", siteDescription, "/", { absoluteTitle: true });

const benefits = [
  { icon: Zap, title: "Quick by design", copy: "Useful answers without the extra steps." },
  { icon: ShieldCheck, title: "Privacy minded", copy: "Tools process inputs in your browser without an account." },
  { icon: WandSparkles, title: "Easy to understand", copy: "Clear inputs, helpful context, and readable results." },
];

const faqs = [
  { question: "What is QITOOL?", answer: "QITOOL is a collection of practical online tools for everyday calculations, text tasks, image needs, password and QR generation, and unit conversions." },
  { question: "Are the tools free to use?", answer: "Yes. QITOOL's current tools are free to use, with no account required." },
  { question: "Do I need to create an account?", answer: "No. The tools work in your browser without an account. Inputs are not saved by QITOOL." },
];

export default function HomePage() {
  const homepageSchema = homeStructuredData();
  return (
    <main id="main-content">
      {homepageSchema && <JsonLd data={homepageSchema} />}
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-shell page-shell">
          <div className="hero-copy">
            <Image src="/brand/logo.png" alt="QITOOL – Smart Tools. Simple Life." width={1800} height={520} className="homepage-brand-logo logo-on-light" sizes="(max-width: 700px) 70vw, 300px" />
            <Image src="/brand/logo-dark.png" alt="QITOOL – Smart Tools. Simple Life." width={1800} height={520} className="homepage-brand-logo logo-on-dark" sizes="(max-width: 700px) 70vw, 300px" />
            <p className="hero-kicker"><span className="hero-kicker-icon"><Zap size={13} aria-hidden="true" /></span> YOUR EVERYDAY DIGITAL TOOLKIT</p>
            <h1>Free calculators <br /><span>and everyday tools.</span></h1>
            <p className="hero-description">Calculate dates and loan payments, count words, convert units or compress an image. Choose a tool to get started.</p>
            <div className="hero-actions">
              <Link href="/tools" className="button-primary">Explore All Tools <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/about" className="button-secondary">Discover QITOOL <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="hero-note"><span className="hero-note-check"><Check size={12} aria-hidden="true" /></span><span>Useful, uncomplicated, and made for real life.</span></div>
          </div>

          <div className="hero-visual" aria-label="A sample percentage calculation result">
            <div className="hero-orb hero-orb-cyan" aria-hidden="true" />
            <div className="hero-orb hero-orb-purple" aria-hidden="true" />
            <div className="visual-orbit orbit-one" aria-hidden="true" />
            <div className="visual-orbit orbit-two" aria-hidden="true" />
            <div className="hero-prism prism-one" aria-hidden="true" />
            <div className="hero-prism prism-two" aria-hidden="true" />
            <div className="float-pill float-pill-top"><span className="float-pill-icon float-blue"><Check size={14} /></span> A clear result</div>
            <div className="floating-tool floating-tool-qr"><span><QrCode size={18} aria-hidden="true" /></span><strong>QR Studio</strong><small>Make a code</small></div>
            <div className="floating-tool floating-tool-convert"><span><Ruler size={18} aria-hidden="true" /></span><strong>Unit Converter</strong><small>Switch units</small></div>
            <div className="floating-tool floating-tool-text"><span><Type size={17} aria-hidden="true" /></span><strong>Text tools</strong></div>
            <div className="preview-card">
              <div className="preview-card-head">
                <span className="preview-icon"><span>%</span></span>
                <span><strong>Percentage</strong><small>Quick example</small></span>
                <span className="preview-more" aria-hidden="true">•••</span>
              </div>
              <div className="preview-question">What is <strong>20%</strong> of <strong>250</strong>?</div>
              <div className="preview-result-row"><span>Answer</span><strong>50</strong></div>
              <div className="preview-rule" />
              <div className="preview-foot"><span><span className="preview-dot" /> Example result</span><span>20% × 250</span></div>
            </div>
            <div className="float-pill float-pill-bottom"><span className="float-pill-icon float-green"><ShieldCheck size={15} /></span> No sign-up needed</div>
            <div className="visual-sparkle sparkle-a" aria-hidden="true">✳</div>
            <div className="visual-sparkle sparkle-b" aria-hidden="true">✦</div>
          </div>
        </div>
        <a className="scroll-cue" href="#tools"><span>Explore the toolkit</span><ArrowDown size={15} aria-hidden="true" /></a>
      </section>

      <FeaturedTools />

      <section className="toolkit-section section-pad" id="tools">
        <div className="page-shell">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> THE FULL COLLECTION</p>
              <h2>Find the right tool for the task.</h2>
              <p className="section-description">Search, filter by category, and open any tool right away.</p>
            </div>
            <Link href="/tools" className="inline-link">View all tools <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <ToolDirectory />
        </div>
      </section>

      <section className="categories-section section-pad" id="categories">
        <div className="page-shell">
          <div className="section-heading section-heading-centered">
            <p className="eyebrow"><span className="eyebrow-line" /> A PLACE FOR EVERY TASK <span className="eyebrow-line" /></p>
            <h2>Tools and guides by category</h2>
            <p className="section-description">Browse a category for tools and worked examples, from checking a GST-inclusive price to fitting an image within a file limit.</p>
          </div>
          <div className="category-grid">
            {toolCategories.slice(1).map((category, index) => {
              const descriptions: Record<string, string> = {
                calculators: "Everyday numbers, dates, and decisions",
                text: "Writing helpers that keep things moving",
                images: "Helpful tools for common image tasks",
                productivity: "Small utilities for a smoother workflow",
                converters: "Quick conversions with clear units",
              };
              const categoryIcon = String(index + 1).padStart(2, "0");
              return (
                <Link href={category.href} key={category.id} className={`category-card category-card-${category.id}`}>
                  <span className="category-index">{categoryIcon}</span>
                  <span className="category-arrow"><ArrowUpRight size={17} aria-hidden="true" /></span>
                  <div className="category-card-text"><h3>{category.label}</h3><p>{descriptions[category.id]}</p></div>
                  <span className="category-bottom-link">Browse category <ChevronRight size={14} aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="why-section section-pad">
        <div className="page-shell why-layout">
          <div className="why-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> OUR PROMISE</p>
            <h2>Useful should feel simple.</h2>
            <p>We think the best tools get out of your way. Each tool answers a practical question, explains its result, and keeps the next step clear.</p>
            <Link href="/about" className="inline-link">A little more about us <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="benefit-list">
            {benefits.map(({ icon: Icon, title, copy }, index) => (
              <div className="benefit-item" key={title}>
                <span className={`benefit-icon benefit-icon-${index}`}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="benefit-copy"><strong>{title}</strong><span>{copy}</span></span>
                <span className="benefit-check"><Check size={14} aria-hidden="true" /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section section-pad">
        <div className="page-shell faq-layout">
          <div className="faq-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> GOOD TO KNOW</p>
            <h2>A few quick answers.</h2>
            <p>Want to know how we think about the toolkit?</p>
            <Link href="/contact" className="inline-link">Get in touch <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details className="faq-item" key={faq.question} open={index === 0}>
                <summary><span>{faq.question}</span><span className="faq-toggle" aria-hidden="true"><span /><span /></span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-pattern" aria-hidden="true" />
        <div className="page-shell closing-content">
          <span className="closing-icon"><MousePointer2 size={19} aria-hidden="true" /></span>
          <Image src="/brand/logo-dark.png" alt="" width={1800} height={520} className="closing-brand-logo" sizes="(max-width: 700px) 68vw, 290px" />
          <p className="eyebrow">MAKE ROOM FOR WHAT MATTERS</p>
          <h2>Less figuring out.<br /><span>More getting done.</span></h2>
          <Link href="/tools" className="button-primary button-light">Explore QITOOL <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
