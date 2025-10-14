import { useLocale } from "@/providers/LocaleProvider";

export const useTranslation = () => {
  const { t, locale, setLocale, locales } = useLocale();
  return { t, locale, setLocale, locales };
};
