import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { AdSlot } from "../components/ads/ad-slot";
import {
  AD_SLOT_ALLOWLIST,
  adRuntimePrerequisites,
  getAdSlotStatus,
  isAdSlotActive,
  isAdSlotAllowlisted,
} from "../lib/ad-slots";

test("advertising is disabled when its private feature switch is missing or malformed", () => {
  const eligibleRoute = "/tools/category/calculators";
  const placement = "category-after-guides";

  for (const value of [undefined, "", "false", "TRUE", "1", " true ", "yes"]) {
    assert.equal(getAdSlotStatus(eligibleRoute, placement, value), "disabled", String(value));
    assert.equal(isAdSlotActive(eligibleRoute, placement, value), false, String(value));
  }
});

test("the explicit allowlist contains the five categories and current content-rich tool pages only", () => {
  assert.equal(Object.keys(AD_SLOT_ALLOWLIST).length, 20);
  for (const [route, placement] of Object.entries(AD_SLOT_ALLOWLIST)) {
    assert.equal(isAdSlotAllowlisted(route, placement), true, route);
    assert.equal(isAdSlotAllowlisted(route, placement === "tool-after-guide" ? "category-after-guides" : "tool-after-guide"), false, `${route} wrong placement`);
  }

  for (const route of [
    "/",
    "/tools",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/tools/a-future-tool",
    "/tools/category/a-future-category",
  ]) {
    assert.equal(isAdSlotAllowlisted(route, "tool-after-guide"), false, route);
    assert.equal(isAdSlotAllowlisted(route, "category-after-guides"), false, route);
  }
});

test("the feature switch cannot activate a route before provider and consent integrations exist", () => {
  assert.equal(getAdSlotStatus("/tools/emi-calculator", "tool-after-guide", "true"), "provider-not-configured");
  assert.equal(isAdSlotActive("/tools/emi-calculator", "tool-after-guide", "true"), false);
  assert.deepEqual(adRuntimePrerequisites, {
    providerAdapterReady: false,
    publisherIdConfigured: false,
    slotIdsConfigured: false,
    consentAdapterReady: false,
  });
});

test("disabled and not-yet-integrated slots render no placeholder or network component", () => {
  const original = process.env.QITOOL_ADS_ENABLED;
  try {
    delete process.env.QITOOL_ADS_ENABLED;
    assert.equal(AdSlot({ route: "/tools/emi-calculator", placement: "tool-after-guide" }), null);
    process.env.QITOOL_ADS_ENABLED = "true";
    assert.equal(AdSlot({ route: "/tools/emi-calculator", placement: "tool-after-guide" }), null);
    assert.equal(AdSlot({ route: "/", placement: "tool-after-guide" }), null);
  } finally {
    if (original === undefined) delete process.env.QITOOL_ADS_ENABLED;
    else process.env.QITOOL_ADS_ENABLED = original;
  }

  const componentSource = readFileSync(resolve(process.cwd(), "components/ads/ad-slot.ts"), "utf8");
  assert.doesNotMatch(componentSource, /next\/script|googlesyndication|adsbygoogle|ca-pub-|\bfetch\s*\(|XMLHttpRequest|new Image|<iframe|<ins\b/iu);
});

test("ad placement configuration is isolated from the analytics consent implementation", () => {
  const configurationSource = readFileSync(resolve(process.cwd(), "lib/ad-slots.ts"), "utf8");
  const componentSource = readFileSync(resolve(process.cwd(), "components/ads/ad-slot.ts"), "utf8");
  assert.doesNotMatch(`${configurationSource}\n${componentSource}`, /AnalyticsConsent|googleAnalyticsId|qitool-analytics-consent/iu);
});
