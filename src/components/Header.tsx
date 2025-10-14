import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Info, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/Modal";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";

export const Header = (): JSX.Element => {
  const [infoOpen, setInfoOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const { showBack, backTo } = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return { showBack: false, backTo: "/" };
    }

    if (segments.length === 1) {
      return { showBack: true, backTo: "/" };
    }

    return { showBack: true, backTo: `/${segments.slice(0, -1).join("/")}` };
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-skin-ring/50 bg-skin-card/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-full px-3 text-sm"
              aria-label={t("header.back", "Назад")}
            >
              <Link to={backTo}>
                <ArrowLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t("header.back", "Назад")}</span>
              </Link>
            </Button>
          ) : null}
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-skin-primary" aria-hidden />
            <span>{t("header.title", "Ідеальний Продавець 2.0")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0"
            onClick={() => setInfoOpen(true)}
            aria-label={t("header.about_button", "Про застосунок")}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Modal
        title={t("header.about_title", "Про застосунок")}
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      >
        <p>{t("header.about_body", "«Ідеальний Продавець 2.0» допомагає команді швидко знаходити відповіді, працювати зі знаннями та підтримувати якісний сервіс.")}</p>
        <ul className="list-inside list-disc space-y-1">
          <li>{t("header.about_point1", "Інтеграція з Telegram WebApp для зручного доступу.")}</li>
          <li>{t("header.about_point2", "Підтримка світлої та темної тем.")}</li>
          <li>{t("header.about_point3", "ШІ-помічник, база знань, чек-листи, каталог і багато іншого.")}</li>
        </ul>
      </Modal>
    </header>
  );
};
