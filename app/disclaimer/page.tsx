import { PageIntro } from "@/components/page-intro";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Online Tool Estimates and Disclaimer", "Understand the assumptions, limitations, and intended general-purpose use of QITOOL tools and content.", "/disclaimer");

export default function DisclaimerPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Disclaimer" description="A few notes about estimates, information, and responsible use of online tools." crumbs={[{ label: "Disclaimer" }]} />
        <article className="prose-card legal-copy">
          <p className="legal-updated">Last updated: November 22, 2026</p>
          <h2>General information</h2>
          <p>QITOOL provides general-purpose tools and explanatory content. Information and outputs are offered for general convenience and may not fit every situation.</p>
          <h2>Estimates and decisions</h2>
          <p>Some results, including loan estimates and body mass index calculations, are based on the inputs and assumptions described on each tool page. They are not financial, medical, legal, or other professional advice. Check important results with a qualified professional or authoritative source before making a decision.</p>
          <h2>Accuracy and availability</h2>
          <p>We work to make each tool clear and accurate, but outputs may contain errors or may not fit every situation. Availability and behavior can change as the website is improved. You are responsible for checking whether a result suits your use.</p>
          <h2>External links and advertising</h2>
          <p>QITOOL links to external references, including CDC guidance on adult BMI, GST Council rate notifications, and NIST unit-conversion factors. The organizations that publish those resources maintain their content. QITOOL currently displays no advertising.</p>
        </article>
      </div>
    </main>
  );
}
