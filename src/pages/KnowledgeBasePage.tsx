import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchKnowledgeBase } from "@/lib/api";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";
import { SearchBar } from "@/components/SearchBar";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalKnowledgeBaseSummaries } from "@/lib/local-data";
import { useTranslation } from "@/hooks/useTranslation";

const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(search), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, error, isPlaceholderData } = useQuery<KnowledgeBaseArticleSummary[]>({
    queryKey: ["kb", debounced],
    queryFn: () => fetchKnowledgeBase(debounced),
    initialData: enableStaticPrefetch && !debounced ? () => getLocalKnowledgeBaseSummaries() : undefined,
    placeholderData:
      enableStaticPrefetch && !debounced ? () => getLocalKnowledgeBaseSummaries() : undefined,
  });

  const grouped = useMemo(() => {
    const groups = new Map<string, KnowledgeBaseArticleSummary[]>();
    (data ?? []).forEach((article) => {
      const arr = groups.get(article.category) ?? [];
      arr.push(article);
      groups.set(article.category, arr);
    });
    return Array.from(groups.entries());
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">{t("knowledge_base.title", "База знань")}</h1>
        <p className="text-sm text-skin-muted">
          {t(
            "knowledge_base.subtitle",
            "Використовуйте пошук або оберіть категорію, щоб знайти потрібну інструкцію.",
          )}
        </p>
      </div>
      <SearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t("knowledge_base.search_placeholder", "Пошук статей")}
      />
      {isLoading && !isPlaceholderData ? (
        <div className="text-sm text-skin-muted">{t("knowledge_base.loading", "Завантаження…")}</div>
      ) : null}
      {error ? (
        <div className="text-sm text-red-500">
          {t("knowledge_base.error", "Не вдалося завантажити статті. Спробуйте пізніше.")}
        </div>
      ) : null}
      <Accordion>
        {grouped.map(([category, articles]) => (
          <AccordionItem
            key={category}
            title={category}
            subtitle={t("knowledge_base.count", "{{count}} матеріал(и)", { count: articles.length })}
          >
            <div className="space-y-3">
              {articles.map((article) => (
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
        ))}
      </Accordion>
      {!isLoading && !grouped.length ? (
        <div className="rounded-2xl bg-skin-base/80 p-6 text-center text-sm text-skin-muted">
          {t("knowledge_base.empty", "Нічого не знайдено. Уточніть запит.")}
        </div>
      ) : null}
    </div>
  );
};

export default KnowledgeBasePage;
