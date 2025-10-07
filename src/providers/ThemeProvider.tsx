import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { useTelegramContext } from "./TelegramProvider";

const STORAGE_KEY = "ip_theme";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { colorScheme } = useTelegramContext();
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return colorScheme ?? "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
    const themeColorMeta = document.getElementById("themeColorMeta");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "dark" ? "#0b0f17" : "#f8fafc");
    }
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (!stored) {
      setThemeState(colorScheme);
    }
  }, [colorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (next) => setThemeState(next),
      toggleTheme: () => setThemeState((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
