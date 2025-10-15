import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, LifeBuoy, Sparkles, TimerReset } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/Modal";
import { getRecentAiThreads, getShiftSnapshot } from "@/lib/shift-data";
import { Badge } from "@/components/ui/Badge";

export const Header = (): JSX.Element => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const shift = useMemo(() => getShiftSnapshot(), []);
  const aiThreads = useMemo(() => getRecentAiThreads(), []);

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
    <header className="sticky top-0 z-20 border-b border-skin-ring/40 bg-skin-card/90 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {showBack ? (
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-full px-3 text-sm"
              aria-label="Назад"
            >
              <Link to={backTo}>
                <ArrowLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </Button>
          ) : null}
          <div className="flex items-center gap-2 text-lg font-semibold text-skin-text">
            <Sparkles className="h-5 w-5 text-skin-primary" aria-hidden />
            <span>Ідеальний Продавець 2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setRequestsOpen(true)}
              aria-label="Мої звернення"
            >
              <TimerReset className="h-5 w-5" />
            </Button>
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
        <div className="flex flex-col gap-3 rounded-2xl border border-skin-ring/40 bg-skin-base/70 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-skin-primary/10 text-skin-primary">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-skin-muted">Зміна завершується о {new Date(shift.shiftEnd).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-sm font-semibold text-skin-text">{shift.sellerName}</p>
              <p className="text-xs text-skin-muted">{shift.store}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:max-w-sm">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-skin-muted">
              <span>Прогрес</span>
              <span>{Math.round(shift.progress * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-skin-ring/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-skin-primary to-rose-400"
                style={{ width: `${Math.min(shift.progress * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button size="sm" variant="secondary" onClick={() => navigate("/assistant")}
              className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Мої звернення
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/sales-now")} className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" /> SOS панель
            </Button>
          </div>
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
      <Modal title="Мої звернення" open={requestsOpen} onClose={() => setRequestsOpen(false)}>
        <div className="space-y-3 text-sm">
          {aiThreads.map((thread) => (
            <div key={thread.id} className="space-y-1 rounded-2xl border border-skin-ring/40 bg-skin-base/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-skin-text">{thread.topic}</p>
                <Badge variant={thread.resolved ? "soft" : "outline"}>
                  {thread.resolved ? "вирішено" : "відкрите"}
                </Badge>
              </div>
              <p className="text-xs text-skin-muted">{thread.lastQuestion}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {thread.relatedArticleIds.map((articleId) => (
                  <Button
                    key={articleId}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setRequestsOpen(false);
                      navigate(`/kb/${articleId}`);
                    }}
                  >
                    Переглянути статтю
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </header>
  );
};
