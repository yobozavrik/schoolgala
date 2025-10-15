import { useMemo } from "react";
import { testModules } from "@/assets/data/tests";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trophy } from "lucide-react";

const leaderboard = [
  { id: "maria", name: "Марія К.", points: 1280 },
  { id: "oleh", name: "Олег С.", points: 1190 },
  { id: "iryna", name: "Ірина Л.", points: 1140 },
];

const TestsPage = () => {
  const modules = useMemo(() => testModules, []);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">Перевірка знань</h1>
        <p className="text-sm text-skin-muted">
          Обирайте модуль для самоперевірки. Доступні щоденні челенджі, бали та рейтинг зміни.
        </p>
      </div>
      <div className="rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-skin-muted">Сьогоднішній челендж</p>
            <h2 className="text-lg font-semibold text-skin-text">Швидкий тест «Десерти + Апселл»</h2>
            <p className="text-sm text-skin-muted">10 запитань · Бонус: +150 балів до рейтингу зміни.</p>
          </div>
          <Button variant="primary">Пройти челендж</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="rounded-2xl border border-skin-ring/40 bg-skin-card p-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-skin-text">{module.title}</h2>
                  <p className="text-sm text-skin-muted">{module.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-skin-muted">
                    <Badge variant="outline">{module.duration}</Badge>
                    <Badge variant="soft">{module.questionsCount} питань</Badge>
                  </div>
                </div>
                <Button type="button" variant="secondary" disabled>
                  Незабаром
                </Button>
              </div>
            </div>
          ))}
        </div>
        <aside className="space-y-3 rounded-2xl border border-skin-ring/40 bg-skin-base/80 p-4 shadow-inner">
          <div className="flex items-center gap-2 text-sm font-semibold text-skin-text">
            <Trophy className="h-5 w-5 text-amber-500" /> Рейтинг зміни
          </div>
          <ul className="space-y-2 text-sm">
            {leaderboard.map((entry, index) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-skin-ring/30 bg-skin-base/90 px-3 py-2"
              >
                <span className="flex items-center gap-2">
                  <Badge variant="soft">#{index + 1}</Badge>
                  {entry.name}
                </span>
                <span className="text-skin-muted">{entry.points} балів</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-skin-muted">
            Порада: проходьте тести після чату з AI — система підкаже релевантні модулі.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default TestsPage;
