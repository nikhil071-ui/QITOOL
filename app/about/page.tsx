import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Check, Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import { pageMetadata, publisherName } from "@/lib/site";

export const metadata = pageMetadata("About Us", "Learn what QITOOL offers, how its browser-based tools work, and the principles behind clear instructions and privacy-minded design.", "/about");

const values = [
  { icon: Compass, title: "Focused on real tasks", text: "The tools address everyday calculations, text work, conversions, and simple image tasks." },
  { icon: HeartHandshake, title: "Clear about the details", text: "Tool pages explain their inputs, methods, examples, and where an estimate has limits." },
  { icon: ShieldCheck, title: "Care with your information", text: "The current tools run in the browser and do not require an account or upload tool inputs." },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="About QITOOL and its browser tools" description="QITOOL is a collection of free online calculators and utilities for everyday numbers, writing tasks, QR codes, passwords, measurements, and images." crumbs={[{ label: "About us" }]} />
        <article className="prose-card">
          <p className="lead-paragraph">QITOOL brings common tasks into one place: calculators for dates, percentages, health screening, taxes, and loan estimates; text tools for writing and typing practice; and utilities for QR codes, passwords, units, and images.</p>
          <h2>How the tools work</h2>
          <p>The available tools run in the browser and do not require an account. Calculations and text counts explain their assumptions on each page. QR codes and passwords are generated locally; uploaded images are processed on the device. A browser may still keep a file a visitor downloads or data they choose to copy.</p>
          <div className="value-grid">
            {values.map(({ icon: Icon, title, text }) => <div className="value-card" key={title}><span><Icon size={19} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
          <h2>Our approach</h2>
          <p>We aim to make inputs, results, methods, and limitations clear. The site does not use testimonials, ratings, or claims of professional authorship. General-purpose calculations are not a substitute for medical, financial, legal, or other professional advice.</p>
          {publisherName && <p>QITOOL is published by {publisherName}.</p>}
          <p>For corrections, accessibility issues, privacy concerns, or general feedback, check the <Link href="/contact">Contact page</Link> for the current status of email contact.</p>
          <p>QITOOL is not affiliated with Google. The optional Google Analytics integration only loads after a visitor opts in when it has been configured for a deployment. No advertising code is included. The privacy policy describes the analytics choice and data flow.</p>
          <div className="prose-callout"><Check size={17} aria-hidden="true" /><p>Read the <Link href="/privacy-policy">privacy policy</Link> to see what the site and its hosting provider may process.</p></div>
        </article>
      </div>
    </main>
  );
}
