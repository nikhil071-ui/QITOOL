(() => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args) => window.dataLayer.push(args));
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
})();
