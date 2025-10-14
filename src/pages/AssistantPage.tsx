import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AudioLines, Send, Square } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingDots } from "@/components/chat/TypingDots";
import { sendAiMessage } from "@/lib/api";
import { useTelegramContext } from "@/providers/TelegramProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useTelemetry } from "@/hooks/useTelemetry";
import { captureError } from "@/lib/observability";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  videoUrl?: string;
  audioUrl?: string;
}

main

export type PersonaId = (typeof PERSONA_IDS)[number];

export const AssistantPage = () => {
  const { initData } = useTelegramContext();
  const { t } = useTranslation();
  const telemetry = useTelemetry();

  const personaOptions = useMemo(
    () => [
      {
        id: "seller" as PersonaId,
        label: t("assistant.persona.seller", "Продавець"),
        description: t(
          "assistant.persona.seller.desc",
          "Про товари, техніки продажу, мерчендайзинг та сервіс",
        ),
      },
      {
        id: "psychologist" as PersonaId,
        label: t("assistant.persona.psychologist", "Психолог"),
        description: t(
          "assistant.persona.psychologist.desc",
          "Підтримка емоційного стану, робота зі стресом та втомою",
        ),
      },
      {
        id: "companion" as PersonaId,
        label: t("assistant.persona.companion", "Потеревенькати"),
        description: t(
          "assistant.persona.companion.desc",
          "Легка дружня бесіда, щоб відволіктися під час зміни",
        ),
      },
    ],
    [t],
  );

  const [persona, setPersona] = useState<PersonaId>(personaOptions[0]?.id ?? "seller");
  const [inputValue, setInputValue] = useState("");
 main
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [canRecordAudio, setCanRecordAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [visualLevel, setVisualLevel] = useState(0);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioUrlsRef = useRef<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const personaRef = useRef<PersonaId>(persona);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendAiMessage,
  });

  const currentMessages = messagesByPersona[persona] ?? [];
 main

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const getUserMedia = navigator.mediaDevices?.getUserMedia;
      if (typeof getUserMedia === "function") {
        setCanRecordAudio(true);
      }
    }
  }, []);

  useEffect(() => () => {
    audioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    audioUrlsRef.current = [];
    cleanupStream();
  }, []);

  useEffect(() => {
    if (!sendFeedback) {
      return;
    }
    const timeout = window.setTimeout(() => setSendFeedback(null), FEEDBACK_TIMEOUT);
    return () => window.clearTimeout(timeout);
  }, [sendFeedback]);

  const cleanupStream = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const stream = streamRef.current;
    stream?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    mediaRecorderRef.current = null;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingSeconds(0);
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }
    setVisualLevel(0);
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
          reject(new Error("base64"));
        }
      };
      reader.onerror = () => reject(new Error("base64"));
      reader.readAsDataURL(blob);
    });

  const trackPersonaChange = (id: PersonaId) => {
    telemetry.track("assistant_persona_selected", { persona: id });
  };

  const trackSendEvent = (payload: { persona: PersonaId; hasAudio: boolean; length: number }) => {
    telemetry.track("assistant_message_sent", payload);
  };

  const trackRecordingEvent = (event: string, payload?: Record<string, unknown>) => {
    telemetry.track(event, payload);
  };

  const updateVisualLevel = () => {
    const analyser = analyserRef.current;
    if (!analyser) {
      return;
    }
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i += 1) {
      const value = dataArray[i]! - 128;
      sumSquares += value * value;
    }
    const rms = Math.sqrt(sumSquares / bufferLength) / 128;
    setVisualLevel(Math.min(1, Math.max(0, rms * 2)));
    rafRef.current = requestAnimationFrame(updateVisualLevel);
  };

  const sendMessage = async ({
    text,
    audioBase64,
    audioUrl,

  }: {
    text?: string;
    audioBase64?: string;
    audioUrl?: string;
main
  }) => {
    const trimmed = text?.trim();
    if (!trimmed && !audioBase64) {
      return;
    }

    if (trimmed && personaId === persona) {
      setInputValue("");
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed ?? t("assistant.voice.message", "Голосове повідомлення"),
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

      setMessagesByPersona((prev) => {
        const prevMessages = prev[personaId] ?? [];
        return {
          ...prev,
          [personaId]: [
            ...prevMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",

  };

  const handleSend = async () => {
    const text = inputValue;
    if (!text.trim()) {
      return;
    }
    trackSendEvent({ persona, hasAudio: false, length: text.length });
    await sendMessage({ text, personaId: persona });
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

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = RECORDING_FFT_SIZE;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      updateVisualLevel();

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setRecordingSeconds(0);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        setIsRecording(false);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingSeconds(0);
        analyserRef.current = null;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => undefined);
          audioContextRef.current = null;
        }
        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];
        if (!chunks.length) {
          setRecordingError(t("assistant.voice.empty", "Запис не містить звуку. Спробуйте ще раз."));
          cleanupStream();
          return;
        }

        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
        if (blob.size === 0) {
          setRecordingError(t("assistant.voice.empty", "Запис не містить звуку. Спробуйте ще раз."));
          cleanupStream();
          return;
        }

        try {
          const base64 = await blobToBase64(blob);
          const objectUrl = URL.createObjectURL(blob);
          audioUrlsRef.current.push(objectUrl);

        } catch (error) {
          captureError(error, { scope: "assistant_audio_prepare" });
          setRecordingError(
            error instanceof Error
              ? error.message
              : t("assistant.voice.empty", "Запис не містить звуку. Спробуйте ще раз."),
          );
        } finally {
          cleanupStream();
        }
      });

      mediaRecorder.start();
      setIsRecording(true);
      trackRecordingEvent("assistant_recording_started", { persona: personaRef.current });
    } catch (error) {
      cleanupStream();
      captureError(error, { scope: "assistant_recording" });
      setRecordingError(
        error instanceof Error
          ? error.message
          : t("assistant.voice.denied", "Немає доступу до мікрофона. Перевірте налаштування."),
      );
      trackRecordingEvent("assistant_recording_denied", { message: (error as Error)?.message });
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
      trackRecordingEvent("assistant_recording_stopped", { persona: personaRef.current, seconds: recordingSeconds });
    } else {
      void startRecording();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-2xl bg-skin-base/80 p-4 shadow-md">
        <span className="text-xs uppercase tracking-wide text-skin-muted">

            const isActive = persona === item.id;
            return (
              <button
                key={item.id}
                type="button"

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
                  <video controls className="w-full rounded-2xl" src={message.videoUrl} />
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

            </div>
          ) : null}
        </div>
      </section>
      <section className="flex flex-col gap-2 rounded-2xl bg-skin-base/70 p-4 shadow-md">
        <Textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={t("assistant.chat.placeholder", "Напишіть повідомлення…")}
          rows={3}
          aria-label={t("assistant.chat.placeholder", "Напишіть повідомлення…")}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            className="px-3 text-sm"
            onClick={handleVoiceButtonClick}
            disabled={!canRecordAudio || isPending}
            aria-pressed={isRecording}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" aria-hidden /> {t("assistant.voice.stop", "Зупинити")}
              </>
            ) : (
              <>
                <AudioLines className="mr-2 h-4 w-4" aria-hidden /> {t("assistant.voice.start", "Голос")}
              </>
            )}
          </Button>
          <Button type="button" onClick={handleSend} disabled={isPending || !inputValue.trim()}>
            {t("assistant.send", "Надіслати")} <Send className="ml-2 h-4 w-4" aria-hidden />
          </Button>
        </div>
        {isRecording ? (
          <div
            className="flex items-center justify-between rounded-xl bg-skin-card px-3 py-2 text-xs text-skin-muted"
            role="status"
            aria-live="polite"
          >
            <span>
              {t("assistant.voice.timer", "Тривалість: {{seconds}} с", {
                seconds: recordingSeconds,
              })}
            </span>
            <div className="flex items-end gap-1" role="img" aria-label={t("assistant.voice.visual_label", "Індикатор рівня звуку")}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const threshold = (index + 1) / 5;
                const active = visualLevel >= threshold * 0.8;
                return (
                  <span
                    key={index}
                    className={`w-1.5 rounded-full transition-all ${
                      active ? "bg-skin-primary" : "bg-skin-muted/40"
                    }`}
                    style={{ height: `${8 + visualLevel * 24}px` }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        {recordingError ? (
          <div className="text-xs text-red-500" role="alert">
            {recordingError}
          </div>
        ) : null}
        <div aria-live="polite" role="status" className="text-xs text-skin-muted">
          {sendFeedback}
        </div>
      </section>
    </div>
  );
};

export default AssistantPage;
