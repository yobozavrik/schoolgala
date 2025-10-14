import { useMemo } from "react";
import { Tile } from "@/components/Tile";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { fetchKnowledgeBase } from "@/lib/api";
import { getLocalKnowledgeBaseSummaries } from "@/lib/local-data";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bot,
  BookOpenCheck,
  Boxes,
  ClipboardCheck,
  GraduationCap,
  MessageSquareShare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const EMERGENCY_CATEGORY = "Дії при екстрених випадках";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tiles = useMemo(
    () => [
      {
        title: t("home.tiles.assistant.title", "ШІ-помічник"),
        description: t("home.tiles.assistant.subtitle", "Миттєві відповіді на складні запитання"),
        icon: <Bot className="h-6 w-6" aria-hidden />,
        to: "/assistant",
      },
      {
        title: t("home.tiles.kb.title", "База знань"),
        description: t("home.tiles.kb.subtitle", "Покрокові інструкції та корисні матеріали"),
        icon: <BookOpenCheck className="h-6 w-6" aria-hidden />,
        to: "/kb",
      },
      {
        title: t("home.tiles.checklists.title", "Чек-листи"),
        description: t("home.tiles.checklists.subtitle", "Контроль щоденних рутин та стандартів"),
        icon: <ClipboardCheck className="h-6 w-6" aria-hidden />,
        to: "/checklists",
      },
      {
        title: t("home.tiles.catalog.title", "Наша продукція"),
        description: t("home.tiles.catalog.subtitle", "Каталог «Галя Балувана» під рукою"),
        icon: <Boxes className="h-6 w-6" aria-hidden />,
        to: "/catalog",
      },
      {
        title: t("home.tiles.tests.title", "Перевірка знань"),
        description: t("home.tiles.tests.subtitle", "Тести та тренажери для розвитку"),
        icon: <GraduationCap className="h-6 w-6" aria-hidden />,
        to: "/tests",
      },
      {
        title: t("home.tiles.contacts.title", "Корисні контакти"),
        description: t("home.tiles.contacts.subtitle", "Миттєвий зв’язок з наставниками"),
        icon: <MessageSquareShare className="h-6 w-6" aria-hidden />,
        to: "/contacts",
      },
    ],
    [t],
  );
  const {
    data: emergencyArticles = [],
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery<KnowledgeBaseArticleSummary[], Error, KnowledgeBaseArticleSummary[]>({
    queryKey: ["kb", "emergency-highlight"],
    queryFn: () => fetchKnowledgeBase(""),
    select: (articles) =>
      articles.filter((article) => article.category === EMERGENCY_CATEGORY),
    initialData: enableStaticPrefetch ? () => getLocalKnowledgeBaseSummaries() : undefined,
    placeholderData: enableStaticPrefetch ? () => getLocalKnowledgeBaseSummaries() : undefined,
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-skin-base/80 p-6 text-center shadow-lg"
      >
        <div className="text-2xl font-semibold text-skin-text">
          {t("home.welcome_title", "Вітаємо, колего!")}
        </div>
        <div className="mt-2 text-sm text-skin-muted">
          {t("home.welcome_subtitle", "Обирайте розділ, щоб отримати інструменти для ідеального сервісу та продажів.")}
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Tile key={tile.title} {...tile} />
        ))}
      </div>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4 rounded-2xl bg-skin-base/80 p-6 shadow-lg"
        aria-labelledby="emergency-actions-heading"
      >
        <div>
          <h2 id="emergency-actions-heading" className="text-xl font-semibold text-skin-text">
            {t("home.emergency.title", EMERGENCY_CATEGORY)}
          </h2>
          <p className="text-sm text-skin-muted">
            {t(
              "home.emergency.subtitle",
              "Швидкий доступ до інструкцій дій під час позаштатних ситуацій.",
            )}
          </p>
        </div>
        {isLoading && !isPlaceholderData ? (
          <div className="text-sm text-skin-muted">{t("common.loading", "Завантаження…")}</div>
        ) : null}
        {error ? (
          <div className="text-sm text-red-500">
            {t("home.emergency.error", "Не вдалося завантажити екстрені інструкції. Спробуйте пізніше.")}
          </div>
        ) : null}
        {!isLoading && !error && !emergencyArticles.length ? (
          <div className="rounded-2xl border border-dashed border-skin-ring/60 p-4 text-sm text-skin-muted">
            {t("home.emergency.empty", "Наразі немає доступних матеріалів у цій категорії.")}
          </div>
        ) : null}
        {emergencyArticles.length ? (
          <Accordion>
            <AccordionItem
              title={t("home.emergency.title", EMERGENCY_CATEGORY)}
              subtitle={t("home.emergency.count", "{{count}} матеріал(и)", {
                count: emergencyArticles.length,
              })}
              defaultOpen
            >
              <div className="space-y-3">
                {emergencyArticles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => navigate(`/kb/${article.id}`)}
                    className="w-full rounded-2xl border border-skin-ring/60 bg-skin-base/60 p-4 text-left transition hover:border-skin-primary"
                  >
                    <div className="text-sm font-semibold text-skin-text">{article.title}</div>
                    <div className="text-xs text-skin-muted">{article.tldr}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        ) : null}
      </motion.section>
    </div>
  );
};

export default HomePage;
