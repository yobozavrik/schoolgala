import { contacts } from "@/assets/data/contacts";
import { Button } from "@/components/ui/Button";
import { Phone, Send } from "lucide-react";

const ContactsPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">Корисні контакти</h1>
        <p className="text-sm text-skin-muted">Зв’язуйтеся з наставниками та підтримкою у разі питань.</p>
      </div>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="rounded-2xl border border-skin-ring/60 bg-skin-card p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-skin-text">{contact.name}</h2>
                <p className="text-sm text-skin-muted">{contact.role}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-skin-muted">
                  <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{contact.phone}</span>
                  <span className="inline-flex items-center gap-1"><Send className="h-4 w-4" />{contact.telegram}</span>
                </div>
              </div>
              <Button asChild>
                <a href={`https://t.me/${contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  Написати
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
