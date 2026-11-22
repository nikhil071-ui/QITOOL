import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { googleAnalyticsId, siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "QITOOL – Smart Tools. Simple Life.",
    template: "%s | QITOOL",
  },
  description: siteDescription,
  applicationName: siteName,
  other: {
    "google-adsense-account": "ca-pub-4649521973867824",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName,
    title: "QITOOL – Smart Tools. Simple Life.",
    description: siteDescription,
    ...(siteUrl ? {
      url: `${siteUrl}/`,
      images: [{ url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, alt: "QITOOL - Smart Tools. Simple Life." }],
    } : {}),
  },
  twitter: {
    card: siteUrl ? "summary_large_image" : "summary",
    title: "QITOOL – Smart Tools. Simple Life.",
    description: siteDescription,
    ...(siteUrl ? { images: [`${siteUrl}/opengraph-image.png`] } : {}),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071B3D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {googleAnalyticsId && <Script src="/ga-consent-init.js" strategy="beforeInteractive" />}
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
