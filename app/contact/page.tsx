import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { MessageCircle } from "lucide-react";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Contact Us", "Check the current status of email contact for calculator errors, corrections, accessibility issues, privacy concerns, and general feedback.", "/contact");

export default function ContactPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell">
        <PageIntro title="Contact QITOOL." description="Email contact for calculator errors, content corrections, accessibility issues, privacy concerns and general feedback is pending mailbox verification and testing." crumbs={[{ label: "Contact us" }]} />
        <section className="contact-card">
          <div className="contact-card-icon"><MessageCircle size={22} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">CONTACT QITOOL</p>
            <h2>Email contact is pending mailbox verification and testing</h2>
            <p>Email contact is not currently available. We will publish an address here only after the mailbox is verified for sending and receiving messages. In the meantime, each <Link href="/tools">tool guide</Link> explains how to check its inputs and results.</p>
          </div>
        </section>
        <p className="contact-privacy-note">See the <Link href="/privacy-policy">privacy policy</Link> for information about tool inputs and hosting logs.</p>
      </div>
    </main>
  );
}
