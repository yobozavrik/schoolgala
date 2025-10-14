import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import "@google/model-viewer";
import { clsx } from "clsx";
import { fetchCatalog } from "@/lib/api";
import { enableStaticPrefetch } from "@/config/env";
import { getLocalCatalogItems } from "@/lib/local-data";
import type { CatalogItem, CatalogInstruction } from "@/types/catalog";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useTelemetry } from "@/hooks/useTelemetry";

const AVAILABILITY_LOW_THRESHOLD = 5;

const InstructionPreview = ({ instruction }: { instruction: CatalogInstruction }) => {
  const { t } = useTranslation();
  if (instruction.type === "video") {
    return (
      <video
        controls
        className="w-full rounded-xl shadow-sm"
        src={instruction.source}
        poster={instruction.thumbnail}
      />
    );
  }

  return (
    <model-viewer
      src={instruction.source}
      alt={instruction.title}
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      style={{ width: "100%", height: "260px", borderRadius: "1rem", background: "#0f172a" }}
      aria-label={t("catalog.instructions.ar", "Увімкнути AR")}
    />
  );
};

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
  const { t } = useTranslation();
  const telemetry = useTelemetry();

  const itemsById = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    (data ?? []).forEach((item) => map.set(item.id, item));
    return map;
  }, [data]);

  const crossSellItems = useMemo(() => {
    if (!selected?.crossSellIds?.length) {
      return [];
    }
    return selected.crossSellIds
      .map((id) => itemsById.get(id))
      .filter((item): item is CatalogItem => Boolean(item));
  }, [itemsById, selected?.crossSellIds]);

  const handleOpen = (item: CatalogItem) => {
    setSelected(item);
    telemetry.track("catalog_item_opened", { id: item.id });
  };

  const handleCrossSellClick = (item: CatalogItem) => {
    setSelected(item);
    telemetry.track("catalog_cross_sell_clicked", { id: item.id });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">
          {t("catalog.title", "Наша продукція")}
        </h1>
        <p className="text-sm text-skin-muted">
          {t(
            "catalog.subtitle",
            "Знайомтесь із лінійкою «Галя Балувана» та відкривайте картку для деталей.",
          )}
        </p>
      </div>
      {isLoading && !isPlaceholderData ? (
        <div className="text-sm text-skin-muted">{t("common.loading", "Завантаження…")}</div>
      ) : null}
      {error ? (
        <div className="text-sm text-red-500">
          {t("common.error", "Сталася помилка. Спробуйте пізніше.")}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(data ?? []).map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleOpen(item)}
            className="overflow-hidden rounded-2xl border border-skin-ring/60 bg-skin-card text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            whileTap={{ scale: 0.97 }}
            aria-label={`${item.name}. ${item.description}`}
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
          <div className="space-y-5 text-sm text-skin-text">
            <img src={selected.image} alt={selected.name} className="w-full rounded-2xl object-cover" loading="lazy" />
            <p>{selected.description}</p>
            <div>
              <h3 className="text-base font-semibold text-skin-text">
                {t("catalog.availability.title", "Доступність по складах")}
              </h3>
              <ul className="mt-2 space-y-2">
                {selected.availability.map((slot) => {
                  const isLow = slot.stock <= AVAILABILITY_LOW_THRESHOLD;
                  return (
                    <li
                      key={slot.location}
                      className="flex items-center justify-between rounded-xl bg-skin-base/70 px-3 py-2"
                    >
                      <div>
                        <div className="font-semibold">{slot.location}</div>
                        {slot.replenishmentEta ? (
                          <div className="text-xs text-skin-muted">
                            {t("catalog.availability.replenishment", "Доставка: {{eta}}", {
                              eta: slot.replenishmentEta,
                            })}
                          </div>
                        ) : null}
                      </div>
                      <span
                        className={clsx(
                          "inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                          isLow ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {slot.stock}
                        {isLow
                          ? ` · ${t("catalog.availability.low", "Мало")}`
                          : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {crossSellItems.length ? (
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-skin-text">
                  {t("catalog.cross_sell.title", "Cross-sell рекомендації")}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {crossSellItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCrossSellClick(item)}
                      className="flex items-center gap-3 rounded-2xl border border-skin-ring/60 bg-skin-base/60 p-3 text-left shadow-sm transition hover:border-skin-primary"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div>
                        <div className="text-sm font-semibold text-skin-text">{item.name}</div>
                        <div className="text-xs text-skin-muted">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-skin-text">
                  {t("catalog.instructions.title", "Інструкції та AR")}
                </h3>
                <Button asChild variant="secondary">
                  <a href={selected.url} target="_blank" rel="noopener noreferrer">
                    {t("common.learn_more", "Докладніше")} <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                  </a>
                </Button>
              </div>
              {selected.instructions?.length ? (
                <div className="grid gap-4">
                  {selected.instructions.map((instruction) => (
                    <Fragment key={instruction.id}>
                      <div className="space-y-3 rounded-2xl border border-skin-ring/60 bg-skin-base/70 p-4 shadow-inner">
                        <div>
                          <div className="text-sm font-semibold text-skin-text">{instruction.title}</div>
                          {instruction.description ? (
                            <div className="mt-1 text-xs text-skin-muted">{instruction.description}</div>
                          ) : null}
                        </div>
                        <InstructionPreview instruction={instruction} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-skin-ring/60 p-4 text-xs text-skin-muted">
                  {t("catalog.instructions.none", "Поки немає інтерактивних матеріалів")}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CatalogPage;
