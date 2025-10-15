import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchKnowledgeBase } from "@/lib/api";
import type { KnowledgeBaseArticleSummary } from "@/types/knowledge-base";
import { SearchBar } from "@/components/SearchBar";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { Badge } from "@/components/ui/Badge";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalKnowledgeBaseSummaries } from "@/lib/local-data";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualItem } from "@tanstack/react-virtual";

const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const parentRef = useRef<HTMLDivElement | null>(null);

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

  const showVirtualized = Boolean(debounced);
  const listVirtualizer = useVirtualizer({
    count: showVirtualized ? (data?.length ?? 0) : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 6,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">База знань</h1>
        <p className="text-sm text-skin-muted">
          Використовуйте пошук або оберіть категорію, щоб знайти потрібну інструкцію.
        </p>
      </div>
      <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук статей" />
      {isLoading && !isPlaceholderData ? <div className="text-sm text-skin-muted">Завантаження…</div> : null}
      {error ? (
        <div className="text-sm text-red-500">Не вдалося завантажити статті. Спробуйте пізніше.</div>
      ) : null}
      {showVirtualized ? (
        <div
          ref={parentRef}
          className="max-h-[70vh] overflow-y-auto rounded-2xl border border-skin-ring/40 bg-skin-base/70 shadow-inner"
        >
          <div style={{ height: `${listVirtualizer.getTotalSize()}px` }} className="relative">
            {listVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
              const article = data?.[virtualRow.index];
              if (!article) return null;
              return (
                <div
                  key={article.id}
                  className="absolute left-0 right-0 px-4 py-3"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/kb/${article.id}`)}
                    className="w-full rounded-2xl border border-skin-ring/50 bg-skin-base/90 p-4 text-left shadow-sm transition hover:border-skin-primary"
                  >
                    <div className="flex items-center justify-between text-xs text-skin-muted">
                      <span>{article.category}</span>
                      <span>{article.tags.slice(0, 2).join(" · ")}</span>
                    </div>
                    <div className="text-sm font-semibold text-skin-text">{article.title}</div>
                    <div className="text-xs text-skin-muted">{article.tldr}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Accordion>
          {grouped.map(([category, articles]) => (
            <AccordionItem key={category} title={category} subtitle={`${articles.length} матеріал(и)`}>
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
      )}
      {!isLoading && !grouped.length ? (
        <div className="rounded-2xl bg-skin-base/80 p-6 text-center text-sm text-skin-muted">
          Нічого не знайдено. Уточніть запит.
        </div>
      ) : null}
    </div>
  );
};

export default KnowledgeBasePage;
