import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Mail, MessageCircle } from "lucide-react";
import { contactEmail, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Contact Us", "Contact QITOOL by email about calculator errors, content corrections, accessibility issues, privacy concerns, or general feedback.", "/contact");

export default function ContactPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Contact QITOOL." description="Email QITOOL about calculator errors, content corrections, accessibility issues, privacy concerns, or general feedback." crumbs={[{ label: "Contact us" }]} />
        <section className="contact-card">
          <div className="contact-card-icon"><MessageCircle size={22} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">CONTACT QITOOL</p>
            <h2>Email the QITOOL team</h2>
            <p>For a correction, include the page or tool name, a non-sensitive example, the result you saw and the result you expected. Leave out passwords, account numbers and other sensitive information.</p>
            <div className="contact-detail"><Mail size={16} aria-hidden="true" /><a className="inline-link" href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
          </div>
        </section>
        <p className="contact-privacy-note">If you email us, we handle the information you send to respond to your enquiry. See the <Link href="/privacy-policy">privacy policy</Link> for details.</p>
      </div>
    </main>
  );
}
