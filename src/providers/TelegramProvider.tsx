import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { TelegramWebApp, TelegramWindow } from "@/types/telegram";

interface TelegramContextValue {
  webApp?: TelegramWebApp;
  initData?: string;
  colorScheme: "light" | "dark";
  themeParams?: TelegramWebApp["themeParams"];
}

const TelegramContext = createContext<TelegramContextValue>({
  colorScheme: "light",
});

export const TelegramProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [webApp, setWebApp] = useState<TelegramWebApp | undefined>();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const win = window as TelegramWindow;
    const instance = win.Telegram?.WebApp;
    if (instance) {
      instance.ready();
      instance.expand();
      setWebApp(instance);
      setColorScheme(instance.colorScheme ?? "light");
    }
  }, []);

  const value = useMemo(
    () => ({
      webApp,
      initData: webApp?.initData,
      colorScheme,
      themeParams: webApp?.themeParams,
    }),
    [colorScheme, webApp],
  );

  useEffect(() => {
    if (!webApp) {
      return;
    }
    const handler = () => {
      setColorScheme(webApp.colorScheme);
    };

    (webApp as unknown as EventTarget).addEventListener?.("themeChanged", handler);
    return () => {
      (webApp as unknown as EventTarget).removeEventListener?.("themeChanged", handler);
    };
  }, [webApp]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
};

export const useTelegramContext = (): TelegramContextValue => useContext(TelegramContext);
