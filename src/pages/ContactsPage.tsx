import { useState } from "react";
import { Phone, Send, Video, ShieldAlert, Mail } from "lucide-react";
import { contacts } from "@/assets/data/contacts";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/Modal";
import { useTranslation } from "@/hooks/useTranslation";
import { useTelemetry } from "@/hooks/useTelemetry";

const ContactsPage = () => {
  const { t } = useTranslation();
  const telemetry = useTelemetry();
  const [sosOpen, setSosOpen] = useState(false);

  const handleSos = () => {
    setSosOpen(true);
    telemetry.track("contacts_sos_triggered", {});
  };

  const handleAction = (type: "call" | "chat" | "video", id: string) => {
    telemetry.track("contact_action", { type, id });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-skin-text">{t("contacts.title", "Корисні контакти")}</h1>
          <p className="text-sm text-skin-muted">
            {t("contacts.subtitle", "Зв’язуйтеся з наставниками та підтримкою у разі питань.")}
          </p>
        </div>
        <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleSos}>
          <ShieldAlert className="mr-2 h-4 w-4" aria-hidden /> {t("contacts.action.sos", "SOS")}
        </Button>
      </div>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-skin-text">{contact.name}</h2>
                <p className="text-sm text-skin-muted">{contact.role}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-skin-muted">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-4 w-4" aria-hidden />
                    <a href={`tel:${contact.phone}`} className="underline" onClick={() => handleAction("call", contact.id)}>
                      {contact.phone}
                    </a>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" aria-hidden />
                    <a href={`mailto:${contact.email ?? "info@galya-baluvana.ua"}`} className="underline">
                      {contact.email ?? "info@galya-baluvana.ua"}
                    </a>
                  </span>
                </div>
                <div className="mt-1 text-xs text-skin-muted">
                  {t("contacts.hours", "Години доступності: {{hours}}", { hours: contact.hours })}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="secondary"
                  onClick={() => handleAction("call", contact.id)}
                  aria-label={`${t("contacts.action.call", "Дзвінок")} ${contact.name}`}
                >
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="mr-2 h-4 w-4" aria-hidden /> {t("contacts.action.call", "Дзвінок")}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  onClick={() => handleAction("chat", contact.id)}
                  aria-label={`${t("contacts.action.chat", "Чат")} ${contact.name}`}
                >
                  <a href={`https://t.me/${contact.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-4 w-4" aria-hidden /> {t("contacts.action.chat", "Чат")}
                  </a>
                </Button>
                {contact.videoUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    onClick={() => handleAction("video", contact.id)}
                    aria-label={`${t("contacts.action.video", "Відеозв’язок")} ${contact.name}`}
                  >
                    <a href={contact.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-2 h-4 w-4" aria-hidden /> {t("contacts.action.video", "Відеозв’язок")}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={sosOpen} onClose={() => setSosOpen(false)} title={t("contacts.sos.title", "Екстрене звернення")}>
        <p className="text-sm text-skin-text">{t("contacts.sos.description", "Повідомлення надіслано менеджеру зміни та службі безпеки.")}</p>
        <div className="mt-3 space-y-1 text-xs text-skin-muted">
          <div>• +380503332211 — Менеджер зміни</div>
          <div>• +380673334455 — Служба безпеки</div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactsPage;
