import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  CheckSquare,
  Link2,
  Loader2,
  Mic,
  Send,
  Square,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveAssistantResources } from "@/lib/assistant-insights";
import type { AssistantRelatedResources } from "@/lib/assistant-insights";
import type { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/Button";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { useNavigate } from "react-router-dom";


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  persona: PersonaId;
  audioBase64?: string;
  relatedResources?: AssistantRelatedResources;
}

interface Persona {
  id: PersonaId;
  label: string;
  icon: string;
  description: string;
  gradient: string;
}

type PersonaId = "seller" | "psychologist" | "companion";

type MessagesByPersona = Record<PersonaId, Message[]>;

type SendPayload = {
  persona: PersonaId;
  text: string;
  audioBase64?: string | null;
  history: Message[];

};

const personas: Persona[] = [
  {
    id: "seller",
    label: "Продавець",
    icon: "🛒",
    description: "Про товари, техніки продажу та сервіс",
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
  },
  {
    id: "psychologist",
    label: "Психолог",
    icon: "💆",
    description: "Підтримка емоційного стану та робота зі стресом",
    gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
  },
  {
    id: "companion",
    label: "Потеревенькати",
    icon: "☕",
    description: "Легка дружня бесіда під час зміни",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
];


  const currentMessages = messagesByPersona[persona];

  const mutation = useMutation({
    mutationFn: sendAssistantMessage,
    onError: () => {
      setMessagesByPersona((prev) => ({
        ...prev,
        [persona]: [
          ...prev[persona],
          {
            id: buildMessageId("error"),
            role: "assistant",
            content: "Вибачте, сталася помилка. Перевірте інтернет або спробуйте пізніше.",
            createdAt: Date.now(),
            persona,
          },
        ],
      }));
    },
    onSuccess: (content) => {
      const resources = resolveAssistantResources(content);
      setLastResources(resources);
      setMessagesByPersona((prev) => ({
        ...prev,
        [persona]: [
          ...prev[persona],
          {
            id: buildMessageId("assistant"),
            role: "assistant",
            content,
            createdAt: Date.now(),
            persona,
            relatedResources: resources,
          },
        ],
      }));
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, mutation.isPending]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingError("Ваш браузер не підтримує запис аудіо");
      return;
    }

    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (!chunks.length) {
          setRecordingError("Запис не містить звуку");
          return;
        }

        const blob = new Blob(chunks, { type: "audio/webm" });
        const base64 = await blobToBase64(blob);
        await handleSend("🎤 Голосове повідомлення", base64);
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Помилка запису:", error);
      setRecordingError("Немає доступу до мікрофона");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  const handleSend = async (text: string, audioBase64: string | null = null) => {
    if (!text.trim() && !audioBase64) return;

    const message: Message = {
      id: buildMessageId("user"),
      role: "user",
      content: text.trim() || "Голосове повідомлення",
      createdAt: Date.now(),
      persona,
      audioBase64: audioBase64 ?? undefined,
    };

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-2xl border border-skin-ring/50 bg-skin-card/80 p-6 shadow-lg`}> 
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${personaConfig.gradient}`} aria-hidden />
        <div className="relative z-[1] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-skin-muted">AI наставник</p>
              <h1 className="text-2xl font-semibold text-skin-text">Обраний режим: {personaConfig.label}</h1>
              <p className="text-sm text-skin-muted">{personaConfig.description}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {personas.map((item) => {
              const active = item.id === persona;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPersona(item.id)}
                  className={`flex items-start gap-3 rounded-2xl border-2 bg-skin-base/70 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-skin-primary ${
                    active ? "border-skin-primary shadow-md" : "border-transparent hover:border-skin-ring"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-skin-text">{item.label}</p>
                    <p className="text-xs text-skin-muted">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-2">
        <AnimatePresence>
          {currentMessages.length === 0 && !mutation.isPending ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-dashed border-skin-ring/40 bg-skin-card/60 p-8 text-center text-sm text-skin-muted"
            >
              <div className="text-4xl">{personaConfig.icon}</div>
              <p className="mt-3">Почніть діалог — наставник підготує сценарії, статті та чек-листи.</p>
            </motion.div>
          ) : null}
          {currentMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`flex items-start gap-3 rounded-2xl border border-skin-ring/50 bg-skin-card/80 p-4 shadow-md ${
                      isUser ? "bg-skin-primary/10" : "bg-skin-base/90"
                    }`}
                  >
                    <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${
                      isUser ? "bg-skin-primary text-white" : "bg-sky-500/10 text-sky-600"
                    }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs text-skin-muted">
                        {new Date(message.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-skin-text">{message.content}</p>
                    </div>
                  </div>
                  {!isUser && message.relatedResources ? (
                    <SuggestedResources resources={message.relatedResources} />
                  ) : null}
                </div>
              </motion.div>
            );
          })}
          {mutation.isPending ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[80%] items-center gap-3 rounded-2xl border border-skin-ring/40 bg-skin-card/70 p-4 shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1 text-skin-muted">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500" style={{ animationDelay: "120ms" }}></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500" style={{ animationDelay: "240ms" }}></span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="space-y-3 rounded-2xl border border-skin-ring/60 bg-skin-card/80 p-4 shadow-xl">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSend(input);
            }
          }}
          placeholder="Напишіть повідомлення..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-skin-ring/40 bg-skin-base/70 p-3 text-sm text-skin-text shadow-inner focus:border-skin-primary focus:outline-none"
          disabled={mutation.isPending}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleVoiceClick}
            disabled={mutation.isPending}
            className={isRecording ? "border-red-400 bg-red-50 text-red-600" : undefined}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" /> Зупинити
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Голос
              </>
            )}
          </Button>
          <Button type="button" onClick={() => void handleSend(input)} disabled={!input.trim() || mutation.isPending}>
            Надіслати <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {recordingError ? <p className="text-xs text-red-500">{recordingError}</p> : null}
        {lastResources && !mutation.isPending ? <SuggestedResources resources={lastResources} /> : null}
      </div>
    </div>
  );
};

export default AssistantPage;
