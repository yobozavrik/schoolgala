import { checklists } from "@/assets/data/checklists";
import { knowledgeBaseArticles } from "@/assets/data/knowledge-base";
import type { Checklist } from "@/types/checklist";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";

const keywordMap: Record<string, { articles?: string[]; checklists?: string[] }> = {
  скарг: { articles: ["complaints"], checklists: ["closing"] },
  дегустац: { articles: ["welcome-flow"], checklists: ["tasting-bar"] },
  десерт: { articles: ["cross-selling"], checklists: ["morning-shift"] },
  тривог: { articles: ["emergency-air-raid"], checklists: ["closing"] },
  пожеж: { articles: ["emergency-fire"], checklists: ["closing"] },
  світл: { articles: ["emergency-power-outage"], checklists: ["closing"] },
};

const normalize = (value: string): string => value.toLowerCase();

const uniqueById = <T extends { id: string }>(list: T[]): T[] => {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

export interface AssistantRelatedResources {
  articles: KnowledgeBaseArticleSummary[];
  checklists: Checklist[];
}

export const resolveAssistantResources = (text: string): AssistantRelatedResources => {
  const normalized = normalize(text);
  const articleIds = new Set<string>();
  const checklistIds = new Set<string>();

  Object.entries(keywordMap).forEach(([keyword, resources]) => {
    if (normalized.includes(keyword)) {
      resources.articles?.forEach((articleId) => articleIds.add(articleId));
      resources.checklists?.forEach((checklistId) => checklistIds.add(checklistId));
    }
  });

  const fallbackArticles = knowledgeBaseArticles.slice(0, 3);
  const fallbackChecklists = checklists.slice(0, 2);

  const matchedArticles = knowledgeBaseArticles.filter((article) => articleIds.has(article.id));
  const matchedChecklists = checklists.filter((checklist) => checklistIds.has(checklist.id));

  return {
    articles: uniqueById(
      (matchedArticles.length ? matchedArticles : fallbackArticles).map(({ contentMd: _content, ...summary }) => summary),
    ),
    checklists: uniqueById(matchedChecklists.length ? matchedChecklists : fallbackChecklists),
  };
};
