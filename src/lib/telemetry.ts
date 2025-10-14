import posthog from "posthog-js";

type TelemetryEvent = Record<string, unknown>;

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

let posthogLoaded = false;
let matomoLoaded = false;

const getEnv = (key: string): string | undefined => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
};

const MATOMO_URL = getEnv("VITE_MATOMO_URL");
const MATOMO_SITE_ID = getEnv("VITE_MATOMO_SITE_ID");
const POSTHOG_KEY = getEnv("VITE_POSTHOG_KEY");
const POSTHOG_HOST = getEnv("VITE_POSTHOG_HOST") ?? "https://app.posthog.com";

const initMatomo = () => {
  if (!MATOMO_URL || !MATOMO_SITE_ID || matomoLoaded) {
    return;
  }
  window._paq = window._paq ?? [];
  window._paq.push(["setTrackerUrl", `${MATOMO_URL.replace(/\/$/, "")}/matomo.php`]);
  window._paq.push(["setSiteId", MATOMO_SITE_ID]);
  const script = document.createElement("script");
  script.async = true;
  script.src = `${MATOMO_URL.replace(/\/$/, "")}/matomo.js`;
  document.head.appendChild(script);
  matomoLoaded = true;
};

export const initTelemetry = () => {
  if (typeof window === "undefined") {
    return;
  }
  if (POSTHOG_KEY && !posthogLoaded) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      disable_session_recording: true,
    });
    posthogLoaded = true;
  }
  initMatomo();
};

export const trackEvent = (name: string, properties: TelemetryEvent = {}) => {
  if (posthogLoaded) {
    posthog.capture(name, properties);
  }
  if (window._paq) {
    window._paq.push(["trackEvent", "app", name, JSON.stringify(properties)]);
  }
  if (!posthogLoaded && !window._paq) {
    console.debug("Telemetry event", name, properties);
  }
};

export const trackPageView = (path: string, properties: TelemetryEvent = {}) => {
  if (posthogLoaded) {
    posthog.capture("$pageview", { $current_url: path, ...properties });
  }
  if (window._paq) {
    window._paq.push(["setCustomUrl", path]);
    window._paq.push(["trackPageView"]);
  }
  if (!posthogLoaded && !window._paq) {
    console.debug("Page view", path, properties);
  }
};
