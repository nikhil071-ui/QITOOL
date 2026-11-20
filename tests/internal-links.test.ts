import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import test from "node:test";

const appRoot = resolve(process.cwd(), "app");
const sourceRoots = [appRoot, resolve(process.cwd(), "components"), resolve(process.cwd(), "lib")];

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : /\.(tsx?|jsx?)$/u.test(entry.name) ? [path] : [];
  });
}

function publicRoutePatterns(): RegExp[] {
  return collectFiles(appRoot).filter((file) => /(?:^|[\\/])page\.tsx?$/u.test(file)).map((file) => {
    const segments = relative(appRoot, dirname(file)).split(sep).filter((segment) => segment && !segment.startsWith("(") && !segment.startsWith("@"));
    const pattern = segments.map((segment) => segment.startsWith("[") && segment.endsWith("]") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("/");
    return new RegExp(`^/${pattern}/?$`, "u");
  });
}

test("static internal links resolve to an App Router page", () => {
  const routePatterns = publicRoutePatterns();
  const references: { file: string; href: string }[] = [];
  const hrefPattern = /\bhref\s*(?::|=)\s*["'](\/[^"'#]*)["']/gu;
  for (const file of sourceRoots.flatMap(collectFiles)) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(hrefPattern)) references.push({ file, href: match[1] });
  }
  assert.ok(references.length > 0, "expected to find static internal links");
  const broken = references.filter(({ href }) => !routePatterns.some((pattern) => pattern.test(href.split(/[?#]/u)[0])));
  assert.deepEqual(broken, [], `broken internal links: ${broken.map(({ file, href }) => `${relative(process.cwd(), file)} -> ${href}`).join(", ")}`);
});
