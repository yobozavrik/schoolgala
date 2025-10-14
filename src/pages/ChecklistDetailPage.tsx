import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { checklists, getChecklistCopy } from "@/assets/data/checklists";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

const ChecklistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const checklist = useMemo(() => checklists.find((item) => item.id === id), [id]);
  const { completedIds, toggle, reset } = useChecklistProgress(id ?? "");
  const { t, locale } = useTranslation();
  const copy = useMemo(() => (checklist ? getChecklistCopy(checklist, locale) : null), [checklist, locale]);

  if (!checklist || !copy) {
    return (
      <div className="text-sm text-skin-muted">
        {t("checklist.detail.not_found", "Чек-лист не знайдено.")}
      </div>
    );
  }

  const progress = Math.round((completedIds.length / copy.items.length) * 100);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-skin-muted">
          {t("checklist.detail.label", "Чек-лист")}
        </p>
        <h1 className="text-2xl font-semibold text-skin-text">{copy.title}</h1>
        <p className="text-sm text-skin-muted">{copy.description}</p>
        <div className="mt-3 text-sm text-skin-primary">
          {t("checklist.detail.progress", "Виконано: {{progress}}%", { progress })}
        </div>
      </header>
      <ul className="space-y-3">
        {copy.items.map((item) => {
          const checked = completedIds.includes(item.id);
          return (
            <li key={item.id} className="flex items-start gap-3 rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-sm">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(item.id)}
                className="mt-1 h-5 w-5 rounded border-skin-ring text-skin-primary focus:ring-skin-primary"
                aria-label={item.text}
              />
              <span className={`text-sm ${checked ? "text-skin-muted line-through" : "text-skin-text"}`}>
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
      <Button type="button" variant="secondary" onClick={reset}>
        {t("checklist.detail.reset", "Скинути прогрес")}
      </Button>
    </div>
  );
};

export default ChecklistDetailPage;
