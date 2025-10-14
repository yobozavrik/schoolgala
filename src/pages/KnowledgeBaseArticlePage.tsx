import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchKnowledgeArticle } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalKnowledgeBaseArticle } from "@/lib/local-data";
import { useTranslation } from "@/hooks/useTranslation";

const KnowledgeBaseArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["kb-article", id],
    queryFn: () => fetchKnowledgeArticle(id ?? ""),
    enabled: Boolean(id),
    initialData: enableStaticPrefetch && id ? () => getLocalKnowledgeBaseArticle(id) : undefined,
    placeholderData: enableStaticPrefetch && id ? () => getLocalKnowledgeBaseArticle(id) : undefined,
  });

  if (isLoading) {
    return <div className="text-sm text-skin-muted">{t("knowledge_base.article.loading", "Завантаження статті…")}</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">{t("knowledge_base.article.error", "Не вдалося завантажити статтю.")}</div>
    );
  }

  if (!data) {
    return <div className="text-sm text-skin-muted">{t("knowledge_base.article.not_found", "Стаття не знайдена.")}</div>;
  }

  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-skin-muted">
          {t("knowledge_base.article.category", "Категорія: {{category}}", { category: data.category })}
        </p>
        <h1 className="text-2xl font-semibold text-skin-text">{data.title}</h1>
        <p className="text-sm text-skin-muted">{data.tldr}</p>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </header>
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={t("knowledge_base.article.image_alt", "Ілюстрація статті")}
          className="w-full rounded-2xl object-cover"
          loading="lazy"
        />
      ) : null}
      <MarkdownRenderer>{data.contentMd}</MarkdownRenderer>
      {data.videoUrl ? (
        <a
          href={data.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-skin-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          {t("knowledge_base.article.video", "Переглянути відео")}
        </a>
      ) : null}
    </article>
  );
};

export default KnowledgeBaseArticlePage;
