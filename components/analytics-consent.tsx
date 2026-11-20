"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { googleAnalyticsId } from "@/lib/site";

type AnalyticsConsent = "accepted" | "declined" | "unset";

const consentStorageKey = "qitool-analytics-consent";
const consentEventName = "qitool-analytics-consent-change";
let memoryConsent: AnalyticsConsent = "unset";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function getConsentSnapshot(): AnalyticsConsent {
  try {
    const saved = window.localStorage.getItem(consentStorageKey);
    if (saved === "accepted" || saved === "declined") return saved;
  } catch {
    return memoryConsent;
  }
  return memoryConsent;
}

function getServerConsentSnapshot(): AnalyticsConsent {
  return "unset";
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener(consentEventName, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(consentEventName, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function saveConsent(next: AnalyticsConsent) {
  memoryConsent = next;
  try {
    if (next === "unset") window.localStorage.removeItem(consentStorageKey);
    else window.localStorage.setItem(consentStorageKey, next);
  } catch {
    // Keep the choice for this page view if browser storage is unavailable.
  }
  window.dispatchEvent(new Event(consentEventName));
}

function updateGoogleConsent(analyticsStorage: "granted" | "denied") {
  window.gtag?.("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const pathname = usePathname();
  const measurementId = googleAnalyticsId;

  useEffect(() => {
    if (!measurementId || consent !== "accepted") {
      if (consent !== "accepted") updateGoogleConsent("denied");
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => { window.dataLayer?.push(args); });
    updateGoogleConsent("granted");
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }, [consent, measurementId]);

  useEffect(() => {
    if (!measurementId || consent !== "accepted" || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, [consent, measurementId, pathname]);

  if (!measurementId) return null;

  return (
    <>
      {consent === "accepted" && (
        <Script
          id="qitool-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
          strategy="afterInteractive"
        />
      )}
      {consent === "unset" && (
        <aside className="analytics-consent" aria-label="Optional analytics preferences">
          <div>
            <strong>Optional analytics</strong>
            <p>Google Analytics can help us understand page visits. It stays off unless you opt in. See our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveConsent("accepted")}>Allow analytics</button>
            <button type="button" onClick={() => saveConsent("declined")}>Decline</button>
          </div>
        </aside>
      )}
    </>
  );
}

export function AnalyticsPreferences() {
  if (!googleAnalyticsId) return null;
  return (
    <button type="button" className="analytics-preferences" onClick={() => saveConsent("unset")}>
      Analytics preferences
    </button>
  );
}
