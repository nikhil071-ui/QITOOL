import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Page Not Found",
  "This QITOOL page could not be found. Return to the homepage or browse all available tools.",
  "",
  { noIndex: true },
);

export default function NotFoundPage() {
  return (
    <main id="main-content" className="inner-page content-page">
      <div className="page-shell not-found-page">
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1>We couldn’t find that page.</h1>
        <p className="page-intro-description">The address may be incorrect or the page may have moved. Choose a working route below.</p>
        <div className="not-found-actions">
          <Link href="/" className="button-secondary"><ArrowLeft size={15} aria-hidden="true" />Go to homepage</Link>
          <Link href="/tools" className="button-primary">Browse all tools <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </main>
  );
}
