export interface KnowledgeBaseArticleSummary {
  id: string;
  title: string;
  tldr: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface KnowledgeBaseArticle extends KnowledgeBaseArticleSummary {
  contentMd: string;
}
