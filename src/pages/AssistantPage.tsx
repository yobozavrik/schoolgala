import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AudioLines, Send } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingDots } from "@/components/chat/TypingDots";
import { sendAiMessage } from "@/lib/api";
import { useTelegramContext } from "@/providers/TelegramProvider";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  videoUrl?: string;
}

const personas = [
  { id: "seller", label: "Продавець" },
  { id: "helper", label: "Наставник" },
  { id: "friendly", label: "Друг" },
];

const AssistantPage = () => {
  const { initData } = useTelegramContext();
  const [persona, setPersona] = useState(personas[0].id);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendAiMessage,
  });

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    try {
      const response = await mutateAsync({ text: trimmed, persona, initData });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.output,
          image: response.image,
          videoUrl: response.videoUrl,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error instanceof Error ? error.message : "Сталася помилка. Спробуйте пізніше.",
        },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-2xl bg-skin-base/80 p-4 shadow-md">
        <span className="text-xs uppercase tracking-wide text-skin-muted">Персона</span>
        <div className="mt-3 inline-flex rounded-full bg-skin-base p-1 shadow-inner">
          {personas.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPersona(item.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                persona === item.id
                  ? "bg-skin-primary text-white shadow"
                  : "text-skin-muted hover:text-skin-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <section className="flex-1 overflow-hidden rounded-2xl bg-skin-card p-4 shadow-inner">
        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1" role="list">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              from={message.role}
              media={
                message.image ? (
                  <img src={message.image} alt="Ілюстрація" className="h-auto w-full" loading="lazy" />
                ) : message.videoUrl ? (
                  <a
                    href={message.videoUrl}
                    className="block rounded-2xl bg-skin-base/80 p-3 text-center text-sm text-skin-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Переглянути відео
                  </a>
                ) : null
              }
            >
              {message.content}
            </ChatBubble>
          ))}
          {isPending ? (
            <ChatBubble from="assistant">
              <TypingDots />
            </ChatBubble>
          ) : null}
          {!messages.length && !isPending ? (
            <div className="mt-12 text-center text-sm text-skin-muted">
              Почніть діалог — напишіть питання про продукт або сервіс.
            </div>
          ) : null}
        </div>
      </section>
      <section className="flex flex-col gap-2 rounded-2xl bg-skin-base/70 p-4 shadow-md">
        <Textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Напишіть повідомлення…"
          rows={3}
        />
        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" className="px-3 text-sm" disabled>
            <AudioLines className="mr-2 h-4 w-4" /> Голос
          </Button>
          <Button type="button" onClick={handleSend} disabled={isPending || !inputValue.trim()}>
            Надіслати <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AssistantPage;
