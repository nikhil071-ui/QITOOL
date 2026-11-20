import { siteName, siteUrl } from "./site";

export type BreadcrumbItem = { label: string; href?: string };

export function homeStructuredData() {
  if (!siteUrl) return null;
  const homeUrl = `${siteUrl}/`;
  const organizationId = `${homeUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        slogan: "Smart Tools. Simple Life.",
        url: homeUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/brand/logo-icon.png`,
          width: 1024,
          height: 1024,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: siteName,
        inLanguage: "en",
        url: homeUrl,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function breadcrumbStructuredData(crumbs: BreadcrumbItem[]) {
  const origin = siteUrl;
  if (!origin || crumbs.length === 0) return null;

  const items = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, origin).toString() } : {}),
    })),
  };
}

export function toolStructuredData(slug: string, name: string, description: string) {
  if (!siteUrl) return null;
  const url = new URL(`/tools/${slug}`, siteUrl).href;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    url, name, description,
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0 },
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</gu, "\\u003c")
    .replace(/\u2028/gu, "\\u2028")
    .replace(/\u2029/gu, "\\u2029");
}
