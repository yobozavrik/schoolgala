import { checklists } from "@/assets/data/checklists";
import { knowledgeBaseArticles } from "@/assets/data/knowledge-base";
import type { Checklist } from "@/types/checklist";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";

export interface ShiftSnapshot {
  sellerName: string;
  store: string;
  shiftEnd: string;
  progress: number;
  revenueToday: number;
  revenueTarget: number;
  activeChecklists: number;
  overdueChecklists: number;
  kpiFocus: string;
}

export interface ShiftHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
}

export interface AiThreadSummary {
  id: string;
  topic: string;
  lastQuestion: string;
  resolved: boolean;
  relatedArticleIds: string[];
}

export const getShiftSnapshot = (): ShiftSnapshot => ({
  sellerName: "Марія Коваль",
  store: "ТРЦ Ocean Plaza",
  shiftEnd: "2024-07-08T21:30:00+03:00",
  progress: 0.62,
  revenueToday: 12840,
  revenueTarget: 18000,
  activeChecklists: 2,
  overdueChecklists: 1,
  kpiFocus: "Допродаж десертів",
});

export const getShiftHighlights = (): ShiftHighlight[] => [
  {
    id: "degustation",
    title: "Старт дегустації о 17:00",
    description: "Підготуйте дегустаційний сет та короткий скрипт",
    icon: "🥧",
    action: "/sales-now",
  },
  {
    id: "loyalty",
    title: "4 клієнти в листі повторних покупок",
    description: "Нагадуйте про програму лояльності та фіксуйте контакти",
    icon: "💌",
  },
  {
    id: "inventory",
    title: "Сирники закінчуються",
    description: "Залишилось 5 коробок — зробіть позначку у звіті",
    icon: "⚠️",
  },
];

export const getRecentAiThreads = (): AiThreadSummary[] => [
  {
    id: "complaint-ice-cream",
    topic: "Робота зі скаргою на смак морозива",
    lastQuestion: "Клієнт просить повернення — що відповісти?",
    resolved: true,
    relatedArticleIds: ["complaints"],
  },
  {
    id: "upsell-dessert",
    topic: "Як апселити десерти",
    lastQuestion: "Що сказати гість, який вагається?",
    resolved: false,
    relatedArticleIds: ["cross-selling", "welcome-flow"],
  },
];

export const getChecklistOverview = (): Checklist[] => checklists;

export const getKnowledgeBaseSummaries = (): KnowledgeBaseArticleSummary[] =>
  knowledgeBaseArticles.map(({ contentMd: _content, ...summary }) => summary);
