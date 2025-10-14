import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  audioBase64?: string;
}

interface Persona {
  id: string;
  label: string;
  icon: string;
  description: string;
}

type PersonaId = 'seller' | 'psychologist' | 'companion';

interface MessagesByPersona {
  seller: Message[];
  psychologist: Message[];
  companion: Message[];
}

const personas: Persona[] = [
  {
    id: 'seller',
    label: 'Продавець',
    icon: '🛒',
    description: 'Про товари, техніки продажу та сервіс'
  },
  {
    id: 'psychologist',
    label: 'Психолог',
    icon: '💆',
    description: 'Підтримка емоційного стану та робота зі стресом'
  },
  {
    id: 'companion',
    label: 'Потеревенькати',
    icon: '☕',
    description: 'Легка дружня бесіда під час зміни'
  }
];

export default function AssistantPage() {
  const [persona, setPersona] = useState<PersonaId>('seller');
  const [messages, setMessages] = useState<MessagesByPersona>({
    seller: [],
    psychologist: [],
    companion: []
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const currentMessages = messages[persona];
  const activePersona = personas.find(p => p.id === persona);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const sendMessage = async (text: string, audioBase64: string | null = null) => {
    if (!text.trim() && !audioBase64) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text.trim() || 'Голосове повідомлення',
      audioBase64: audioBase64 || undefined
    };

    setMessages(prev => ({
      ...prev,
      [persona]: [...prev[persona], userMessage]
    }));

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.dmytrotovstytskyi.online/webhook/gala.school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          audioBase64,
          persona,
          history: currentMessages.slice(-10)
        })
      });

      if (!response.ok) throw new Error('Помилка відповіді від сервера');

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.message || data.output || 'Вибачте, не зміг отримати відповідь.'
      };

      setMessages(prev => ({
        ...prev,
        [persona]: [...prev[persona], aiMessage]
      }));
    } catch (error) {
      console.error('Помилка AI чату:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Вибачте, сталася помилка. Перевірте інтернет або спробуйте пізніше.'
      };
      setMessages(prev => ({
        ...prev,
        [persona]: [...prev[persona], errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1] || '';
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingError('Ваш браузер не підтримує запис аудіо');
      return;
    }

    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', async () => {
        setIsRecording(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (!chunks.length) {
          setRecordingError('Запис не містить звуку');
          return;
        }

        const blob = new Blob(chunks, { type: 'audio/webm' });
        
        try {
          const base64 = await blobToBase64(blob);
          await sendMessage('🎤 Голосове повідомлення', base64);
        } catch (error) {
          setRecordingError('Не вдалося обробити аудіо');
        }
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Помилка запису:', error);
      setRecordingError('Немає доступу до мікрофона');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
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

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-galya-beige to-gray-50">
      <div className="bg-white border-b-2 border-galya-accent px-4 py-4 shadow-md">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-galya-brown">AI Наставник</h1>
          <p className="text-sm text-galya-brown-light">Виберіть режим спілкування</p>
        </div>
      </div>

      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as PersonaId)}
              className={`p-3 rounded-xl border-2 transition-all ${
                persona === p.id
                  ? 'border-galya-brown bg-galya-beige shadow-md'
                  : 'border-gray-200 hover:border-galya-brown-light'
              }`}
            >
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="text-xs font-semibold text-galya-brown">{p.label}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-center text-galya-brown-light mt-2">
          {activePersona?.description}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-md mx-auto space-y-4">
          {currentMessages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{activePersona?.icon}</div>
              <p className="text-galya-brown-light">
                Почніть діалог з {activePersona?.label}
              </p>
            </div>
          )}

          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-galya-brown to-galya-brown-light'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User size={20} className="text-white" />
                    ) : (
                      <Bot size={20} className="text-white" />
                    )}
                  </div>
                </div>
                <div className={`rounded-2xl px-4 py-3 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-galya-brown to-galya-brown-light text-white'
                    : 'bg-white text-galya-brown border-2 border-galya-beige'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
                    <Bot size={20} className="text-white" />
                  </div>
                </div>
                <div className="rounded-2xl px-4 py-3 shadow-md bg-white border-2 border-galya-beige">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-galya-brown rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-galya-brown rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-galya-brown rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-galya-accent px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2 mb-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напишіть повідомлення..."
              disabled={isLoading}
              rows={2}
              className="flex-1 px-4 py-3 border-2 border-galya-brown-light rounded-xl focus:outline-none focus:border-galya-brown disabled:opacity-50 resize-none"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleVoiceClick}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-galya-brown hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {isRecording ? (
                <>
                  <Square size={18} className="mr-2" />
                  Зупинити
                </>
              ) : (
                <>
                  <Mic size={18} className="mr-2" />
                  Голос
                </>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-galya-brown to-galya-brown-light text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center"
            >
              Надіслати
              <Send size={18} className="ml-2" />
            </button>
          </div>
          {recordingError && (
            <p className="text-xs text-red-500 mt-2">{recordingError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
