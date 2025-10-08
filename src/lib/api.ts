import type { CatalogItem } from "@/types/catalog";
import type { KnowledgeBaseArticle, KnowledgeBaseArticleSummary } from "@/types/knowledge-base";
import {
  getLocalCatalogItems,
  getLocalKnowledgeBaseArticle,
  getLocalKnowledgeBaseSummaries,
} from "@/lib/local-data";

type FetchOptions = RequestInit & { timeoutMs?: number };

const withTimeout = async (input: RequestInfo, { timeoutMs = 10000, ...init }: FetchOptions = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const baseUrl = (import.meta.env.VITE_WEBHOOK_BASE_URL as string | undefined)?.replace(/\/$/, "");
const aiPath = import.meta.env.VITE_WEBHOOK_AI_PATH ?? "/ai";
const kbPath = import.meta.env.VITE_WEBHOOK_KB_PATH ?? "/kb";
const catalogPath = import.meta.env.VITE_WEBHOOK_CATALOG_PATH ?? "/catalog";
const directAiWebhookUrl = (import.meta.env.VITE_AI_DIRECT_WEBHOOK_URL as string | undefined)?.trim();
const fallbackAiWebhookUrl = "https://n8n.dmytrotovstytskyi.online/webhook-test/gala.school";

const buildUrl = (path: string, query?: string) => {
  if (!baseUrl) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}${query ? `?${query}` : ""}`;
};

export interface AiRequestBody {
  text?: string;
  audioBase64?: string;
  persona: string;
  initData?: string;
}

export interface AiResponse {
  output: string;
  image?: string;
  videoUrl?: string;
}

export const sendAiMessage = async (body: AiRequestBody): Promise<AiResponse> => {
  const url = buildUrl(aiPath) ?? directAiWebhookUrl ?? fallbackAiWebhookUrl;
  if (!url) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      output: `Персона ${body.persona}: наразі бекенд недоступний. Спробуйте пізніше.`,
    };
  }

  const response = await withTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Не вдалося отримати відповідь від ІІ");
  }

  const payload = await response.json();
  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    const output =
      typeof data.output === "string"
        ? data.output
        : typeof data.reply === "string"
          ? data.reply
          : typeof data.text === "string"
            ? data.text
            : undefined;

    return {
      output:
        output ??
        "Від агента отримано відповідь у невідомому форматі. Перевірте налаштування вебхука.",
      image: typeof data.image === "string" ? data.image : undefined,
      videoUrl: typeof data.videoUrl === "string" ? data.videoUrl : undefined,
    };
  }

  return {
    output:
      "Від агента отримано відповідь у невідомому форматі. Перевірте налаштування вебхука.",
  };
};

export const fetchKnowledgeBase = async (query: string): Promise<KnowledgeBaseArticleSummary[]> => {
  const url = query ? buildUrl(kbPath, new URLSearchParams({ query }).toString()) : buildUrl(kbPath);
  if (!url) {
    return getLocalKnowledgeBaseSummaries(query);
  }

  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("Не вдалося отримати дані бази знань");
  }
  return (await response.json()) as KnowledgeBaseArticleSummary[];
};

export const fetchKnowledgeArticle = async (id: string): Promise<KnowledgeBaseArticle> => {
  const url = buildUrl(`${kbPath}/${id}`);
  if (!url) {
    const article = getLocalKnowledgeBaseArticle(id);
    if (!article) {
      throw new Error("Стаття не знайдена");
    }
    return article;
  }

  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("Не вдалося отримати статтю");
  }
  return (await response.json()) as KnowledgeBaseArticle;
};

export const fetchCatalog = async (): Promise<CatalogItem[]> => {
  const url = buildUrl(catalogPath);
  if (!url) {
    return getLocalCatalogItems();
  }

  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("Не вдалося завантажити каталог");
  }
  return (await response.json()) as CatalogItem[];
};
