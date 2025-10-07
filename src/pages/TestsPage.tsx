import { testModules } from "@/assets/data/tests";
import { Button } from "@/components/ui/Button";

const TestsPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">Перевірка знань</h1>
        <p className="text-sm text-skin-muted">Обирайте модуль для самоперевірки. Повна інтеграція з тестами на підході.</p>
      </div>
      <div className="space-y-3">
        {testModules.map((module) => (
          <div key={module.id} className="rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-skin-text">{module.title}</h2>
                <p className="text-sm text-skin-muted">{module.description}</p>
                <div className="mt-2 text-xs text-skin-muted">
                  Тривалість: {module.duration} · Питань: {module.questionsCount}
                </div>
              </div>
              <Button type="button" variant="secondary" disabled>
                Незабаром
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestsPage;
