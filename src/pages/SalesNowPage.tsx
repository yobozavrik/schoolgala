import { useMemo, useState } from "react";
import { salesScripts } from "@/assets/data/sales-now";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, ClipboardList, Copy, Sparkles, Zap } from "lucide-react";

const SalesNowPage = () => {
  const scripts = useMemo(() => salesScripts, []);
  const [activeId, setActiveId] = useState(scripts[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);

  const active = scripts.find((script) => script.id === activeId) ?? scripts[0];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-skin-ring/40 bg-gradient-to-br from-skin-primary/10 via-transparent to-transparent p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-skin-muted">Режим швидких продажів</p>
            <h1 className="text-2xl font-semibold text-skin-text">Sales Now</h1>
            <p className="text-sm text-skin-muted">
              Використовуйте діагностичні питання, аргументи та крос-селл для поточної зміни.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-skin-muted">
            <Badge variant="soft" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Новий контент щодня
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-4 w-4" /> 3 сценарії
            </Badge>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <aside className="space-y-3 rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-4 shadow-inner">
          <p className="text-xs uppercase tracking-wide text-skin-muted">Сценарії зміни</p>
          <div className="space-y-2">
            {scripts.map((script) => (
              <button
                key={script.id}
                type="button"
                onClick={() => setActiveId(script.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  script.id === activeId
                    ? "border-skin-primary bg-skin-base/90 text-skin-text shadow-md"
                    : "border-skin-ring/40 bg-skin-base/70 text-skin-muted hover:border-skin-primary"
                }`}
              >
                <span className="block font-semibold">{script.title}</span>
                <span className="text-xs">{script.scenario}</span>
              </button>
            ))}
          </div>
        </aside>
        {active ? (
          <div className="space-y-5 rounded-3xl border border-skin-ring/40 bg-skin-base/80 p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-skin-text">{active.title}</h2>
                <p className="text-sm text-skin-muted">{active.scenario}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" /> {active.diagnostics.length} питань
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CardBlock title="Діагностика" items={active.diagnostics} />
              <CardBlock title="Ключові аргументи" items={active.keyArguments} accent="primary" />
              <CardBlock title="Крос-селл" items={active.crossSell} accent="emerald" iconPrefix="•" />
              <CardBlock title="Поради дегустації" items={active.tastingTips} accent="amber" iconPrefix="★" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={async () => {
                  if (!active) return;
                  try {
                    await navigator.clipboard.writeText(
                      [
                        "Діагностика:",
                        ...active.diagnostics,
                        "\nАргументи:",
                        ...active.keyArguments,
                        "\nКрос-селл:",
                        ...active.crossSell,
                      ].join("\n"),
                    );
                    setCopied(active.id);
                    window.setTimeout(() => setCopied(null), 2000);
                  } catch {
                    setCopied(null);
                  }
                }}
              >
                {copied === active.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Скопіювати план
              </Button>
              <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Повернутися до навігації
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

interface CardBlockProps {
  title: string;
  items: string[];
  accent?: "primary" | "emerald" | "amber";
  iconPrefix?: string;
}

const accentMap: Record<NonNullable<CardBlockProps["accent"]>, string> = {
  primary: "bg-skin-primary/10 text-skin-primary",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

const CardBlock = ({ title, items, accent = "primary", iconPrefix }: CardBlockProps) => (
  <div className="rounded-2xl border border-skin-ring/40 bg-skin-base/90 p-4 shadow-sm">
    <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${accentMap[accent]}`}>{title}</p>
    <ul className="mt-3 space-y-2 text-sm text-skin-text">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          {iconPrefix ? <span className="text-xs text-skin-muted">{iconPrefix}</span> : null}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default SalesNowPage;
