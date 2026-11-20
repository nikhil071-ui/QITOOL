import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Terms and Conditions", "Read the terms for using QITOOL’s website, online tools, and general informational content.", "/terms");

export default function TermsPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Terms & conditions" description="These terms explain the basic expectations for using QITOOL." crumbs={[{ label: "Terms & conditions" }]} />
        <article className="prose-card legal-copy">
          <p className="legal-updated">Last updated: November 20, 2026</p>
          <h2>Using the site</h2>
          <p>You may use QITOOL for lawful, personal, and business purposes. Do not misuse the site, interfere with its operation, attempt unauthorized access, or use it in a way that violates applicable law.</p>
          <h2>Tools and information</h2>
          <p>Tools and content are offered for general informational convenience. Read the disclaimer and check important outputs independently before relying on them.</p>
          <h2>Availability and changes</h2>
          <p>We may add, update, or remove pages and features as the site develops. We aim to keep the site available, but do not promise uninterrupted service.</p>
          <h2>Ownership</h2>
          <p>Unless stated otherwise, the QITOOL name, site design, and original content belong to the site owner. Do not copy or redistribute substantial portions of the site without permission.</p>
          <h2>Contact and updates</h2>
          <p>Changes to these terms appear here with an updated date. For questions about using the tools, visit <Link href="/contact">Contact QITOOL</Link>.</p>
        </article>
      </div>
    </main>
  );
}
