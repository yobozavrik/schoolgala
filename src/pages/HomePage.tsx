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

const tiles = [
  {
    title: "ШІ-помічник",
    description: "Миттєві відповіді на складні запитання",
    icon: <Bot className="h-6 w-6" aria-hidden />,
    to: "/assistant",
  },
  {
    title: "База знань",
    description: "Покрокові інструкції та корисні матеріали",
    icon: <BookOpenCheck className="h-6 w-6" aria-hidden />,
    to: "/kb",
  },
  {
    title: "Чек-листи",
    description: "Контроль щоденних рутин та стандартів",
    icon: <ClipboardCheck className="h-6 w-6" aria-hidden />,
    to: "/checklists",
  },
  {
    title: "Наша продукція",
    description: "Каталог «Галя Балувана» під рукою",
    icon: <Boxes className="h-6 w-6" aria-hidden />,
    to: "/catalog",
  },
  {
    title: "Перевірка знань",
    description: "Тести та тренажери для розвитку",
    icon: <GraduationCap className="h-6 w-6" aria-hidden />,
    to: "/tests",
  },
  {
    title: "Корисні контакти",
    description: "Миттєвий зв’язок з наставниками",
    icon: <MessageSquareShare className="h-6 w-6" aria-hidden />,
    to: "/contacts",
  },
];

const EMERGENCY_CATEGORY = "Дії при екстрених випадках";

const HomePage = () => {
  const navigate = useNavigate();
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
        <div className="text-2xl font-semibold text-skin-text">Вітаємо, колего!</div>
        <div className="mt-2 text-sm text-skin-muted">
          Обирайте розділ, щоб отримати інструменти для ідеального сервісу та продажів.
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
            {EMERGENCY_CATEGORY}
          </h2>
          <p className="text-sm text-skin-muted">
            Швидкий доступ до інструкцій дій під час позаштатних ситуацій.
          </p>
        </div>
        {isLoading && !isPlaceholderData ? (
          <div className="text-sm text-skin-muted">Завантаження…</div>
        ) : null}
        {error ? (
          <div className="text-sm text-red-500">
            Не вдалося завантажити екстрені інструкції. Спробуйте пізніше.
          </div>
        ) : null}
        {!isLoading && !error && !emergencyArticles.length ? (
          <div className="rounded-2xl border border-dashed border-skin-ring/60 p-4 text-sm text-skin-muted">
            Наразі немає доступних матеріалів у цій категорії.
          </div>
        ) : null}
        {emergencyArticles.length ? (
          <Accordion>
            <AccordionItem
              title={EMERGENCY_CATEGORY}
              subtitle={`${emergencyArticles.length} матеріал(и)`}
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
