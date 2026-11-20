import type { Metadata } from "next";

export const siteName = "QITOOL";
export const siteDescription =
  "Use 15 free browser tools to calculate ages and percentages, estimate an Indian loan EMI, check word counts, convert units or compress images.";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function resolveSiteOrigin(value?: string): string | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL, such as the real production origin.");
  }
  if (!new Set(["https:", "http:"]).has(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an http(s) origin without credentials, a path, a query, or a fragment.");
  }
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }
  return url.origin;
}

export const siteUrl = resolveSiteOrigin(configuredUrl);

const configuredAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
if (configuredAnalyticsId && !/^G-[A-Z0-9]+$/u.test(configuredAnalyticsId)) {
  throw new Error("NEXT_PUBLIC_GA_MEASUREMENT_ID must be a Google Analytics 4 measurement ID such as G-ABC123XYZ.");
}
export const googleAnalyticsId = configuredAnalyticsId || null;

const configuredContactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
if (configuredContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredContactEmail)) {
  throw new Error("NEXT_PUBLIC_CONTACT_EMAIL must be a valid public email address.");
}
export const contactEmail = configuredContactEmail || null;

export const publisherName = process.env.NEXT_PUBLIC_PUBLISHER_NAME?.trim() || null;

const socialImage = "/opengraph-image.png";

export function pageMetadata(title: string, description: string, path: string, options?: { noIndex?: boolean; absoluteTitle?: boolean }): Metadata {
  const socialTitle = options?.absoluteTitle ? title : `${title} | ${siteName}`;
  const canonicalUrl = siteUrl && path ? new URL(path, siteUrl).toString() : undefined;
  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      type: "website",
      siteName,
      title: socialTitle,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(siteUrl ? { images: [{ url: new URL(socialImage, siteUrl).toString(), width: 1200, height: 630, alt: `${siteName} — practical online tools` }] } : {}),
    },
    twitter: {
      card: siteUrl ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      ...(siteUrl ? { images: [new URL(socialImage, siteUrl).toString()] } : {}),
    },
    ...(options?.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
