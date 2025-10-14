import * as Sentry from "@sentry/react";

const getEnv = (key: string): string | undefined => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const SENTRY_DSN = getEnv("VITE_SENTRY_DSN");
const LOGTAIL_TOKEN = getEnv("VITE_LOGTAIL_TOKEN");
const APP_VERSION = getEnv("VITE_APP_VERSION");

let sentryInitialized = false;

export const initErrorTracking = () => {
  if (!SENTRY_DSN || sentryInitialized || typeof window === "undefined") {
    return;
  }
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [],
    tracesSampleRate: 0.1,
    release: APP_VERSION,
  });
  sentryInitialized = true;
};

export const captureError = (error: unknown, context?: Record<string, unknown>) => {
  if (sentryInitialized) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("Captured error", error, context);
  }
  if (LOGTAIL_TOKEN && typeof fetch === "function") {
    void fetch("https://in.logtail.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOGTAIL_TOKEN}`,
      },
      body: JSON.stringify({
        level: "error",
        message: error instanceof Error ? error.message : String(error),
        context,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => undefined);
  }
};

export const SentryErrorBoundary = Sentry.ErrorBoundary;
