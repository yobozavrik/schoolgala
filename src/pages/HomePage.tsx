import { useEffect, useMemo, useState } from "react";
import { Tile } from "@/components/Tile";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { fetchKnowledgeBase } from "@/lib/api";
import { getLocalKnowledgeBaseSummaries } from "@/lib/local-data";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bot,
  BookOpenCheck,
  Boxes,
  ClipboardCheck,
  GraduationCap,
  MessageSquareShare,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getChecklistOverview,
  getShiftHighlights,
  getShiftSnapshot,
} from "@/lib/shift-data";

const tiles = [
  {
    title: "ШІ-помічник",
    description: "Миттєві відповіді на складні запитання",
    icon: <Bot className="h-6 w-6" aria-hidden />,
    to: "/assistant",
    badge: "новий режим",
  },
  {
    title: "База знань",
    description: "Покрокові інструкції та корисні матеріали",
    icon: <BookOpenCheck className="h-6 w-6" aria-hidden />,
    to: "/kb",
    badge: "+3 статті",
    badgeTone: "sky" as const,
  },
  {
    title: "Чек-листи",
    description: "Контроль щоденних рутин та стандартів",
    icon: <ClipboardCheck className="h-6 w-6" aria-hidden />,
    to: "/checklists",
    badge: "нагадування",
    badgeTone: "emerald" as const,
  },
  {
    title: "Наша продукція",
    description: "Каталог «Галя Балувана» під рукою",
    icon: <Boxes className="h-6 w-6" aria-hidden />,
    to: "/catalog",
  },
  {
    title: "Sales Now",
    description: "Скрипти, аргументи та крос-селл у режимі зміни",
    icon: <Rocket className="h-6 w-6" aria-hidden />,
    to: "/sales-now",
    badge: "швидкий старт",
    badgeTone: "amber" as const,
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

const tutorialSlides = [
  {
    title: "AI + знання",
    description: "Поставте запит у ШІ, а потім одразу відкрийте чек-лист, який порадить система.",
  },
  {
    title: "Sales Now",
    description: "Перед дегустацією перегляньте швидкі аргументи та крос-селл у новому режимі.",
  },
  {
    title: "Команда",
    description: "Стежте за прогресом зміни у верхній панелі й завершуйте чек-листи вчасно.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const shiftSnapshot = useMemo(() => getShiftSnapshot(), []);
  const shiftHighlights = useMemo(() => getShiftHighlights(), []);
  const shiftChecklists = useMemo(() => getChecklistOverview(), []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % tutorialSlides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    void queryClient.prefetchQuery({ queryKey: ["catalog"], queryFn: fetchPrefetchedCatalog });
    void queryClient.prefetchQuery({ queryKey: ["kb", ""], queryFn: () => fetchKnowledgeBase("") });
  }, [queryClient]);

  const {
    data: emergencyArticles = [],
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery<KnowledgeBaseArticleSummary[], Error, KnowledgeBaseArticleSummary[]>({
    queryKey: ["kb", "emergency-highlight"],
    queryFn: () => fetchKnowledgeBase(""),
    select: (articles) => articles.filter((article) => article.category === EMERGENCY_CATEGORY),
    initialData: enableStaticPrefetch ? () => getLocalKnowledgeBaseSummaries() : undefined,
    placeholderData: enableStaticPrefetch ? () => getLocalKnowledgeBaseSummaries() : undefined,
  });

  const emergencyState = isLoading && !isPlaceholderData;

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl border border-skin-ring/40 bg-gradient-to-br from-amber-100/70 via-white to-sky-50 p-6 shadow-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-skin-muted">Ваша зміна</p>
            <h1 className="text-3xl font-semibold text-skin-text">Вітаємо, {shiftSnapshot.sellerName}!</h1>
            <p className="text-sm text-skin-muted">
              {shiftSnapshot.store} · KPI дня: {shiftSnapshot.kpiFocus}
            </p>
            <div className="space-y-3 rounded-2xl border border-skin-ring/30 bg-white/70 p-4 text-sm">
              <div className="flex items-center justify-between text-skin-muted">
                <span>Прогрес зміни</span>
                <span>{Math.round(shiftSnapshot.progress * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-skin-ring/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-skin-primary to-rose-400"
                  style={{ width: `${Math.min(shiftSnapshot.progress * 100, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-skin-muted">
                <div className="rounded-xl bg-skin-base/60 p-3 shadow-sm">
                  <p className="font-semibold text-skin-text">
                    ₴{shiftSnapshot.revenueToday.toLocaleString("uk-UA")}
                  </p>
                  <p>виконано з ₴{shiftSnapshot.revenueTarget.toLocaleString("uk-UA")}</p>
                </div>
                <div className="rounded-xl bg-skin-base/60 p-3 shadow-sm">
                  <p className="font-semibold text-skin-text">{shiftSnapshot.activeChecklists}</p>
                  <p>активні чек-листи</p>
                </div>
              </div>
              <div className="text-xs text-skin-muted">
                Завершіть чек-листи до {new Date(shiftSnapshot.shiftEnd).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-skin-ring/40 bg-white/80 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-wide text-skin-muted">Фокус сьогодні</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {shiftHighlights.map((highlight) => (
                <button
                  key={highlight.id}
                  type="button"
                  onClick={() => highlight.action && navigate(highlight.action)}
                  className="flex items-start gap-3 rounded-2xl border border-skin-ring/40 bg-skin-base/70 p-3 text-left transition hover:border-skin-primary"
                >
                  <span className="text-2xl" aria-hidden>
                    {highlight.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-skin-text">{highlight.title}</p>
                    <p className="text-xs text-skin-muted">{highlight.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-dashed border-skin-ring/50 bg-skin-base/60 p-3 text-xs text-skin-muted">
              {shiftSnapshot.overdueChecklists > 0
                ? `${shiftSnapshot.overdueChecklists} чек-лист(и) потребують уваги`
                : "Усі чек-листи виконуються вчасно"}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-skin-muted">Навігація</p>
            <h2 className="text-2xl font-semibold text-skin-text">Швидкі модулі</h2>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <Tile key={tile.title} {...tile} />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <div className="rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-skin-muted">Онбординг</p>
              <h2 className="text-xl font-semibold text-skin-text">Міні-карусель для новачків</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-skin-muted">
              {tutorialSlides.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-6 rounded-full transition ${
                    carouselIndex === index ? "bg-skin-primary" : "bg-skin-ring/60"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-skin-ring/40 bg-gradient-to-br from-skin-primary/10 via-transparent to-transparent p-6 shadow-inner">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-skin-text">{tutorialSlides[carouselIndex].title}</h3>
              <p className="text-sm text-skin-muted">{tutorialSlides[carouselIndex].description}</p>
            </motion.div>
          </div>
        </div>
        <div className="rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg">
          <p className="text-xs uppercase tracking-wide text-skin-muted">Нагадування</p>
          <h2 className="text-xl font-semibold text-skin-text">Активні чек-листи</h2>
          <div className="mt-4 space-y-3">
            {shiftChecklists.map((checklist) => (
              <button
                key={checklist.id}
                type="button"
                onClick={() => navigate(`/checklists/${checklist.id}`)}
                className="w-full rounded-2xl border border-skin-ring/40 bg-skin-base/60 p-4 text-left text-sm transition hover:border-skin-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-skin-text">{checklist.title}</span>
                  {checklist.nextDueAt ? (
                    <span className="text-xs text-skin-muted">
                      до {new Date(checklist.nextDueAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-skin-muted">{checklist.description}</p>
                {checklist.lastCompletedAt ? (
                  <p className="mt-1 text-[11px] text-skin-muted/80">
                    Востаннє: {new Date(checklist.lastCompletedAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-4 rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg"
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
        {emergencyState ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-skin-ring/20" />
            ))}
          </div>
        ) : null}
        {error ? (
          <div className="text-sm text-red-500">
            Не вдалося завантажити екстрені інструкції. Спробуйте пізніше.
          </div>
        ) : null}
        {!emergencyState && !error && !emergencyArticles.length ? (
          <div className="rounded-2xl border border-dashed border-skin-ring/60 p-4 text-sm text-skin-muted">
            Наразі немає доступних матеріалів у цій категорії.
          </div>
        ) : null}
        {emergencyArticles.length ? (
          <Accordion>
            <AccordionItem title={EMERGENCY_CATEGORY} subtitle={`${emergencyArticles.length} матеріал(и)`} defaultOpen>
              <div className="space-y-3">
                {emergencyArticles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => navigate(`/kb/${article.id}`)}
                    className="w-full rounded-2xl border border-skin-ring/60 bg-gradient-to-r from-red-50/70 via-white to-white p-4 text-left transition hover:border-skin-primary"
                  >
                    <div className="flex items-center justify-between text-xs text-red-500">
                      <span className="inline-flex items-center gap-1">
                        <Badge variant="soft">SOS</Badge>
                        {article.category}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-skin-text">{article.title}</div>
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

const fetchPrefetchedCatalog = () => import("@/lib/api").then((mod) => mod.fetchCatalog());

export default HomePage;
