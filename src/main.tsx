import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { TelegramProvider } from "./providers/TelegramProvider";
import { createQueryClient } from "@/lib/query-client";
import { reportWebVitals } from "@/lib/metrics";
import { onCLS, onINP, onLCP } from "web-vitals";

const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TelegramProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </TelegramProvider>
  </React.StrictMode>,
);

onCLS(reportWebVitals);
onINP(reportWebVitals);
onLCP(reportWebVitals);
