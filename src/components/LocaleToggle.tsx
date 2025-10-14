import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

export const LocaleToggle = () => {
  const { locales, locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Мова інтерфейсу">
      {locales.map((item) => (
        <Button
          key={item.code}
          type="button"
          variant={item.code === locale ? "primary" : "secondary"}
          className="h-8 rounded-full px-3 text-xs"
          onClick={() => setLocale(item.code)}
          aria-pressed={item.code === locale}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
