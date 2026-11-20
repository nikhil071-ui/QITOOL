export type AdSlotPlacement = "category-after-guides" | "tool-after-guide";

/**
 * Explicit Phase 13 candidates only. New routes must not inherit ad eligibility
 * from the tool catalog or category definitions.
 */
export const AD_SLOT_ALLOWLIST = {
  "/tools/category/calculators": "category-after-guides",
  "/tools/category/text": "category-after-guides",
  "/tools/category/images": "category-after-guides",
  "/tools/category/productivity": "category-after-guides",
  "/tools/category/converters": "category-after-guides",
  "/tools/age-calculator": "tool-after-guide",
  "/tools/percentage-calculator": "tool-after-guide",
  "/tools/bmi-calculator": "tool-after-guide",
  "/tools/emi-calculator": "tool-after-guide",
  "/tools/gst-calculator": "tool-after-guide",
  "/tools/date-calculator": "tool-after-guide",
  "/tools/discount-calculator": "tool-after-guide",
  "/tools/loan-calculator": "tool-after-guide",
  "/tools/word-counter": "tool-after-guide",
  "/tools/character-counter": "tool-after-guide",
  "/tools/qr-code-generator": "tool-after-guide",
  "/tools/password-generator": "tool-after-guide",
  "/tools/unit-converter": "tool-after-guide",
  "/tools/image-compressor": "tool-after-guide",
  "/tools/typing-speed-test": "tool-after-guide",
} as const satisfies Record<string, AdSlotPlacement>;

export const adRuntimePrerequisites = Object.freeze({
  providerAdapterReady: false,
  publisherIdConfigured: false,
  slotIdsConfigured: false,
  consentAdapterReady: false,
});

export type AdSlotStatus =
  | "disabled"
  | "route-not-allowlisted"
  | "provider-not-configured"
  | "consent-not-configured"
  | "ready";

export function isAdSlotAllowlisted(route: string, placement: AdSlotPlacement): boolean {
  return AD_SLOT_ALLOWLIST[route as keyof typeof AD_SLOT_ALLOWLIST] === placement;
}

export function getAdSlotStatus(
  route: string,
  placement: AdSlotPlacement,
  featureSwitch = process.env.QITOOL_ADS_ENABLED,
): AdSlotStatus {
  if (!isAdSlotAllowlisted(route, placement)) return "route-not-allowlisted";
  if (featureSwitch !== "true") return "disabled";
  if (
    !adRuntimePrerequisites.providerAdapterReady ||
    !adRuntimePrerequisites.publisherIdConfigured ||
    !adRuntimePrerequisites.slotIdsConfigured
  ) return "provider-not-configured";
  if (!adRuntimePrerequisites.consentAdapterReady) return "consent-not-configured";
  return "ready";
}

export function isAdSlotActive(
  route: string,
  placement: AdSlotPlacement,
  featureSwitch = process.env.QITOOL_ADS_ENABLED,
): boolean {
  return getAdSlotStatus(route, placement, featureSwitch) === "ready";
}
