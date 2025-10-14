import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { initTelemetry, trackEvent, trackPageView } from "@/lib/telemetry";

type TelemetryContextValue = {
  track: (name: string, properties?: Record<string, unknown>) => void;
  page: (path: string, properties?: Record<string, unknown>) => void;
};

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export const TelemetryProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const location = useLocation();

  useEffect(() => {
    initTelemetry();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    trackPageView(path);
  }, [location.pathname, location.search]);

  const value = useMemo(
    () => ({
      track: trackEvent,
      page: trackPageView,
    }),
    [],
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetryContext = (): TelemetryContextValue => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within TelemetryProvider");
  }
  return context;
};
