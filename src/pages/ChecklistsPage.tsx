import { useNavigate } from "react-router-dom";
import { checklists, getChecklistCopy } from "@/assets/data/checklists";
import { useTranslation } from "@/hooks/useTranslation";

const ChecklistsPage = () => {
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">
          {t("checklists.title", "Чек-листи")}
        </h1>
        <p className="text-sm text-skin-muted">
          {t("checklists.subtitle", "Підтримуйте стандарти сервісу разом із контрольними списками.")}
        </p>
      </div>
      <div className="space-y-3">
        {checklists.map((checklist) => {
          const copy = getChecklistCopy(checklist, locale);
          return (
            <button
              key={checklist.id}
              type="button"
              onClick={() => navigate(`/checklists/${checklist.id}`)}
              className="w-full rounded-2xl border border-skin-ring/60 bg-skin-base/70 p-4 text-left shadow-md transition hover:border-skin-primary"
            >
              <div className="text-sm font-semibold text-skin-text">{copy.title}</div>
              <div className="text-xs text-skin-muted">{copy.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistsPage;
