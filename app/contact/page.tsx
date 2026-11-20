import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Mail, MessageCircle } from "lucide-react";
import { contactEmail, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Contact Us", "Contact QITOOL about tool errors, content corrections, privacy questions, or accessibility feedback.", "/contact");

export default function ContactPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Contact QITOOL." description="Get help with a tool, report a calculation error, or ask about privacy and accessibility." crumbs={[{ label: "Contact us" }]} />
        <section className="contact-card">
          <div className="contact-card-icon"><MessageCircle size={22} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">CONTACT QITOOL</p>
            <h2>{contactEmail ? "Email the QITOOL team" : "Email support is unavailable"}</h2>
            {contactEmail ? <>
              <p>For a correction, include the tool name, a non-sensitive example and the result you expected. Please leave out passwords, account numbers and private documents.</p>
              <div className="contact-detail"><Mail size={16} aria-hidden="true" /><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
            </> : <p>A public email address is currently unavailable. Each <Link href="/tools">tool guide</Link> explains its inputs and results. The <Link href="/privacy-policy">privacy policy</Link> explains how your data is handled.</p>}
          </div>
        </section>
        <p className="contact-privacy-note">If you email us, your message and address are processed by your email provider and the recipient’s email provider. See the <Link href="/privacy-policy">privacy policy</Link> for more about hosting logs and site data.</p>
      </div>
    </main>
  );
}
