import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { pageMetadata, publisherName } from "@/lib/site";

export const metadata = pageMetadata("Terms and Conditions", "Read the terms for using QITOOL’s website, online tools, and general informational content.", "/terms");

export default function TermsPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Terms & conditions" description="These terms explain the basic expectations for using QITOOL." crumbs={[{ label: "Terms & conditions" }]} />
        <article className="prose-card legal-copy">
          <p className="legal-updated">Last updated: November 22, 2026</p>
          <h2>Using the site</h2>
          <p>You may use QITOOL for lawful, personal, and business purposes. Do not misuse the site, interfere with its operation, attempt unauthorized access, or use it in a way that violates applicable law.</p>
          <h2>Tools and information</h2>
          <p>Tools and content are offered for general informational convenience. Read the <Link href="/disclaimer">full disclaimer</Link> and check important outputs independently before relying on them.</p>
          <h2>Availability and changes</h2>
          <p>We may add, update, or remove pages and features as the site develops. We aim to keep the site available, but do not promise uninterrupted service.</p>
          <h2>Ownership</h2>
          <p>{publisherName} publishes QITOOL. Unless stated otherwise, the site owner retains the rights to the QITOOL name, site design, and original content. Use the <Link href="/contact">Contact page</Link> to request permission before copying or redistributing substantial portions of the site.</p>
          <h2>Contact and updates</h2>
          <p>Changes to these terms appear here with an updated date. For questions about QITOOL or its tools, contact us using the email address on the <Link href="/contact">Contact page</Link>.</p>
        </article>
      </div>
    </main>
  );
}
