import { PageIntro } from "@/components/page-intro";
import Link from "next/link";
import { googleAnalyticsId, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Privacy Policy", "Learn how QITOOL processes tool inputs, stores browser preferences, and handles page requests.", "/privacy-policy");

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Privacy policy" description="What QITOOL’s browser tools process locally and what the hosting provider may receive when you load a page." crumbs={[{ label: "Privacy policy" }]} />
        <article className="prose-card legal-copy">
          <p className="legal-updated">Last updated: November 21, 2026</p>
          <p>This notice covers the information involved when you use a tool or load a page.</p>
          <h2>Information you enter</h2>
          <p>The search, calculators, text counters, typing test, QR generation, password generation, unit conversion, and image processing run in your browser. The application does not send tool inputs or results to a QITOOL application server or persist them in an account or database. Generated passwords remain in page memory until cleared or the page is left. If you copy a result or download a file, your browser or clipboard manager handles that action under its own settings.</p>
          <p>Uploaded images are decoded and processed locally. The page creates temporary browser object URLs for previews and revokes them when they are replaced or the page is closed. Images are not uploaded by the application.</p>
          <h2>Cookies and similar storage</h2>
          <p>The theme preference is saved in your browser’s local storage. If the optional analytics integration is enabled, your choice to accept or decline analytics is also saved there. These settings are not sent to QITOOL’s application server. The hosting provider, content delivery network, or security service may use essential cookies or similar technologies.</p>
          <h2>Hosting and request data</h2>
          <p>To deliver and protect the website, its hosting provider receives network requests. Depending on the provider and configuration, this can include an IP address, requested URL, user-agent and device information, referrer, timestamps, and security events in operational logs. Log contents and retention depend on the hosting service and its settings.</p>
          <h2>Contact email</h2>
          <p>Email contact has not been activated; mailbox verification and sending and receiving tests are still pending. QITOOL does not provide a contact form. The <Link href="/contact">Contact page</Link> gives the current status.</p>
          <h2>Analytics and advertising</h2>
          {googleAnalyticsId
            ? <p>Google Analytics 4 is configured for this deployment but its tag is not loaded unless you choose “Allow analytics.” If enabled, QITOOL sends page-view events containing the page path, page title, and page URL to Google. Google may process browser, device, network, and cookie information under its own terms. You can change your choice using “Analytics preferences” in the footer. A declined choice blocks the tag on later page loads and stops QITOOL’s page-view events for the current page. No advertising scripts, including Google AdSense, are included.</p>
            : <p>This site currently loads no Google Analytics or advertising scripts.</p>}
          <h2>Children and sensitive data</h2>
          <p>QITOOL is a general-purpose website. Do not enter passwords, financial account credentials, or other sensitive personal information into any tool. The password generator creates a password locally; it does not accept or store an existing password.</p>
          <h2>Policy changes</h2>
          <p>Updates appear on this page with a revised date.</p>
        </article>
      </div>
    </main>
  );
}
