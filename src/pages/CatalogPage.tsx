import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Play, ShieldAlert } from "lucide-react";
import { fetchCatalog } from "@/lib/api";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalCatalogItems } from "@/lib/local-data";
import type { CatalogItem } from "@/types/catalog";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const CatalogPage = () => {
  const { data, isLoading, error, isPlaceholderData } = useQuery<CatalogItem[]>({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
    initialData: enableStaticPrefetch ? () => getLocalCatalogItems() : undefined,
    placeholderData: enableStaticPrefetch
      ? (previous) => previous ?? getLocalCatalogItems()
      : undefined,
  });
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [copiedObjectionId, setCopiedObjectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"highlights" | "serving" | "objections">("highlights");

  const availabilityLabel = useMemo(() => {
    if (!selected) return "";
    return selected.availability === "in-stock" ? "В наявності" : "Під замовлення";
  }, [selected]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">Наша продукція</h1>
        <p className="text-sm text-skin-muted">Знайомтесь із лінійкою «Галя Балувана» та відкривайте картку для деталей.</p>
      </div>
      {isLoading && !isPlaceholderData ? (
        <div className="text-sm text-skin-muted">Завантаження…</div>
      ) : null}
      {error ? (
        <div className="text-sm text-red-500">Не вдалося отримати каталог. Спробуйте пізніше.</div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(data ?? []).map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setSelected(item)}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-skin-ring/60 bg-skin-card text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            whileTap={{ scale: 0.97 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-32 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-3">
              <div className="text-sm font-semibold text-skin-text">{item.name}</div>
              <div className="mt-1 text-xs text-skin-muted">{item.description}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="soft">{item.segment}</Badge>
                <Badge variant={item.availability === "in-stock" ? "soft" : "outline"}>
                  {item.availability === "in-stock" ? "В наявності" : "Під замовлення"}
                </Badge>
                <Badge variant="outline">{item.badge}</Badge>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <Modal
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setActiveTab("highlights");
          setCopiedObjectionId(null);
        }}
        title={selected?.name ?? ""}
      >
        {selected ? (
          <div className="space-y-4 text-sm text-skin-text">
            <img
              src={selected.image}
              alt={selected.name}
              className="w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-skin-muted">
              <Badge variant="soft">{selected.segment}</Badge>
              <Badge variant={selected.availability === "in-stock" ? "soft" : "outline"}>{availabilityLabel}</Badge>
              <Badge variant="outline">{selected.badge}</Badge>
              {selected.storageNotes ? <span className="inline-flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" />{selected.storageNotes}</span> : null}
            </div>
            <p>{selected.description}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={selected.url} target="_blank" rel="noopener noreferrer">
                  Відкрити на сайті <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {selected.videoUrl ? (
                <Button asChild variant="secondary">
                  <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer">
                    Відео приготування <Play className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>
            <div className="rounded-2xl border border-skin-ring/40 bg-skin-base/80">
              <div className="flex items-center justify-between border-b border-skin-ring/30">
                {(
                  [
                    { id: "highlights", label: "Склад та переваги" },
                    { id: "serving", label: "Подача" },
                    { id: "objections", label: "Питання клієнтів" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-xs font-medium transition ${
                      activeTab === tab.id
                        ? "bg-skin-base/90 text-skin-text"
                        : "text-skin-muted hover:bg-skin-base/70"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="space-y-3 p-4">
                {activeTab === "highlights" ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {selected.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    {selected.allergens?.length ? (
                      <li className="text-skin-muted">Алергени: {selected.allergens.join(", ")}</li>
                    ) : null}
                    {selected.pairingIdeas?.length ? (
                      <li className="text-skin-muted">Комбо: {selected.pairingIdeas.join(", ")}</li>
                    ) : null}
                  </ul>
                ) : null}
                {activeTab === "serving" ? (
                  <ol className="list-decimal space-y-2 pl-5 text-sm">
                    {selected.servingTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ol>
                ) : null}
                {activeTab === "objections" ? (
                  <div className="space-y-3">
                    {selected.objections.map((objection) => (
                      <div
                        key={objection.id}
                        className="rounded-2xl border border-skin-ring/40 bg-skin-base/90 p-3 text-sm shadow-sm"
                      >
                        <p className="font-semibold text-skin-text">{objection.question}</p>
                        <p className="mt-1 text-skin-muted">{objection.answer}</p>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mt-2"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(objection.answer);
                              setCopiedObjectionId(objection.id);
                              window.setTimeout(() => setCopiedObjectionId(null), 2000);
                            } catch {
                              setCopiedObjectionId(null);
                            }
                          }}
                        >
                          {copiedObjectionId === objection.id ? (
                            <>
                              <Check className="h-4 w-4" /> Скопійовано
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" /> Скопіювати відповідь
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CatalogPage;
