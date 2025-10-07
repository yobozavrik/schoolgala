export interface TelegramWebAppThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

export interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    hash?: string;
  };
  colorScheme: "light" | "dark";
  themeParams: TelegramWebAppThemeParams;
  ready: () => void;
  expand: () => void;
  sendData?: (data: string) => void;
  openTelegramLink?: (url: string) => void;
}

export interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
