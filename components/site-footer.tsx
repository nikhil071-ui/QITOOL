import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { toolCategories } from "@/lib/tools";
import { AnalyticsPreferences } from "@/components/analytics-consent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand-column">
          <Link href="/" className="brand footer-brand" aria-label="QITOOL home">
            <Image src="/brand/logo.png" alt="" width={1800} height={520} className="brand-logo brand-logo-horizontal logo-on-light footer-logo-light" sizes="180px" />
            <Image src="/brand/logo-dark.png" alt="" width={1800} height={520} className="brand-logo brand-logo-horizontal logo-on-dark footer-logo-dark" sizes="180px" />
          </Link>
        </div>
        <div className="footer-link-group">
          <h2>Explore</h2>
          <Link href="/tools">All tools <ArrowUpRight size={13} aria-hidden="true" /></Link>
          {toolCategories.slice(1).map((category) => <Link key={category.id} href={category.href}>{category.label}</Link>)}
        </div>
        <div className="footer-link-group">
          <h2>QITOOL</h2>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {new Date().getFullYear()} QITOOL.</span>
        <AnalyticsPreferences />
        <span className="footer-note"><span aria-hidden="true" /> Built for clarity, privacy, and everyday use.</span>
      </div>
    </footer>
  );
}
