import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AudioLines, Send, Square } from "lucide-react";
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
  audioUrl?: string;
}

const personas = [
  {
    id: "seller",
    label: "Продавець",
    description: "Про товари, техніки продажу, мерчендайзинг та сервіс",
  },
  {
    id: "psychologist",
    label: "Психолог",
    description: "Підтримка емоційного стану, робота зі стресом та втомою",
  },
  {
    id: "companion",
    label: "Потеревенькати",
    description: "Легка дружня бесіда, щоб відволіктися під час зміни",
  },
];

const AssistantPage = () => {
  const { initData } = useTelegramContext();
  const [persona, setPersona] = useState(personas[0].id);
  const [inputValue, setInputValue] = useState("");
  const [messagesByPersona, setMessagesByPersona] = useState<Record<string, ChatMessage[]>>(
    () =>
      Object.fromEntries(personas.map((item) => [item.id, []])) as Record<string, ChatMessage[]>,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [canRecordAudio, setCanRecordAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioUrlsRef = useRef<string[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendAiMessage,
  });

  const currentMessages = messagesByPersona[persona] ?? [];
  const activePersona = personas.find((item) => item.id === persona);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const getUserMedia = navigator.mediaDevices?.getUserMedia;
      if (typeof getUserMedia === "function") {
        setCanRecordAudio(true);
      }
    }
  }, []);

  useEffect(
    () => () => {
      audioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      audioUrlsRef.current = [];
      const stream = streamRef.current;
      stream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    },
    [],
  );

  const sendMessage = async ({
    text,
    audioBase64,
    audioUrl,
    personaId = persona,
  }: {
    text?: string;
    audioBase64?: string;
    audioUrl?: string;
    personaId?: string;
  }) => {
    const trimmed = text?.trim();
    if (!trimmed && !audioBase64) {
      return;
    }

    if (trimmed) {
      setInputValue("");
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed ?? "Голосове повідомлення",
      audioUrl,
    };

    setMessagesByPersona((prev) => {
      const prevMessages = prev[personaId] ?? [];
      return {
        ...prev,
        [personaId]: [...prevMessages, userMessage],
      };
    });

    try {
      const response = await mutateAsync({
        text: trimmed,
        audioBase64,
        persona: personaId,
        initData,
      });
      setMessagesByPersona((prev) => {
        const prevMessages = prev[personaId] ?? [];
        return {
          ...prev,
          [personaId]: [
            ...prevMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: response.output,
              image: response.image,
              videoUrl: response.videoUrl,
            },
          ],
        };
      });
    } catch (error) {
      setMessagesByPersona((prev) => {
        const prevMessages = prev[personaId] ?? [];
        return {
          ...prev,
          [personaId]: [
            ...prevMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content:
                error instanceof Error
                  ? error.message
                  : "Сталася помилка. Спробуйте пізніше.",
            },
          ],
        };
      });
    }
  };

  const handleSend = async () => {
    await sendMessage({ text: inputValue, personaId: persona });
  };

  const blobToBase64 = async (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const base64 = result.split(",")[1] ?? "";
          resolve(base64);
        } else {
          reject(new Error("Не вдалося обробити аудіо"));
        }
      };
      reader.onerror = () => reject(new Error("Не вдалося обробити аудіо"));
      reader.readAsDataURL(blob);
    });

  const stopStreamTracks = () => {
    const stream = streamRef.current;
    stream?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  const startRecording = async () => {
    if (!canRecordAudio || isRecording) {
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
        stopStreamTracks();
        mediaRecorderRef.current = null;
        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];
        if (!chunks.length) {
          setRecordingError("Запис не містить звуку. Спробуйте ще раз.");
          return;
        }

        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
        if (blob.size === 0) {
          setRecordingError("Запис не містить звуку. Спробуйте ще раз.");
          return;
        }

        try {
          const base64 = await blobToBase64(blob);
          const objectUrl = URL.createObjectURL(blob);
          audioUrlsRef.current.push(objectUrl);
          await sendMessage({ audioBase64: base64, audioUrl: objectUrl, personaId: persona });
        } catch (error) {
          setRecordingError(
            error instanceof Error ? error.message : "Не вдалося підготувати аудіо.",
          );
        }
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      stopStreamTracks();
      setRecordingError(
        error instanceof Error
          ? error.message
          : "Немає доступу до мікрофона. Перевірте налаштування.",
      );
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-2xl bg-skin-base/80 p-4 shadow-md">
        <span className="text-xs uppercase tracking-wide text-skin-muted">
          Інтелектуальні агенти
        </span>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {personas.map((item) => {
            const isActive = persona === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPersona(item.id)}
                className={`flex h-full flex-col rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 ${
                  isActive
                    ? "border-skin-primary bg-skin-primary/10 text-skin-text shadow"
                    : "border-transparent bg-skin-base text-skin-muted hover:border-skin-primary/40 hover:text-skin-text"
                }`}
              >
                <span className="text-base font-semibold text-skin-text">{item.label}</span>
                <span className="mt-2 text-sm text-skin-muted">{item.description}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="flex-1 overflow-hidden rounded-2xl bg-skin-card p-4 shadow-inner">
        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1" role="list">
          {currentMessages.map((message) => (
            <ChatBubble
              key={message.id}
              from={message.role}
              media={
                message.audioUrl ? (
                  <audio controls className="w-full" src={message.audioUrl} />
                ) : message.image ? (
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
          {!currentMessages.length && !isPending ? (
            <div className="mt-12 text-center text-sm text-skin-muted">
              Почніть діалог із агентом «{activePersona?.label}». {activePersona?.description}
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
          <Button
            type="button"
            variant="ghost"
            className="px-3 text-sm"
            onClick={handleVoiceButtonClick}
            disabled={!canRecordAudio || isPending}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" /> Зупинити
              </>
            ) : (
              <>
                <AudioLines className="mr-2 h-4 w-4" /> Голос
              </>
            )}
          </Button>
          <Button type="button" onClick={handleSend} disabled={isPending || !inputValue.trim()}>
            Надіслати <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {recordingError ? <div className="text-xs text-red-500">{recordingError}</div> : null}
      </section>
    </div>
  );
};

export default AssistantPage;
