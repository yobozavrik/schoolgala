import { catalogItems } from "@/assets/data/catalog";
import { knowledgeBaseArticles } from "@/assets/data/knowledge-base";
import type { CatalogItem } from "@/types/catalog";
import type {
  KnowledgeBaseArticle,
  KnowledgeBaseArticleSummary,
} from "@/types/knowledge-base";

const normalize = (value: string): string => value.trim().toLowerCase();

export const getLocalCatalogItems = (): CatalogItem[] =>
  catalogItems.map((item) => ({ ...item }));

export const getLocalKnowledgeBaseSummaries = (query = ""): KnowledgeBaseArticleSummary[] => {
  const normalizedQuery = normalize(query);

  return knowledgeBaseArticles
    .filter((article) =>
      normalizedQuery ? article.title.toLowerCase().includes(normalizedQuery) : true,
    )
    .map(({ contentMd: _content, ...summary }) => ({ ...summary }));
};

export const getLocalKnowledgeBaseArticle = (
  id: string,
): KnowledgeBaseArticle | undefined => knowledgeBaseArticles.find((article) => article.id === id);
