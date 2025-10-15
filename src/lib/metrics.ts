interface VitalReport {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
}

const sendToAnalytics = (metric: VitalReport) => {
  try {
    const payload = JSON.stringify({
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id,
      timestamp: Date.now(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("https://httpbin.org/post", payload);
    } else {
      void fetch("https://httpbin.org/post", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
    }
  } catch {
    // ignore in offline environments
  }
};

export const reportWebVitals = (metric: VitalReport) => {
  if (import.meta.env.DEV) {
    console.info(`[WebVitals] ${metric.name}: ${metric.value.toFixed(0)} (${metric.rating})`);
  }
  sendToAnalytics(metric);
};
