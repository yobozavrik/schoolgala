import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";

export const ErrorFallback = ({ resetError }: { resetError?: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-sm rounded-2xl border border-skin-ring/60 bg-skin-base/80 p-6 text-center shadow-lg">
        <h2 className="text-lg font-semibold text-skin-text">
          {t("common.error", "Сталася помилка. Спробуйте пізніше.")}
        </h2>
        <p className="mt-2 text-sm text-skin-muted">
          {t("errors.fallback.subtitle", "Ми зафіксували інцидент і вже працюємо над вирішенням.")}
        </p>
        {resetError ? (
          <Button type="button" className="mt-4" onClick={resetError}>
            {t("common.retry", "Спробувати ще раз")}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
