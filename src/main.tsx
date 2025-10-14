import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { TelegramProvider } from "./providers/TelegramProvider";
import { LocaleProvider } from "./providers/LocaleProvider";
import { TelemetryProvider } from "./providers/TelemetryProvider";
import { initErrorTracking, SentryErrorBoundary } from "./lib/observability";
import { ErrorFallback } from "./components/ErrorFallback";
import { createQueryClient } from "@/lib/query-client";

const queryClient = createQueryClient();

initErrorTracking();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TelegramProvider>
      <LocaleProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <TelemetryProvider>
                <SentryErrorBoundary fallback={<ErrorFallback />}>
                  <App />
                </SentryErrorBoundary>
              </TelemetryProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </LocaleProvider>
    </TelegramProvider>
  </React.StrictMode>,
);
