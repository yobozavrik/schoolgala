import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { fetchCatalog } from "@/lib/api";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalCatalogItems } from "@/lib/local-data";
import type { CatalogItem } from "@/types/catalog";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";

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
            className="overflow-hidden rounded-2xl border border-skin-ring/60 bg-skin-card text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            whileTap={{ scale: 0.97 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-32 w-full object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <div className="text-sm font-semibold text-skin-text">{item.name}</div>
              <div className="mt-1 text-xs text-skin-muted">{item.description}</div>
            </div>
          </motion.button>
        ))}
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected ? (
          <div className="space-y-4 text-sm text-skin-text">
            <img src={selected.image} alt={selected.name} className="w-full rounded-2xl object-cover" loading="lazy" />
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
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CatalogPage;
