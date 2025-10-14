import { useMemo, useState } from "react";
import { testModules } from "@/assets/data/tests";
import { learningPlans } from "@/assets/data/learning-plans";
import { checklists, getChecklistCopy } from "@/assets/data/checklists";
import { knowledgeBaseArticles } from "@/assets/data/knowledge-base";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/Modal";
import { useTranslation } from "@/hooks/useTranslation";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useNavigate } from "react-router-dom";
import type { TestModule } from "@/types/tests";
import type { LearningPlan } from "@/types/learning-plan";

interface TestResult {
  module: TestModule;
  score: number;
  correct: number;
  total: number;
  earnedBadges: string[];
  answers: Record<string, string>;
}

const TestsPage = () => {
  const { t, locale } = useTranslation();
  const telemetry = useTelemetry();
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState<TestModule | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ message: string; variant: "positive" | "negative" } | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);

  const currentQuestion = activeModule?.questions[currentIndex];
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  const leaderboard = useMemo(() => {
    const base = [
      { name: "Оля", score: 94 },
      { name: "Максим", score: 88 },
      { name: "Ірина", score: 81 },
    ];
    if (result) {
      base.push({ name: t("tests.gamification.you", "Ви"), score: result.score });
    }
    return base
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry, index) => ({ ...entry, position: index + 1 }));
  }, [result, t]);

  const resetState = () => {
    setAnswers({});
    setRevealedHints({});
    setFeedback(null);
  };

  const handleStart = (module: TestModule) => {
    resetState();
    setResult(null);
    setActiveModule(module);
    setCurrentIndex(0);
    telemetry.track("test_started", { moduleId: module.id });
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleRevealHint = () => {
    if (!currentQuestion || revealedHints[currentQuestion.id]) {
      return;
    }
    setRevealedHints((prev) => ({ ...prev, [currentQuestion.id]: true }));
    telemetry.track("test_hint_revealed", {
      moduleId: activeModule?.id,
      questionId: currentQuestion.id,
    });
  };

  const finalizeModule = (module: TestModule) => {
    const total = module.questions.length;
    const correct = module.questions.filter((question) => answers[question.id] === question.correctOptionId).length;
    const score = Math.round((correct / total) * 100);
    const earnedBadges = score >= 80 ? module.badges ?? [] : [];
    setResult({ module, score, correct, total, earnedBadges, answers });
    setActiveModule(null);
    setFeedback(null);
    telemetry.track("test_finished", { moduleId: module.id, score, correct, total, earnedBadges });
  };

  const handleAdvance = () => {
    if (!activeModule || !currentQuestion) {
      return;
    }
    const chosen = answers[currentQuestion.id];
    if (!chosen) {
      return;
    }
    const isCorrect = chosen === currentQuestion.correctOptionId;
    const correctOption = currentQuestion.options.find((option) => option.id === currentQuestion.correctOptionId);
    setFeedback({
      message: isCorrect
        ? t("tests.feedback.correct", "Чудово! Відповідь правильна.")
        : t("tests.feedback.incorrect", "Зверніть увагу: правильна відповідь — {{answer}}.", {
            answer: correctOption?.text ?? "",
          }),
      variant: isCorrect ? "positive" : "negative",
    });
    telemetry.track("test_question_answered", {
      moduleId: activeModule.id,
      questionId: currentQuestion.id,
      isCorrect,
    });

    if (currentIndex < activeModule.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finalizeModule(activeModule);
    }
  };

  const handleResourceNavigate = (path: string, eventName: string, payload: Record<string, unknown>) => {
    telemetry.track(eventName, payload);
    navigate(path);
  };

  const handlePlanOpen = (plan: LearningPlan) => {
    setSelectedPlan(plan);
    telemetry.track("learning_plan_opened", { id: plan.id });
  };

  const renderModuleList = () => (
    <div className="space-y-3">
      {testModules.map((module) => (
        <div key={module.id} className="rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-skin-text">{module.title}</h2>
              <p className="text-sm text-skin-muted">{module.description}</p>
              <div className="mt-2 text-xs text-skin-muted">
                {module.duration} · {module.questionsCount} {t("tests.questions_label", "питань")}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => handleStart(module)}>
                {t("tests.start", "Почати")}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuestion = () => {
    if (!activeModule || !currentQuestion) {
      return null;
    }
    const total = activeModule.questions.length;
    const progressLabel = t("tests.progress", "Питання {{current}}/{{total}}", {
      current: currentIndex + 1,
      total,
    });

    return (
      <div className="space-y-4 rounded-2xl border border-skin-ring/60 bg-skin-card p-5 shadow-lg">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-skin-muted">
          <span>{activeModule.title}</span>
          <span>{progressLabel}</span>
        </div>
        <div className="text-base font-semibold text-skin-text">{currentQuestion.text}</div>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-skin-primary ${
                  isSelected
                    ? "border-skin-primary bg-skin-primary/10 text-skin-text"
                    : "border-skin-ring/40 bg-skin-base/70 text-skin-text hover:border-skin-primary/60"
                }`}
                aria-pressed={isSelected}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentQuestion.hint ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleRevealHint}
              disabled={Boolean(revealedHints[currentQuestion.id])}
            >
              {t("tests.hint", "Підказка")}
            </Button>
          ) : null}
          <Button type="button" onClick={handleAdvance} disabled={!selectedOption}>
            {currentIndex === activeModule.questions.length - 1
              ? t("tests.finish", "Завершити")
              : t("tests.next", "Далі")}
          </Button>
        </div>
        {revealedHints[currentQuestion.id] && currentQuestion.hint ? (
          <div className="rounded-xl bg-skin-base/60 p-3 text-xs text-skin-muted" role="status">
            {currentQuestion.hint}
          </div>
        ) : null}
        {feedback ? (
          <div
            className={`rounded-xl px-3 py-2 text-xs ${
              feedback.variant === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
            role="status"
          >
            {feedback.message}
          </div>
        ) : null}
      </div>
    );
  };

  const renderResult = () => {
    if (!result) {
      return null;
    }

    const checklistEntries = result.module.recommendedChecklists
      ?.map((id) => {
        const checklist = checklists.find((item) => item.id === id);
        if (!checklist) {
          return null;
        }
        const copy = getChecklistCopy(checklist, locale);
        return { id, title: copy.title };
      })
      .filter((entry): entry is { id: string; title: string } => Boolean(entry));
    const articleEntries = result.module.recommendedArticles
      ?.map((id) => {
        const article = knowledgeBaseArticles.find((item) => item.id === id);
        return article ? { id, title: article.title } : null;
      })
      .filter((entry): entry is { id: string; title: string } => Boolean(entry));
    const testEntries = result.module.recommendedTests
      ?.map((id) => {
        const module = testModules.find((item) => item.id === id);
        return module ? { id, title: module.title } : null;
      })
      .filter((entry): entry is { id: string; title: string } => Boolean(entry));

    return (
      <div className="space-y-3 rounded-2xl border border-skin-ring/60 bg-skin-base/80 p-5 shadow-md">
        <h2 className="text-lg font-semibold text-skin-text">
          {t("tests.score", "Ваш результат: {{score}}% ({{correct}} з {{total}})", {
            score: result.score,
            correct: result.correct,
            total: result.total,
          })}
        </h2>
        {result.earnedBadges.length ? (
          <div className="flex flex-wrap gap-2">
            {result.earnedBadges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        ) : null}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-skin-text">
            {t("tests.review.title", "Рекомендації для повторення")}
          </div>
          <ul className="space-y-1 text-sm text-skin-muted">
            {checklistEntries?.map((entry) => (
              <li key={`checklist-${entry.id}`}>
                <button
                  type="button"
                  className="underline"
                  onClick={() =>
                    handleResourceNavigate(`/checklists/${entry.id}`, "test_recommendation_checklist", {
                      moduleId: result.module.id,
                      checklist: entry.title,
                    })
                  }
                >
                  {t("tests.review.checklist", "Чек-лист: {{title}}", { title: entry.title })}
                </button>
              </li>
            ))}
            {articleEntries?.map((entry) => (
              <li key={`article-${entry.id}`}>
                <button
                  type="button"
                  className="underline"
                  onClick={() =>
                    handleResourceNavigate(`/kb/${entry.id}`, "test_recommendation_article", {
                      moduleId: result.module.id,
                      article: entry.title,
                    })
                  }
                >
                  {t("tests.review.article", "Стаття: {{title}}", { title: entry.title })}
                </button>
              </li>
            ))}
            {testEntries?.map((entry) => (
              <li key={`test-${entry.id}`}>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    const nextModule = testModules.find((module) => module.id === entry.id);
                    if (nextModule) {
                      handleStart(nextModule);
                    }
                  }}
                >
                  {t("tests.review.test", "Тест: {{title}}", { title: entry.title })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderLearningPlans = (plans: LearningPlan[]) => (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-skin-text">
          {t("learning_plans.title", "Плани навчання")}
        </h2>
        <p className="text-sm text-skin-muted">
          {t(
            "learning_plans.subtitle",
            "Комбінуйте чек-листи, статті та тести, щоб закріпити знання.",
          )}
        </p>
      </div>
      <div className="space-y-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-skin-text">{plan.title}</h3>
                <p className="text-sm text-skin-muted">{plan.description}</p>
                <div className="mt-2 text-xs text-skin-muted">
                  {t("learning_plans.meta", "{{duration}} · {{checklists}} чек-лист(и) · {{articles}} статті · {{tests}} тести", {
                    duration: plan.duration,
                    checklists: plan.checklistIds.length,
                    articles: plan.articleIds.length,
                    tests: plan.testIds.length,
                  })}
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={() => handlePlanOpen(plan)}>
                {t("learning_plans.complete", "Переглянути план")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">{t("tests.title", "Перевірка знань")}</h1>
        <p className="text-sm text-skin-muted">
          {t("tests.subtitle", "Обирайте модуль і проходьте перевірку навичок у реальному часі.")}
        </p>
      </div>
      {result ? renderResult() : null}
      {activeModule ? renderQuestion() : renderModuleList()}
      <section className="space-y-3 rounded-2xl border border-skin-ring/60 bg-skin-base/80 p-4 shadow-md">
        <div className="text-base font-semibold text-skin-text">
          {t("tests.gamification.badges_title", "Досягнення")}
        </div>
        {result?.earnedBadges?.length ? (
          <div className="flex flex-wrap gap-2">
            {result.earnedBadges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-skin-muted">—</div>
        )}
        <div className="text-base font-semibold text-skin-text">
          {t("tests.gamification.rankings_title", "Рейтинг зміни")}
        </div>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between rounded-xl bg-skin-card px-3 py-2 text-sm text-skin-text"
            >
              <span>
                {entry.position}. {entry.name}
              </span>
              <span className="font-semibold">{entry.score}</span>
            </div>
          ))}
        </div>
      </section>
      {renderLearningPlans(learningPlans)}
      <Modal
        open={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        title={selectedPlan?.title ?? ""}
      >
        {selectedPlan ? (
          <div className="space-y-3 text-sm text-skin-text">
            <p>{selectedPlan.description}</p>
            <div className="text-xs text-skin-muted">
              {t("learning_plans.meta", "{{duration}} · {{checklists}} чек-лист(и) · {{articles}} статті · {{tests}} тести", {
                duration: selectedPlan.duration,
                checklists: selectedPlan.checklistIds.length,
                articles: selectedPlan.articleIds.length,
                tests: selectedPlan.testIds.length,
              })}
            </div>
            <div className="space-y-2">
              {selectedPlan.checklistIds.map((id) => {
                const checklist = checklists.find((item) => item.id === id);
                if (!checklist) {
                  return null;
                }
                const copy = getChecklistCopy(checklist, locale);
                return (
                  <button
                    key={id}
                    type="button"
                    className="block w-full rounded-xl border border-skin-ring/60 bg-skin-base/70 px-3 py-2 text-left text-sm"
                    onClick={() => handleResourceNavigate(`/checklists/${id}`, "plan_open_checklist", { id, title: copy.title })}
                  >
                    {t("tests.review.checklist", "Чек-лист: {{title}}", { title: copy.title })}
                  </button>
                );
              })}
              {selectedPlan.articleIds.map((id) => {
                const article = knowledgeBaseArticles.find((item) => item.id === id);
                if (!article) {
                  return null;
                }
                return (
                  <button
                    key={id}
                    type="button"
                    className="block w-full rounded-xl border border-skin-ring/60 bg-skin-base/70 px-3 py-2 text-left text-sm"
                    onClick={() => handleResourceNavigate(`/kb/${id}`, "plan_open_article", { id })}
                  >
                    {t("tests.review.article", "Стаття: {{title}}", { title: article.title })}
                  </button>
                );
              })}
              {selectedPlan.testIds.map((id) => {
                const module = testModules.find((item) => item.id === id);
                if (!module) {
                  return null;
                }
                return (
                  <button
                    key={id}
                    type="button"
                    className="block w-full rounded-xl border border-skin-ring/60 bg-skin-base/70 px-3 py-2 text-left text-sm"
                    onClick={() => {
                      handleStart(module);
                      setSelectedPlan(null);
                    }}
                  >
                    {t("tests.review.test", "Тест: {{title}}", { title: module.title })}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default TestsPage;
