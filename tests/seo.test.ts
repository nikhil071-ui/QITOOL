import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { toolCategories, tools } from "../lib/tools";

// Use a loopback origin in this isolated test worker. No public domain is needed.
const origin = "https://127.0.0.1:44321";
process.env.NEXT_PUBLIC_SITE_URL = origin;

test("sitemap, robots, canonical and Open Graph metadata share all public canonical routes", async () => {
  const { default: sitemap } = await import("../app/sitemap");
  const { default: robots } = await import("../app/robots");
  const { pageMetadata } = await import("../lib/site");
  const paths = ["/", "/tools", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer",
    ...tools.map(tool => `/tools/${tool.slug}`),
    ...toolCategories.filter(category => category.id !== "all").map(category => `/tools/category/${category.id}`)];
  assert.equal(paths.length, 27);
  assert.deepEqual(sitemap().map(entry => entry.url).sort(), paths.map(path => origin + path).sort());
  assert.equal(robots().sitemap, origin + "/sitemap.xml");
  for (const path of paths) {
    const metadata = pageMetadata("Title", "Description", path);
    assert.equal(metadata.alternates?.canonical, origin + path);
    assert.equal(metadata.openGraph?.url, origin + path);
    assert.deepEqual(metadata.openGraph?.images, [{
      url: origin + "/opengraph-image.png", width: 1200, height: 630, alt: "QITOOL — practical online tools",
    }]);
  }
  assert.equal(pageMetadata("Page Not Found", "Missing", "", { noIndex: true }).alternates, undefined);
});

test("structured data links the organization to the website and mirrors the visible breadcrumb sequence", async () => {
  const { homeStructuredData, breadcrumbStructuredData, serializeJsonLd } = await import("../lib/structured-data");
  const graph = homeStructuredData()?.["@graph"];
  assert.ok(graph);
  assert.deepEqual(graph.map(node => node["@type"]), ["Organization", "WebSite"]);
  assert.equal(graph[1].publisher?.["@id"], graph[0]["@id"]);
  assert.equal(graph[0].logo?.url, origin + "/brand/logo-icon.png");
  const crumbs = [{ label: "All tools", href: "/tools" }, { label: "Calculators", href: "/tools/category/calculators" }, { label: "EMI Calculator" }];
  const data = breadcrumbStructuredData(crumbs);
  assert.equal(data?.["@type"], "BreadcrumbList");
  assert.deepEqual(data?.itemListElement.map(({ name, position, item }) => [name, position, item]), [
    ["Home", 1, origin + "/"], ["All tools", 2, origin + "/tools"],
    ["Calculators", 3, origin + "/tools/category/calculators"], ["EMI Calculator", 4, undefined],
  ]);
  assert.equal(breadcrumbStructuredData([]), null);
  const label = "An example </script>";
  assert.ok(!serializeJsonLd({ label }).includes("<"));
  assert.deepEqual(JSON.parse(serializeJsonLd({ label })), { label });
});

test("missing production origin emits no domain-dependent metadata or discovery URLs", () => {
  const check = spawnSync(process.execPath, ["-e", `
    const assert = require("node:assert/strict");
    const { siteUrl, pageMetadata } = require("./.test-dist/lib/site");
    assert.equal(siteUrl, null);
    assert.equal(pageMetadata("Home", "Description", "/").alternates, undefined);
    assert.equal(require("./.test-dist/lib/structured-data").homeStructuredData(), null);
    assert.equal(require("./.test-dist/lib/structured-data").toolStructuredData("word-counter", "Word Counter", "Count words"), null);
    assert.deepEqual(require("./.test-dist/app/sitemap").default(), []);
    assert.equal(require("./.test-dist/app/robots").default().sitemap, undefined);
  `], { encoding: "utf8", env: { ...process.env, NEXT_PUBLIC_SITE_URL: "" } });
  assert.equal(check.status, 0, check.stderr);
});

test("each WebApplication uses the visible tool name and introduction on its canonical URL", async () => {
  const { toolStructuredData } = await import("../lib/structured-data");
  const { getToolArticle } = await import("../lib/tool-content");
  for (const tool of tools) {
    const article = getToolArticle(tool);
    const entity = toolStructuredData(tool.slug, tool.name, article.introduction);
    assert.equal(entity?.["@type"], "WebApplication");
    assert.equal(entity.name, tool.name);
    assert.equal(entity.description, article.introduction);
    assert.equal(entity.url, `${origin}/tools/${tool.slug}`);
    assert.equal(entity.publisher["@id"], `${origin}/#organization`);
    assert.equal(entity.isAccessibleForFree, true);
    assert.equal(entity.offers.price, 0);
    assert.ok(!("aggregateRating" in entity) && !("review" in entity));
  }
});
