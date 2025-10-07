import { useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/Modal";

export const Header = (): JSX.Element => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-skin-ring/50 bg-skin-card/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-skin-primary" aria-hidden />
          <span>Ідеальний Продавець 2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0"
            onClick={() => setInfoOpen(true)}
            aria-label="Про застосунок"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Modal title="Про застосунок" open={infoOpen} onClose={() => setInfoOpen(false)}>
        <p>
          «Ідеальний Продавець 2.0» допомагає команді швидко знаходити відповіді, працювати зі знаннями та
          підтримувати якісний сервіс.
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>Інтеграція з Telegram WebApp для зручного доступу.</li>
          <li>Підтримка світлої та темної тем.</li>
          <li>ШІ-помічник, база знань, чек-листи, каталог і багато іншого.</li>
        </ul>
      </Modal>
    </header>
  );
};
