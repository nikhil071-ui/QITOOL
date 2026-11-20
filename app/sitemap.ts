import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";
import { toolCategories, tools } from "../lib/tools";

const routes = [
  "/", "/about", "/contact", "/privacy-policy", "/disclaimer", "/terms",
  ...toolCategories.map(category => category.href),
  ...tools.map(tool => `/tools/${tool.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl;
  if (!origin) return [];
  return routes.map((route) => ({ url: new URL(route, origin).toString() }));
}
