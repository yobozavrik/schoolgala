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
  { id: "seller", label: "Продавець" },
  { id: "helper", label: "Наставник" },
  { id: "friendly", label: "Друг" },
];

const AssistantPage = () => {
  const { initData } = useTelegramContext();
  const [persona, setPersona] = useState(personas[0].id);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
  }: {
    text?: string;
    audioBase64?: string;
    audioUrl?: string;
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

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await mutateAsync({
        text: trimmed,
        audioBase64,
        persona,
        initData,
      });
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

  const handleSend = async () => {
    await sendMessage({ text: inputValue });
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
          await sendMessage({ audioBase64: base64, audioUrl: objectUrl });
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
