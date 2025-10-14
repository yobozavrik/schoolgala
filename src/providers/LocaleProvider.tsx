import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Locale, TranslateParams, supportedLocales, translate } from "@/i18n/dictionary";

const STORAGE_KEY = "ideal-seller-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (value: Locale) => void;
  t: (key: string, fallback: string, params?: TranslateParams) => string;
  locales: typeof supportedLocales;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "uk";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && supportedLocales.some((item) => item.code === stored)) {
    return stored;
  }
  const browserLang = window.navigator.language.slice(0, 2) as Locale;
  return supportedLocales.some((item) => item.code === browserLang) ? browserLang : "uk";
};

export const LocaleProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, fallback, params) => translate(locale, key, fallback, params),
      locales: supportedLocales,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
};
