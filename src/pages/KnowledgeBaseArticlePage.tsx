import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchKnowledgeArticle } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalKnowledgeBaseArticle } from "@/lib/local-data";

const KnowledgeBaseArticlePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["kb-article", id],
    queryFn: () => fetchKnowledgeArticle(id ?? ""),
    enabled: Boolean(id),
    initialData: enableStaticPrefetch && id ? () => getLocalKnowledgeBaseArticle(id) : undefined,
    placeholderData: enableStaticPrefetch && id ? () => getLocalKnowledgeBaseArticle(id) : undefined,
  });

  if (isLoading) {
    return <div className="text-sm text-skin-muted">Завантаження статті…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Не вдалося завантажити статтю.</div>;
  }

  if (!data) {
    return <div className="text-sm text-skin-muted">Стаття не знайдена.</div>;
  }

  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-skin-muted">{data.category}</p>
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
          alt="Ілюстрація статті"
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
          Переглянути відео
        </a>
      ) : null}
    </article>
  );
};

export default KnowledgeBaseArticlePage;
