import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { checklists } from "@/assets/data/checklists";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const ChecklistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const checklist = useMemo(() => checklists.find((item) => item.id === id), [id]);
  const { completedIds, toggle, reset } = useChecklistProgress(id ?? "");

  if (!checklist) {
    return <div className="text-sm text-skin-muted">Чек-лист не знайдено.</div>;
  }

  const progress = Math.round((completedIds.length / checklist.items.length) * 100);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-skin-muted">Чек-лист</p>
        <h1 className="text-2xl font-semibold text-skin-text">{checklist.title}</h1>
        <p className="text-sm text-skin-muted">{checklist.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-skin-muted">
          <span className="font-semibold text-skin-text">Виконано: {progress}%</span>
          {checklist.lastCompletedAt ? (
            <Badge variant="outline">
              Востаннє: {new Date(checklist.lastCompletedAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          ) : null}
          {checklist.reminderMinutes ? (
            <Badge variant="soft">Нагадування {Math.round(checklist.reminderMinutes / 60)} год</Badge>
          ) : null}
        </div>
      </header>
      <ul className="space-y-3">
        {checklist.items.map((item) => {
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
              <div className="flex flex-col gap-1">
                <span className={`text-sm ${checked ? "text-skin-muted line-through" : "text-skin-text"}`}>{item.text}</span>
                {item.helperLink ? (
                  <a
                    href={item.helperLink}
                    className="text-xs text-skin-primary underline-offset-2 hover:underline"
                    target={item.helperLink.startsWith("http") ? "_blank" : undefined}
                    rel={item.helperLink.startsWith("http") ? "noreferrer" : undefined}
                  >
                    Підказка
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <Button type="button" variant="secondary" onClick={reset}>
        Скинути прогрес
      </Button>
    </div>
  );
};

export default ChecklistDetailPage;
