import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Lightbulb, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  bundleIdeas,
  dailyFocusList,
  objectionResponses,
  salesPlaybooks,
} from "@/assets/data/sales-tools";
import type { SalesPlaybook } from "@/types/sales";

const buildPlaybookScript = (playbook: SalesPlaybook): string => {
  const stepsText = playbook.steps
    .map((step, index) => `${index + 1}. ${step.title}: ${step.example}`)
    .join("\n");
  const upsells = playbook.upsellIdeas.map((idea) => `- ${idea}`).join("\n");

  return `Сценарій: ${playbook.title}\nМета: ${playbook.goal}\n\n${stepsText}\n\nФінал: ${playbook.closing}\n\nІдеї для підсилення:\n${upsells}`;
};

const SalesToolsPage = () => {
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(salesPlaybooks[0]?.id ?? "");
  const [copiedPlaybookId, setCopiedPlaybookId] = useState<string | null>(null);
  const [selectedObjectionId, setSelectedObjectionId] = useState<string>(
    objectionResponses[0]?.id ?? "",
  );

  const selectedPlaybook = useMemo(
    () => salesPlaybooks.find((item) => item.id === selectedPlaybookId) ?? salesPlaybooks[0],
    [selectedPlaybookId],
  );

  const selectedObjection = useMemo(
    () => objectionResponses.find((item) => item.id === selectedObjectionId) ?? objectionResponses[0],
    [selectedObjectionId],
  );

  const todayFocus = useMemo(() => {
    if (!dailyFocusList.length) {
      return null;
    }
    const todayIndex = new Date().getDay() % dailyFocusList.length;
    return dailyFocusList[todayIndex];
  }, []);

  const handleCopyScript = async () => {
    if (!selectedPlaybook) return;
    try {
      await navigator.clipboard?.writeText(buildPlaybookScript(selectedPlaybook));
      setCopiedPlaybookId(selectedPlaybook.id);
      setTimeout(() => setCopiedPlaybookId(null), 2500);
    } catch (error) {
      console.error("Не вдалося скопіювати скрипт", error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-3 rounded-2xl bg-skin-base/80 p-6 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 text-skin-primary" aria-hidden />
          <div>
            <h1 className="text-2xl font-semibold text-skin-text">Інструменти продажу</h1>
            <p className="mt-1 text-sm text-skin-muted">
              Готові скрипти, робота із запереченнями та набори, які допоможуть закрити продаж у будь-якій ситуації.
            </p>
          </div>
        </div>
        {todayFocus ? (
          <div className="rounded-2xl border border-skin-ring/50 bg-skin-card/70 p-4">
            <div className="flex items-start gap-2 text-sm text-skin-text">
              <Lightbulb className="mt-0.5 h-4 w-4 text-skin-primary" aria-hidden />
              <div>
                <div className="font-medium">{todayFocus.title}</div>
                <p className="mt-1 text-skin-muted">{todayFocus.context}</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-skin-text">
                  {todayFocus.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
                <div className="mt-2 inline-flex rounded-full bg-skin-primary/10 px-3 py-1 text-xs font-semibold text-skin-primary">
                  Показник дня: {todayFocus.metric}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-4 rounded-2xl bg-skin-base/80 p-6 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-skin-text">Скрипти ситуацій</h2>
            <p className="text-sm text-skin-muted">Обирай сценарій — отримаєш готові кроки, щоб впевнено вести діалог.</p>
          </div>
          <Button type="button" variant="secondary" onClick={handleCopyScript} className="text-sm">
            {copiedPlaybookId === selectedPlaybook?.id ? "Скрипт скопійовано" : "Скопіювати"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {salesPlaybooks.map((playbook) => (
            <button
              key={playbook.id}
              type="button"
              onClick={() => setSelectedPlaybookId(playbook.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                playbook.id === selectedPlaybookId
                  ? "border-skin-primary bg-skin-primary text-white shadow"
                  : "border-skin-ring/60 bg-skin-card/70 text-skin-muted hover:text-skin-text"
              }`}
            >
              {playbook.title}
            </button>
          ))}
        </div>
        {selectedPlaybook ? (
          <div className="space-y-4 rounded-2xl border border-skin-ring/50 bg-skin-card/70 p-5">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-skin-muted">Ситуація</div>
              <div className="text-base font-semibold text-skin-text">{selectedPlaybook.scenario}</div>
              <p className="text-sm text-skin-muted">Мета: {selectedPlaybook.goal}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-skin-muted">Коли використати</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPlaybook.triggers.map((trigger) => (
                  <Badge key={trigger} className="border border-skin-ring/60 bg-skin-card/80 text-skin-text">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {selectedPlaybook.steps.map((step, index) => (
                <div key={step.title} className="rounded-xl bg-skin-base/70 p-4">
                  <div className="text-sm font-semibold text-skin-text">
                    {index + 1}. {step.title}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-skin-muted">Що зробити</div>
                  <p className="text-sm text-skin-text">{step.prompt}</p>
                  <div className="mt-2 text-xs uppercase tracking-wide text-skin-muted">Фраза</div>
                  <p className="text-sm text-skin-text">{step.example}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-dashed border-skin-ring/60 bg-skin-base/60 p-4 text-sm text-skin-text">
              <div className="font-semibold">Як завершити:</div>
              <p className="mt-1 text-skin-text">{selectedPlaybook.closing}</p>
              <div className="mt-3 text-xs uppercase tracking-wide text-skin-muted">Підсилення</div>
              <ul className="mt-1 list-inside list-disc space-y-1">
                {selectedPlaybook.upsellIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="space-y-4 rounded-2xl bg-skin-base/80 p-6 shadow-lg"
      >
        <div className="flex items-start gap-2">
          <ClipboardCheck className="mt-1 h-5 w-5 text-skin-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold text-skin-text">Відпрацювання заперечень</h2>
            <p className="text-sm text-skin-muted">
              Обирай типове заперечення клієнта та тримай під рукою готову відповідь з емпатією та логікою.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {objectionResponses.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedObjectionId(item.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                item.id === selectedObjectionId
                  ? "border-skin-primary bg-skin-primary text-white shadow"
                  : "border-skin-ring/60 bg-skin-card/70 text-skin-muted hover:text-skin-text"
              }`}
            >
              {item.objection}
            </button>
          ))}
        </div>
        {selectedObjection ? (
          <div className="space-y-3 rounded-2xl border border-skin-ring/60 bg-skin-card/70 p-5 text-sm text-skin-text">
            <div>
              <div className="text-xs uppercase tracking-wide text-skin-muted">Емпатія</div>
              <p>{selectedObjection.empathy}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-skin-muted">Аргумент</div>
              <p>{selectedObjection.answer}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-skin-muted">Фінальне питання</div>
              <p>{selectedObjection.followUp}</p>
            </div>
          </div>
        ) : null}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="space-y-4 rounded-2xl bg-skin-base/80 p-6 shadow-lg"
      >
        <div className="flex items-start gap-2">
          <PartyPopper className="mt-1 h-5 w-5 text-skin-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold text-skin-text">Готові набори для продажу</h2>
            <p className="text-sm text-skin-muted">
              Надихайся комбінаціями продуктів «Галя Балувана», щоб пропонувати рішення під різні ситуації.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {bundleIdeas.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-2xl border border-skin-ring/60 bg-skin-card/70 p-5 text-sm text-skin-text"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-base font-semibold text-skin-text">{bundle.name}</div>
                <Badge className="bg-skin-primary/15 text-skin-primary">{bundle.priceAnchor}</Badge>
              </div>
              <p className="mt-1 text-skin-muted">{bundle.description}</p>
              <div className="mt-3 text-xs uppercase tracking-wide text-skin-muted">Головний герой</div>
              <p>{bundle.heroProduct}</p>
              <div className="mt-3 text-xs uppercase tracking-wide text-skin-muted">Що додати</div>
              <ul className="mt-1 list-inside list-disc space-y-1">
                {bundle.contents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-3 text-xs uppercase tracking-wide text-skin-muted">Як презентувати</div>
              <p>{bundle.pitch}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default SalesToolsPage;
